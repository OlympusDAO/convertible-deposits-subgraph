// Entity helpers for LimitOrders
// In Ponder, we use context.db for database operations and context.client for contract calls

import type { Context } from "ponder:registry";
import schema from "ponder:schema";
import { and, desc, eq, lt, or } from "ponder";
import type { Address } from "viem";
import { fetchDepositManager, fetchReceiptTokenData } from "../contracts/depositFacility";
import {
  fetchAuctioneerFacility,
  fetchLimitOrder,
  fetchLimitOrdersAuctioneer,
  fetchLimitOrdersContractEnabled,
  fetchLimitOrdersTotalUsdsDeposited,
  fetchLimitOrdersTotalUsdsOwed,
  fetchLimitOrdersUSDS,
} from "../contracts/limitOrder";
import { toDecimal } from "../utils/decimal";
import { getAssetDecimals, getOrCreateDepositAsset, getOrCreateDepositAssetPeriod } from "./asset";
import { getOrCreateDepositor } from "./depositor";

/**
 * Get or create a LimitOrdersContract
 */
export async function getOrCreateLimitOrdersContract(
  context: Context,
  chainId: number,
  address: Address,
): Promise<typeof schema.limitOrdersContract.$inferSelect> {
  // Check if contract exists
  const existing = await context.db.find(schema.limitOrdersContract, {
    chainId,
    address: address.toLowerCase() as Address,
  });

  if (existing) {
    return existing;
  }

  // Fetch enabled status from contract
  const enabled = await fetchLimitOrdersContractEnabled(context.client, address);

  // Version is not available from contract, use defaults
  // Could be fetched if VERSION constant exists in future
  const majorVersion = 0;
  const minorVersion = 0;

  // Insert new contract
  const newContract = {
    chainId,
    address: address.toLowerCase() as Address,
    enabled,
    majorVersion,
    minorVersion,
  };

  await context.db.insert(schema.limitOrdersContract).values(newContract);

  return newContract;
}

/**
 * Update an existing LimitOrdersContract
 */
export async function updateLimitOrdersContract(
  context: Context,
  chainId: number,
  address: Address,
  updates: Partial<Omit<typeof schema.limitOrdersContract.$inferSelect, "chainId" | "address">>,
): Promise<void> {
  await context.db
    .update(schema.limitOrdersContract, {
      chainId,
      address: address.toLowerCase() as Address,
    })
    .set(updates);
}

/**
 * Get or create a LimitOrdersDepositPeriod
 * receiptTokenManager and receiptTokenId are fetched using fetchReceiptTokenData()
 */
export async function getOrCreateLimitOrdersDepositPeriod(
  context: Context,
  chainId: number,
  contractAddress: Address,
  depositPeriod: number,
  depositAsset: Address,
): Promise<typeof schema.limitOrdersDepositPeriod.$inferSelect> {
  // Check if it exists
  const existing = await context.db.find(schema.limitOrdersDepositPeriod, {
    chainId,
    contractAddress: contractAddress.toLowerCase() as Address,
    depositPeriod,
  });

  if (existing) {
    return existing;
  }

  // Get or create the contract first
  await getOrCreateLimitOrdersContract(context, chainId, contractAddress);

  // Get or create deposit asset and period
  await getOrCreateDepositAsset(context, chainId, depositAsset);
  await getOrCreateDepositAssetPeriod(context, chainId, depositAsset, depositPeriod);

  // Fetch receipt token data from contract
  // LimitOrders -> Auctioneer -> Facility -> DepositManager -> ReceiptTokenData
  // Get auctioneer address from LimitOrders contract
  const auctioneerAddress = await fetchLimitOrdersAuctioneer(context.client, contractAddress);

  // Get facility address from auctioneer
  const facilityAddress = await fetchAuctioneerFacility(context.client, auctioneerAddress);

  // Get deposit manager from facility
  const depositManagerAddress = await fetchDepositManager(context.client, facilityAddress);

  // Fetch receipt token data
  const receiptTokenData = await fetchReceiptTokenData(
    context.client,
    depositManagerAddress,
    depositAsset,
    depositPeriod,
    facilityAddress,
  );

  const finalReceiptTokenManager = receiptTokenData.receiptTokenManager;
  const finalReceiptTokenId = receiptTokenData.receiptTokenId;

  // Insert new deposit period
  const newPeriod = {
    chainId,
    contractAddress: contractAddress.toLowerCase() as Address,
    depositPeriod,
    depositAsset: depositAsset.toLowerCase() as Address,
    receiptTokenManager: finalReceiptTokenManager.toLowerCase() as Address,
    receiptTokenId: finalReceiptTokenId,
    enabled: true,
  };

  await context.db.insert(schema.limitOrdersDepositPeriod).values(newPeriod);

  return newPeriod;
}

/**
 * Update an existing LimitOrdersDepositPeriod
 */
export async function updateLimitOrdersDepositPeriod(
  context: Context,
  chainId: number,
  contractAddress: Address,
  depositPeriod: number,
  updates: Partial<
    Omit<
      typeof schema.limitOrdersDepositPeriod.$inferSelect,
      "chainId" | "contractAddress" | "depositPeriod"
    >
  >,
): Promise<void> {
  await context.db
    .update(schema.limitOrdersDepositPeriod, {
      chainId,
      contractAddress: contractAddress.toLowerCase() as Address,
      depositPeriod,
    })
    .set(updates);
}

/**
 * Get or create a LimitOrder
 */
export async function getOrCreateLimitOrder(
  context: Context,
  chainId: number,
  contractAddress: Address,
  orderId: bigint,
): Promise<typeof schema.limitOrder.$inferSelect> {
  // Check if order exists
  const existing = await context.db.find(schema.limitOrder, {
    chainId,
    contractAddress: contractAddress.toLowerCase() as Address,
    orderId,
  });

  if (existing) {
    return existing;
  }

  // Get or create contract
  await getOrCreateLimitOrdersContract(context, chainId, contractAddress);

  // Fetch order data from contract
  const orderData = await fetchLimitOrder(context.client, contractAddress, orderId);

  // Get or create depositor
  await getOrCreateDepositor(context, chainId, orderData.owner);

  // Get depositAsset from contract (USDS)
  const depositAsset = await fetchLimitOrdersUSDS(context.client, contractAddress);

  // Get or create deposit asset period
  await getOrCreateDepositAssetPeriod(context, chainId, depositAsset, orderData.depositPeriod);

  // Get asset decimals
  const assetDecimals = await getAssetDecimals(context, chainId, depositAsset);

  // Insert new order
  const newOrder = {
    chainId,
    contractAddress: contractAddress.toLowerCase() as Address,
    orderId,
    owner: orderData.owner.toLowerCase() as Address,
    depositPeriod: orderData.depositPeriod,
    active: orderData.active,
    depositBudget: orderData.depositBudget,
    depositBudgetDecimal: toDecimal(orderData.depositBudget, assetDecimals),
    incentiveBudget: orderData.incentiveBudget,
    incentiveBudgetDecimal: toDecimal(orderData.incentiveBudget, assetDecimals),
    maxPrice: orderData.maxPrice,
    maxPriceDecimal: toDecimal(orderData.maxPrice, assetDecimals),
    minFillSize: orderData.minFillSize,
    minFillSizeDecimal: toDecimal(orderData.minFillSize, assetDecimals),
    createdAtBlock: BigInt(0), // Will be set by handler from event
    createdAtTimestamp: BigInt(0), // Will be set by handler from event
  };

  await context.db.insert(schema.limitOrder).values(newOrder);

  const created = await context.db.find(schema.limitOrder, {
    chainId,
    contractAddress: contractAddress.toLowerCase() as Address,
    orderId,
  });

  if (!created) {
    throw new Error(`Failed to create limit order: ${chainId}, ${contractAddress}, ${orderId}`);
  }

  return created;
}

/**
 * Update an existing LimitOrder
 */
export async function updateLimitOrder(
  context: Context,
  chainId: number,
  contractAddress: Address,
  orderId: bigint,
  updates: Partial<
    Omit<typeof schema.limitOrder.$inferSelect, "chainId" | "contractAddress" | "orderId">
  >,
): Promise<void> {
  await context.db
    .update(schema.limitOrder, {
      chainId,
      contractAddress: contractAddress.toLowerCase() as Address,
      orderId,
    })
    .set(updates);
}

/**
 * Get the most recent limit order snapshot for a given order before or at a specific block
 */
export async function getLatestLimitOrderSnapshot(
  context: Context,
  chainId: number,
  contractAddress: Address,
  orderId: bigint,
  beforeBlock: bigint,
  beforeLogIndex: number,
): Promise<typeof schema.limitOrderSnapshot.$inferSelect | null> {
  const results = await context.db.sql
    .select()
    .from(schema.limitOrderSnapshot)
    .where(
      and(
        eq(schema.limitOrderSnapshot.chainId, chainId),
        eq(schema.limitOrderSnapshot.contractAddress, contractAddress.toLowerCase() as Address),
        eq(schema.limitOrderSnapshot.orderId, orderId),
        or(
          lt(schema.limitOrderSnapshot.block, beforeBlock),
          and(
            eq(schema.limitOrderSnapshot.block, beforeBlock),
            lt(schema.limitOrderSnapshot.logIndex, beforeLogIndex),
          ),
        ),
      ),
    )
    .orderBy(desc(schema.limitOrderSnapshot.block), desc(schema.limitOrderSnapshot.logIndex))
    .limit(1);

  if (results.length === 0) {
    return null;
  }

  return results[0] as typeof schema.limitOrderSnapshot.$inferSelect;
}

/**
 * Create a limit order snapshot by copying the previous snapshot and applying updates
 * This ensures cumulative tracking across order events by preserving previous spent amounts
 */
export async function createLimitOrderSnapshot(
  context: Context,
  chainId: number,
  blockNumber: bigint,
  timestamp: bigint,
  logIndex: number,
  contractAddress: Address,
  orderId: bigint,
  previousSnapshot: typeof schema.limitOrderSnapshot.$inferSelect,
  updates: {
    depositSpentDelta?: bigint;
    incentiveSpentDelta?: bigint;
    active?: boolean;
  },
): Promise<typeof schema.limitOrderSnapshot.$inferSelect> {
  // Get or create the order entity first
  await getOrCreateLimitOrder(context, chainId, contractAddress, orderId);

  // Get depositAsset and decimals
  const depositAsset = await fetchLimitOrdersUSDS(context.client, contractAddress);
  const assetDecimals = await getAssetDecimals(context, chainId, depositAsset);

  const depositSpent = previousSnapshot.depositSpent + (updates.depositSpentDelta ?? BigInt(0));
  const incentiveSpent =
    previousSnapshot.incentiveSpent + (updates.incentiveSpentDelta ?? BigInt(0));
  const depositSpentDecimal = toDecimal(depositSpent, assetDecimals);
  const isCompleted = depositSpent >= previousSnapshot.depositBudget;

  // Copy the previous snapshot and update the values
  const snapshotValues = {
    ...previousSnapshot,
    block: blockNumber,
    logIndex,
    timestamp,
    active: updates.active ?? previousSnapshot.active,
    completed: isCompleted,
    depositSpent,
    depositSpentDecimal,
    incentiveSpent,
    incentiveSpentDecimal: toDecimal(incentiveSpent, assetDecimals),
  };

  // If there is an existing snapshot, it needs to be updated
  await context.db.insert(schema.limitOrderSnapshot).values(snapshotValues);

  const snapshot = await context.db.find(schema.limitOrderSnapshot, {
    chainId,
    block: blockNumber,
    logIndex,
    contractAddress: contractAddress.toLowerCase() as Address,
    orderId,
  });

  if (!snapshot) {
    throw new Error(`Failed to create limit order snapshot`);
  }

  return snapshot;
}

/**
 * Get the most recent limit orders contract snapshot for a given contract before or at a specific block
 */
export async function getLatestLimitOrdersContractSnapshot(
  context: Context,
  chainId: number,
  contractAddress: Address,
  beforeBlock: bigint,
  beforeLogIndex: number,
): Promise<typeof schema.limitOrdersContractSnapshot.$inferSelect | null> {
  const results = await context.db.sql
    .select()
    .from(schema.limitOrdersContractSnapshot)
    .where(
      and(
        eq(schema.limitOrdersContractSnapshot.chainId, chainId),
        eq(
          schema.limitOrdersContractSnapshot.contractAddress,
          contractAddress.toLowerCase() as Address,
        ),
        or(
          lt(schema.limitOrdersContractSnapshot.block, beforeBlock),
          and(
            eq(schema.limitOrdersContractSnapshot.block, beforeBlock),
            lt(schema.limitOrdersContractSnapshot.logIndex, beforeLogIndex),
          ),
        ),
      ),
    )
    .orderBy(
      desc(schema.limitOrdersContractSnapshot.block),
      desc(schema.limitOrdersContractSnapshot.logIndex),
    )
    .limit(1);

  if (results.length === 0) {
    return null;
  }

  return results[0] as typeof schema.limitOrdersContractSnapshot.$inferSelect;
}

/**
 * Create a limit orders contract snapshot
 */
export async function createLimitOrdersContractSnapshot(
  context: Context,
  chainId: number,
  blockNumber: bigint,
  timestamp: bigint,
  logIndex: number,
  contractAddress: Address,
  enabled: boolean,
): Promise<typeof schema.limitOrdersContractSnapshot.$inferSelect> {
  // Get or create the contract first
  await getOrCreateLimitOrdersContract(context, chainId, contractAddress);

  // Get depositAsset and decimals
  const depositAsset = await fetchLimitOrdersUSDS(context.client, contractAddress);
  const assetDecimals = await getAssetDecimals(context, chainId, depositAsset);

  // Fetch contract-level totals
  const totalUsdsOwed = await fetchLimitOrdersTotalUsdsOwed(context.client, contractAddress);
  const totalUsdsDeposited = await fetchLimitOrdersTotalUsdsDeposited(
    context.client,
    contractAddress,
  );

  // Insert contract snapshot
  await context.db.insert(schema.limitOrdersContractSnapshot).values({
    chainId,
    block: blockNumber,
    timestamp,
    logIndex,
    contractAddress: contractAddress.toLowerCase() as Address,
    enabled,
    totalUsdsOwed,
    totalUsdsOwedDecimal: toDecimal(totalUsdsOwed, assetDecimals),
    totalUsdsDeposited,
    totalUsdsDepositedDecimal: toDecimal(totalUsdsDeposited, assetDecimals),
  });

  const snapshot = await context.db.find(schema.limitOrdersContractSnapshot, {
    chainId,
    block: blockNumber,
    logIndex,
    contractAddress: contractAddress.toLowerCase() as Address,
  });

  if (!snapshot) {
    throw new Error(`Failed to create limit orders contract snapshot`);
  }

  return snapshot;
}
