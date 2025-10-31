// Contract call functions for ConvertibleDepositAuctioneer
// In Ponder, we use direct contract calls instead of Effect API

import type { Address } from "viem";
import type { PonderClient } from "../types";
import { ConvertibleDepositAuctioneerAbi } from "../../abis/ConvertibleDepositAuctioneer";

/**
 * Fetch auctioneer current tick (price, capacity, lastUpdate)
 */
export async function fetchAuctioneerCurrentTick(
  client: PonderClient,
  address: Address,
  depositPeriod: number,
): Promise<{ price: bigint; capacity: bigint; lastUpdate: number }> {
  const result = await client.readContract({
    address,
    abi: ConvertibleDepositAuctioneerAbi,
    functionName: "getCurrentTick",
    args: [depositPeriod],
  });

  return {
    price: result.price,
    capacity: result.capacity,
    lastUpdate: result.lastUpdate,
  };
}

/**
 * Batch fetch all auctioneer configuration data in a single multicall
 * This is more efficient than making separate calls
 */
export async function fetchAuctioneerConfigBatch(
  client: PonderClient,
  address: Address,
): Promise<{
  version: { major: number; minor: number };
  trackingPeriod: number;
  depositAsset: Address;
  tickStep: number;
}> {
  const results = await client.multicall({
    contracts: [
      {
        address,
        abi: ConvertibleDepositAuctioneerAbi,
        functionName: "VERSION",
      },
      {
        address,
        abi: ConvertibleDepositAuctioneerAbi,
        functionName: "getAuctionTrackingPeriod",
      },
      {
        address,
        abi: ConvertibleDepositAuctioneerAbi,
        functionName: "getDepositAsset",
      },
      {
        address,
        abi: ConvertibleDepositAuctioneerAbi,
        functionName: "getTickStep",
      },
    ],
  });

  // Extract results with proper typing
  const versionResult = results[0];
  const trackingPeriodResult = results[1];
  const depositAssetResult = results[2];
  const tickStepResult = results[3];

  if (
    versionResult.status === "failure" ||
    trackingPeriodResult.status === "failure" ||
    depositAssetResult.status === "failure" ||
    tickStepResult.status === "failure"
  ) {
    throw new Error(
      `Failed to fetch auctioneer config batch for ${address}: ${versionResult.error || trackingPeriodResult.error || depositAssetResult.error || tickStepResult.error}`
    );
  }

  return {
    version: {
      major: versionResult.result[0],
      minor: versionResult.result[1],
    },
    trackingPeriod: trackingPeriodResult.result,
    depositAsset: depositAssetResult.result,
    tickStep: tickStepResult.result,
  };
}

/**
 * Fetch auctioneer parameters (target, tickSize, minPrice)
 */
export async function fetchAuctioneerParameters(
  client: PonderClient,
  address: Address,
): Promise<{ target: bigint; tickSize: bigint; minPrice: bigint }> {
  const result = await client.readContract({
    address,
    abi: ConvertibleDepositAuctioneerAbi,
    functionName: "getAuctionParameters",
  });

  return result;
}

/**
 * Fetch auctioneer day state (dayInitTimestamp, convertible)
 */
export async function fetchAuctioneerDayState(
  client: PonderClient,
  address: Address,
): Promise<{ dayInitTimestamp: bigint; convertible: bigint }> {
  const result = await client.readContract({
    address,
    abi: ConvertibleDepositAuctioneerAbi,
    functionName: "getDayState",
  });

  return {
    dayInitTimestamp: BigInt(result.initTimestamp),
    convertible: result.convertible,
  };
}

/**
 * Batch fetch auctioneer day state and parameters in a single multicall
 */
export async function fetchAuctioneerDayStateAndParameters(
  client: PonderClient,
  address: Address,
): Promise<{
  dayState: { dayInitTimestamp: bigint; convertible: bigint };
  parameters: { target: bigint; tickSize: bigint; minPrice: bigint };
}> {
  const results = await client.multicall({
    contracts: [
      {
        address,
        abi: ConvertibleDepositAuctioneerAbi,
        functionName: "getDayState",
      },
      {
        address,
        abi: ConvertibleDepositAuctioneerAbi,
        functionName: "getAuctionParameters",
      },
    ],
  });

  const dayStateResult = results[0];
  const parametersResult = results[1];

  if (dayStateResult.status === "failure" || parametersResult.status === "failure") {
    throw new Error(
      `Failed to fetch auctioneer day state and parameters for ${address}: ${dayStateResult.error || parametersResult.error}`
    );
  }

  return {
    dayState: {
      dayInitTimestamp: BigInt(dayStateResult.result.initTimestamp),
      convertible: dayStateResult.result.convertible,
    },
    parameters: parametersResult.result,
  };
}

/**
 * Fetch auctioneer active status
 */
export async function fetchAuctioneerIsActive(
  client: PonderClient,
  address: Address,
): Promise<boolean> {
  const result = await client.readContract({
    address,
    abi: ConvertibleDepositAuctioneerAbi,
    functionName: "isActive",
  });

  return result;
}

/**
 * Fetch auctioneer enabled deposit periods
 */
export async function fetchAuctioneerEnabledPeriods(
  client: PonderClient,
  address: Address,
): Promise<number[]> {
  const result = await client.readContract({
    address,
    abi: ConvertibleDepositAuctioneerAbi,
    functionName: "getDepositPeriods",
  });

  return [...result];
}

