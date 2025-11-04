// Entity helpers for Asset, DepositAsset, and DepositAssetPeriod
// In Ponder, we use context.db for database operations and context.client for contract calls

import type { Context } from "ponder:registry";
import schema from "ponder:schema";
import type { Address } from "viem";
import { fetchAssetDataBatch } from "../contracts/asset";

/**
 * Get or create an Asset
 */
export async function getOrCreateAsset(
  context: Context,
  chainId: number,
  address: Address,
): Promise<typeof schema.asset.$inferSelect> {
  // Check if asset exists
  const existing = await context.db.find(schema.asset, {
    chainId,
    address: address.toLowerCase() as Address,
  });

  if (existing) {
    return existing;
  }

  // Fetch asset details from contract (batched for efficiency)
  const { decimals, name, symbol } = await fetchAssetDataBatch(context.client, address);

  // Insert new asset
  const newAsset = {
    chainId,
    address: address.toLowerCase() as Address,
    decimals,
    name,
    symbol,
  };

  await context.db.insert(schema.asset).values(newAsset);

  return newAsset;
}

/**
 * Get an Asset record
 */
export async function getAsset(
  context: Context,
  chainId: number,
  address: Address,
): Promise<typeof schema.asset.$inferSelect> {
  const result = await context.db.find(schema.asset, {
    chainId,
    address: address.toLowerCase() as Address,
  });

  if (!result) {
    throw new Error(`Asset not found: ${chainId}:${address}`);
  }

  return result;
}

/**
 * Get asset decimals
 */
export async function getAssetDecimals(
  context: Context,
  chainId: number,
  assetAddress: Address,
): Promise<number> {
  const asset = await getAsset(context, chainId, assetAddress);
  return asset.decimals;
}

/**
 * Get or create a DepositAsset
 */
export async function getOrCreateDepositAsset(
  context: Context,
  chainId: number,
  assetAddress: Address,
): Promise<typeof schema.depositAsset.$inferSelect> {
  // Check if deposit asset exists
  const existing = await context.db.find(schema.depositAsset, {
    chainId,
    asset: assetAddress.toLowerCase() as Address,
  });

  if (existing) {
    return existing;
  }

  // Create the underlying Asset record
  await getOrCreateAsset(context, chainId, assetAddress);

  // Insert new deposit asset
  const newDepositAsset = {
    chainId,
    asset: assetAddress.toLowerCase() as Address,
    enabled: true,
  };

  await context.db.insert(schema.depositAsset).values(newDepositAsset);

  return newDepositAsset;
}

/**
 * Get a DepositAsset record
 */
export async function getDepositAsset(
  context: Context,
  chainId: number,
  assetAddress: Address,
): Promise<typeof schema.depositAsset.$inferSelect> {
  const result = await context.db.find(schema.depositAsset, {
    chainId,
    asset: assetAddress.toLowerCase() as Address,
  });

  if (!result) {
    throw new Error(`DepositAsset not found: ${chainId}:${assetAddress}`);
  }

  return result;
}

/**
 * Get deposit asset decimals
 */
export async function getDepositAssetDecimals(
  context: Context,
  chainId: number,
  assetAddress: Address,
): Promise<number> {
  return await getAssetDecimals(context, chainId, assetAddress);
}

/**
 * Get or create a DepositAssetPeriod
 */
export async function getOrCreateDepositAssetPeriod(
  context: Context,
  chainId: number,
  depositAssetAddress: Address,
  depositPeriod: number,
): Promise<typeof schema.depositAssetPeriod.$inferSelect> {
  // Check if deposit asset period exists
  const existing = await context.db.find(schema.depositAssetPeriod, {
    chainId,
    depositAsset: depositAssetAddress.toLowerCase() as Address,
    depositPeriod,
  });

  if (existing) {
    return existing;
  }

  // Create the underlying DepositAsset record (ensures asset exists)
  await getOrCreateDepositAsset(context, chainId, depositAssetAddress);

  // Insert new deposit asset period
  const newPeriod = {
    chainId,
    depositAsset: depositAssetAddress.toLowerCase() as Address,
    depositPeriod,
    enabled: true,
  };

  await context.db.insert(schema.depositAssetPeriod).values(newPeriod);

  return newPeriod;
}

/**
 * Get a DepositAssetPeriod record
 */
export async function getDepositAssetPeriod(
  context: Context,
  chainId: number,
  depositAssetAddress: Address,
  depositPeriod: number,
): Promise<typeof schema.depositAssetPeriod.$inferSelect> {
  const result = await context.db.find(schema.depositAssetPeriod, {
    chainId,
    depositAsset: depositAssetAddress.toLowerCase() as Address,
    depositPeriod,
  });

  if (!result) {
    throw new Error(
      `DepositAssetPeriod not found: ${chainId}:${depositAssetAddress}:${depositPeriod}`,
    );
  }

  return result;
}

/**
 * Get deposit asset period decimals
 */
export async function getDepositAssetPeriodDecimals(
  context: Context,
  chainId: number,
  depositAssetAddress: Address,
): Promise<number> {
  return await getAssetDecimals(context, chainId, depositAssetAddress);
}
