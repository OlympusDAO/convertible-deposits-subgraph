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
