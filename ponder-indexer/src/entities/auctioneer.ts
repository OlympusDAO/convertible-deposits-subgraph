// Entity helpers for Auctioneer
// In Ponder, we use context.db for database operations and context.client for contract calls

import type { Address } from "viem";
import schema from "ponder:schema";
import type { Context } from "ponder:registry";
import { fetchAuctioneerConfigBatch } from "../contracts/auctioneer";
import { toBpsDecimal } from "../utils/decimal";
import { getOrCreateDepositAsset } from "./asset";

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

