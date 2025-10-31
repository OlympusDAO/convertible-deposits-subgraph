import type { Context } from "ponder:registry";
import schema from "ponder:schema";
import type { Address } from "viem";
import { fetchDepositManager, fetchReceiptTokenData } from "../contracts/depositFacility";
import { getOrCreateDepositAssetPeriod } from "./asset";
import { getOrCreateDepositFacility } from "./depositFacility";

/**
 * Get or create a ReceiptToken entity
 */
export async function getOrCreateReceiptToken(
  context: Context,
  chainId: number,
  facilityAddress: Address,
  depositAssetAddress: Address,
  depositPeriod: number,
): Promise<typeof schema.receiptToken.$inferSelect> {
  // Get deposit manager address
  const depositManagerAddress = await fetchDepositManager(context.client, facilityAddress);

  // Fetch receipt token data (manager and ID) from contract
  const receiptTokenData = await fetchReceiptTokenData(
    context.client,
    depositManagerAddress,
    depositAssetAddress,
    depositPeriod,
    facilityAddress,
  );

  // Check if receipt token already exists
  const existing = await context.db.find(schema.receiptToken, {
    chainId,
    receiptTokenManager: receiptTokenData.receiptTokenManager.toLowerCase() as Address,
    receiptTokenId: receiptTokenData.receiptTokenId,
  });

  if (existing) {
    return existing;
  }

  // Get or create related entities
  await getOrCreateDepositFacility(context, chainId, facilityAddress);
  await getOrCreateDepositAssetPeriod(context, chainId, depositAssetAddress, depositPeriod);

  // Create receipt token
  await context.db.insert(schema.receiptToken).values({
    chainId,
    receiptTokenManager: receiptTokenData.receiptTokenManager.toLowerCase() as Address,
    receiptTokenId: receiptTokenData.receiptTokenId,
    facility: facilityAddress.toLowerCase() as Address,
    depositAsset: depositAssetAddress.toLowerCase() as Address,
    depositPeriod,
  });

  // Return the created entity
  const created = await context.db.find(schema.receiptToken, {
    chainId,
    receiptTokenManager: receiptTokenData.receiptTokenManager.toLowerCase() as Address,
    receiptTokenId: receiptTokenData.receiptTokenId,
  });

  if (!created) {
    throw new Error(
      `Failed to create receipt token: ${chainId}, ${receiptTokenData.receiptTokenManager}, ${receiptTokenData.receiptTokenId}`,
    );
  }

  return created;
}
