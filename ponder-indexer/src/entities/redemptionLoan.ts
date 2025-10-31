import type { Context } from "ponder:registry";
import schema from "ponder:schema";
import type { Address } from "viem";
import { fetchLoan } from "../contracts/redemptionVault";
import { toDecimal } from "../utils/decimal";
import { getDepositAssetPeriod } from "./asset";
import { getOrCreateRedemption } from "./redemption";

/**
 * Get or create a RedemptionLoan entity
 */
export async function getOrCreateRedemptionLoan(
  context: Context,
  chainId: number,
  redemptionVaultAddress: Address,
  facilityAddress: Address,
  depositAssetAddress: Address,
  depositAssetPeriodMonths: number,
  userAddress: Address,
  redemptionId: number,
  createdAt: bigint,
): Promise<typeof schema.redemptionLoan.$inferSelect> {
  // Check if redemption loan already exists
  const existing = await context.db.find(schema.redemptionLoan, {
    chainId,
    redemptionVault: redemptionVaultAddress.toLowerCase() as Address,
    depositor: userAddress.toLowerCase() as Address,
    redemptionId,
  });

  if (existing) {
    return existing;
  }

  // Get or create redemption first
  const redemption = await getOrCreateRedemption(
    context,
    chainId,
    redemptionVaultAddress,
    facilityAddress,
    depositAssetAddress,
    depositAssetPeriodMonths,
    userAddress,
    redemptionId,
  );

  // Get asset decimals
  await getDepositAssetPeriod(context, chainId, depositAssetAddress, depositAssetPeriodMonths);
  const assetDecimals = await context.db.find(schema.asset, {
    chainId,
    address: depositAssetAddress.toLowerCase() as Address,
  });

  if (!assetDecimals) {
    throw new Error(`Asset not found: ${chainId}, ${depositAssetAddress}`);
  }

  // Fetch loan data from contract
  const loan = await fetchLoan(context.client, redemptionVaultAddress, userAddress, redemptionId);

  // Create redemption loan
  await context.db.insert(schema.redemptionLoan).values({
    chainId,
    redemptionVault: redemptionVaultAddress.toLowerCase() as Address,
    depositor: userAddress.toLowerCase() as Address,
    depositAsset: depositAssetAddress.toLowerCase() as Address,
    depositPeriod: depositAssetPeriodMonths,
    facility: facilityAddress.toLowerCase() as Address,
    receiptTokenManager: redemption.receiptTokenManager,
    receiptTokenId: redemption.receiptTokenId,
    redemptionId,
    initialPrincipal: loan.initialPrincipal,
    initialPrincipalDecimal: toDecimal(loan.initialPrincipal, assetDecimals.decimals),
    principal: loan.principal,
    principalDecimal: toDecimal(loan.principal, assetDecimals.decimals),
    interest: loan.interest,
    interestDecimal: toDecimal(loan.interest, assetDecimals.decimals),
    createdAt,
    dueDate: loan.dueDate,
    status: loan.isDefaulted ? "defaulted" : "active",
  });

  // Return the created entity
  const created = await context.db.find(schema.redemptionLoan, {
    chainId,
    redemptionVault: redemptionVaultAddress.toLowerCase() as Address,
    depositor: userAddress.toLowerCase() as Address,
    redemptionId,
  });

  if (!created) {
    throw new Error(
      `Failed to create redemption loan: ${chainId}, ${redemptionVaultAddress}, ${userAddress}, ${redemptionId}`,
    );
  }

  return created;
}

/**
 * Get an existing RedemptionLoan entity (throws if not found)
 */
export async function getRedemptionLoan(
  context: Context,
  chainId: number,
  redemptionVaultAddress: Address,
  userAddress: Address,
  redemptionId: number,
): Promise<typeof schema.redemptionLoan.$inferSelect> {
  const loan = await context.db.find(schema.redemptionLoan, {
    chainId,
    redemptionVault: redemptionVaultAddress.toLowerCase() as Address,
    depositor: userAddress.toLowerCase() as Address,
    redemptionId,
  });

  if (!loan) {
    throw new Error(
      `RedemptionLoan not found: ${chainId}, ${redemptionVaultAddress}, ${userAddress}, ${redemptionId}`,
    );
  }

  return loan;
}

/**
 * Update an existing RedemptionLoan entity
 */
export async function updateRedemptionLoan(
  context: Context,
  chainId: number,
  redemptionVaultAddress: Address,
  userAddress: Address,
  redemptionId: number,
  updates: Partial<
    Omit<
      typeof schema.redemptionLoan.$inferSelect,
      "chainId" | "redemptionVault" | "depositor" | "redemptionId"
    >
  >,
): Promise<void> {
  await context.db
    .update(schema.redemptionLoan, {
      chainId,
      redemptionVault: redemptionVaultAddress.toLowerCase() as Address,
      depositor: userAddress.toLowerCase() as Address,
      redemptionId,
    })
    .set(updates);
}
