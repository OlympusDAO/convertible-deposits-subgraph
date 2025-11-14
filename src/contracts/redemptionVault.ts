import type { Address } from "viem";
import { DepositRedemptionVaultAbi } from "../../abis/DepositRedemptionVault";
import type { PonderClient } from "../types";

const UINT256_MAX = BigInt(
  "115792089237316195423570985008687907853269984665640564039457584007913129639935",
);

/**
 * Fetch claim default reward percentage from redemption vault
 */
export async function fetchClaimDefaultRewardPercentage(
  client: PonderClient,
  address: Address,
): Promise<number> {
  const result = await client.readContract({
    address,
    abi: DepositRedemptionVaultAbi,
    functionName: "getClaimDefaultRewardPercentage",
  });
  return Number(result);
}

/**
 * Fetch redemption vault interest rate for an asset/facility pair
 */
export async function fetchRedemptionVaultInterestRate(
  client: PonderClient,
  address: Address,
  facilityAddress: Address,
  assetAddress: Address,
): Promise<number> {
  const result = await client.readContract({
    address,
    abi: DepositRedemptionVaultAbi,
    functionName: "getAnnualInterestRate",
    args: [assetAddress, facilityAddress],
  });
  return Number(result);
}

/**
 * Fetch redemption vault max borrow percentage for an asset/facility pair
 */
export async function fetchRedemptionVaultMaxBorrowPercentage(
  client: PonderClient,
  address: Address,
  facilityAddress: Address,
  assetAddress: Address,
): Promise<number> {
  const result = await client.readContract({
    address,
    abi: DepositRedemptionVaultAbi,
    functionName: "getMaxBorrowPercentage",
    args: [assetAddress, facilityAddress],
  });
  return Number(result);
}

/**
 * Batch fetch interest rate and max borrow percentage
 */
export async function fetchRedemptionVaultAssetConfiguration(
  client: PonderClient,
  address: Address,
  facilityAddress: Address,
  assetAddress: Address,
): Promise<{
  interestRate: number;
  maxBorrowPercentage: number;
}> {
  const results = await client.multicall({
    contracts: [
      {
        address,
        abi: DepositRedemptionVaultAbi,
        functionName: "getAnnualInterestRate",
        args: [assetAddress, facilityAddress],
      },
      {
        address,
        abi: DepositRedemptionVaultAbi,
        functionName: "getMaxBorrowPercentage",
        args: [assetAddress, facilityAddress],
      },
    ],
  });

  const interestRateResult = results[0];
  const maxBorrowPercentageResult = results[1];

  if (interestRateResult.status === "failure" || maxBorrowPercentageResult.status === "failure") {
    throw new Error(
      `Failed to fetch redemption vault asset configuration for ${address}: ${interestRateResult.error || maxBorrowPercentageResult.error}`,
    );
  }

  return {
    interestRate: Number(interestRateResult.result),
    maxBorrowPercentage: Number(maxBorrowPercentageResult.result),
  };
}

/**
 * Fetch redemption data for a user and redemption id
 */
export async function fetchRedemption(
  client: PonderClient,
  vaultAddress: Address,
  userAddress: Address,
  redemptionId: number,
): Promise<{
  depositToken: Address;
  depositPeriod: number;
  redeemableAt: bigint;
  amount: bigint;
  facility: Address;
  positionId: bigint | null;
}> {
  const result = await client.readContract({
    address: vaultAddress,
    abi: DepositRedemptionVaultAbi,
    functionName: "getUserRedemption",
    args: [userAddress, redemptionId],
  });

  return {
    depositToken: result.depositToken,
    depositPeriod: Number(result.depositPeriod),
    redeemableAt: BigInt(result.redeemableAt),
    amount: result.amount,
    facility: result.facility,
    positionId: result.positionId === UINT256_MAX ? null : result.positionId,
  };
}

/**
 * Fetch loan data for a redemption
 */
export async function fetchLoan(
  client: PonderClient,
  vaultAddress: Address,
  userAddress: Address,
  redemptionId: number,
): Promise<{
  initialPrincipal: bigint;
  principal: bigint;
  interest: bigint;
  dueDate: bigint;
  isDefaulted: boolean;
}> {
  const result = await client.readContract({
    address: vaultAddress,
    abi: DepositRedemptionVaultAbi,
    functionName: "getRedemptionLoan",
    args: [userAddress, redemptionId],
  });

  return {
    initialPrincipal: result.initialPrincipal,
    principal: result.principal,
    interest: result.interest,
    dueDate: BigInt(result.dueDate),
    isDefaulted: result.isDefaulted,
  };
}
