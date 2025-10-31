// Event handlers for ConvertibleDepositAuctioneer contract

import { ponder } from "ponder:registry";
import schema from "ponder:schema";
import type { Address } from "viem";
import { fetchAuctioneerCurrentTick } from "../contracts/auctioneer";
import {
  getDepositAssetDecimals,
  getDepositAssetPeriodDecimals,
  getOrCreateDepositAsset,
} from "../entities/asset";
import {
  getOrCreateAuctioneer,
  getOrCreateAuctioneerDepositPeriod,
  updateAuctioneer,
  updateAuctioneerDepositPeriod,
} from "../entities/auctioneer";
import { getOrCreateDepositFacility } from "../entities/depositFacility";
import { getOrCreateDepositor } from "../entities/depositor";
import { getOrCreatePosition } from "../entities/position";
import {
  getOrCreateAuctioneerDepositPeriodSnapshot,
  getOrCreateAuctioneerSnapshot,
} from "../entities/snapshot";
import { toBpsDecimal, toDecimal, toOhmDecimal } from "../utils/decimal";

ponder.on("ConvertibleDepositAuctioneer:Enabled", async ({ event, context }) => {
  const chainId = Number(context.chain.id);
  const auctioneerAddress = event.log.address as Address;

  // Get or create auctioneer
  const _auctioneer = await getOrCreateAuctioneer(context, chainId, auctioneerAddress);

  // Record the Enabled event
  await context.db.insert(schema.convertibleDepositAuctioneerEnabled).values({
    chainId,
    block: BigInt(event.block.number),
    logIndex: event.log.logIndex,
    txHash: event.transaction.hash,
    timestamp: BigInt(event.block.timestamp),
    auctioneer: auctioneerAddress.toLowerCase() as Address,
  });

  // Update auctioneer status
  await updateAuctioneer(context, chainId, auctioneerAddress, { enabled: true });
});

ponder.on("ConvertibleDepositAuctioneer:Disabled", async ({ event, context }) => {
  const chainId = Number(context.chain.id);
  const auctioneerAddress = event.log.address as Address;

  // Get or create auctioneer
  const _auctioneer = await getOrCreateAuctioneer(context, chainId, auctioneerAddress);

  // Record the Disabled event
  await context.db.insert(schema.convertibleDepositAuctioneerDisabled).values({
    chainId,
    block: BigInt(event.block.number),
    logIndex: event.log.logIndex,
    txHash: event.transaction.hash,
    timestamp: BigInt(event.block.timestamp),
    auctioneer: auctioneerAddress.toLowerCase() as Address,
  });

  // Update auctioneer status
  await updateAuctioneer(context, chainId, auctioneerAddress, { enabled: false });
});

ponder.on("ConvertibleDepositAuctioneer:TickStepUpdated", async ({ event, context }) => {
  const chainId = Number(context.chain.id);
  const auctioneerAddress = event.log.address as Address;

  // Get or create auctioneer
  await getOrCreateAuctioneer(context, chainId, auctioneerAddress);

  // Calculate decimals
  const newTickStep = event.args.newTickStep;
  const tickStepDecimal = toBpsDecimal(Number(newTickStep));

  // Record the TickStepUpdated event
  await context.db.insert(schema.convertibleDepositAuctioneerTickStepUpdated).values({
    chainId,
    block: BigInt(event.block.number),
    logIndex: event.log.logIndex,
    txHash: event.transaction.hash,
    timestamp: BigInt(event.block.timestamp),
    auctioneer: auctioneerAddress.toLowerCase() as Address,
    newTickStep: BigInt(newTickStep),
    newTickStepDecimal: tickStepDecimal,
  });

  // Update auctioneer with new tick step
  await updateAuctioneer(context, chainId, auctioneerAddress, {
    tickStep: BigInt(newTickStep),
    tickStepDecimal,
  });
});

ponder.on(
  "ConvertibleDepositAuctioneer:AuctionTrackingPeriodUpdated",
  async ({ event, context }) => {
    const chainId = Number(context.chain.id);
    const auctioneerAddress = event.log.address as Address;

    // Get or create auctioneer
    await getOrCreateAuctioneer(context, chainId, auctioneerAddress);

    // Record the AuctionTrackingPeriodUpdated event
    await context.db
      .insert(schema.convertibleDepositAuctioneerAuctionTrackingPeriodUpdated)
      .values({
        chainId,
        block: BigInt(event.block.number),
        logIndex: event.log.logIndex,
        txHash: event.transaction.hash,
        timestamp: BigInt(event.block.timestamp),
        auctioneer: auctioneerAddress.toLowerCase() as Address,
        auctionTrackingPeriod: Number(event.args.newAuctionTrackingPeriod),
      });

    // Update auctioneer with new tracking period
    await updateAuctioneer(context, chainId, auctioneerAddress, {
      auctionTrackingPeriod: Number(event.args.newAuctionTrackingPeriod),
    });
  },
);

ponder.on("ConvertibleDepositAuctioneer:DepositPeriodDisableQueued", async ({ event, context }) => {
  const chainId = Number(context.chain.id);
  const auctioneerAddress = event.log.address as Address;
  const depositAssetAddress = event.args.depositAsset as Address;
  const depositPeriod = Number(event.args.depositPeriod);

  // Get or create auctioneer and deposit period
  await getOrCreateAuctioneer(context, chainId, auctioneerAddress);
  await getOrCreateAuctioneerDepositPeriod(
    context,
    chainId,
    auctioneerAddress,
    depositAssetAddress,
    depositPeriod,
  );

  // Record the DepositPeriodDisableQueued event
  await context.db.insert(schema.convertibleDepositAuctioneerDepositPeriodDisableQueued).values({
    chainId,
    block: BigInt(event.block.number),
    logIndex: event.log.logIndex,
    txHash: event.transaction.hash,
    timestamp: BigInt(event.block.timestamp),
    auctioneer: auctioneerAddress.toLowerCase() as Address,
    depositAsset: depositAssetAddress.toLowerCase() as Address,
    depositPeriod,
  });
});

ponder.on("ConvertibleDepositAuctioneer:DepositPeriodDisabled", async ({ event, context }) => {
  const chainId = Number(context.chain.id);
  const auctioneerAddress = event.log.address as Address;
  const depositAssetAddress = event.args.depositAsset as Address;
  const depositPeriod = Number(event.args.depositPeriod);

  // Get or create auctioneer
  await getOrCreateAuctioneer(context, chainId, auctioneerAddress);
  await getOrCreateAuctioneerDepositPeriod(
    context,
    chainId,
    auctioneerAddress,
    depositAssetAddress,
    depositPeriod,
  );

  // Record the DepositPeriodDisabled event
  await context.db.insert(schema.convertibleDepositAuctioneerDepositPeriodDisabled).values({
    chainId,
    block: BigInt(event.block.number),
    logIndex: event.log.logIndex,
    txHash: event.transaction.hash,
    timestamp: BigInt(event.block.timestamp),
    auctioneer: auctioneerAddress.toLowerCase() as Address,
    depositAsset: depositAssetAddress.toLowerCase() as Address,
    depositPeriod,
  });

  // Update the AuctioneerDepositPeriod with the new status
  await updateAuctioneerDepositPeriod(
    context,
    chainId,
    auctioneerAddress,
    depositAssetAddress,
    depositPeriod,
    { enabled: false },
  );
});

ponder.on("ConvertibleDepositAuctioneer:DepositPeriodEnableQueued", async ({ event, context }) => {
  const chainId = Number(context.chain.id);
  const auctioneerAddress = event.log.address as Address;
  const depositAssetAddress = event.args.depositAsset as Address;
  const depositPeriod = Number(event.args.depositPeriod);

  // Get or create auctioneer and deposit period
  await getOrCreateAuctioneer(context, chainId, auctioneerAddress);
  await getOrCreateAuctioneerDepositPeriod(
    context,
    chainId,
    auctioneerAddress,
    depositAssetAddress,
    depositPeriod,
  );

  // Record the DepositPeriodEnableQueued event
  await context.db.insert(schema.convertibleDepositAuctioneerDepositPeriodEnableQueued).values({
    chainId,
    block: BigInt(event.block.number),
    logIndex: event.log.logIndex,
    txHash: event.transaction.hash,
    timestamp: BigInt(event.block.timestamp),
    auctioneer: auctioneerAddress.toLowerCase() as Address,
    depositAsset: depositAssetAddress.toLowerCase() as Address,
    depositPeriod,
  });
});

ponder.on("ConvertibleDepositAuctioneer:DepositPeriodEnabled", async ({ event, context }) => {
  const chainId = Number(context.chain.id);
  const auctioneerAddress = event.log.address as Address;
  const depositAssetAddress = event.args.depositAsset as Address;
  const depositPeriod = Number(event.args.depositPeriod);

  // Get or create auctioneer
  await getOrCreateAuctioneer(context, chainId, auctioneerAddress);
  await getOrCreateAuctioneerDepositPeriod(
    context,
    chainId,
    auctioneerAddress,
    depositAssetAddress,
    depositPeriod,
  );

  // Record the DepositPeriodEnabled event
  await context.db.insert(schema.convertibleDepositAuctioneerDepositPeriodEnabled).values({
    chainId,
    block: BigInt(event.block.number),
    logIndex: event.log.logIndex,
    txHash: event.transaction.hash,
    timestamp: BigInt(event.block.timestamp),
    auctioneer: auctioneerAddress.toLowerCase() as Address,
    depositAsset: depositAssetAddress.toLowerCase() as Address,
    depositPeriod,
  });

  // Update the AuctioneerDepositPeriod with the new status
  await updateAuctioneerDepositPeriod(
    context,
    chainId,
    auctioneerAddress,
    depositAssetAddress,
    depositPeriod,
    { enabled: true },
  );
});

ponder.on("ConvertibleDepositAuctioneer:Bid", async ({ event, context }) => {
  const chainId = Number(context.chain.id);
  const auctioneerAddress = event.log.address as Address;
  const depositAssetAddress = event.args.depositAsset as Address;
  const depositPeriod = Number(event.args.depositPeriod);
  const positionId = event.args.positionId;
  const bidderAddress = event.args.bidder as Address;

  // Get or create entities
  await getOrCreateDepositFacility(context, chainId, auctioneerAddress);
  await getOrCreateAuctioneerDepositPeriod(
    context,
    chainId,
    auctioneerAddress,
    depositAssetAddress,
    depositPeriod,
  );
  await getOrCreateDepositor(context, chainId, bidderAddress);
  await getOrCreatePosition(
    context,
    chainId,
    auctioneerAddress, // Facility address (same as auctioneer in this case)
    depositAssetAddress,
    depositPeriod,
    BigInt(positionId),
    bidderAddress,
    event.transaction.hash,
    BigInt(event.block.number),
    BigInt(event.block.timestamp),
  );

  const assetDecimals = await getDepositAssetPeriodDecimals(context, chainId, depositAssetAddress);

  // Fetch tick data from contract
  const tickData = await fetchAuctioneerCurrentTick(
    context.client,
    auctioneerAddress,
    depositPeriod,
  );

  // Calculate decimals
  const depositAmount = event.args.depositAmount;
  const depositAmountDecimal = toDecimal(BigInt(depositAmount), assetDecimals);
  const convertedAmount = event.args.convertedAmount;
  const convertedAmountDecimal = toOhmDecimal(BigInt(convertedAmount));
  const tickCapacity = tickData.capacity;
  const tickCapacityDecimal = toOhmDecimal(tickCapacity);
  const tickPrice = tickData.price;
  const tickPriceDecimal = toDecimal(tickPrice, assetDecimals);

  // Record the Bid event
  await context.db.insert(schema.convertibleDepositAuctioneerBid).values({
    chainId,
    block: BigInt(event.block.number),
    logIndex: event.log.logIndex,
    txHash: event.transaction.hash,
    timestamp: BigInt(event.block.timestamp),
    auctioneer: auctioneerAddress.toLowerCase() as Address,
    depositAsset: depositAssetAddress.toLowerCase() as Address,
    depositPeriod,
    depositor: bidderAddress.toLowerCase() as Address,
    positionId: BigInt(positionId),
    depositAmount: BigInt(depositAmount),
    depositAmountDecimal,
    convertedAmount: BigInt(convertedAmount),
    convertedAmountDecimal,
    tickCapacity,
    tickCapacityDecimal,
    tickPrice,
    tickPriceDecimal,
  });

  // Update auctioneer snapshot after bid (day state/tick changes)
  await getOrCreateAuctioneerSnapshot(
    context,
    chainId,
    BigInt(event.block.number),
    BigInt(event.block.timestamp),
    auctioneerAddress,
  );

  // Create/update period-specific snapshot with tick data
  await getOrCreateAuctioneerDepositPeriodSnapshot(
    context,
    chainId,
    BigInt(event.block.number),
    BigInt(event.block.timestamp),
    auctioneerAddress,
    depositAssetAddress,
    depositPeriod,
    tickPrice,
    tickPriceDecimal,
    tickCapacity,
    tickCapacityDecimal,
  );
});

ponder.on("ConvertibleDepositAuctioneer:AuctionParametersUpdated", async ({ event, context }) => {
  const chainId = Number(context.chain.id);
  const auctioneerAddress = event.log.address as Address;
  const depositAssetAddress = event.args.depositAsset as Address;

  // Get or create entities
  await getOrCreateAuctioneer(context, chainId, auctioneerAddress);
  await getOrCreateDepositAsset(context, chainId, depositAssetAddress);
  const assetDecimals = await getDepositAssetDecimals(context, chainId, depositAssetAddress);

  // Calculate decimals
  const target = event.args.newTarget;
  const targetDecimal = toOhmDecimal(BigInt(target));
  const tickSize = event.args.newTickSize;
  const tickSizeDecimal = toOhmDecimal(BigInt(tickSize));
  const minPrice = event.args.newMinPrice;
  const minPriceDecimal = toDecimal(BigInt(minPrice), assetDecimals);

  // Record the AuctionParametersUpdated event
  await context.db.insert(schema.convertibleDepositAuctioneerAuctionParametersUpdated).values({
    chainId,
    block: BigInt(event.block.number),
    logIndex: event.log.logIndex,
    txHash: event.transaction.hash,
    timestamp: BigInt(event.block.timestamp),
    auctioneer: auctioneerAddress.toLowerCase() as Address,
    depositAsset: depositAssetAddress.toLowerCase() as Address,
    target: BigInt(target),
    targetDecimal,
    tickSize: BigInt(tickSize),
    tickSizeDecimal,
    minPrice: BigInt(minPrice),
    minPriceDecimal,
  });
});

ponder.on("ConvertibleDepositAuctioneer:AuctionResult", async ({ event, context }) => {
  const chainId = Number(context.chain.id);
  const auctioneerAddress = event.log.address as Address;
  const depositAssetAddress = event.args.depositAsset as Address;

  // Get or create entities
  await getOrCreateAuctioneer(context, chainId, auctioneerAddress);
  await getOrCreateDepositAsset(context, chainId, depositAssetAddress);

  // Calculate decimals
  const ohmConvertible = event.args.ohmConvertible;
  const ohmConvertibleDecimal = toOhmDecimal(BigInt(ohmConvertible));
  const target = event.args.target;
  const targetDecimal = toOhmDecimal(BigInt(target));

  // Record the AuctionResult event
  await context.db.insert(schema.convertibleDepositAuctioneerAuctionResult).values({
    chainId,
    block: BigInt(event.block.number),
    logIndex: event.log.logIndex,
    txHash: event.transaction.hash,
    timestamp: BigInt(event.block.timestamp),
    auctioneer: auctioneerAddress.toLowerCase() as Address,
    depositAsset: depositAssetAddress.toLowerCase() as Address,
    ohmConvertible: BigInt(ohmConvertible),
    ohmConvertibleDecimal,
    target: BigInt(target),
    targetDecimal,
    periodIndex: Number(event.args.periodIndex),
  });

  // Update auctioneer snapshot after auction result (day state changes)
  await getOrCreateAuctioneerSnapshot(
    context,
    chainId,
    BigInt(event.block.number),
    BigInt(event.block.timestamp),
    auctioneerAddress,
  );
});
