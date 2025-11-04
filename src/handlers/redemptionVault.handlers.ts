/*
 * Event handlers for DepositRedemptionVault contract
 */

import { ponder } from "ponder:registry";
import schema from "ponder:schema";
import type { Address } from "viem";
import { getAssetDecimals } from "../entities/asset";
import { getOrCreateDepositFacility } from "../entities/depositFacility";
import { updatePositionFromContract } from "../entities/position";
import { getOrCreateRedemption, getRedemption, updateRedemption } from "../entities/redemption";
import {
  getOrCreateRedemptionLoan,
  getRedemptionLoan,
  updateRedemptionLoan,
} from "../entities/redemptionLoan";
import {
  getOrCreateRedemptionVault,
  getOrCreateRedemptionVaultAssetConfiguration,
  updateRedemptionVault,
  updateRedemptionVaultAssetConfiguration,
} from "../entities/redemptionVault";
import {
  updateFacilityAssetSnapshotBorrowedAmount,
  updateFacilityAssetSnapshotDeposited,
  updateFacilityAssetSnapshotPendingRedemption,
} from "../entities/snapshot";
import { toBpsDecimal, toDecimal } from "../utils/decimal";

// Enabled / Disabled handlers
ponder.on("DepositRedemptionVault:Enabled", async ({ event, context }) => {
  const chainId = Number(context.chain.id);
  const redemptionVaultAddress = event.log.address as Address;

  // Get or create redemption vault
  await getOrCreateRedemptionVault(context, chainId, redemptionVaultAddress);

  // Record event
  await context.db.insert(schema.depositRedemptionVaultEnabled).values({
    chainId,
    block: BigInt(event.block.number),
    logIndex: event.log.logIndex,
    txHash: event.transaction.hash,
    timestamp: BigInt(event.block.timestamp),
    redemptionVault: redemptionVaultAddress.toLowerCase() as Address,
  });

  // Update redemption vault status
  await updateRedemptionVault(context, chainId, redemptionVaultAddress, {
    enabled: true,
  });
});

ponder.on("DepositRedemptionVault:Disabled", async ({ event, context }) => {
  const chainId = Number(context.chain.id);
  const redemptionVaultAddress = event.log.address as Address;

  // Get or create redemption vault
  await getOrCreateRedemptionVault(context, chainId, redemptionVaultAddress);

  // Record event
  await context.db.insert(schema.depositRedemptionVaultDisabled).values({
    chainId,
    block: BigInt(event.block.number),
    logIndex: event.log.logIndex,
    txHash: event.transaction.hash,
    timestamp: BigInt(event.block.timestamp),
    redemptionVault: redemptionVaultAddress.toLowerCase() as Address,
  });

  // Update redemption vault status
  await updateRedemptionVault(context, chainId, redemptionVaultAddress, {
    enabled: false,
  });
});

// ClaimDefaultRewardPercentageSet handler
ponder.on("DepositRedemptionVault:ClaimDefaultRewardPercentageSet", async ({ event, context }) => {
  const chainId = Number(context.chain.id);
  const redemptionVaultAddress = event.log.address as Address;

  // Get or create redemption vault
  await getOrCreateRedemptionVault(context, chainId, redemptionVaultAddress);

  // Record event
  await context.db.insert(schema.depositRedemptionVaultClaimDefaultRewardPercentageSet).values({
    chainId,
    block: BigInt(event.block.number),
    logIndex: event.log.logIndex,
    txHash: event.transaction.hash,
    timestamp: BigInt(event.block.timestamp),
    redemptionVault: redemptionVaultAddress.toLowerCase() as Address,
    percent: BigInt(event.args.percent),
    percentDecimal: toBpsDecimal(BigInt(event.args.percent)),
  });

  // Update redemption vault with new claim default reward percentage
  await updateRedemptionVault(context, chainId, redemptionVaultAddress, {
    claimDefaultRewardPercentage: BigInt(event.args.percent),
    claimDefaultRewardPercentageDecimal: toBpsDecimal(BigInt(event.args.percent)),
  });
});

// Facility authorization handlers
ponder.on("DepositRedemptionVault:FacilityAuthorized", async ({ event, context }) => {
  const chainId = Number(context.chain.id);
  const redemptionVaultAddress = event.log.address as Address;
  const facilityAddress = event.args.facility as Address;

  // Get or create entities
  await getOrCreateRedemptionVault(context, chainId, redemptionVaultAddress);
  await getOrCreateDepositFacility(context, chainId, facilityAddress);

  // Record event
  await context.db.insert(schema.depositRedemptionVaultFacilityAuthorized).values({
    chainId,
    block: BigInt(event.block.number),
    logIndex: event.log.logIndex,
    txHash: event.transaction.hash,
    timestamp: BigInt(event.block.timestamp),
    redemptionVault: redemptionVaultAddress.toLowerCase() as Address,
    facility: facilityAddress.toLowerCase() as Address,
  });
});

ponder.on("DepositRedemptionVault:FacilityDeauthorized", async ({ event, context }) => {
  const chainId = Number(context.chain.id);
  const redemptionVaultAddress = event.log.address as Address;
  const facilityAddress = event.args.facility as Address;

  // Get or create entities
  await getOrCreateRedemptionVault(context, chainId, redemptionVaultAddress);
  await getOrCreateDepositFacility(context, chainId, facilityAddress);

  // Record event
  await context.db.insert(schema.depositRedemptionVaultFacilityDeauthorized).values({
    chainId,
    block: BigInt(event.block.number),
    logIndex: event.log.logIndex,
    txHash: event.transaction.hash,
    timestamp: BigInt(event.block.timestamp),
    redemptionVault: redemptionVaultAddress.toLowerCase() as Address,
    facility: facilityAddress.toLowerCase() as Address,
  });
});

// Asset configuration handlers
ponder.on("DepositRedemptionVault:AnnualInterestRateSet", async ({ event, context }) => {
  const chainId = Number(context.chain.id);
  const redemptionVaultAddress = event.log.address as Address;
  const facilityAddress = event.args.facility as Address;
  const assetAddress = event.args.asset as Address;

  // Get or create asset configuration
  await getOrCreateRedemptionVaultAssetConfiguration(
    context,
    chainId,
    redemptionVaultAddress,
    facilityAddress,
    assetAddress,
  );

  // Record event
  await context.db.insert(schema.depositRedemptionVaultAnnualInterestRateSet).values({
    chainId,
    block: BigInt(event.block.number),
    logIndex: event.log.logIndex,
    txHash: event.transaction.hash,
    timestamp: BigInt(event.block.timestamp),
    redemptionVault: redemptionVaultAddress.toLowerCase() as Address,
    facility: facilityAddress.toLowerCase() as Address,
    depositAsset: assetAddress.toLowerCase() as Address,
    rate: BigInt(event.args.rate),
    rateDecimal: toBpsDecimal(BigInt(event.args.rate)),
  });

  // Update asset configuration with new interest rate
  await updateRedemptionVaultAssetConfiguration(
    context,
    chainId,
    redemptionVaultAddress,
    facilityAddress,
    assetAddress,
    {
      interestRate: BigInt(event.args.rate),
      interestRateDecimal: toBpsDecimal(BigInt(event.args.rate)),
    },
  );
});

ponder.on("DepositRedemptionVault:MaxBorrowPercentageSet", async ({ event, context }) => {
  const chainId = Number(context.chain.id);
  const redemptionVaultAddress = event.log.address as Address;
  const facilityAddress = event.args.facility as Address;
  const assetAddress = event.args.asset as Address;

  // Get or create asset configuration
  await getOrCreateRedemptionVaultAssetConfiguration(
    context,
    chainId,
    redemptionVaultAddress,
    facilityAddress,
    assetAddress,
  );

  // Record event
  await context.db.insert(schema.depositRedemptionVaultMaxBorrowPercentageSet).values({
    chainId,
    block: BigInt(event.block.number),
    logIndex: event.log.logIndex,
    txHash: event.transaction.hash,
    timestamp: BigInt(event.block.timestamp),
    redemptionVault: redemptionVaultAddress.toLowerCase() as Address,
    facility: facilityAddress.toLowerCase() as Address,
    depositAsset: assetAddress.toLowerCase() as Address,
    percent: BigInt(event.args.percent),
    percentDecimal: toBpsDecimal(BigInt(event.args.percent)),
  });

  // Update asset configuration with new max borrow percentage
  await updateRedemptionVaultAssetConfiguration(
    context,
    chainId,
    redemptionVaultAddress,
    facilityAddress,
    assetAddress,
    {
      maxBorrowPercentage: BigInt(event.args.percent),
      maxBorrowPercentageDecimal: toBpsDecimal(BigInt(event.args.percent)),
    },
  );
});

// Redemption lifecycle handlers
ponder.on("DepositRedemptionVault:RedemptionStarted", async ({ event, context }) => {
  const chainId = Number(context.chain.id);
  const redemptionVaultAddress = event.log.address as Address;
  const facilityAddress = event.args.facility as Address;
  const depositTokenAddress = event.args.depositToken as Address;
  const depositPeriod = Number(event.args.depositPeriod);
  const userAddress = event.args.user as Address;
  const redemptionId = Number(event.args.redemptionId);

  // Get or create redemption (with nested asset relation)
  const redemption = await getOrCreateRedemption(
    context,
    chainId,
    redemptionVaultAddress,
    facilityAddress,
    depositTokenAddress,
    depositPeriod,
    userAddress,
    redemptionId,
  );

  // Get asset decimals
  const assetDecimals = await getAssetDecimals(context, chainId, depositTokenAddress);

  // Record event
  await context.db.insert(schema.depositRedemptionVaultRedemptionStarted).values({
    chainId,
    block: BigInt(event.block.number),
    logIndex: event.log.logIndex,
    txHash: event.transaction.hash,
    timestamp: BigInt(event.block.timestamp),
    redemptionVault: redemptionVaultAddress.toLowerCase() as Address,
    depositor: userAddress.toLowerCase() as Address,
    redemptionId,
    depositAsset: depositTokenAddress.toLowerCase() as Address,
    depositPeriod,
    facility: facilityAddress.toLowerCase() as Address,
    amount: BigInt(event.args.amount),
    amountDecimal: toDecimal(BigInt(event.args.amount), assetDecimals),
  });

  // Update redemption amount
  await updateRedemption(context, chainId, redemptionVaultAddress, userAddress, redemptionId, {
    amount: BigInt(event.args.amount),
    amountDecimal: toDecimal(BigInt(event.args.amount), assetDecimals),
  });

  // Update position amount if it exists
  if (redemption.positionId) {
    await updatePositionFromContract(context, chainId, redemption.positionId, assetDecimals);
  }

  // Update facility asset snapshot with pending redemption
  await getOrCreateDepositFacility(context, chainId, facilityAddress);
  // Increase in pending redemption amount
  await updateFacilityAssetSnapshotPendingRedemption(
    context,
    chainId,
    BigInt(event.block.number),
    BigInt(event.block.timestamp),
    facilityAddress,
    depositTokenAddress,
    BigInt(event.args.amount), // Positive for new redemption
  );
});

ponder.on("DepositRedemptionVault:RedemptionFinished", async ({ event, context }) => {
  const chainId = Number(context.chain.id);
  const redemptionVaultAddress = event.log.address as Address;
  const userAddress = event.args.user as Address;
  const redemptionId = Number(event.args.redemptionId);

  // Get redemption (with nested asset relation)
  const redemption = await getRedemption(
    context,
    chainId,
    redemptionVaultAddress,
    userAddress,
    redemptionId,
  );

  // Get asset decimals
  const assetDecimals = await getAssetDecimals(context, chainId, redemption.depositAsset);

  // Record event
  await context.db.insert(schema.depositRedemptionVaultRedemptionFinished).values({
    chainId,
    block: BigInt(event.block.number),
    logIndex: event.log.logIndex,
    txHash: event.transaction.hash,
    timestamp: BigInt(event.block.timestamp),
    redemptionVault: redemptionVaultAddress.toLowerCase() as Address,
    depositor: userAddress.toLowerCase() as Address,
    redemptionId,
    amount: BigInt(event.args.amount),
    amountDecimal: toDecimal(BigInt(event.args.amount), assetDecimals),
  });

  // Update redemption amount
  await updateRedemption(context, chainId, redemptionVaultAddress, userAddress, redemptionId, {
    amount: BigInt(event.args.amount),
    amountDecimal: toDecimal(BigInt(event.args.amount), assetDecimals),
  });

  // Update position amount if it exists
  if (redemption.positionId) {
    await updatePositionFromContract(context, chainId, redemption.positionId, assetDecimals);
  }

  // Update facility asset snapshot with completed redemption
  // Reduction in pending redemption amount
  await updateFacilityAssetSnapshotPendingRedemption(
    context,
    chainId,
    BigInt(event.block.number),
    BigInt(event.block.timestamp),
    redemption.facility,
    redemption.depositAsset,
    -BigInt(event.args.amount), // Negative for completed redemption
  );
  // Reduction in deposited assets
  await updateFacilityAssetSnapshotDeposited(
    context,
    chainId,
    BigInt(event.block.number),
    BigInt(event.block.timestamp),
    redemption.facility,
    redemption.depositAsset,
    -BigInt(event.args.amount), // Negative for completed redemption
  );
});

ponder.on("DepositRedemptionVault:RedemptionCancelled", async ({ event, context }) => {
  const chainId = Number(context.chain.id);
  const redemptionVaultAddress = event.log.address as Address;
  const userAddress = event.args.user as Address;
  const redemptionId = Number(event.args.redemptionId);
  const depositTokenAddress = event.args.depositToken as Address;
  const depositPeriod = Number(event.args.depositPeriod);

  // Get redemption (with nested asset relation)
  const redemption = await getRedemption(
    context,
    chainId,
    redemptionVaultAddress,
    userAddress,
    redemptionId,
  );

  // Get asset decimals
  const assetDecimals = await getAssetDecimals(context, chainId, depositTokenAddress);

  // Record event
  await context.db.insert(schema.depositRedemptionVaultRedemptionCancelled).values({
    chainId,
    block: BigInt(event.block.number),
    logIndex: event.log.logIndex,
    txHash: event.transaction.hash,
    timestamp: BigInt(event.block.timestamp),
    redemptionVault: redemptionVaultAddress.toLowerCase() as Address,
    depositor: userAddress.toLowerCase() as Address,
    redemptionId,
    depositAsset: depositTokenAddress.toLowerCase() as Address,
    depositPeriod,
    amount: BigInt(event.args.amount),
    amountDecimal: toDecimal(BigInt(event.args.amount), assetDecimals),
    remainingAmount: BigInt(event.args.remainingAmount),
    remainingAmountDecimal: toDecimal(BigInt(event.args.remainingAmount), assetDecimals),
  });

  // Update redemption amount
  await updateRedemption(context, chainId, redemptionVaultAddress, userAddress, redemptionId, {
    amount: BigInt(event.args.amount),
    amountDecimal: toDecimal(BigInt(event.args.amount), assetDecimals),
  });

  // Update position amount if it exists
  if (redemption.positionId) {
    await updatePositionFromContract(context, chainId, redemption.positionId, assetDecimals);
  }

  // Update facility asset snapshot with cancelled redemption
  // Reduce pending redemption amount (use the old amount before update)
  await updateFacilityAssetSnapshotPendingRedemption(
    context,
    chainId,
    BigInt(event.block.number),
    BigInt(event.block.timestamp),
    redemption.facility,
    depositTokenAddress,
    -redemption.amount, // Negative for cancelled redemption (use old amount)
  );
  // No increase in deposits, since assets are still in the DepositManager
});

// Loan lifecycle handlers
ponder.on("DepositRedemptionVault:LoanCreated", async ({ event, context }) => {
  const chainId = Number(context.chain.id);
  const redemptionVaultAddress = event.log.address as Address;
  const facilityAddress = event.args.facility as Address;
  const userAddress = event.args.user as Address;
  const redemptionId = Number(event.args.redemptionId);

  // Get redemption (with nested asset relation)
  const redemption = await getRedemption(
    context,
    chainId,
    redemptionVaultAddress,
    userAddress,
    redemptionId,
  );

  // Create the RedemptionLoan record
  await getOrCreateRedemptionLoan(
    context,
    chainId,
    redemptionVaultAddress,
    facilityAddress,
    redemption.depositAsset,
    redemption.depositPeriod,
    userAddress,
    redemptionId,
    BigInt(event.block.timestamp),
  );

  // Record event
  await context.db.insert(schema.depositRedemptionVaultLoanCreated).values({
    chainId,
    block: BigInt(event.block.number),
    logIndex: event.log.logIndex,
    txHash: event.transaction.hash,
    timestamp: BigInt(event.block.timestamp),
    redemptionVault: redemptionVaultAddress.toLowerCase() as Address,
    depositor: userAddress.toLowerCase() as Address,
    redemptionId,
    facility: facilityAddress.toLowerCase() as Address,
    amount: BigInt(event.args.amount),
    amountDecimal: toDecimal(
      BigInt(event.args.amount),
      await getAssetDecimals(context, chainId, redemption.depositAsset),
    ),
  });

  // Update position amount if it exists
  if (redemption.positionId) {
    await updatePositionFromContract(
      context,
      chainId,
      redemption.positionId,
      await getAssetDecimals(context, chainId, redemption.depositAsset),
    );
  }

  // Update facility asset snapshot with new loan
  // Positive delta for borrowed amount
  await updateFacilityAssetSnapshotBorrowedAmount(
    context,
    chainId,
    BigInt(event.block.number),
    BigInt(event.block.timestamp),
    facilityAddress,
    redemption.depositAsset,
    BigInt(event.args.amount), // Positive for new loan
  );
  // Reduce asset deposits
  await updateFacilityAssetSnapshotDeposited(
    context,
    chainId,
    BigInt(event.block.number),
    BigInt(event.block.timestamp),
    facilityAddress,
    redemption.depositAsset,
    -BigInt(event.args.amount), // Negative for new loan
  );
});

ponder.on("DepositRedemptionVault:LoanRepaid", async ({ event, context }) => {
  const chainId = Number(context.chain.id);
  const redemptionVaultAddress = event.log.address as Address;
  const userAddress = event.args.user as Address;
  const redemptionId = Number(event.args.redemptionId);

  // Get redemption and loan
  const redemption = await getRedemption(
    context,
    chainId,
    redemptionVaultAddress,
    userAddress,
    redemptionId,
  );
  const redemptionLoan = await getRedemptionLoan(
    context,
    chainId,
    redemptionVaultAddress,
    userAddress,
    redemptionId,
  );

  // Get asset decimals
  const assetDecimals = await getAssetDecimals(context, chainId, redemption.depositAsset);

  // Record event
  await context.db.insert(schema.depositRedemptionVaultLoanRepaid).values({
    chainId,
    block: BigInt(event.block.number),
    logIndex: event.log.logIndex,
    txHash: event.transaction.hash,
    timestamp: BigInt(event.block.timestamp),
    redemptionVault: redemptionVaultAddress.toLowerCase() as Address,
    depositor: userAddress.toLowerCase() as Address,
    redemptionId,
    principal: BigInt(event.args.principal),
    principalDecimal: toDecimal(BigInt(event.args.principal), assetDecimals),
    interest: BigInt(event.args.interest),
    interestDecimal: toDecimal(BigInt(event.args.interest), assetDecimals),
  });

  // Update loan status
  await updateRedemptionLoan(context, chainId, redemptionVaultAddress, userAddress, redemptionId, {
    status: event.args.principal === BigInt(0) ? "repaid" : "active",
    principal: BigInt(event.args.principal),
    principalDecimal: toDecimal(BigInt(event.args.principal), assetDecimals),
    interest: BigInt(event.args.interest),
    interestDecimal: toDecimal(BigInt(event.args.interest), assetDecimals),
  });

  // Update position amount if it exists
  if (redemption.positionId) {
    await updatePositionFromContract(context, chainId, redemption.positionId, assetDecimals);
  }

  // Update facility asset snapshot with repaid loan
  // Calculate the amount repaid (old principal - new principal)
  const amountRepaid = redemptionLoan.principal - BigInt(event.args.principal);

  if (amountRepaid > BigInt(0)) {
    // Reduction in borrowed amount
    await updateFacilityAssetSnapshotBorrowedAmount(
      context,
      chainId,
      BigInt(event.block.number),
      BigInt(event.block.timestamp),
      redemption.facility,
      redemption.depositAsset,
      -amountRepaid, // Negative for loan repayment
    );
    // Increase in deposited assets
    await updateFacilityAssetSnapshotDeposited(
      context,
      chainId,
      BigInt(event.block.number),
      BigInt(event.block.timestamp),
      redemption.facility,
      redemption.depositAsset,
      amountRepaid, // Positive for loan repayment
    );
  }
});

ponder.on("DepositRedemptionVault:LoanDefaulted", async ({ event, context }) => {
  const chainId = Number(context.chain.id);
  const redemptionVaultAddress = event.log.address as Address;
  const userAddress = event.args.user as Address;
  const redemptionId = Number(event.args.redemptionId);

  // Get redemption and loan
  const redemption = await getRedemption(
    context,
    chainId,
    redemptionVaultAddress,
    userAddress,
    redemptionId,
  );

  // Get asset decimals
  const assetDecimals = await getAssetDecimals(context, chainId, redemption.depositAsset);

  // Record event
  await context.db.insert(schema.depositRedemptionVaultLoanDefaulted).values({
    chainId,
    block: BigInt(event.block.number),
    logIndex: event.log.logIndex,
    txHash: event.transaction.hash,
    timestamp: BigInt(event.block.timestamp),
    redemptionVault: redemptionVaultAddress.toLowerCase() as Address,
    depositor: userAddress.toLowerCase() as Address,
    redemptionId,
    principal: BigInt(event.args.principal),
    principalDecimal: toDecimal(BigInt(event.args.principal), assetDecimals),
    interest: BigInt(event.args.interest),
    interestDecimal: toDecimal(BigInt(event.args.interest), assetDecimals),
    remainingCollateral: BigInt(event.args.remainingCollateral),
    remainingCollateralDecimal: toDecimal(BigInt(event.args.remainingCollateral), assetDecimals),
  });

  // Update loan status
  await updateRedemptionLoan(context, chainId, redemptionVaultAddress, userAddress, redemptionId, {
    status: "defaulted",
  });

  // Update position amount if it exists
  if (redemption.positionId) {
    await updatePositionFromContract(context, chainId, redemption.positionId, assetDecimals);
  }

  // Update facility asset snapshot with defaulted loan
  // Reduce loan amount
  await updateFacilityAssetSnapshotBorrowedAmount(
    context,
    chainId,
    BigInt(event.block.number),
    BigInt(event.block.timestamp),
    redemption.facility,
    redemption.depositAsset,
    -BigInt(event.args.principal), // Negative for defaulted loan
  );
  // No increase in deposits, since it is repossessed by the protocol
});

ponder.on("DepositRedemptionVault:LoanExtended", async ({ event, context }) => {
  const chainId = Number(context.chain.id);
  const redemptionVaultAddress = event.log.address as Address;
  const userAddress = event.args.user as Address;
  const redemptionId = Number(event.args.redemptionId);

  // Get redemption and loan
  const redemption = await getRedemption(
    context,
    chainId,
    redemptionVaultAddress,
    userAddress,
    redemptionId,
  );

  // Get asset decimals
  const assetDecimals = await getAssetDecimals(context, chainId, redemption.depositAsset);

  // Record event
  await context.db.insert(schema.depositRedemptionVaultLoanExtended).values({
    chainId,
    block: BigInt(event.block.number),
    logIndex: event.log.logIndex,
    txHash: event.transaction.hash,
    timestamp: BigInt(event.block.timestamp),
    redemptionVault: redemptionVaultAddress.toLowerCase() as Address,
    depositor: userAddress.toLowerCase() as Address,
    redemptionId,
    newDueDate: BigInt(event.args.newDueDate),
  });

  // Update loan due date
  await updateRedemptionLoan(context, chainId, redemptionVaultAddress, userAddress, redemptionId, {
    dueDate: BigInt(event.args.newDueDate),
  });

  // Update position amount if it exists
  if (redemption.positionId) {
    await updatePositionFromContract(context, chainId, redemption.positionId, assetDecimals);
  }
});
