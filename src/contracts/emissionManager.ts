import type { Address } from "viem";
import { EmissionManagerAbi } from "../../abis/EmissionManager";
import type { PonderClient } from "../types";

type MulticallItem<T> = { status: "success"; result: T } | { status: "failure"; error: unknown };

function unwrapResult<T>(result: MulticallItem<T>): T {
  if (result.status === "failure") {
    throw result.error;
  }

  return result.result;
}

export async function fetchEmissionManagerState(
  client: PonderClient,
  address: Address,
): Promise<{
  enabled: boolean;
  backing: bigint;
  baseEmissionRate: bigint;
  bondMarketAuctioneer: Address;
  convertibleDepositAuctioneer: Address;
  bondMarketTeller: Address;
  bondMarketCapacityScalar: bigint;
  minPriceScalar: bigint;
  minimumPremium: bigint;
  reserveAsset: Address;
  restartTimeframe: bigint;
  tickSize: bigint;
  vestingPeriod: bigint;
}> {
  const results = await client.multicall({
    contracts: [
      {
        address,
        abi: EmissionManagerAbi,
        functionName: "isEnabled",
      },
      {
        address,
        abi: EmissionManagerAbi,
        functionName: "backing",
      },
      {
        address,
        abi: EmissionManagerAbi,
        functionName: "baseEmissionRate",
      },
      {
        address,
        abi: EmissionManagerAbi,
        functionName: "bondAuctioneer",
      },
      {
        address,
        abi: EmissionManagerAbi,
        functionName: "cdAuctioneer",
      },
      {
        address,
        abi: EmissionManagerAbi,
        functionName: "teller",
      },
      {
        address,
        abi: EmissionManagerAbi,
        functionName: "bondMarketCapacityScalar",
      },
      {
        address,
        abi: EmissionManagerAbi,
        functionName: "minPriceScalar",
      },
      {
        address,
        abi: EmissionManagerAbi,
        functionName: "minimumPremium",
      },
      {
        address,
        abi: EmissionManagerAbi,
        functionName: "reserve",
      },
      {
        address,
        abi: EmissionManagerAbi,
        functionName: "restartTimeframe",
      },
      {
        address,
        abi: EmissionManagerAbi,
        functionName: "tickSize",
      },
      {
        address,
        abi: EmissionManagerAbi,
        functionName: "vestingPeriod",
      },
    ],
  });

  const [
    enabledResult,
    backingResult,
    baseEmissionRateResult,
    bondMarketAuctioneerResult,
    convertibleDepositAuctioneerResult,
    bondMarketTellerResult,
    bondMarketCapacityScalarResult,
    minPriceScalarResult,
    minimumPremiumResult,
    reserveAssetResult,
    restartTimeframeResult,
    tickSizeResult,
    vestingPeriodResult,
  ] = results;

  // The initial sepolia version of the EmissionManager did not have a bond market capacity scalar, so we default to 100%
  let bondMarketCapacityScalar: bigint = BigInt(1e18);
  if (bondMarketCapacityScalarResult.status === "success") {
    bondMarketCapacityScalar = BigInt(bondMarketCapacityScalarResult.result);
  }

  return {
    enabled: unwrapResult(enabledResult),
    backing: unwrapResult(backingResult),
    baseEmissionRate: unwrapResult(baseEmissionRateResult),
    bondMarketAuctioneer: unwrapResult(bondMarketAuctioneerResult),
    convertibleDepositAuctioneer: unwrapResult(convertibleDepositAuctioneerResult),
    bondMarketTeller: unwrapResult(bondMarketTellerResult),
    bondMarketCapacityScalar: bondMarketCapacityScalar,
    minPriceScalar: unwrapResult(minPriceScalarResult),
    minimumPremium: unwrapResult(minimumPremiumResult),
    reserveAsset: unwrapResult(reserveAssetResult),
    restartTimeframe: BigInt(unwrapResult(restartTimeframeResult)),
    tickSize: unwrapResult(tickSizeResult),
    vestingPeriod: BigInt(unwrapResult(vestingPeriodResult)),
  };
}

export async function fetchEmissionManagerBaseEmissionRate(
  client: PonderClient,
  address: Address,
): Promise<bigint> {
  return client.readContract({
    address,
    abi: EmissionManagerAbi,
    functionName: "baseEmissionRate",
  });
}
