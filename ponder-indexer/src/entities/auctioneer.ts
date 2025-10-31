// Entity helpers for Auctioneer
// In Ponder, we use context.db for database operations and context.client for contract calls

import type { Address } from "viem";
import schema from "ponder:schema";
import type { Context } from "ponder:registry";
import { fetchAuctioneerConfigBatch } from "../contracts/auctioneer";
import { toBpsDecimal } from "../utils/decimal";
import { getOrCreateDepositAsset, getOrCreateDepositAssetPeriod } from "./asset";

/**
 * Get or create an Auctioneer
 */
export async function getOrCreateAuctioneer(
  context: Context,
  chainId: number,
  address: Address,
): Promise<typeof schema.auctioneer.$inferSelect> {
  // Check if auctioneer exists
  const existing = await context.db.find(schema.auctioneer, {
    chainId,
    address: address.toLowerCase() as Address,
  });

  if (existing) {
    return existing;
  }

  // Fetch auctioneer details from contract using batched multicall for efficiency
  const config = await fetchAuctioneerConfigBatch(context.client, address);

  // Create the deposit asset
  await getOrCreateDepositAsset(context, chainId, config.depositAsset);

  // Insert new auctioneer
  const newAuctioneer = {
    chainId,
    address: address.toLowerCase() as Address,
    depositAsset: config.depositAsset.toLowerCase() as Address,
    majorVersion: config.version.major,
    minorVersion: config.version.minor,
    enabled: false,
    auctionTrackingPeriod: config.trackingPeriod,
    tickStep: BigInt(config.tickStep),
    tickStepDecimal: toBpsDecimal(config.tickStep),
  };

  await context.db.insert(schema.auctioneer).values(newAuctioneer);

  return newAuctioneer;
}

/**
 * Get an Auctioneer record
 */
export async function getAuctioneer(
  context: Context,
  chainId: number,
  address: Address,
): Promise<typeof schema.auctioneer.$inferSelect> {
  const result = await context.db.find(schema.auctioneer, {
    chainId,
    address: address.toLowerCase() as Address,
  });

  if (!result) {
    throw new Error(`Auctioneer not found: ${chainId}:${address}`);
  }

  return result;
}

/**
 * Update an existing Auctioneer
 */
export async function updateAuctioneer(
  context: Context,
  chainId: number,
  address: Address,
  updates: Partial<Omit<typeof schema.auctioneer.$inferSelect, "chainId" | "address">>,
): Promise<void> {
  await context.db.update(schema.auctioneer, {
    chainId,
    address: address.toLowerCase() as Address,
  }).set(updates);
}

/**
 * Get or create an AuctioneerDepositPeriod
 */
export async function getOrCreateAuctioneerDepositPeriod(
  context: Context,
  chainId: number,
  auctioneerAddress: Address,
  depositAssetAddress: Address,
  depositPeriod: number,
): Promise<typeof schema.auctioneerDepositPeriod.$inferSelect> {
  // Check if it exists
  const existing = await context.db.find(schema.auctioneerDepositPeriod, {
    chainId,
    auctioneer: auctioneerAddress.toLowerCase() as Address,
    depositAsset: depositAssetAddress.toLowerCase() as Address,
    depositPeriod,
  });

  if (existing) {
    return existing;
  }

  // Get or create the auctioneer first
  await getOrCreateAuctioneer(context, chainId, auctioneerAddress);

  // Get or create the deposit asset period
  await getOrCreateDepositAssetPeriod(context, chainId, depositAssetAddress, depositPeriod);

  // Insert new auctioneer deposit period
  const newPeriod = {
    chainId,
    auctioneer: auctioneerAddress.toLowerCase() as Address,
    depositAsset: depositAssetAddress.toLowerCase() as Address,
    depositPeriod,
    enabled: false,
    currentTickCapacity: null,
    currentTickCapacityDecimal: null,
    currentTickPrice: null,
    currentTickPriceDecimal: null,
  };

  await context.db.insert(schema.auctioneerDepositPeriod).values(newPeriod);

  return newPeriod;
}

/**
 * Update an existing AuctioneerDepositPeriod
 */
export async function updateAuctioneerDepositPeriod(
  context: Context,
  chainId: number,
  auctioneerAddress: Address,
  depositAssetAddress: Address,
  depositPeriod: number,
  updates: Partial<Omit<typeof schema.auctioneerDepositPeriod.$inferSelect, "chainId" | "auctioneer" | "depositAsset" | "depositPeriod">>,
): Promise<void> {
  await context.db.update(schema.auctioneerDepositPeriod, {
    chainId,
    auctioneer: auctioneerAddress.toLowerCase() as Address,
    depositAsset: depositAssetAddress.toLowerCase() as Address,
    depositPeriod,
  }).set(updates);
}

