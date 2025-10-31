// Contract call functions for DepositPositionManager
// In Ponder, we use direct contract calls instead of Effect API

import type { Address } from "viem";
import type { PonderClient } from "../types";
import { DepositPositionManagerAbi } from "../../abis/DepositPositionManager";

const DEPOSIT_POSITION_MANAGER: Address = "0xb2c2Bab8023E7AEdc0fB13B10B24CA5Af5CdD16f";

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
export async function fetchPosition(
  client: PonderClient,
  positionId: bigint,
): Promise<Position> {
  const result = await client.readContract({
    address: DEPOSIT_POSITION_MANAGER,
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
  client: PonderClient,
  userAddress: Address,
): Promise<bigint[]> {
  const result = await client.readContract({
    address: DEPOSIT_POSITION_MANAGER,
    abi: DepositPositionManagerAbi,
    functionName: "getUserPositionIds",
    args: [userAddress],
  });

  return [...result];
}

/**
 * Batch fetch multiple positions using multicall
 */
export async function fetchPositions(
  client: PonderClient,
  positionIds: bigint[],
): Promise<Position[]> {
  if (positionIds.length === 0) {
    return [];
  }

  const contracts = positionIds.map((positionId) => ({
    address: DEPOSIT_POSITION_MANAGER,
    abi: DepositPositionManagerAbi,
    functionName: "getPosition" as const,
    args: [positionId],
  }));

  const results = await client.multicall({
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

