// Contract call functions for ConvertibleDepositFacility
// In Ponder, we use direct contract calls instead of Effect API

import type { Address } from "viem";
import type { PonderClient } from "../types";
import { ConvertibleDepositFacilityAbi } from "../../abis/ConvertibleDepositFacility";

/**
 * Fetch deposit manager address
 */
export async function fetchDepositManager(
  client: PonderClient,
  facilityAddress: Address,
): Promise<Address> {
  const result = await client.readContract({
    address: facilityAddress,
    abi: ConvertibleDepositFacilityAbi,
    functionName: "DEPOSIT_MANAGER",
  });

  return result;
}

/**
 * Fetch asset period reclaim rate
 */
export async function fetchDepositFacilityAssetPeriodReclaimRate(
  client: PonderClient,
  facilityAddress: Address,
  depositAssetAddress: Address,
  depositAssetPeriodMonths: number,
): Promise<number> {
  const result = await client.readContract({
    address: facilityAddress,
    abi: ConvertibleDepositFacilityAbi,
    functionName: "getAssetPeriodReclaimRate",
    args: [depositAssetAddress, depositAssetPeriodMonths],
  });

  return result;
}

/**
 * Fetch facility asset committed amount
 */
export async function fetchDepositFacilityAssetCommittedAmount(
  client: PonderClient,
  facilityAddress: Address,
  depositAssetAddress: Address,
): Promise<bigint> {
  const result = await client.readContract({
    address: facilityAddress,
    abi: ConvertibleDepositFacilityAbi,
    functionName: "getCommittedDeposits",
    args: [depositAssetAddress],
  });

  return result;
}

/**
 * Fetch facility claimable yield
 */
export async function fetchFacilityClaimableYield(
  client: PonderClient,
  facilityAddress: Address,
  assetAddress: Address,
): Promise<bigint> {
  const result = await client.readContract({
    address: facilityAddress,
    abi: ConvertibleDepositFacilityAbi,
    functionName: "previewClaimYield",
    args: [assetAddress],
  });

  return result;
}

