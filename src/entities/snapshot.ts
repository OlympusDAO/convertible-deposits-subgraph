// Snapshot entity helpers
// In Ponder, we query snapshots directly by timestamp instead of using LatestSnapshot

import type { Context } from "ponder:registry";
import schema from "ponder:schema";
import { and, desc, eq, lte } from "ponder";
import type { Address } from "viem";
import {
  fetchAuctioneerCurrentTickBatch,
  fetchAuctioneerDayStateAndParameters,
} from "../contracts/auctioneer";
import { fetchFacilityClaimableYield } from "../contracts/depositFacility";
import { toDecimal, toOhmDecimal } from "../utils/decimal";
import { getAssetDecimals } from "./asset";
import { getOrCreateAuctioneer } from "./auctioneer";
import { getOrCreateDepositFacilityAsset } from "./depositFacility";

/**
 * Get the most recent deposit facility asset snapshot for a given facility/asset before or at a specific block
 */
async function getLatestDepositFacilityAssetSnapshot(
  context: Context,
  chainId: number,
  facilityAddress: Address,
  depositAssetAddress: Address,
  beforeBlock: bigint,
): Promise<typeof schema.depositFacilityAssetSnapshot.$inferSelect | null> {
  const results = await context.db.sql
    .select()
    .from(schema.depositFacilityAssetSnapshot)
    .where(
      and(
        eq(schema.depositFacilityAssetSnapshot.chainId, chainId),
        eq(schema.depositFacilityAssetSnapshot.facility, facilityAddress.toLowerCase() as Address),
        eq(
          schema.depositFacilityAssetSnapshot.depositAsset,
          depositAssetAddress.toLowerCase() as Address,
        ),
        lte(schema.depositFacilityAssetSnapshot.block, beforeBlock),
      ),
    )
    .orderBy(desc(schema.depositFacilityAssetSnapshot.block))
    .limit(1);

  if (results.length === 0) {
    return null;
  }

  return results[0] as typeof schema.depositFacilityAssetSnapshot.$inferSelect;
}

/**
 * Create an AuctioneerSnapshot for the given auctioneer
 */
export async function getOrCreateAuctioneerSnapshot(
  context: Context,
  chainId: number,
  blockNumber: bigint,
  timestamp: bigint,
  auctioneerAddress: Address,
): Promise<typeof schema.auctioneerSnapshot.$inferSelect> {
  // Check if snapshot already exists
  const existing = await context.db.find(schema.auctioneerSnapshot, {
    chainId,
    block: blockNumber,
    auctioneer: auctioneerAddress.toLowerCase() as Address,
  });

  if (existing) {
    return existing;
  }

  // Get or create auctioneer entity
  const auctioneer = await getOrCreateAuctioneer(context, chainId, auctioneerAddress);

  // Fetch day state and auction parameters from contract in a single multicall
  const { dayState, parameters: auctionParameters } = await fetchAuctioneerDayStateAndParameters(
    context.client,
    auctioneerAddress,
  );

  // Get asset decimals
  const assetDecimals = await getAssetDecimals(context, chainId, auctioneer.depositAsset);

  // Create the main auctioneer snapshot
  await context.db.insert(schema.auctioneerSnapshot).values({
    chainId,
    block: blockNumber,
    timestamp,
    auctioneer: auctioneerAddress.toLowerCase() as Address,
    dayInitTimestamp: dayState.dayInitTimestamp,
    ohmSold: dayState.convertible,
    ohmSoldDecimal: toOhmDecimal(dayState.convertible),
    isAuctionActive: auctioneer.enabled,
    target: auctionParameters.target,
    targetDecimal: toOhmDecimal(auctionParameters.target),
    tickSize: auctionParameters.tickSize,
    tickSizeDecimal: toOhmDecimal(auctionParameters.tickSize),
    minPrice: auctionParameters.minPrice,
    minPriceDecimal: toDecimal(auctionParameters.minPrice, assetDecimals),
  });

  // Return the created snapshot
  const snapshot = await context.db.find(schema.auctioneerSnapshot, {
    chainId,
    block: blockNumber,
    auctioneer: auctioneerAddress.toLowerCase() as Address,
  });

  if (!snapshot) {
    throw new Error(`Failed to create auctioneer snapshot`);
  }

  return snapshot;
}

/**
 * Get or create an AuctioneerDepositPeriodSnapshot for a specific period
 */
export async function getOrCreateAuctioneerDepositPeriodSnapshot(
  context: Context,
  chainId: number,
  blockNumber: bigint,
  timestamp: bigint,
  auctioneerAddress: Address,
  depositAssetAddress: Address,
  depositPeriod: number,
  tickPrice: bigint,
  tickPriceDecimal: string,
  tickCapacity: bigint,
  tickCapacityDecimal: string,
): Promise<typeof schema.auctioneerDepositPeriodSnapshot.$inferSelect> {
  // Check if snapshot already exists
  const existing = await context.db.find(schema.auctioneerDepositPeriodSnapshot, {
    chainId,
    block: blockNumber,
    auctioneer: auctioneerAddress.toLowerCase() as Address,
    depositAsset: depositAssetAddress.toLowerCase() as Address,
    depositPeriod,
  });

  if (existing) {
    return existing;
  }

  // Create the period snapshot
  await context.db.insert(schema.auctioneerDepositPeriodSnapshot).values({
    chainId,
    block: blockNumber,
    timestamp,
    auctioneer: auctioneerAddress.toLowerCase() as Address,
    depositAsset: depositAssetAddress.toLowerCase() as Address,
    depositPeriod,
    currentTickPrice: tickPrice,
    currentTickPriceDecimal: tickPriceDecimal,
    currentTickCapacity: tickCapacity,
    currentTickCapacityDecimal: tickCapacityDecimal,
  });

  const snapshot = await context.db.find(schema.auctioneerDepositPeriodSnapshot, {
    chainId,
    block: blockNumber,
    auctioneer: auctioneerAddress.toLowerCase() as Address,
    depositAsset: depositAssetAddress.toLowerCase() as Address,
    depositPeriod,
  });

  if (!snapshot) {
    throw new Error(`Failed to create auctioneer deposit period snapshot`);
  }

  return snapshot;
}

/**
 * Refresh auction state from contract and create snapshots for auctioneer and all deposit periods
 */
export async function refreshAuctionState(
  context: Context,
  chainId: number,
  blockNumber: bigint,
  timestamp: bigint,
  auctioneerAddress: Address,
): Promise<void> {
  // Create the main auctioneer snapshot
  await getOrCreateAuctioneerSnapshot(context, chainId, blockNumber, timestamp, auctioneerAddress);

  // Get or create auctioneer (fetch once, use for all periods)
  const auctioneer = await getOrCreateAuctioneer(context, chainId, auctioneerAddress);
  const assetDecimals = await getAssetDecimals(context, chainId, auctioneer.depositAsset);

  // Get all deposit periods for this auctioneer (enabled or not)
  const depositPeriods = await context.db.sql
    .select()
    .from(schema.auctioneerDepositPeriod)
    .where(
      and(
        eq(schema.auctioneerDepositPeriod.chainId, chainId),
        eq(schema.auctioneerDepositPeriod.auctioneer, auctioneerAddress.toLowerCase() as Address),
      ),
    );

  // Batch fetch current tick data for all periods in a single multicall
  // This is much more efficient than individual calls, especially when there are many periods
  const depositPeriodNumbers = depositPeriods.map((p) => p.depositPeriod);
  const tickDataMap = await fetchAuctioneerCurrentTickBatch(
    context.client,
    auctioneerAddress,
    depositPeriodNumbers,
  );

  // Create period snapshots for all deposit periods
  for (const depositPeriod of depositPeriods) {
    const tickData = tickDataMap.get(depositPeriod.depositPeriod);
    if (!tickData) {
      throw new Error(
        `Tick data not found for period ${depositPeriod.depositPeriod} in batch results`,
      );
    }

    // Calculate decimals
    const tickPriceDecimal = toDecimal(tickData.price, assetDecimals);
    const tickCapacityDecimal = toOhmDecimal(tickData.capacity);

    // Create period snapshot
    await getOrCreateAuctioneerDepositPeriodSnapshot(
      context,
      chainId,
      blockNumber,
      timestamp,
      auctioneerAddress,
      depositPeriod.depositAsset,
      depositPeriod.depositPeriod,
      tickData.price,
      tickPriceDecimal,
      tickData.capacity,
      tickCapacityDecimal,
    );
  }
}

/**
 * Get or create a DepositFacilityAssetSnapshot for the given facility and asset
 * @param claimableYield - Optional pre-fetched claimable yield. If not provided, will be fetched from contract.
 */
export async function getOrCreateDepositFacilityAssetSnapshot(
  context: Context,
  chainId: number,
  blockNumber: bigint,
  timestamp: bigint,
  facilityAddress: Address,
  depositAssetAddress: Address,
  claimableYield?: bigint,
): Promise<typeof schema.depositFacilityAssetSnapshot.$inferSelect> {
  // Check if snapshot already exists
  const existing = await context.db.find(schema.depositFacilityAssetSnapshot, {
    chainId,
    block: blockNumber,
    facility: facilityAddress.toLowerCase() as Address,
    depositAsset: depositAssetAddress.toLowerCase() as Address,
  });

  if (existing) {
    return existing;
  }

  // Get the latest previous snapshot for this facility/asset combo
  const previousSnapshot = await getLatestDepositFacilityAssetSnapshot(
    context,
    chainId,
    facilityAddress,
    depositAssetAddress,
    blockNumber,
  );

  // Copy values from previous snapshot or initialize to 0
  const totalDeposited = previousSnapshot ? previousSnapshot.totalDeposited : BigInt(0);
  const pendingRedemption = previousSnapshot ? previousSnapshot.pendingRedemption : BigInt(0);
  const borrowedAmount = previousSnapshot ? previousSnapshot.borrowedAmount : BigInt(0);

  // Get or create facility asset (required for snapshot)
  await getOrCreateDepositFacilityAsset(context, chainId, facilityAddress, depositAssetAddress);

  // Get asset decimals
  const assetDecimals = await getAssetDecimals(context, chainId, depositAssetAddress);

  // Fetch claimable yield from contract if not provided
  const finalClaimableYield =
    claimableYield ??
    (await fetchFacilityClaimableYield(context.client, facilityAddress, depositAssetAddress));

  // Create new snapshot
  const newSnapshot = {
    chainId,
    block: blockNumber,
    timestamp,
    facility: facilityAddress.toLowerCase() as Address,
    depositAsset: depositAssetAddress.toLowerCase() as Address,
    totalDeposited,
    totalDepositedDecimal: toDecimal(totalDeposited, assetDecimals),
    pendingRedemption,
    pendingRedemptionDecimal: toDecimal(pendingRedemption, assetDecimals),
    borrowedAmount,
    borrowedAmountDecimal: toDecimal(borrowedAmount, assetDecimals),
    claimableYield: finalClaimableYield,
    claimableYieldDecimal: toDecimal(finalClaimableYield, assetDecimals),
  };

  await context.db.insert(schema.depositFacilityAssetSnapshot).values(newSnapshot);

  return newSnapshot;
}

/**
 * Update facility asset deposited amount (positive delta for deposit, negative for withdrawal)
 */
export async function updateFacilityAssetSnapshotDeposited(
  context: Context,
  chainId: number,
  blockNumber: bigint,
  timestamp: bigint,
  facilityAddress: Address,
  depositAssetAddress: Address,
  delta: bigint,
): Promise<void> {
  // Get or create facility asset snapshot
  const assetSnapshot = await getOrCreateDepositFacilityAssetSnapshot(
    context,
    chainId,
    blockNumber,
    timestamp,
    facilityAddress,
    depositAssetAddress,
  );

  // Get asset decimals
  const assetDecimals = await getAssetDecimals(context, chainId, depositAssetAddress);

  // Update totalDeposited
  const updatedTotalDeposited = assetSnapshot.totalDeposited + delta;

  // Re-fetch claimable yield from contract
  const claimableYield = await fetchFacilityClaimableYield(
    context.client,
    facilityAddress,
    depositAssetAddress,
  );

  // Update snapshot
  await context.db
    .update(schema.depositFacilityAssetSnapshot, {
      chainId,
      block: blockNumber,
      facility: facilityAddress.toLowerCase() as Address,
      depositAsset: depositAssetAddress.toLowerCase() as Address,
    })
    .set({
      totalDeposited: updatedTotalDeposited,
      totalDepositedDecimal: toDecimal(updatedTotalDeposited, assetDecimals),
      claimableYield,
      claimableYieldDecimal: toDecimal(claimableYield, assetDecimals),
    });
}

/**
 * Update facility asset pending redemption (positive for new redemption, negative for redeemed/cancelled)
 */
export async function updateFacilityAssetSnapshotPendingRedemption(
  context: Context,
  chainId: number,
  blockNumber: bigint,
  timestamp: bigint,
  facilityAddress: Address,
  depositAssetAddress: Address,
  delta: bigint,
): Promise<void> {
  // Get or create facility asset snapshot
  const assetSnapshot = await getOrCreateDepositFacilityAssetSnapshot(
    context,
    chainId,
    blockNumber,
    timestamp,
    facilityAddress,
    depositAssetAddress,
  );

  // Get asset decimals
  const assetDecimals = await getAssetDecimals(context, chainId, depositAssetAddress);

  // Update pendingRedemption
  const updatedPendingRedemption = assetSnapshot.pendingRedemption + delta;

  // Update snapshot
  await context.db
    .update(schema.depositFacilityAssetSnapshot, {
      chainId,
      block: blockNumber,
      facility: facilityAddress.toLowerCase() as Address,
      depositAsset: depositAssetAddress.toLowerCase() as Address,
    })
    .set({
      pendingRedemption: updatedPendingRedemption,
      pendingRedemptionDecimal: toDecimal(updatedPendingRedemption, assetDecimals),
    });
}

/**
 * Update facility asset borrowed amount (positive for new loan, negative for repaid)
 */
export async function updateFacilityAssetSnapshotBorrowedAmount(
  context: Context,
  chainId: number,
  blockNumber: bigint,
  timestamp: bigint,
  facilityAddress: Address,
  depositAssetAddress: Address,
  delta: bigint,
): Promise<void> {
  // Get or create facility asset snapshot
  const assetSnapshot = await getOrCreateDepositFacilityAssetSnapshot(
    context,
    chainId,
    blockNumber,
    timestamp,
    facilityAddress,
    depositAssetAddress,
  );

  // Get asset decimals
  const assetDecimals = await getAssetDecimals(context, chainId, depositAssetAddress);

  // Update borrowedAmount
  const updatedBorrowedAmount = assetSnapshot.borrowedAmount + delta;

  // Update snapshot
  await context.db
    .update(schema.depositFacilityAssetSnapshot, {
      chainId,
      block: blockNumber,
      facility: facilityAddress.toLowerCase() as Address,
      depositAsset: depositAssetAddress.toLowerCase() as Address,
    })
    .set({
      borrowedAmount: updatedBorrowedAmount,
      borrowedAmountDecimal: toDecimal(updatedBorrowedAmount, assetDecimals),
    });
}
