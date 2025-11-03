// Entity helpers for Asset, DepositAsset, and DepositAssetPeriod
// In Ponder, we use context.db for database operations and context.client for contract calls

import type { Context } from "ponder:registry";
import schema from "ponder:schema";
import { and, eq } from "ponder";
import type { Address } from "viem";
import { fetchAssetDecimals, fetchAssetName, fetchAssetSymbol } from "../contracts/asset";

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

  // Fetch asset details from contract
  const decimals = await fetchAssetDecimals(context.client, address);
  const name = await fetchAssetName(context.client, address);
  const symbol = await fetchAssetSymbol(context.client, address);

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
 * Get or create a DepositAsset (with asset relation for decimals)
 */
export async function getOrCreateDepositAsset(
  context: Context,
  chainId: number,
  assetAddress: Address,
): Promise<
  typeof schema.depositAsset.$inferSelect & {
    rAsset: typeof schema.asset.$inferSelect;
  }
> {
  // Check if deposit asset exists with asset relation
  const existing = await context.db.sql.query.depositAsset.findFirst({
    where: and(
      eq(schema.depositAsset.chainId, chainId),
      eq(schema.depositAsset.asset, assetAddress.toLowerCase() as Address),
    ),
    with: {
      rAsset: true,
    },
  });

  if (existing) {
    // Ensure nested relations exist before returning
    if (!existing.rAsset) {
      throw new Error(`Asset or asset not found: ${chainId}, ${assetAddress}`);
    }

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

  // Re-query with relation to return consistent type
  const created = await context.db.sql.query.depositAsset.findFirst({
    where: and(
      eq(schema.depositAsset.chainId, chainId),
      eq(schema.depositAsset.asset, assetAddress.toLowerCase() as Address),
    ),
    with: {
      rAsset: true,
    },
  });

  if (!created) {
    throw new Error(`Failed to create deposit asset: ${chainId}:${assetAddress}`);
  }

  // Ensure nested relations exist before returning
  if (!created.rAsset) {
    throw new Error(
      `Deposit asset created but asset relation not found: ${chainId}, ${assetAddress}`,
    );
  }

  return created;
}

/**
 * Get a DepositAsset record (with asset relation for decimals)
 */
export async function getDepositAsset(
  context: Context,
  chainId: number,
  assetAddress: Address,
): Promise<
  typeof schema.depositAsset.$inferSelect & {
    rAsset: typeof schema.asset.$inferSelect;
  }
> {
  const result = await context.db.sql.query.depositAsset.findFirst({
    where: and(
      eq(schema.depositAsset.chainId, chainId),
      eq(schema.depositAsset.asset, assetAddress.toLowerCase() as Address),
    ),
    with: {
      rAsset: true,
    },
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
 * Get or create a DepositAssetPeriod (with nested asset relation for decimals)
 */
export async function getOrCreateDepositAssetPeriod(
  context: Context,
  chainId: number,
  depositAssetAddress: Address,
  depositPeriod: number,
): Promise<
  typeof schema.depositAssetPeriod.$inferSelect & {
    rDepositAsset: typeof schema.depositAsset.$inferSelect & {
      rAsset: typeof schema.asset.$inferSelect;
    };
  }
> {
  // Check if deposit asset period exists with nested relations
  const existing = await context.db.sql.query.depositAssetPeriod.findFirst({
    where: and(
      eq(schema.depositAssetPeriod.chainId, chainId),
      eq(schema.depositAssetPeriod.depositAsset, depositAssetAddress.toLowerCase() as Address),
      eq(schema.depositAssetPeriod.depositPeriod, depositPeriod),
    ),
    with: {
      rDepositAsset: {
        with: {
          rAsset: true,
        },
      },
    },
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

  // Re-query with relations to return consistent type
  const created = await context.db.sql.query.depositAssetPeriod.findFirst({
    where: and(
      eq(schema.depositAssetPeriod.chainId, chainId),
      eq(schema.depositAssetPeriod.depositAsset, depositAssetAddress.toLowerCase() as Address),
      eq(schema.depositAssetPeriod.depositPeriod, depositPeriod),
    ),
    with: {
      rDepositAsset: {
        with: {
          rAsset: true,
        },
      },
    },
  });

  if (!created) {
    throw new Error(
      `Failed to create deposit asset period: ${chainId}:${depositAssetAddress}:${depositPeriod}`,
    );
  }

  return created;
}

/**
 * Get a DepositAssetPeriod record (with nested asset relation for decimals)
 */
export async function getDepositAssetPeriod(
  context: Context,
  chainId: number,
  depositAssetAddress: Address,
  depositPeriod: number,
): Promise<
  typeof schema.depositAssetPeriod.$inferSelect & {
    rDepositAsset: typeof schema.depositAsset.$inferSelect & {
      rAsset: typeof schema.asset.$inferSelect;
    };
  }
> {
  const result = await context.db.sql.query.depositAssetPeriod.findFirst({
    where: and(
      eq(schema.depositAssetPeriod.chainId, chainId),
      eq(schema.depositAssetPeriod.depositAsset, depositAssetAddress.toLowerCase() as Address),
      eq(schema.depositAssetPeriod.depositPeriod, depositPeriod),
    ),
    with: {
      rDepositAsset: {
        with: {
          rAsset: true,
        },
      },
    },
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
