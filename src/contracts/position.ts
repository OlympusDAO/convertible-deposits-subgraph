import type { Address } from "viem";
import { DepositPositionManagerAbi } from "../../abis/DepositPositionManager";
import type { Context } from "../types";

const getPositionManager = (chainId: number): Address => {
  // TODO convert to lookup via keycode
  switch (chainId) {
    case 1:
      return "0x02331A4c97a4841084dF54d7c0eC04DD3f1A9F1c";
    case 11155111:
      return "0xb2c2Bab8023E7AEdc0fB13B10B24CA5Af5CdD16f";
    default:
      throw new Error(`Unsupported chain ID: ${chainId}`);
  }
};

export interface Position {
  operator: Address;
  owner: Address;
  asset: Address;
  periodMonths: number;
  remainingDeposit: bigint;
  conversionPrice: bigint;
  expiry: number;
  wrapped: boolean;
  additionalData: `0x${string}`;
}

/**
 * Fetch a single position from the DepositPositionManager contract
 */
export async function fetchPosition(context: Context, positionId: bigint): Promise<Position> {
  const result = await context.client.readContract({
    address: getPositionManager(context.chain.id),
    abi: DepositPositionManagerAbi,
    functionName: "getPosition",
    args: [positionId],
  });

  return {
    operator: result.operator,
    owner: result.owner,
    asset: result.asset,
    periodMonths: result.periodMonths,
    remainingDeposit: result.remainingDeposit,
    conversionPrice: result.conversionPrice,
    expiry: result.expiry,
    wrapped: result.wrapped,
    additionalData: result.additionalData,
  };
}

/**
 * Fetch all position IDs for a user
 */
export async function fetchUserPositionIds(
  context: Context,
  userAddress: Address,
): Promise<bigint[]> {
  const result = await context.client.readContract({
    address: getPositionManager(context.chain.id),
    abi: DepositPositionManagerAbi,
    functionName: "getUserPositionIds",
    args: [userAddress],
  });

  return [...result];
}

/**
 * Batch fetch multiple positions using multicall
 */
export async function fetchPositions(context: Context, positionIds: bigint[]): Promise<Position[]> {
  if (positionIds.length === 0) {
    return [];
  }

  const contracts = positionIds.map((positionId) => ({
    address: getPositionManager(context.chain.id),
    abi: DepositPositionManagerAbi,
    functionName: "getPosition" as const,
    args: [positionId],
  }));

  const results = await context.client.multicall({
    contracts,
  });

  // Extract results - throw if any call failed
  const positions: Position[] = [];
  for (let i = 0; i < results.length; i++) {
    const result = results[i];
    if (!result) {
      throw new Error(`No result returned for position ${positionIds[i]}`);
    }
    if (result.status === "failure") {
      const errorMsg = result.error?.message || String(result.error) || "Unknown error";
      throw new Error(`Failed to fetch position ${positionIds[i]}: ${errorMsg}`);
    }
    if (result.status === "success") {
      if (!result.result) {
        throw new Error(`Success status but no result for position ${positionIds[i]}`);
      }
      positions.push({
        operator: result.result.operator,
        owner: result.result.owner,
        asset: result.result.asset,
        periodMonths: result.result.periodMonths,
        remainingDeposit: result.result.remainingDeposit,
        conversionPrice: result.result.conversionPrice,
        expiry: result.result.expiry,
        wrapped: result.result.wrapped,
        additionalData: result.result.additionalData,
      });
    }
  }
  return positions;
}
