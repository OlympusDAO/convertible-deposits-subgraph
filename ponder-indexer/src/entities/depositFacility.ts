// Entity helpers for DepositFacility
// In Ponder, we use context.db for database operations and context.client for contract calls

import type { Address } from "viem";
import schema from "ponder:schema";
import type { Context } from "ponder:registry";

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

