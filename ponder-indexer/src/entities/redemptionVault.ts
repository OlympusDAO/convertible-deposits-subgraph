import type { Context } from "ponder:registry";
import schema from "ponder:schema";
import type { Address } from "viem";
import {
  fetchClaimDefaultRewardPercentage,
  fetchRedemptionVaultAssetConfiguration,
} from "../contracts/redemptionVault";
import { toBpsDecimal } from "../utils/decimal";

/**
 * Get or create a DepositRedemptionVault entity
 */
export async function getOrCreateRedemptionVault(
  context: Context,
  chainId: number,
  address: Address,
): Promise<typeof schema.depositRedemptionVault.$inferSelect> {
  // Check if redemption vault already exists
  const existing = await context.db.find(schema.depositRedemptionVault, {
    chainId,
    address: address.toLowerCase() as Address,
  });

  if (existing) {
    return existing;
  }

  // Fetch the claim default reward percentage from the contract
  const claimDefaultRewardPercentage = await fetchClaimDefaultRewardPercentage(
    context.client,
    address,
  );

  // Create redemption vault
  await context.db.insert(schema.depositRedemptionVault).values({
    chainId,
    address: address.toLowerCase() as Address,
    enabled: false,
    claimDefaultRewardPercentage: BigInt(claimDefaultRewardPercentage),
    claimDefaultRewardPercentageDecimal: toBpsDecimal(BigInt(claimDefaultRewardPercentage)),
  });

  // Return the created entity
  const created = await context.db.find(schema.depositRedemptionVault, {
    chainId,
    address: address.toLowerCase() as Address,
  });

  if (!created) {
    throw new Error(`Failed to create redemption vault: ${chainId}, ${address}`);
  }

  return created;
}

/**
 * Update an existing DepositRedemptionVault entity
 */
export async function updateRedemptionVault(
  context: Context,
  chainId: number,
  address: Address,
  updates: Partial<Omit<typeof schema.depositRedemptionVault.$inferSelect, "chainId" | "address">>,
): Promise<void> {
  await context.db
    .update(schema.depositRedemptionVault, {
      chainId,
      address: address.toLowerCase() as Address,
    })
    .set(updates);
}

/**
 * Get or create a DepositRedemptionVaultAssetConfiguration entity
 */
export async function getOrCreateRedemptionVaultAssetConfiguration(
  context: Context,
  chainId: number,
  redemptionVaultAddress: Address,
  facilityAddress: Address,
  depositAssetAddress: Address,
): Promise<typeof schema.depositRedemptionVaultAssetConfiguration.$inferSelect> {
  // Check if asset configuration already exists
  const existing = await context.db.find(schema.depositRedemptionVaultAssetConfiguration, {
    chainId,
    redemptionVault: redemptionVaultAddress.toLowerCase() as Address,
    facility: facilityAddress.toLowerCase() as Address,
    depositAsset: depositAssetAddress.toLowerCase() as Address,
  });

  if (existing) {
    return existing;
  }

  // Get or create redemption vault first
  await getOrCreateRedemptionVault(context, chainId, redemptionVaultAddress);

  // Fetch the data from the contract
  const config = await fetchRedemptionVaultAssetConfiguration(
    context.client,
    redemptionVaultAddress,
    facilityAddress,
    depositAssetAddress,
  );

  // Create asset configuration
  await context.db.insert(schema.depositRedemptionVaultAssetConfiguration).values({
    chainId,
    redemptionVault: redemptionVaultAddress.toLowerCase() as Address,
    facility: facilityAddress.toLowerCase() as Address,
    depositAsset: depositAssetAddress.toLowerCase() as Address,
    interestRate: BigInt(config.interestRate),
    interestRateDecimal: toBpsDecimal(BigInt(config.interestRate)),
    maxBorrowPercentage: BigInt(config.maxBorrowPercentage),
    maxBorrowPercentageDecimal: toBpsDecimal(BigInt(config.maxBorrowPercentage)),
  });

  // Return the created entity
  const created = await context.db.find(schema.depositRedemptionVaultAssetConfiguration, {
    chainId,
    redemptionVault: redemptionVaultAddress.toLowerCase() as Address,
    facility: facilityAddress.toLowerCase() as Address,
    depositAsset: depositAssetAddress.toLowerCase() as Address,
  });

  if (!created) {
    throw new Error(
      `Failed to create redemption vault asset configuration: ${chainId}, ${redemptionVaultAddress}, ${facilityAddress}, ${depositAssetAddress}`,
    );
  }

  return created;
}

/**
 * Update an existing DepositRedemptionVaultAssetConfiguration entity
 */
export async function updateRedemptionVaultAssetConfiguration(
  context: Context,
  chainId: number,
  redemptionVaultAddress: Address,
  facilityAddress: Address,
  depositAssetAddress: Address,
  updates: Partial<
    Omit<
      typeof schema.depositRedemptionVaultAssetConfiguration.$inferSelect,
      "chainId" | "redemptionVault" | "facility" | "depositAsset"
    >
  >,
): Promise<void> {
  await context.db
    .update(schema.depositRedemptionVaultAssetConfiguration, {
      chainId,
      redemptionVault: redemptionVaultAddress.toLowerCase() as Address,
      facility: facilityAddress.toLowerCase() as Address,
      depositAsset: depositAssetAddress.toLowerCase() as Address,
    })
    .set(updates);
}
