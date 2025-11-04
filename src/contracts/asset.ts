// Contract call functions for Asset (ERC20)
// In Ponder, we use direct contract calls instead of Effect API

import type { Address } from "viem";
import { erc20Abi } from "viem";
import type { PonderClient } from "../types";

/**
 * Fetch ERC20 asset decimals
 */
export async function fetchAssetDecimals(client: PonderClient, address: Address): Promise<number> {
  const result = await client.readContract({
    address,
    abi: erc20Abi,
    functionName: "decimals",
  });

  return result;
}

/**
 * Fetch ERC20 asset name
 */
export async function fetchAssetName(client: PonderClient, address: Address): Promise<string> {
  const result = await client.readContract({
    address,
    abi: erc20Abi,
    functionName: "name",
  });

  return result;
}

/**
 * Fetch ERC20 asset symbol
 */
export async function fetchAssetSymbol(client: PonderClient, address: Address): Promise<string> {
  const result = await client.readContract({
    address,
    abi: erc20Abi,
    functionName: "symbol",
  });

  return result;
}

/**
 * Batch fetch all ERC20 asset data (decimals, name, symbol) in a single multicall
 * This is more efficient than making separate calls
 */
export async function fetchAssetDataBatch(
  client: PonderClient,
  address: Address,
): Promise<{
  decimals: number;
  name: string;
  symbol: string;
}> {
  const results = await client.multicall({
    contracts: [
      {
        address,
        abi: erc20Abi,
        functionName: "decimals",
      },
      {
        address,
        abi: erc20Abi,
        functionName: "name",
      },
      {
        address,
        abi: erc20Abi,
        functionName: "symbol",
      },
    ],
  });

  const decimalsResult = results[0];
  const nameResult = results[1];
  const symbolResult = results[2];

  if (
    decimalsResult.status === "failure" ||
    nameResult.status === "failure" ||
    symbolResult.status === "failure"
  ) {
    throw new Error(
      `Failed to fetch asset data batch for ${address}: ${decimalsResult.error || nameResult.error || symbolResult.error}`,
    );
  }

  return {
    decimals: decimalsResult.result,
    name: nameResult.result,
    symbol: symbolResult.result,
  };
}
