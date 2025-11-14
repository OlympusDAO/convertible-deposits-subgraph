import { ponder } from "ponder:registry";
import schema from "ponder:schema";
import type { Address } from "viem";
import { zeroAddress } from "viem";
import { fetchEmissionManagerBaseEmissionRate } from "../contracts/emissionManager";
import { getAssetDecimals } from "../entities/asset";
import { getOrCreateAuctioneer } from "../entities/auctioneer";
import { getOrCreateEmissionManager, updateEmissionManager } from "../entities/emissionManager";
import { toDecimal, toOhmDecimal, toWadDecimal } from "../utils/decimal";

type HandlerEvent = {
  block: { number: number | string | bigint; timestamp: number | string | bigint };
  log: { logIndex: number };
  transaction: { hash: `0x${string}` };
};

function toAddress(value: Address): Address {
  return value.toLowerCase() as Address;
}

function toBigInt(value: number | string | bigint): bigint {
  return typeof value === "bigint" ? value : BigInt(value);
}

function baseEventValues(event: HandlerEvent) {
  return {
    block: toBigInt(event.block.number),
    logIndex: event.log.logIndex,
    txHash: event.transaction.hash,
    timestamp: toBigInt(event.block.timestamp),
  } as const;
}

ponder.on("EmissionManager:Enabled", async ({ event, context }) => {
  const chainId = Number(context.chain.id);
  const emissionManagerAddress = event.log.address as Address;

  await getOrCreateEmissionManager(context, chainId, emissionManagerAddress);

  await context.db.insert(schema.emissionManagerEnabled).values({
    chainId,
    emissionManager: toAddress(emissionManagerAddress),
    ...baseEventValues(event),
  });

  await updateEmissionManager(context, chainId, emissionManagerAddress, {
    enabled: true,
  });
});

ponder.on("EmissionManager:Disabled", async ({ event, context }) => {
  const chainId = Number(context.chain.id);
  const emissionManagerAddress = event.log.address as Address;

  await getOrCreateEmissionManager(context, chainId, emissionManagerAddress);

  await context.db.insert(schema.emissionManagerDisabled).values({
    chainId,
    emissionManager: toAddress(emissionManagerAddress),
    ...baseEventValues(event),
  });

  await updateEmissionManager(context, chainId, emissionManagerAddress, {
    enabled: false,
  });
});

ponder.on("EmissionManager:BackingChanged", async ({ event, context }) => {
  const chainId = Number(context.chain.id);
  const emissionManagerAddress = event.log.address as Address;

  const emissionManager = await getOrCreateEmissionManager(
    context,
    chainId,
    emissionManagerAddress,
  );
  const reserveDecimals = await getAssetDecimals(context, chainId, emissionManager.reserveAsset);
  const newBacking = BigInt(event.args.newBacking);
  const newBackingDecimal = toDecimal(newBacking, reserveDecimals);

  await context.db.insert(schema.emissionManagerBackingChanged).values({
    chainId,
    emissionManager: toAddress(emissionManagerAddress),
    newBacking,
    newBackingDecimal,
    ...baseEventValues(event),
  });

  await updateEmissionManager(context, chainId, emissionManagerAddress, {
    backing: newBacking,
    backingDecimal: newBackingDecimal,
  });
});

ponder.on("EmissionManager:BackingUpdated", async ({ event, context }) => {
  const chainId = Number(context.chain.id);
  const emissionManagerAddress = event.log.address as Address;

  const emissionManager = await getOrCreateEmissionManager(
    context,
    chainId,
    emissionManagerAddress,
  );
  const reserveDecimals = await getAssetDecimals(context, chainId, emissionManager.reserveAsset);

  const newBacking = BigInt(event.args.newBacking);
  const newBackingDecimal = toDecimal(newBacking, reserveDecimals);
  const supplyAdded = BigInt(event.args.supplyAdded);
  const supplyAddedDecimal = toOhmDecimal(supplyAdded);
  const reservesAdded = BigInt(event.args.reservesAdded);
  const reservesAddedDecimal = toDecimal(reservesAdded, reserveDecimals);

  await context.db.insert(schema.emissionManagerBackingUpdated).values({
    chainId,
    emissionManager: toAddress(emissionManagerAddress),
    newBacking,
    newBackingDecimal,
    supplyAdded,
    supplyAddedDecimal,
    reservesAdded,
    reservesAddedDecimal,
    ...baseEventValues(event),
  });

  await updateEmissionManager(context, chainId, emissionManagerAddress, {
    backing: newBacking,
    backingDecimal: newBackingDecimal,
  });
});

ponder.on("EmissionManager:BaseRateChanged", async ({ event, context }) => {
  const chainId = Number(context.chain.id);
  const emissionManagerAddress = event.log.address as Address;

  await getOrCreateEmissionManager(context, chainId, emissionManagerAddress);

  const changeBy = BigInt(event.args.changeBy);
  const changeByDecimal = toOhmDecimal(changeBy);
  const forNumBeats = BigInt(event.args.forNumBeats);
  const add = Boolean(event.args.add);

  await context.db.insert(schema.emissionManagerBaseRateChanged).values({
    chainId,
    emissionManager: toAddress(emissionManagerAddress),
    changeBy,
    changeByDecimal,
    forNumBeats,
    add,
    ...baseEventValues(event),
  });

  const baseEmissionRate = await fetchEmissionManagerBaseEmissionRate(
    context.client,
    emissionManagerAddress,
  );

  await updateEmissionManager(context, chainId, emissionManagerAddress, {
    baseEmissionRate,
    baseEmissionRateDecimal: toOhmDecimal(baseEmissionRate),
  });
});

ponder.on("EmissionManager:BondContractsSet", async ({ event, context }) => {
  const chainId = Number(context.chain.id);
  const emissionManagerAddress = event.log.address as Address;

  await getOrCreateEmissionManager(context, chainId, emissionManagerAddress);

  const bondMarketAuctioneer = toAddress(event.args.auctioneer as Address);
  const bondMarketTeller = toAddress(event.args.teller as Address);

  await context.db.insert(schema.emissionManagerBondContractsSet).values({
    chainId,
    emissionManager: toAddress(emissionManagerAddress),
    bondMarketAuctioneer,
    bondMarketTeller,
    ...baseEventValues(event),
  });

  await updateEmissionManager(context, chainId, emissionManagerAddress, {
    bondMarketAuctioneer,
    bondMarketTeller,
  });
});

ponder.on("EmissionManager:BondMarketCapacityScalarChanged", async ({ event, context }) => {
  const chainId = Number(context.chain.id);
  const emissionManagerAddress = event.log.address as Address;

  await getOrCreateEmissionManager(context, chainId, emissionManagerAddress);

  const newScalar = BigInt(event.args.newBondMarketCapacityScalar);
  const newScalarDecimal = toWadDecimal(newScalar);

  await context.db.insert(schema.emissionManagerBondMarketCapacityScalarChanged).values({
    chainId,
    emissionManager: toAddress(emissionManagerAddress),
    newBondMarketCapacityScalar: newScalar,
    newBondMarketCapacityScalarDecimal: newScalarDecimal,
    ...baseEventValues(event),
  });

  await updateEmissionManager(context, chainId, emissionManagerAddress, {
    bondMarketCapacityScalar: newScalar,
    bondMarketCapacityScalarDecimal: newScalarDecimal,
  });
});

ponder.on("EmissionManager:BondMarketCreationFailed", async ({ event, context }) => {
  const chainId = Number(context.chain.id);
  const emissionManagerAddress = event.log.address as Address;

  await getOrCreateEmissionManager(context, chainId, emissionManagerAddress);

  const saleAmount = BigInt(event.args.saleAmount);

  await context.db.insert(schema.emissionManagerBondMarketCreationFailed).values({
    chainId,
    emissionManager: toAddress(emissionManagerAddress),
    saleAmount,
    saleAmountDecimal: toOhmDecimal(saleAmount),
    ...baseEventValues(event),
  });
});

ponder.on("EmissionManager:ConvertibleDepositAuctioneerSet", async ({ event, context }) => {
  const chainId = Number(context.chain.id);
  const emissionManagerAddress = event.log.address as Address;

  await getOrCreateEmissionManager(context, chainId, emissionManagerAddress);

  const convertibleDepositAuctioneer = toAddress(event.args.auctioneer as Address);

  await context.db.insert(schema.emissionManagerConvertibleDepositAuctioneerSet).values({
    chainId,
    emissionManager: toAddress(emissionManagerAddress),
    convertibleDepositAuctioneer,
    ...baseEventValues(event),
  });

  if (convertibleDepositAuctioneer !== zeroAddress) {
    await getOrCreateAuctioneer(context, chainId, convertibleDepositAuctioneer);
  }

  await updateEmissionManager(context, chainId, emissionManagerAddress, {
    convertibleDepositAuctioneer,
  });
});

ponder.on("EmissionManager:MinPriceScalarChanged", async ({ event, context }) => {
  const chainId = Number(context.chain.id);
  const emissionManagerAddress = event.log.address as Address;

  await getOrCreateEmissionManager(context, chainId, emissionManagerAddress);

  const newMinPriceScalar = BigInt(event.args.newMinPriceScalar);
  const newMinPriceScalarDecimal = toWadDecimal(newMinPriceScalar);

  await context.db.insert(schema.emissionManagerMinPriceScalarChanged).values({
    chainId,
    emissionManager: toAddress(emissionManagerAddress),
    newMinPriceScalar,
    newMinPriceScalarDecimal,
    ...baseEventValues(event),
  });

  await updateEmissionManager(context, chainId, emissionManagerAddress, {
    minPriceScalar: newMinPriceScalar,
    minPriceScalarDecimal: newMinPriceScalarDecimal,
  });
});

ponder.on("EmissionManager:MinimumPremiumChanged", async ({ event, context }) => {
  const chainId = Number(context.chain.id);
  const emissionManagerAddress = event.log.address as Address;

  await getOrCreateEmissionManager(context, chainId, emissionManagerAddress);

  const newMinimumPremium = BigInt(event.args.newMinimumPremium);
  const newMinimumPremiumDecimal = toWadDecimal(newMinimumPremium);

  await context.db.insert(schema.emissionManagerMinimumPremiumChanged).values({
    chainId,
    emissionManager: toAddress(emissionManagerAddress),
    newMinimumPremium,
    newMinimumPremiumDecimal,
    ...baseEventValues(event),
  });

  await updateEmissionManager(context, chainId, emissionManagerAddress, {
    minimumPremium: newMinimumPremium,
    minimumPremiumDecimal: newMinimumPremiumDecimal,
  });
});

ponder.on("EmissionManager:RestartTimeframeChanged", async ({ event, context }) => {
  const chainId = Number(context.chain.id);
  const emissionManagerAddress = event.log.address as Address;

  await getOrCreateEmissionManager(context, chainId, emissionManagerAddress);

  const newRestartTimeframe = BigInt(event.args.newRestartTimeframe);

  await context.db.insert(schema.emissionManagerRestartTimeframeChanged).values({
    chainId,
    emissionManager: toAddress(emissionManagerAddress),
    newRestartTimeframe,
    ...baseEventValues(event),
  });

  await updateEmissionManager(context, chainId, emissionManagerAddress, {
    restartTimeframe: newRestartTimeframe,
  });
});

ponder.on("EmissionManager:SaleCreated", async ({ event, context }) => {
  const chainId = Number(context.chain.id);
  const emissionManagerAddress = event.log.address as Address;

  await getOrCreateEmissionManager(context, chainId, emissionManagerAddress);

  const marketId = BigInt(event.args.marketID);
  const saleAmount = BigInt(event.args.saleAmount);

  await context.db.insert(schema.emissionManagerBondMarketCreated).values({
    chainId,
    emissionManager: toAddress(emissionManagerAddress),
    marketId,
    saleAmount,
    saleAmountDecimal: toOhmDecimal(saleAmount),
    ...baseEventValues(event),
  });

  // No additional state updates required beyond event record insertion.
});

ponder.on("EmissionManager:TickSizeChanged", async ({ event, context }) => {
  const chainId = Number(context.chain.id);
  const emissionManagerAddress = event.log.address as Address;

  await getOrCreateEmissionManager(context, chainId, emissionManagerAddress);

  const newTickSize = BigInt(event.args.newTickSize);
  const newTickSizeDecimal = toOhmDecimal(newTickSize);

  await context.db.insert(schema.emissionManagerTickSizeChanged).values({
    chainId,
    emissionManager: toAddress(emissionManagerAddress),
    newTickSize,
    newTickSizeDecimal,
    ...baseEventValues(event),
  });

  await updateEmissionManager(context, chainId, emissionManagerAddress, {
    tickSize: newTickSize,
    tickSizeDecimal: newTickSizeDecimal,
  });
});

ponder.on("EmissionManager:VestingPeriodChanged", async ({ event, context }) => {
  const chainId = Number(context.chain.id);
  const emissionManagerAddress = event.log.address as Address;

  await getOrCreateEmissionManager(context, chainId, emissionManagerAddress);

  const newVestingPeriod = BigInt(event.args.newVestingPeriod);

  await context.db.insert(schema.emissionManagerVestingPeriodChanged).values({
    chainId,
    emissionManager: toAddress(emissionManagerAddress),
    newVestingPeriod,
    ...baseEventValues(event),
  });

  await updateEmissionManager(context, chainId, emissionManagerAddress, {
    vestingPeriod: newVestingPeriod,
  });
});
