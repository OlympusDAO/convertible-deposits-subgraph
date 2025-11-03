// Entity helpers for Auctioneer
// In Ponder, we use context.db for database operations and context.client for contract calls

import type { Context } from "ponder:registry";
import schema from "ponder:schema";
import { and, eq } from "ponder";
import type { Address } from "viem";
import { fetchAuctioneerConfigBatch } from "../contracts/auctioneer";
import { toBpsDecimal } from "../utils/decimal";
import { getOrCreateDepositAsset, getOrCreateDepositAssetPeriod } from "./asset";

/**
 * Get or create an Auctioneer (with nested asset relation for decimals)
 */
export async function getOrCreateAuctioneer(
  context: Context,
  chainId: number,
  address: Address,
): Promise<
  typeof schema.auctioneer.$inferSelect & {
    rDepositAsset: typeof schema.depositAsset.$inferSelect & {
      rAsset: typeof schema.asset.$inferSelect;
    };
  }
> {
  // Check if auctioneer exists with nested relations
  const existing = await context.db.sql.query.auctioneer.findFirst({
    where: and(
      eq(schema.auctioneer.chainId, chainId),
      eq(schema.auctioneer.address, address.toLowerCase() as Address),
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

  // Fetch auctioneer details from contract using batched multicall for efficiency
  const config = await fetchAuctioneerConfigBatch(context.client, address);

  // Create the deposit asset (with nested asset relation)
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

  // Re-query with relations to return consistent type
  const created = await context.db.sql.query.auctioneer.findFirst({
    where: and(
      eq(schema.auctioneer.chainId, chainId),
      eq(schema.auctioneer.address, address.toLowerCase() as Address),
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
    throw new Error(`Failed to create auctioneer: ${chainId}:${address}`);
  }

  // Ensure nested relations exist before returning
  if (!created.rDepositAsset?.rAsset?.decimals) {
    throw new Error(`Deposit asset or asset not found for auctioneer: ${chainId}, ${address}`);
  }

  return created;
}

/**
 * Get an Auctioneer record (with nested asset relation for decimals)
 */
export async function getAuctioneer(
  context: Context,
  chainId: number,
  address: Address,
): Promise<
  typeof schema.auctioneer.$inferSelect & {
    rDepositAsset: typeof schema.depositAsset.$inferSelect & {
      rAsset: typeof schema.asset.$inferSelect;
    };
  }
> {
  const result = await context.db.sql.query.auctioneer.findFirst({
    where: and(
      eq(schema.auctioneer.chainId, chainId),
      eq(schema.auctioneer.address, address.toLowerCase() as Address),
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
  await context.db
    .update(schema.auctioneer, {
      chainId,
      address: address.toLowerCase() as Address,
    })
    .set(updates);
}

/**
 * Get or create an AuctioneerDepositPeriod (with nested asset relation for decimals)
 */
export async function getOrCreateAuctioneerDepositPeriod(
  context: Context,
  chainId: number,
  auctioneerAddress: Address,
  depositAssetAddress: Address,
  depositPeriod: number,
): Promise<
  typeof schema.auctioneerDepositPeriod.$inferSelect & {
    rAssetPeriod: typeof schema.depositAssetPeriod.$inferSelect & {
      rDepositAsset: typeof schema.depositAsset.$inferSelect & {
        rAsset: typeof schema.asset.$inferSelect;
      };
    };
  }
> {
  // Check if it exists with nested relations
  const existing = await context.db.sql.query.auctioneerDepositPeriod.findFirst({
    where: and(
      eq(schema.auctioneerDepositPeriod.chainId, chainId),
      eq(schema.auctioneerDepositPeriod.auctioneer, auctioneerAddress.toLowerCase() as Address),
      eq(schema.auctioneerDepositPeriod.depositAsset, depositAssetAddress.toLowerCase() as Address),
      eq(schema.auctioneerDepositPeriod.depositPeriod, depositPeriod),
    ),
    with: {
      rAssetPeriod: {
        with: {
          rDepositAsset: {
            with: {
              rAsset: true,
            },
          },
        },
      },
    },
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
  };

  await context.db.insert(schema.auctioneerDepositPeriod).values(newPeriod);

  // Re-query with relations to return consistent type
  const created = await context.db.sql.query.auctioneerDepositPeriod.findFirst({
    where: and(
      eq(schema.auctioneerDepositPeriod.chainId, chainId),
      eq(schema.auctioneerDepositPeriod.auctioneer, auctioneerAddress.toLowerCase() as Address),
      eq(schema.auctioneerDepositPeriod.depositAsset, depositAssetAddress.toLowerCase() as Address),
      eq(schema.auctioneerDepositPeriod.depositPeriod, depositPeriod),
    ),
    with: {
      rAssetPeriod: {
        with: {
          rDepositAsset: {
            with: {
              rAsset: true,
            },
          },
        },
      },
    },
  });

  if (!created) {
    throw new Error(
      `Failed to create auctioneer deposit period: ${chainId}:${auctioneerAddress}:${depositAssetAddress}:${depositPeriod}`,
    );
  }

  return created;
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
  updates: Partial<
    Omit<
      typeof schema.auctioneerDepositPeriod.$inferSelect,
      "chainId" | "auctioneer" | "depositAsset" | "depositPeriod"
    >
  >,
): Promise<void> {
  await context.db
    .update(schema.auctioneerDepositPeriod, {
      chainId,
      auctioneer: auctioneerAddress.toLowerCase() as Address,
      depositAsset: depositAssetAddress.toLowerCase() as Address,
      depositPeriod,
    })
    .set(updates);
}
