import type { Context } from "ponder:registry";
import schema from "ponder:schema";
import type { Address } from "viem";
import { fetchRedemption } from "../contracts/redemptionVault";
import { toDecimal } from "../utils/decimal";
import { getAssetDecimals, getOrCreateDepositAssetPeriod } from "./asset";
import { getOrCreateDepositFacility } from "./depositFacility";
import { getOrCreateDepositor } from "./depositor";
import { getOrCreateReceiptToken } from "./receiptToken";
import { getOrCreateRedemptionVault } from "./redemptionVault";

/**
 * Get or create a Redemption entity
 */
export async function getOrCreateRedemption(
  context: Context,
  chainId: number,
  redemptionVaultAddress: Address,
  facilityAddress: Address,
  depositAssetAddress: Address,
  depositAssetPeriodMonths: number,
  userAddress: Address,
  redemptionId: number,
): Promise<typeof schema.redemption.$inferSelect> {
  // Check if redemption already exists
  const existing = await context.db.find(schema.redemption, {
    chainId,
    redemptionVault: redemptionVaultAddress.toLowerCase() as Address,
    depositor: userAddress.toLowerCase() as Address,
    redemptionId,
  });

  if (existing) {
    return existing;
  }

  // Get or create related entities
  await getOrCreateDepositor(context, chainId, userAddress);
  const receiptToken = await getOrCreateReceiptToken(
    context,
    chainId,
    facilityAddress,
    depositAssetAddress,
    depositAssetPeriodMonths,
  );
  await getOrCreateRedemptionVault(context, chainId, redemptionVaultAddress);
  await getOrCreateDepositFacility(context, chainId, facilityAddress);
  await getOrCreateDepositAssetPeriod(
    context,
    chainId,
    depositAssetAddress,
    depositAssetPeriodMonths,
  );

  // Fetch redemption data from contract
  const redemptionData = await fetchRedemption(
    context.client,
    redemptionVaultAddress,
    userAddress,
    redemptionId,
  );

  // Get asset decimals
  const assetDecimals = await getAssetDecimals(context, chainId, depositAssetAddress);

  // Create redemption record
  const newRedemption = {
    chainId,
    redemptionVault: redemptionVaultAddress.toLowerCase() as Address,
    depositor: userAddress.toLowerCase() as Address,
    redemptionId,
    depositAsset: depositAssetAddress.toLowerCase() as Address,
    depositPeriod: depositAssetPeriodMonths,
    facility: facilityAddress.toLowerCase() as Address,
    receiptTokenManager: receiptToken.receiptTokenManager,
    receiptTokenId: receiptToken.receiptTokenId,
    positionId: redemptionData.positionId,
    amount: redemptionData.amount,
    amountDecimal: toDecimal(redemptionData.amount, assetDecimals),
    redeemableAt: redemptionData.redeemableAt,
  };

  await context.db.insert(schema.redemption).values(newRedemption);

  return newRedemption;
}

/**
 * Get an existing Redemption entity (throws if not found)
 */
export async function getRedemption(
  context: Context,
  chainId: number,
  redemptionVaultAddress: Address,
  userAddress: Address,
  redemptionId: number,
): Promise<typeof schema.redemption.$inferSelect> {
  const redemption = await context.db.find(schema.redemption, {
    chainId,
    redemptionVault: redemptionVaultAddress.toLowerCase() as Address,
    depositor: userAddress.toLowerCase() as Address,
    redemptionId,
  });

  if (!redemption) {
    throw new Error(
      `Redemption not found: ${chainId}, ${redemptionVaultAddress}, ${userAddress}, ${redemptionId}`,
    );
  }

  return redemption;
}

/**
 * Update an existing Redemption entity
 */
export async function updateRedemption(
  context: Context,
  chainId: number,
  redemptionVaultAddress: Address,
  userAddress: Address,
  redemptionId: number,
  updates: Partial<
    Omit<
      typeof schema.redemption.$inferSelect,
      "chainId" | "redemptionVault" | "depositor" | "redemptionId"
    >
  >,
): Promise<void> {
  await context.db
    .update(schema.redemption, {
      chainId,
      redemptionVault: redemptionVaultAddress.toLowerCase() as Address,
      depositor: userAddress.toLowerCase() as Address,
      redemptionId,
    })
    .set(updates);
}
