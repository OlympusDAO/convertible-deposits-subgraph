// Contract call functions for ConvertibleDepositFacility
// In Ponder, we use direct contract calls instead of Effect API

import type { Address } from "viem";
import { ConvertibleDepositFacilityAbi } from "../../abis/ConvertibleDepositFacility";
import { DepositManagerAbi } from "../../abis/DepositManager";
import type { PonderClient } from "../types";

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

/**
 * Batch fetch facility claimable yield for multiple facility/asset pairs in a single multicall
 * This is more efficient than making separate calls, especially in loops
 * @param facilityAssetMap - Map of facility addresses to arrays of asset addresses
 * @returns Nested Map: Map<facilityAddress, Map<assetAddress, claimableYield>>
 */
export async function fetchFacilityClaimableYieldBatch(
  client: PonderClient,
  facilityAssetMap: Map<Address, Address[]>,
): Promise<Map<Address, Map<Address, bigint>>> {
  // Build contracts array directly from Map structure
  const contracts: Array<{
    address: Address;
    abi: typeof ConvertibleDepositFacilityAbi;
    functionName: "previewClaimYield";
    args: [Address];
    facilityAddress: Address;
    assetAddress: Address;
  }> = [];

  for (const [facilityAddress, assetAddresses] of facilityAssetMap) {
    for (const assetAddress of assetAddresses) {
      contracts.push({
        address: facilityAddress,
        abi: ConvertibleDepositFacilityAbi,
        functionName: "previewClaimYield" as const,
        args: [assetAddress] as [Address],
        facilityAddress,
        assetAddress,
      });
    }
  }

  if (contracts.length === 0) {
    return new Map();
  }

  const results = await client.multicall({
    contracts: contracts.map(({ address, abi, functionName, args }) => ({
      address,
      abi,
      functionName,
      args,
    })),
  });

  // Build nested Map structure
  const yieldMap = new Map<Address, Map<Address, bigint>>();
  for (let i = 0; i < results.length; i++) {
    const result = results[i];
    const contract = contracts[i];
    if (!contract) {
      throw new Error(`Missing contract at index ${i}`);
    }
    if (!result) {
      throw new Error(
        `No result returned for facility ${contract.facilityAddress} asset ${contract.assetAddress} at index ${i}`,
      );
    }
    if (result.status === "failure") {
      throw new Error(
        `Failed to fetch claimable yield for facility ${contract.facilityAddress} asset ${contract.assetAddress}: ${result.error}`,
      );
    }

    const claimableYield = result.result as bigint;

    // Get or create inner Map for this facility
    let facilityYieldMap = yieldMap.get(contract.facilityAddress);
    if (!facilityYieldMap) {
      facilityYieldMap = new Map<Address, bigint>();
      yieldMap.set(contract.facilityAddress, facilityYieldMap);
    }

    facilityYieldMap.set(contract.assetAddress, claimableYield);
  }

  return yieldMap;
}

/**
 * Fetch receipt token manager address from deposit manager
 */
export async function fetchReceiptTokenManager(
  client: PonderClient,
  depositManagerAddress: Address,
): Promise<Address> {
  const result = await client.readContract({
    address: depositManagerAddress,
    abi: DepositManagerAbi,
    functionName: "getReceiptTokenManager",
  });

  return result;
}

/**
 * Fetch receipt token ID from deposit manager
 */
export async function fetchReceiptTokenId(
  client: PonderClient,
  depositManagerAddress: Address,
  assetAddress: Address,
  depositPeriod: number,
  facilityAddress: Address,
): Promise<bigint> {
  const result = await client.readContract({
    address: depositManagerAddress,
    abi: DepositManagerAbi,
    functionName: "getReceiptTokenId",
    args: [assetAddress, depositPeriod, facilityAddress],
  });

  return result;
}

/**
 * Batch fetch receipt token manager and ID
 */
export async function fetchReceiptTokenData(
  client: PonderClient,
  depositManagerAddress: Address,
  assetAddress: Address,
  depositPeriod: number,
  facilityAddress: Address,
): Promise<{
  receiptTokenManager: Address;
  receiptTokenId: bigint;
}> {
  const results = await client.multicall({
    contracts: [
      {
        address: depositManagerAddress,
        abi: DepositManagerAbi,
        functionName: "getReceiptTokenManager",
      },
      {
        address: depositManagerAddress,
        abi: DepositManagerAbi,
        functionName: "getReceiptTokenId",
        args: [assetAddress, depositPeriod, facilityAddress],
      },
    ],
  });

  const managerResult = results[0];
  const idResult = results[1];

  if (managerResult.status === "failure" || idResult.status === "failure") {
    throw new Error(
      `Failed to fetch receipt token data from ${depositManagerAddress}: ${managerResult.error || idResult.error}`,
    );
  }

  return {
    receiptTokenManager: managerResult.result,
    receiptTokenId: idResult.result,
  };
}
