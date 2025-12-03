// Event handlers for ConvertibleDepositFacility contract

import { ponder } from "ponder:registry";
import schema from "ponder:schema";
import type { Address } from "viem";
import { fetchPositions, fetchUserPositionIds } from "../contracts/position";
import { getAssetDecimals } from "../entities/asset";
import {
  getOrCreateDepositFacility,
  getOrCreateDepositFacilityAsset,
  getOrCreateDepositFacilityAssetPeriod,
  updateDepositFacility,
  updateDepositFacilityAsset,
  updateDepositFacilityAssetPeriod,
} from "../entities/depositFacility";
import { getOrCreateDepositor } from "../entities/depositor";
import { getOrCreatePosition, getPosition, updatePosition } from "../entities/position";
import { updateFacilityAssetSnapshotDeposited } from "../entities/snapshot";
import { toBpsDecimal, toDecimal, toOhmDecimal } from "../utils/decimal";

ponder.on("ConvertibleDepositFacility:Enabled", async ({ event, context }) => {
  const chainId = Number(context.chain.id);
  const facilityAddress = event.log.address as Address;

  // Get or create facility
  await getOrCreateDepositFacility(context, chainId, facilityAddress);

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
  await getOrCreateDepositFacility(context, chainId, facilityAddress);

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

ponder.on("ConvertibleDepositFacility:AssetCommitCancelled", async ({ event, context }) => {
  const chainId = Number(context.chain.id);
  const facilityAddress = event.log.address as Address;
  const assetAddress = event.args.asset as Address;

  // Create/fetch records
  const facilityAsset = await getOrCreateDepositFacilityAsset(
    context,
    chainId,
    facilityAddress,
    assetAddress,
  );
  const assetDecimals = await getAssetDecimals(context, chainId, assetAddress);

  // Calculate committed amount
  const committedAmount = facilityAsset.committedAmount - BigInt(event.args.amount);

  // Record event
  await context.db.insert(schema.convertibleDepositFacilityAssetCommitCancelled).values({
    chainId,
    block: BigInt(event.block.number),
    logIndex: event.log.logIndex,
    txHash: event.transaction.hash,
    timestamp: BigInt(event.block.timestamp),
    facility: facilityAddress.toLowerCase() as Address,
    depositAsset: assetAddress.toLowerCase() as Address,
    operator: (event.args.operator as Address).toLowerCase() as Address,
    amount: BigInt(event.args.amount),
    amountDecimal: toDecimal(BigInt(event.args.amount), assetDecimals),
    committedAmount: committedAmount,
    committedAmountDecimal: toDecimal(committedAmount, assetDecimals),
  });

  // Update facility asset amount
  await updateDepositFacilityAsset(context, chainId, facilityAddress, assetAddress, {
    committedAmount: committedAmount,
    committedAmountDecimal: toDecimal(committedAmount, assetDecimals),
  });
});

ponder.on("ConvertibleDepositFacility:AssetCommitWithdrawn", async ({ event, context }) => {
  const chainId = Number(context.chain.id);
  const facilityAddress = event.log.address as Address;
  const assetAddress = event.args.asset as Address;

  // Create/fetch records
  const facilityAsset = await getOrCreateDepositFacilityAsset(
    context,
    chainId,
    facilityAddress,
    assetAddress,
  );
  const assetDecimals = await getAssetDecimals(context, chainId, assetAddress);

  // Calculate committed amount
  const committedAmount = facilityAsset.committedAmount - BigInt(event.args.amount);

  // Record event
  await context.db.insert(schema.convertibleDepositFacilityAssetCommitWithdrawn).values({
    chainId,
    block: BigInt(event.block.number),
    logIndex: event.log.logIndex,
    txHash: event.transaction.hash,
    timestamp: BigInt(event.block.timestamp),
    facility: facilityAddress.toLowerCase() as Address,
    depositAsset: assetAddress.toLowerCase() as Address,
    operator: (event.args.operator as Address).toLowerCase() as Address,
    amount: BigInt(event.args.amount),
    amountDecimal: toDecimal(BigInt(event.args.amount), assetDecimals),
    committedAmount: committedAmount,
    committedAmountDecimal: toDecimal(committedAmount, assetDecimals),
  });

  // Update facility asset amount
  await updateDepositFacilityAsset(context, chainId, facilityAddress, assetAddress, {
    committedAmount: committedAmount,
    committedAmountDecimal: toDecimal(committedAmount, assetDecimals),
  });
});

ponder.on("ConvertibleDepositFacility:AssetCommitted", async ({ event, context }) => {
  const chainId = Number(context.chain.id);
  const facilityAddress = event.log.address as Address;
  const assetAddress = event.args.asset as Address;

  // Create/fetch records
  const facilityAsset = await getOrCreateDepositFacilityAsset(
    context,
    chainId,
    facilityAddress,
    assetAddress,
  );
  const assetDecimals = await getAssetDecimals(context, chainId, assetAddress);

  // Calculate committed amount
  const committedAmount = facilityAsset.committedAmount + BigInt(event.args.amount);

  // Record event
  await context.db.insert(schema.convertibleDepositFacilityAssetCommitted).values({
    chainId,
    block: BigInt(event.block.number),
    logIndex: event.log.logIndex,
    txHash: event.transaction.hash,
    timestamp: BigInt(event.block.timestamp),
    facility: facilityAddress.toLowerCase() as Address,
    depositAsset: assetAddress.toLowerCase() as Address,
    operator: (event.args.operator as Address).toLowerCase() as Address,
    amount: BigInt(event.args.amount),
    amountDecimal: toDecimal(BigInt(event.args.amount), assetDecimals),
    committedAmount: committedAmount,
    committedAmountDecimal: toDecimal(committedAmount, assetDecimals),
  });

  // Update facility asset amount
  await updateDepositFacilityAsset(context, chainId, facilityAddress, assetAddress, {
    committedAmount: committedAmount,
    committedAmountDecimal: toDecimal(committedAmount, assetDecimals),
  });
});

ponder.on("ConvertibleDepositFacility:AssetPeriodReclaimRateSet", async ({ event, context }) => {
  const chainId = Number(context.chain.id);
  const facilityAddress = event.log.address as Address;
  const assetAddress = event.args.asset as Address;
  const depositPeriod = Number(event.args.depositPeriod);

  // Create/fetch records
  await getOrCreateDepositFacilityAssetPeriod(
    context,
    chainId,
    facilityAddress,
    assetAddress,
    depositPeriod,
  );

  // Record event
  await context.db.insert(schema.convertibleDepositFacilityAssetPeriodReclaimRateSet).values({
    chainId,
    block: BigInt(event.block.number),
    logIndex: event.log.logIndex,
    txHash: event.transaction.hash,
    timestamp: BigInt(event.block.timestamp),
    facility: facilityAddress.toLowerCase() as Address,
    depositAsset: assetAddress.toLowerCase() as Address,
    depositPeriod,
    reclaimRate: BigInt(event.args.reclaimRate),
    reclaimRateDecimal: toBpsDecimal(Number(event.args.reclaimRate)),
  });

  // Update facility asset period reclaim rate
  await updateDepositFacilityAssetPeriod(
    context,
    chainId,
    facilityAddress,
    assetAddress,
    depositPeriod,
    {
      reclaimRate: BigInt(event.args.reclaimRate),
      reclaimRateDecimal: toBpsDecimal(Number(event.args.reclaimRate)),
    },
  );
});

ponder.on("ConvertibleDepositFacility:CreatedDeposit", async ({ event, context }) => {
  const chainId = Number(context.chain.id);
  const facilityAddress = event.log.address as Address;
  const assetAddress = event.args.asset as Address;
  const depositPeriod = Number(event.args.periodMonths);
  const positionId = event.args.positionId;
  const depositorAddress = event.args.depositor as Address;

  // Create/fetch records
  // Note: getOrCreateDepositAssetPeriod is called internally by getOrCreateDepositFacilityAssetPeriod,
  // so we skip calling it here to avoid duplicate database queries
  await getOrCreateDepositFacilityAssetPeriod(
    context,
    chainId,
    facilityAddress,
    assetAddress,
    depositPeriod,
  );
  // Note: getOrCreateDepositor is called internally by getOrCreatePosition,
  // so we skip calling it here to avoid duplicate database queries
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
  // Get asset decimals from nested relation
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

  // Update facility asset snapshot with deposit
  await updateFacilityAssetSnapshotDeposited(
    context,
    chainId,
    BigInt(event.block.number),
    BigInt(event.block.timestamp),
    facilityAddress,
    assetAddress,
    BigInt(event.args.depositAmount),
  );
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
  // Get asset decimals from nested relation
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

  // Update facility asset snapshot with withdrawal (negative delta for reclaimed amount)
  await updateFacilityAssetSnapshotDeposited(
    context,
    chainId,
    BigInt(event.block.number),
    BigInt(event.block.timestamp),
    facilityAddress,
    assetAddress,
    -BigInt(event.args.reclaimedAmount), // Negative for withdrawal
  );
});

ponder.on("ConvertibleDepositFacility:ConvertedDeposit", async ({ event, context }) => {
  const chainId = Number(context.chain.id);
  const facilityAddress = event.log.address as Address;
  const assetAddress = event.args.asset as Address;
  const depositPeriod = Number(event.args.periodMonths);
  const depositorAddress = event.args.depositor as Address;

  // Create/fetch records
  await getOrCreateDepositor(context, chainId, depositorAddress);
  // Note: getOrCreateDepositAssetPeriod is called internally by getOrCreateDepositFacilityAssetPeriod,
  // so we skip calling it here to avoid duplicate database queries
  await getOrCreateDepositFacilityAssetPeriod(
    context,
    chainId,
    facilityAddress,
    assetAddress,
    depositPeriod,
  );
  // Get asset decimals from nested relation
  const assetDecimals = await getAssetDecimals(context, chainId, assetAddress);

  // Create record for the parent event
  await context.db.insert(schema.convertibleDepositFacilityConvertedDeposits).values({
    chainId,
    block: BigInt(event.block.number),
    logIndex: event.log.logIndex,
    txHash: event.transaction.hash,
    timestamp: BigInt(event.block.timestamp),
    facility: facilityAddress.toLowerCase() as Address,
    depositAsset: assetAddress.toLowerCase() as Address,
    depositPeriod,
    depositAmount: BigInt(event.args.depositAmount),
    depositAmountDecimal: toDecimal(BigInt(event.args.depositAmount), assetDecimals),
    convertedAmount: BigInt(event.args.convertedAmount),
    convertedAmountDecimal: toOhmDecimal(BigInt(event.args.convertedAmount)),
  });

  // Update positions of depositor for this asset period
  const contractPositionIds = await fetchUserPositionIds(context, depositorAddress);
  const contractPositions = await fetchPositions(context, contractPositionIds);

  // Track total converted amount for snapshot update
  let totalDepositConverted = BigInt(0);

  // Update positions of depositor for this asset period
  let logIndexCounter = event.log.logIndex;
  for (let i = 0; i < contractPositionIds.length; i++) {
    const contractPositionId = contractPositionIds[i];
    const contractPosition = contractPositions[i];

    // Skip if position data is missing
    if (!contractPositionId || !contractPosition) {
      throw new Error(`Position data is missing for contract position ID: ${contractPositionId}`);
    }

    // Get the position record - this will throw if position is not found
    const recordPosition = await getPosition(context, chainId, contractPositionId);

    // Check if this position matches the facility asset period
    if (
      recordPosition.facility.toLowerCase() !== facilityAddress.toLowerCase() ||
      recordPosition.depositAsset.toLowerCase() !== assetAddress.toLowerCase() ||
      recordPosition.depositPeriod !== depositPeriod
    ) {
      throw new Error(`Position does not match facility asset period: ${contractPositionId}`);
    }

    const depositConvertedAmount =
      recordPosition.remainingAmount - contractPosition.remainingDeposit;

    // Calculate the amount converted
    const convertedAmount =
      (depositConvertedAmount * BigInt(1e9)) / contractPosition.conversionPrice;

    // Create record for the converted deposit (use sequential logIndex for child events)
    await context.db.insert(schema.convertibleDepositFacilityConvertedDeposit).values({
      chainId,
      block: BigInt(event.block.number),
      logIndex: logIndexCounter++,
      txHash: event.transaction.hash,
      timestamp: BigInt(event.block.timestamp),
      facility: facilityAddress.toLowerCase() as Address,
      depositAsset: assetAddress.toLowerCase() as Address,
      depositPeriod,
      depositor: depositorAddress.toLowerCase() as Address,
      positionId: contractPositionId,
      parentEventChainId: chainId,
      parentEventBlock: BigInt(event.block.number),
      parentEventLogIndex: event.log.logIndex,
      depositAmount: depositConvertedAmount,
      depositAmountDecimal: toDecimal(depositConvertedAmount, assetDecimals),
      convertedAmount: convertedAmount,
      convertedAmountDecimal: toOhmDecimal(convertedAmount),
    });

    // Accumulate total converted amount
    totalDepositConverted += depositConvertedAmount;

    // Update the position record with the new remaining amount
    await updatePosition(context, chainId, contractPositionId, {
      remainingAmount: contractPosition.remainingDeposit,
      remainingAmountDecimal: toDecimal(contractPosition.remainingDeposit, assetDecimals),
    });
  }

  // Update facility asset snapshot with converted deposits (negative delta for reduced deposits)
  if (totalDepositConverted > 0n) {
    await updateFacilityAssetSnapshotDeposited(
      context,
      chainId,
      BigInt(event.block.number),
      BigInt(event.block.timestamp),
      facilityAddress,
      assetAddress,
      -totalDepositConverted, // Negative because deposits are converted away
    );
  }
});

ponder.on("ConvertibleDepositFacility:ClaimedYield", async ({ event, context }) => {
  const chainId = Number(context.chain.id);
  const facilityAddress = event.log.address as Address;
  const assetAddress = event.args.asset as Address;

  // Create/fetch records
  await getOrCreateDepositFacilityAsset(context, chainId, facilityAddress, assetAddress);
  const assetDecimals = await getAssetDecimals(context, chainId, assetAddress);

  // Record event
  await context.db.insert(schema.convertibleDepositFacilityClaimedYield).values({
    chainId,
    block: BigInt(event.block.number),
    logIndex: event.log.logIndex,
    txHash: event.transaction.hash,
    timestamp: BigInt(event.block.timestamp),
    facility: facilityAddress.toLowerCase() as Address,
    depositAsset: assetAddress.toLowerCase() as Address,
    amount: BigInt(event.args.amount),
    amountDecimal: toDecimal(BigInt(event.args.amount), assetDecimals),
  });
});

ponder.on("ConvertibleDepositFacility:ClaimAllYieldFailed", async ({ event, context }) => {
  const chainId = Number(context.chain.id);
  const facilityAddress = event.log.address as Address;

  // Record event
  await context.db.insert(schema.convertibleDepositFacilityClaimAllYieldFailed).values({
    chainId,
    block: BigInt(event.block.number),
    logIndex: event.log.logIndex,
    txHash: event.transaction.hash,
    timestamp: BigInt(event.block.timestamp),
    facility: facilityAddress.toLowerCase() as Address,
  });
});
