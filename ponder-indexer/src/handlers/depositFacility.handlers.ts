// Event handlers for ConvertibleDepositFacility contract

import { ponder } from "ponder:registry";
import type { Address } from "viem";
import schema from "ponder:schema";
import {
  getOrCreateDepositFacility,
  updateDepositFacility,
  getOrCreateDepositFacilityAssetPeriod,
} from "../entities/depositFacility";
import { getAssetDecimals } from "../entities/asset";
import { getOrCreateDepositor } from "../entities/depositor";
import { getOrCreatePosition, updatePosition } from "../entities/position";
import { toDecimal } from "../utils/decimal";

ponder.on("ConvertibleDepositFacility:Enabled", async ({ event, context }) => {
  const chainId = Number(context.chain.id);
  const facilityAddress = event.log.address as Address;

  // Get or create facility
  await getOrCreateDepositFacility(
    context,
    chainId,
    facilityAddress,
  );

  // Record the Enabled event
  await context.db.insert(schema.convertibleDepositFacilityEnabled).values({
    chainId,
    block: BigInt(event.block.number),
    logIndex: event.log.logIndex,
    txHash: event.transaction.hash,
    timestamp: BigInt(event.block.timestamp),
    facility: facilityAddress.toLowerCase() as Address,
  });

  // Update facility status
  await updateDepositFacility(context, chainId, facilityAddress, { enabled: true });
});

ponder.on("ConvertibleDepositFacility:Disabled", async ({ event, context }) => {
  const chainId = Number(context.chain.id);
  const facilityAddress = event.log.address as Address;

  // Get or create facility
  await getOrCreateDepositFacility(
    context,
    chainId,
    facilityAddress,
  );

  // Record the Disabled event
  await context.db.insert(schema.convertibleDepositFacilityDisabled).values({
    chainId,
    block: BigInt(event.block.number),
    logIndex: event.log.logIndex,
    txHash: event.transaction.hash,
    timestamp: BigInt(event.block.timestamp),
    facility: facilityAddress.toLowerCase() as Address,
  });

  // Update facility status
  await updateDepositFacility(context, chainId, facilityAddress, { enabled: false });
});

ponder.on("ConvertibleDepositFacility:OperatorAuthorized", async ({ event, context }) => {
  const chainId = Number(context.chain.id);
  const facilityAddress = event.log.address as Address;

  // Get or create facility
  await getOrCreateDepositFacility(context, chainId, facilityAddress);

  // Record event
  await context.db.insert(schema.convertibleDepositFacilityOperatorAuthorized).values({
    chainId,
    block: BigInt(event.block.number),
    logIndex: event.log.logIndex,
    txHash: event.transaction.hash,
    timestamp: BigInt(event.block.timestamp),
    facility: facilityAddress.toLowerCase() as Address,
    operator: (event.args.operator as Address).toLowerCase() as Address,
  });
});

ponder.on("ConvertibleDepositFacility:OperatorDeauthorized", async ({ event, context }) => {
  const chainId = Number(context.chain.id);
  const facilityAddress = event.log.address as Address;

  // Get or create facility
  await getOrCreateDepositFacility(context, chainId, facilityAddress);

  // Record event
  await context.db.insert(schema.convertibleDepositFacilityOperatorDeauthorized).values({
    chainId,
    block: BigInt(event.block.number),
    logIndex: event.log.logIndex,
    txHash: event.transaction.hash,
    timestamp: BigInt(event.block.timestamp),
    facility: facilityAddress.toLowerCase() as Address,
    operator: (event.args.operator as Address).toLowerCase() as Address,
  });
});

ponder.on("ConvertibleDepositFacility:CreatedDeposit", async ({ event, context }) => {
  const chainId = Number(context.chain.id);
  const facilityAddress = event.log.address as Address;
  const assetAddress = event.args.asset as Address;
  const depositPeriod = Number(event.args.periodMonths);
  const positionId = event.args.positionId;
  const depositorAddress = event.args.depositor as Address;

  // Create/fetch records
  await getOrCreateDepositFacilityAssetPeriod(
    context,
    chainId,
    facilityAddress,
    assetAddress,
    depositPeriod,
  );
  await getOrCreateDepositor(context, chainId, depositorAddress);
  await getOrCreatePosition(
    context,
    chainId,
    facilityAddress,
    assetAddress,
    depositPeriod,
    BigInt(positionId),
    depositorAddress,
    event.transaction.hash,
    BigInt(event.block.number),
    BigInt(event.block.timestamp),
  );
  const assetDecimals = await getAssetDecimals(context, chainId, assetAddress);

  // Record event
  await context.db.insert(schema.convertibleDepositFacilityCreatedDeposit).values({
    chainId,
    block: BigInt(event.block.number),
    logIndex: event.log.logIndex,
    txHash: event.transaction.hash,
    timestamp: BigInt(event.block.timestamp),
    facility: facilityAddress.toLowerCase() as Address,
    depositAsset: assetAddress.toLowerCase() as Address,
    depositPeriod,
    depositor: depositorAddress.toLowerCase() as Address,
    positionId: BigInt(positionId),
    depositAmount: BigInt(event.args.depositAmount),
    depositAmountDecimal: toDecimal(BigInt(event.args.depositAmount), assetDecimals),
  });

  // Update position with initial amount
  await updatePosition(context, chainId, BigInt(positionId), {
    initialAmount: BigInt(event.args.depositAmount),
    initialAmountDecimal: toDecimal(BigInt(event.args.depositAmount), assetDecimals),
    remainingAmount: BigInt(event.args.depositAmount),
    remainingAmountDecimal: toDecimal(BigInt(event.args.depositAmount), assetDecimals),
  });
});

ponder.on("ConvertibleDepositFacility:Reclaimed", async ({ event, context }) => {
  const chainId = Number(context.chain.id);
  const facilityAddress = event.log.address as Address;
  const assetAddress = event.args.depositToken as Address;
  const depositPeriod = Number(event.args.depositPeriod);
  const depositorAddress = event.args.user as Address;

  // Create/fetch records
  await getOrCreateDepositFacilityAssetPeriod(
    context,
    chainId,
    facilityAddress,
    assetAddress,
    depositPeriod,
  );
  await getOrCreateDepositor(context, chainId, depositorAddress);
  const assetDecimals = await getAssetDecimals(context, chainId, assetAddress);

  // Record event
  await context.db.insert(schema.convertibleDepositFacilityReclaimed).values({
    chainId,
    block: BigInt(event.block.number),
    logIndex: event.log.logIndex,
    txHash: event.transaction.hash,
    timestamp: BigInt(event.block.timestamp),
    facility: facilityAddress.toLowerCase() as Address,
    depositAsset: assetAddress.toLowerCase() as Address,
    depositPeriod,
    depositor: depositorAddress.toLowerCase() as Address,
    reclaimedAmount: BigInt(event.args.reclaimedAmount),
    reclaimedAmountDecimal: toDecimal(BigInt(event.args.reclaimedAmount), assetDecimals),
    forfeitedAmount: BigInt(event.args.forfeitedAmount),
    forfeitedAmountDecimal: toDecimal(BigInt(event.args.forfeitedAmount), assetDecimals),
  });
});

