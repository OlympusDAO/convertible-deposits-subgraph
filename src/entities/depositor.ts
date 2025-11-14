// Entity helpers for Depositor
// In Ponder, we use context.db for database operations

import type { Context } from "ponder:registry";
import schema from "ponder:schema";
import type { Address } from "viem";

/**
 * Get or create a Depositor
 */
export async function getOrCreateDepositor(
  context: Context,
  chainId: number,
  address: Address,
): Promise<typeof schema.depositor.$inferSelect> {
  // Check if depositor exists
  const existing = await context.db.find(schema.depositor, {
    chainId,
    address: address.toLowerCase() as Address,
  });

  if (existing) {
    return existing;
  }

  // Insert new depositor
  const newDepositor = {
    chainId,
    address: address.toLowerCase() as Address,
  };

  await context.db.insert(schema.depositor).values(newDepositor);

  return newDepositor;
}

/**
 * Get a Depositor record
 */
export async function getDepositor(
  context: Context,
  chainId: number,
  address: Address,
): Promise<typeof schema.depositor.$inferSelect> {
  const result = await context.db.find(schema.depositor, {
    chainId,
    address: address.toLowerCase() as Address,
  });

  if (!result) {
    throw new Error(`Depositor not found: ${chainId}:${address}`);
  }

  return result;
}
