// Entity helpers for DepositFacility
// In Ponder, we use context.db for database operations and context.client for contract calls

import type { Context } from "ponder:registry";
import schema from "ponder:schema";
import { and, eq } from "ponder";
import type { Address } from "viem";
import {
  fetchDepositFacilityAssetCommittedAmount,
  fetchDepositFacilityAssetPeriodReclaimRate,
} from "../contracts/depositFacility";
import { toBpsDecimal, toDecimal } from "../utils/decimal";
import { getOrCreateDepositAsset, getOrCreateDepositAssetPeriod } from "./asset";

/**
 * Get or create a DepositFacility
 */
export async function getOrCreateDepositFacility(
  context: Context,
  chainId: number,
  address: Address,
): Promise<typeof schema.depositFacility.$inferSelect> {
  // Check if facility exists
  const existing = await context.db.find(schema.depositFacility, {
    chainId,
    address: address.toLowerCase() as Address,
  });

  if (existing) {
    return existing;
  }

  // Insert new facility
  const newFacility = {
    chainId,
    address: address.toLowerCase() as Address,
    enabled: false,
  };

  await context.db.insert(schema.depositFacility).values(newFacility);

  return newFacility;
}

/**
 * Get a DepositFacility record
 */
export async function getDepositFacility(
  context: Context,
  chainId: number,
  address: Address,
): Promise<typeof schema.depositFacility.$inferSelect> {
  const result = await context.db.find(schema.depositFacility, {
    chainId,
    address: address.toLowerCase() as Address,
  });

  if (!result) {
    throw new Error(`Deposit facility not found: ${chainId}:${address}`);
  }

  return result;
}

/**
 * Update an existing DepositFacility
 */
export async function updateDepositFacility(
  context: Context,
  chainId: number,
  address: Address,
  updates: Partial<Omit<typeof schema.depositFacility.$inferSelect, "chainId" | "address">>,
): Promise<void> {
  await context.db
    .update(schema.depositFacility, {
      chainId,
      address: address.toLowerCase() as Address,
    })
    .set(updates);
}

/**
 * Get or create a DepositFacilityAsset (with nested asset relation for decimals)
 */
export async function getOrCreateDepositFacilityAsset(
  context: Context,
  chainId: number,
  facilityAddress: Address,
  depositAssetAddress: Address,
): Promise<
  typeof schema.depositFacilityAsset.$inferSelect & {
    rDepositAsset: typeof schema.depositAsset.$inferSelect & {
      rAsset: typeof schema.asset.$inferSelect;
    };
  }
> {
  // Check if it exists with nested relations
  const existing = await context.db.sql.query.depositFacilityAsset.findFirst({
    where: and(
      eq(schema.depositFacilityAsset.chainId, chainId),
      eq(schema.depositFacilityAsset.facility, facilityAddress.toLowerCase() as Address),
      eq(schema.depositFacilityAsset.depositAsset, depositAssetAddress.toLowerCase() as Address),
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
    // Ensure nested relations exist before returning
    if (!existing.rDepositAsset?.rAsset?.decimals) {
      throw new Error(
        `Deposit asset or asset not found: ${chainId}, ${facilityAddress}, ${depositAssetAddress}`,
      );
    }
    return existing;
  }

  // Get or create facility and deposit asset
  await getOrCreateDepositFacility(context, chainId, facilityAddress);
  const depositAsset = await getOrCreateDepositAsset(context, chainId, depositAssetAddress);

  // Fetch committed amount from contract
  const committedAmount = await fetchDepositFacilityAssetCommittedAmount(
    context.client,
    facilityAddress,
    depositAssetAddress,
  );

  // Use decimals from relation
  const assetDecimals = depositAsset.rAsset.decimals;

  // Insert new facility asset
  const newAsset = {
    chainId,
    facility: facilityAddress.toLowerCase() as Address,
    depositAsset: depositAssetAddress.toLowerCase() as Address,
    committedAmount,
    committedAmountDecimal: toDecimal(committedAmount, assetDecimals),
  };

  await context.db.insert(schema.depositFacilityAsset).values(newAsset);

  // Re-query with relations to return consistent type
  const created = await context.db.sql.query.depositFacilityAsset.findFirst({
    where: and(
      eq(schema.depositFacilityAsset.chainId, chainId),
      eq(schema.depositFacilityAsset.facility, facilityAddress.toLowerCase() as Address),
      eq(schema.depositFacilityAsset.depositAsset, depositAssetAddress.toLowerCase() as Address),
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
      `Failed to create deposit facility asset: ${chainId}:${facilityAddress}:${depositAssetAddress}`,
    );
  }

  // Ensure nested relations exist before returning
  if (!created.rDepositAsset) {
    throw new Error(
      `Deposit asset or asset not found: ${chainId}, ${facilityAddress}, ${depositAssetAddress}`,
    );
  }

  return created;
}

/**
 * Get or create a DepositFacilityAssetPeriod (with nested asset relation for decimals)
 */
export async function getOrCreateDepositFacilityAssetPeriod(
  context: Context,
  chainId: number,
  facilityAddress: Address,
  depositAssetAddress: Address,
  depositPeriod: number,
): Promise<
  typeof schema.depositFacilityAssetPeriod.$inferSelect & {
    rAssetPeriod: typeof schema.depositAssetPeriod.$inferSelect & {
      rDepositAsset: typeof schema.depositAsset.$inferSelect & {
        rAsset: typeof schema.asset.$inferSelect;
      };
    };
  }
> {
  // Check if it exists with nested relations
  const existing = await context.db.sql.query.depositFacilityAssetPeriod.findFirst({
    where: and(
      eq(schema.depositFacilityAssetPeriod.chainId, chainId),
      eq(schema.depositFacilityAssetPeriod.facility, facilityAddress.toLowerCase() as Address),
      eq(
        schema.depositFacilityAssetPeriod.depositAsset,
        depositAssetAddress.toLowerCase() as Address,
      ),
      eq(schema.depositFacilityAssetPeriod.depositPeriod, depositPeriod),
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

  // Get or create facility asset
  await getOrCreateDepositFacilityAsset(context, chainId, facilityAddress, depositAssetAddress);

  // Get or create deposit asset period
  await getOrCreateDepositAssetPeriod(context, chainId, depositAssetAddress, depositPeriod);

  // Fetch reclaim rate from contract
  const reclaimRate = await fetchDepositFacilityAssetPeriodReclaimRate(
    context.client,
    facilityAddress,
    depositAssetAddress,
    depositPeriod,
  );

  // Insert new facility asset period
  const newPeriod = {
    chainId,
    facility: facilityAddress.toLowerCase() as Address,
    depositAsset: depositAssetAddress.toLowerCase() as Address,
    depositPeriod,
    reclaimRate: BigInt(reclaimRate),
    reclaimRateDecimal: toBpsDecimal(reclaimRate),
  };

  await context.db.insert(schema.depositFacilityAssetPeriod).values(newPeriod);

  // Re-query with relations to return consistent type
  const created = await context.db.sql.query.depositFacilityAssetPeriod.findFirst({
    where: and(
      eq(schema.depositFacilityAssetPeriod.chainId, chainId),
      eq(schema.depositFacilityAssetPeriod.facility, facilityAddress.toLowerCase() as Address),
      eq(
        schema.depositFacilityAssetPeriod.depositAsset,
        depositAssetAddress.toLowerCase() as Address,
      ),
      eq(schema.depositFacilityAssetPeriod.depositPeriod, depositPeriod),
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
      `Failed to create deposit facility asset period: ${chainId}:${facilityAddress}:${depositAssetAddress}:${depositPeriod}`,
    );
  }

  return created;
}

/**
 * Update an existing DepositFacilityAsset
 */
export async function updateDepositFacilityAsset(
  context: Context,
  chainId: number,
  facilityAddress: Address,
  depositAssetAddress: Address,
  updates: Partial<
    Omit<typeof schema.depositFacilityAsset.$inferSelect, "chainId" | "facility" | "depositAsset">
  >,
): Promise<void> {
  await context.db
    .update(schema.depositFacilityAsset, {
      chainId,
      facility: facilityAddress.toLowerCase() as Address,
      depositAsset: depositAssetAddress.toLowerCase() as Address,
    })
    .set(updates);
}

/**
 * Update an existing DepositFacilityAssetPeriod
 */
export async function updateDepositFacilityAssetPeriod(
  context: Context,
  chainId: number,
  facilityAddress: Address,
  depositAssetAddress: Address,
  depositPeriod: number,
  updates: Partial<
    Omit<
      typeof schema.depositFacilityAssetPeriod.$inferSelect,
      "chainId" | "facility" | "depositAsset" | "depositPeriod"
    >
  >,
): Promise<void> {
  await context.db
    .update(schema.depositFacilityAssetPeriod, {
      chainId,
      facility: facilityAddress.toLowerCase() as Address,
      depositAsset: depositAssetAddress.toLowerCase() as Address,
      depositPeriod,
    })
    .set(updates);
}
