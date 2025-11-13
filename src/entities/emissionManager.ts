import type { Context } from "ponder:registry";
import schema from "ponder:schema";
import type { Address } from "viem";
import { fetchEmissionManagerState } from "../contracts/emissionManager";
import { toDecimal, toOhmDecimal, toWadDecimal } from "../utils/decimal";
import { getAssetDecimals, getOrCreateAsset } from "./asset";

export async function getOrCreateEmissionManager(
  context: Context,
  chainId: number,
  address: Address,
): Promise<typeof schema.emissionManager.$inferSelect> {
  const normalizedAddress = address.toLowerCase() as Address;

  const existing = await context.db.find(schema.emissionManager, {
    chainId,
    address: normalizedAddress,
  });

  if (existing) {
    return existing;
  }

  const state = await fetchEmissionManagerState(context.client, address);

  const reserveAsset = state.reserveAsset.toLowerCase() as Address;
  await getOrCreateAsset(context, chainId, reserveAsset);
  const reserveDecimals = await getAssetDecimals(context, chainId, reserveAsset);

  const record = {
    chainId,
    address: normalizedAddress,
    enabled: state.enabled,
    backing: state.backing,
    backingDecimal: toDecimal(state.backing, reserveDecimals),
    baseEmissionRate: state.baseEmissionRate,
    baseEmissionRateDecimal: toOhmDecimal(state.baseEmissionRate),
    bondMarketAuctioneer: state.bondMarketAuctioneer.toLowerCase() as Address,
    convertibleDepositAuctioneer: state.convertibleDepositAuctioneer.toLowerCase() as Address,
    bondMarketTeller: state.bondMarketTeller.toLowerCase() as Address,
    bondMarketCapacityScalar: state.bondMarketCapacityScalar,
    bondMarketCapacityScalarDecimal: toWadDecimal(state.bondMarketCapacityScalar),
    minPriceScalar: state.minPriceScalar,
    minPriceScalarDecimal: toWadDecimal(state.minPriceScalar),
    minimumPremium: state.minimumPremium,
    minimumPremiumDecimal: toWadDecimal(state.minimumPremium),
    reserveAsset,
    restartTimeframe: state.restartTimeframe,
    tickSize: state.tickSize,
    tickSizeDecimal: toOhmDecimal(state.tickSize),
    vestingPeriod: state.vestingPeriod,
  } as const;

  await context.db.insert(schema.emissionManager).values(record);

  return record;
}

export async function getEmissionManager(
  context: Context,
  chainId: number,
  address: Address,
): Promise<typeof schema.emissionManager.$inferSelect> {
  const record = await context.db.find(schema.emissionManager, {
    chainId,
    address: address.toLowerCase() as Address,
  });

  if (!record) {
    throw new Error(`EmissionManager not found: ${chainId}:${address}`);
  }

  return record;
}

export async function updateEmissionManager(
  context: Context,
  chainId: number,
  address: Address,
  updates: Partial<Omit<typeof schema.emissionManager.$inferSelect, "chainId" | "address">>,
): Promise<void> {
  await context.db
    .update(schema.emissionManager, {
      chainId,
      address: address.toLowerCase() as Address,
    })
    .set(updates);
}
