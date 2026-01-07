// Contract call functions for ConvertibleDepositAuctioneerLimitOrders
// In Ponder, we use direct contract calls instead of Effect API

import type { Address } from "viem";
import { erc20Abi } from "viem";
import { ConvertibleDepositAuctioneerAbi } from "../../abis/ConvertibleDepositAuctioneer";
import { ConvertibleDepositAuctioneerLimitOrdersAbi } from "../../abis/ConvertibleDepositAuctioneerLimitOrders";
import type { PonderClient } from "../types";

/**
 * Fetch limit order data from contract
 */
export async function fetchLimitOrder(
  client: PonderClient,
  contractAddress: Address,
  orderId: bigint,
): Promise<{
  owner: Address;
  depositPeriod: number;
  active: boolean;
  depositBudget: bigint;
  incentiveBudget: bigint;
  depositSpent: bigint;
  incentiveSpent: bigint;
  maxPrice: bigint;
  minFillSize: bigint;
}> {
  const result = await client.readContract({
    address: contractAddress,
    abi: ConvertibleDepositAuctioneerLimitOrdersAbi,
    functionName: "getOrder",
    args: [orderId],
  });

  return {
    owner: result.owner,
    depositPeriod: result.depositPeriod,
    active: result.active,
    depositBudget: result.depositBudget,
    incentiveBudget: result.incentiveBudget,
    depositSpent: result.depositSpent,
    incentiveSpent: result.incentiveSpent,
    maxPrice: result.maxPrice,
    minFillSize: result.minFillSize,
  };
}

/**
 * Fetch LimitOrders contract enabled status
 */
export async function fetchLimitOrdersContractEnabled(
  client: PonderClient,
  contractAddress: Address,
): Promise<boolean> {
  const result = await client.readContract({
    address: contractAddress,
    abi: ConvertibleDepositAuctioneerLimitOrdersAbi,
    functionName: "isEnabled",
  });

  return result;
}

/**
 * Fetch USDS address from LimitOrders contract
 * This can be used to determine the depositAsset
 */
export async function fetchLimitOrdersUSDS(
  client: PonderClient,
  contractAddress: Address,
): Promise<Address> {
  const result = await client.readContract({
    address: contractAddress,
    abi: ConvertibleDepositAuctioneerLimitOrdersAbi,
    functionName: "USDS",
  });

  return result;
}

/**
 * Fetch sUSDS address from LimitOrders contract
 */
export async function fetchLimitOrdersSUSDS(
  client: PonderClient,
  contractAddress: Address,
): Promise<Address> {
  const result = await client.readContract({
    address: contractAddress,
    abi: ConvertibleDepositAuctioneerLimitOrdersAbi,
    functionName: "SUSDS",
  });

  return result;
}

/**
 * Fetch CD_AUCTIONEER address from LimitOrders contract
 */
export async function fetchLimitOrdersAuctioneer(
  client: PonderClient,
  contractAddress: Address,
): Promise<Address> {
  const result = await client.readContract({
    address: contractAddress,
    abi: ConvertibleDepositAuctioneerLimitOrdersAbi,
    functionName: "CD_AUCTIONEER",
  });

  return result;
}

/**
 * Fetch CD_FACILITY address from Auctioneer contract
 */
export async function fetchAuctioneerFacility(
  client: PonderClient,
  auctioneerAddress: Address,
): Promise<Address> {
  const result = await client.readContract({
    address: auctioneerAddress,
    abi: ConvertibleDepositAuctioneerAbi,
    functionName: "CD_FACILITY",
  });

  return result;
}

/**
 * Fetch total USDS owed from LimitOrders contract
 */
export async function fetchLimitOrdersTotalUsdsOwed(
  client: PonderClient,
  contractAddress: Address,
): Promise<bigint> {
  const result = await client.readContract({
    address: contractAddress,
    abi: ConvertibleDepositAuctioneerLimitOrdersAbi,
    functionName: "totalUsdsOwed",
  });

  return result;
}

/**
 * Fetch total USDS deposited (sUSDS balance converted to USDS terms)
 */
export async function fetchLimitOrdersTotalUsdsDeposited(
  client: PonderClient,
  contractAddress: Address,
): Promise<bigint> {
  // Get sUSDS address
  const sUsdsAddress = await fetchLimitOrdersSUSDS(client, contractAddress);

  // Get sUSDS balance of the LimitOrders contract (ERC20 balanceOf)
  const balanceResult = await client.readContract({
    address: sUsdsAddress,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: [contractAddress],
  });

  // Convert sUSDS shares to USDS assets using ERC4626 convertToAssets
  // ERC4626 extends ERC20, so we can use the same abi reference
  const assetsResult = await client.readContract({
    address: sUsdsAddress,
    abi: [
      {
        type: "function",
        name: "convertToAssets",
        inputs: [{ name: "shares", type: "uint256", internalType: "uint256" }],
        outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
        stateMutability: "view",
      },
    ],
    functionName: "convertToAssets",
    args: [balanceResult],
  });

  return assetsResult;
}
