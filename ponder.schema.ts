import { onchainTable, primaryKey, relations } from "ponder";

// ============================================================================
// Core Entities
// ============================================================================

export const asset = onchainTable(
  "asset",
  (t) => ({
    chainId: t.integer().notNull(),
    address: t.hex().notNull(),
    decimals: t.integer().notNull(),
    name: t.text().notNull(),
    symbol: t.text().notNull(),
  }),
  (table) => ({
    pk: primaryKey({ columns: [table.chainId, table.address] }),
  }),
);

export const depositAsset = onchainTable(
  "deposit_asset",
  (t) => ({
    chainId: t.integer().notNull(),
    asset: t.hex().notNull(), // Asset address (same as asset.address)
    enabled: t.boolean().notNull(),
  }),
  (table) => ({
    pk: primaryKey({ columns: [table.chainId, table.asset] }),
  }),
);

export const depositAssetPeriod = onchainTable(
  "deposit_asset_period",
  (t) => ({
    chainId: t.integer().notNull(),
    depositAsset: t.hex().notNull(), // Asset address (references depositAsset.asset)
    depositPeriod: t.integer().notNull(),
    enabled: t.boolean().notNull(),
  }),
  (table) => ({
    pk: primaryKey({
      columns: [table.chainId, table.depositAsset, table.depositPeriod],
    }),
  }),
);

export const auctioneer = onchainTable(
  "auctioneer",
  (t) => ({
    chainId: t.integer().notNull(),
    address: t.hex().notNull(),
    depositAsset: t.hex().notNull(), // Asset address (references depositAsset.asset)
    majorVersion: t.integer().notNull(),
    minorVersion: t.integer().notNull(),
    enabled: t.boolean().notNull(),
    auctionTrackingPeriod: t.integer().notNull(),
    tickStep: t.bigint().notNull(),
    tickStepDecimal: t.text().notNull(), // BigDecimal as text
  }),
  (table) => ({
    pk: primaryKey({ columns: [table.chainId, table.address] }),
  }),
);

export const depositFacility = onchainTable(
  "deposit_facility",
  (t) => ({
    chainId: t.integer().notNull(),
    address: t.hex().notNull(),
    enabled: t.boolean().notNull(),
  }),
  (table) => ({
    pk: primaryKey({ columns: [table.chainId, table.address] }),
  }),
);

export const depositRedemptionVault = onchainTable(
  "deposit_redemption_vault",
  (t) => ({
    chainId: t.integer().notNull(),
    address: t.hex().notNull(),
    enabled: t.boolean().notNull(),
    claimDefaultRewardPercentage: t.bigint().notNull(),
    claimDefaultRewardPercentageDecimal: t.text().notNull(), // BigDecimal as text
  }),
  (table) => ({
    pk: primaryKey({ columns: [table.chainId, table.address] }),
  }),
);

export const receiptToken = onchainTable(
  "receipt_token",
  (t) => ({
    chainId: t.integer().notNull(),
    receiptTokenManager: t.hex().notNull(),
    receiptTokenId: t.bigint().notNull(),
    facility: t.hex().notNull(), // Facility address (FK)
    depositAsset: t.hex().notNull(), // Asset address (FK to depositAssetPeriod)
    depositPeriod: t.integer().notNull(), // Period months (FK to depositAssetPeriod)
  }),
  (table) => ({
    pk: primaryKey({
      columns: [table.chainId, table.receiptTokenManager, table.receiptTokenId],
    }),
  }),
);

export const emissionManager = onchainTable(
  "emission_manager",
  (t) => ({
    chainId: t.integer().notNull(),
    address: t.hex().notNull(),
    enabled: t.boolean().notNull(),
    backing: t.bigint().notNull(), // Scale: reserve asset decimals
    backingDecimal: t.text().notNull(), // BigDecimal as text
    baseEmissionRate: t.bigint().notNull(), // Scale: 1e9 = 100%
    baseEmissionRateDecimal: t.text().notNull(), // BigDecimal as text
    bondMarketAuctioneer: t.hex().notNull(),
    convertibleDepositAuctioneer: t.hex().notNull(),
    bondMarketTeller: t.hex().notNull(),
    bondMarketCapacityScalar: t.bigint().notNull(), // Scale: 1e18 = 100%
    bondMarketCapacityScalarDecimal: t.text().notNull(), // BigDecimal as text
    minPriceScalar: t.bigint().notNull(), // Scale: 1e18 = 100%
    minPriceScalarDecimal: t.text().notNull(), // BigDecimal as text
    minimumPremium: t.bigint().notNull(), // Scale: 1e18 = 100%
    minimumPremiumDecimal: t.text().notNull(), // BigDecimal as text
    reserveAsset: t.hex().notNull(),
    restartTimeframe: t.bigint().notNull(),
    tickSize: t.bigint().notNull(), // Scale: 1e9
    tickSizeDecimal: t.text().notNull(), // BigDecimal as text
    vestingPeriod: t.bigint().notNull(),
  }),
  (table) => ({
    pk: primaryKey({
      columns: [table.chainId, table.address],
    }),
  }),
);

export const depositRedemptionVaultAssetConfiguration = onchainTable(
  "deposit_redemption_vault_asset_configuration",
  (t) => ({
    chainId: t.integer().notNull(),
    redemptionVault: t.hex().notNull(), // Redemption vault address (FK)
    facility: t.hex().notNull(), // Facility address (FK)
    depositAsset: t.hex().notNull(), // Asset address (FK to depositAsset)
    interestRate: t.bigint().notNull(),
    interestRateDecimal: t.text().notNull(), // BigDecimal as text (BPS)
    maxBorrowPercentage: t.bigint().notNull(),
    maxBorrowPercentageDecimal: t.text().notNull(), // BigDecimal as text (BPS)
  }),
  (table) => ({
    pk: primaryKey({
      columns: [table.chainId, table.redemptionVault, table.facility, table.depositAsset],
    }),
  }),
);

export const redemption = onchainTable(
  "redemption",
  (t) => ({
    chainId: t.integer().notNull(),
    redemptionVault: t.hex().notNull(), // Redemption vault address (FK)
    depositor: t.hex().notNull(), // Depositor address (FK)
    redemptionId: t.integer().notNull(), // Redemption ID (unique per user per vault)
    depositAsset: t.hex().notNull(), // Asset address (FK to depositAssetPeriod)
    depositPeriod: t.integer().notNull(), // Period months (FK to depositAssetPeriod)
    facility: t.hex().notNull(), // Facility address (FK)
    receiptTokenManager: t.hex().notNull(), // ReceiptToken receiptTokenManager (FK)
    receiptTokenId: t.bigint().notNull(), // ReceiptToken receiptTokenId (FK)
    positionId: t.bigint(), // Position ID (optional, FK to convertibleDepositPosition)
    amount: t.bigint().notNull(),
    amountDecimal: t.text().notNull(), // BigDecimal as text
    redeemableAt: t.bigint().notNull(),
  }),
  (table) => ({
    pk: primaryKey({
      columns: [table.chainId, table.redemptionVault, table.depositor, table.redemptionId],
    }),
  }),
);

export const redemptionLoan = onchainTable(
  "redemption_loan",
  (t) => ({
    chainId: t.integer().notNull(),
    redemptionVault: t.hex().notNull(), // Redemption vault address
    depositor: t.hex().notNull(), // Depositor address (FK to redemption)
    depositAsset: t.hex().notNull(), // Asset address (FK to redemption)
    depositPeriod: t.integer().notNull(), // Period months (FK to redemption)
    facility: t.hex().notNull(), // Facility address (FK to redemption)
    receiptTokenManager: t.hex().notNull(), // ReceiptToken (FK to redemption)
    receiptTokenId: t.bigint().notNull(), // ReceiptToken (FK to redemption)
    redemptionId: t.integer().notNull(), // Redemption ID (part of redemption PK)
    initialPrincipal: t.bigint().notNull(),
    initialPrincipalDecimal: t.text().notNull(), // BigDecimal as text
    principal: t.bigint().notNull(),
    principalDecimal: t.text().notNull(), // BigDecimal as text
    interest: t.bigint().notNull(),
    interestDecimal: t.text().notNull(), // BigDecimal as text
    createdAt: t.bigint().notNull(),
    dueDate: t.bigint().notNull(),
    status: t.text().notNull(), // "active", "repaid", "defaulted"
  }),
  (table) => ({
    pk: primaryKey({
      columns: [table.chainId, table.redemptionVault, table.depositor, table.redemptionId],
    }),
  }),
);

export const depositor = onchainTable(
  "depositor",
  (t) => ({
    chainId: t.integer().notNull(),
    address: t.hex().notNull(),
  }),
  (table) => ({
    pk: primaryKey({ columns: [table.chainId, table.address] }),
  }),
);

export const auctioneerDepositPeriod = onchainTable(
  "auctioneer_deposit_period",
  (t) => ({
    chainId: t.integer().notNull(),
    auctioneer: t.hex().notNull(), // Auctioneer address (FK)
    depositAsset: t.hex().notNull(), // Asset address (FK to depositAssetPeriod)
    depositPeriod: t.integer().notNull(), // Period months (FK to depositAssetPeriod)
    enabled: t.boolean().notNull(),
    // Note: Current tick data is stored in auctioneerDepositPeriodSnapshot, updated on each bid
  }),
  (table) => ({
    pk: primaryKey({
      columns: [table.chainId, table.auctioneer, table.depositAsset, table.depositPeriod],
    }),
  }),
);

export const depositFacilityAsset = onchainTable(
  "deposit_facility_asset",
  (t) => ({
    chainId: t.integer().notNull(),
    facility: t.hex().notNull(), // Facility address (FK)
    depositAsset: t.hex().notNull(), // Asset address (FK to depositAsset)
    committedAmount: t.bigint().notNull(),
    committedAmountDecimal: t.text().notNull(), // BigDecimal as text
  }),
  (table) => ({
    pk: primaryKey({ columns: [table.chainId, table.facility, table.depositAsset] }),
  }),
);

export const depositFacilityAssetPeriod = onchainTable(
  "deposit_facility_asset_period",
  (t) => ({
    chainId: t.integer().notNull(),
    facility: t.hex().notNull(), // Facility address (FK)
    depositAsset: t.hex().notNull(), // Asset address (FK to depositAssetPeriod)
    depositPeriod: t.integer().notNull(), // Period months (FK to depositAssetPeriod)
    reclaimRate: t.bigint().notNull(),
    reclaimRateDecimal: t.text().notNull(), // BigDecimal as text
  }),
  (table) => ({
    pk: primaryKey({
      columns: [table.chainId, table.facility, table.depositAsset, table.depositPeriod],
    }),
  }),
);

export const convertibleDepositPosition = onchainTable(
  "convertible_deposit_position",
  (t) => ({
    chainId: t.integer().notNull(),
    positionId: t.bigint().notNull(),
    txHash: t.hex().notNull(),
    block: t.bigint().notNull(),
    timestamp: t.bigint().notNull(),
    // Foreign keys (all reuse chainId)
    facility: t.hex().notNull(), // Facility address
    depositor: t.hex().notNull(), // Depositor address
    depositAsset: t.hex().notNull(), // Asset address (for depositAssetPeriod)
    depositPeriod: t.integer().notNull(), // Period months (for depositAssetPeriod)
    receiptTokenManager: t.hex().notNull(),
    receiptTokenId: t.bigint().notNull(),
    // Amounts - BigInt stored as bigint, BigDecimal as text
    initialAmount: t.bigint().notNull(),
    initialAmountDecimal: t.text().notNull(),
    remainingAmount: t.bigint().notNull(),
    remainingAmountDecimal: t.text().notNull(),
    conversionPrice: t.bigint(),
    conversionPriceDecimal: t.text(),
  }),
  (table) => ({
    pk: primaryKey({ columns: [table.chainId, table.positionId] }),
  }),
);

// ============================================================================
// Event Entities
// ============================================================================

// Auctioneer Events
export const convertibleDepositAuctioneerEnabled = onchainTable(
  "convertible_deposit_auctioneer_enabled",
  (t) => ({
    chainId: t.integer().notNull(),
    block: t.bigint().notNull(),
    logIndex: t.integer().notNull(),
    txHash: t.hex().notNull(),
    timestamp: t.bigint().notNull(),
    auctioneer: t.hex().notNull(), // Auctioneer address (FK)
  }),
  (table) => ({
    pk: primaryKey({ columns: [table.chainId, table.block, table.logIndex] }),
  }),
);

export const convertibleDepositAuctioneerDisabled = onchainTable(
  "convertible_deposit_auctioneer_disabled",
  (t) => ({
    chainId: t.integer().notNull(),
    block: t.bigint().notNull(),
    logIndex: t.integer().notNull(),
    txHash: t.hex().notNull(),
    timestamp: t.bigint().notNull(),
    auctioneer: t.hex().notNull(), // Auctioneer address (FK)
  }),
  (table) => ({
    pk: primaryKey({ columns: [table.chainId, table.block, table.logIndex] }),
  }),
);

// Facility Events
export const convertibleDepositFacilityEnabled = onchainTable(
  "convertible_deposit_facility_enabled",
  (t) => ({
    chainId: t.integer().notNull(),
    block: t.bigint().notNull(),
    logIndex: t.integer().notNull(),
    txHash: t.hex().notNull(),
    timestamp: t.bigint().notNull(),
    facility: t.hex().notNull(), // Facility address (FK)
  }),
  (table) => ({
    pk: primaryKey({ columns: [table.chainId, table.block, table.logIndex] }),
  }),
);

export const convertibleDepositAuctioneerTickStepUpdated = onchainTable(
  "convertible_deposit_auctioneer_tick_step_updated",
  (t) => ({
    chainId: t.integer().notNull(),
    block: t.bigint().notNull(),
    logIndex: t.integer().notNull(),
    txHash: t.hex().notNull(),
    timestamp: t.bigint().notNull(),
    auctioneer: t.hex().notNull(), // Auctioneer address (FK)
    newTickStep: t.bigint().notNull(),
    newTickStepDecimal: t.text().notNull(), // BigDecimal as text
  }),
  (table) => ({
    pk: primaryKey({ columns: [table.chainId, table.block, table.logIndex] }),
  }),
);

export const convertibleDepositAuctioneerAuctionTrackingPeriodUpdated = onchainTable(
  "convertible_deposit_auctioneer_auction_tracking_period_updated",
  (t) => ({
    chainId: t.integer().notNull(),
    block: t.bigint().notNull(),
    logIndex: t.integer().notNull(),
    txHash: t.hex().notNull(),
    timestamp: t.bigint().notNull(),
    auctioneer: t.hex().notNull(), // Auctioneer address (FK)
    auctionTrackingPeriod: t.integer().notNull(),
  }),
  (table) => ({
    pk: primaryKey({ columns: [table.chainId, table.block, table.logIndex] }),
  }),
);

export const convertibleDepositAuctioneerDepositPeriodDisableQueued = onchainTable(
  "convertible_deposit_auctioneer_deposit_period_disable_queued",
  (t) => ({
    chainId: t.integer().notNull(),
    block: t.bigint().notNull(),
    logIndex: t.integer().notNull(),
    txHash: t.hex().notNull(),
    timestamp: t.bigint().notNull(),
    auctioneer: t.hex().notNull(), // Auctioneer address (FK)
    depositAsset: t.hex().notNull(), // Asset address (FK)
    depositPeriod: t.integer().notNull(), // Period months (FK)
  }),
  (table) => ({
    pk: primaryKey({ columns: [table.chainId, table.block, table.logIndex] }),
  }),
);

export const convertibleDepositAuctioneerDepositPeriodDisabled = onchainTable(
  "convertible_deposit_auctioneer_deposit_period_disabled",
  (t) => ({
    chainId: t.integer().notNull(),
    block: t.bigint().notNull(),
    logIndex: t.integer().notNull(),
    txHash: t.hex().notNull(),
    timestamp: t.bigint().notNull(),
    auctioneer: t.hex().notNull(), // Auctioneer address (FK)
    depositAsset: t.hex().notNull(), // Asset address (FK)
    depositPeriod: t.integer().notNull(), // Period months (FK)
  }),
  (table) => ({
    pk: primaryKey({ columns: [table.chainId, table.block, table.logIndex] }),
  }),
);

export const convertibleDepositAuctioneerDepositPeriodEnableQueued = onchainTable(
  "convertible_deposit_auctioneer_deposit_period_enable_queued",
  (t) => ({
    chainId: t.integer().notNull(),
    block: t.bigint().notNull(),
    logIndex: t.integer().notNull(),
    txHash: t.hex().notNull(),
    timestamp: t.bigint().notNull(),
    auctioneer: t.hex().notNull(), // Auctioneer address (FK)
    depositAsset: t.hex().notNull(), // Asset address (FK)
    depositPeriod: t.integer().notNull(), // Period months (FK)
  }),
  (table) => ({
    pk: primaryKey({ columns: [table.chainId, table.block, table.logIndex] }),
  }),
);

export const convertibleDepositAuctioneerDepositPeriodEnabled = onchainTable(
  "convertible_deposit_auctioneer_deposit_period_enabled",
  (t) => ({
    chainId: t.integer().notNull(),
    block: t.bigint().notNull(),
    logIndex: t.integer().notNull(),
    txHash: t.hex().notNull(),
    timestamp: t.bigint().notNull(),
    auctioneer: t.hex().notNull(), // Auctioneer address (FK)
    depositAsset: t.hex().notNull(), // Asset address (FK)
    depositPeriod: t.integer().notNull(), // Period months (FK)
  }),
  (table) => ({
    pk: primaryKey({ columns: [table.chainId, table.block, table.logIndex] }),
  }),
);

export const convertibleDepositFacilityDisabled = onchainTable(
  "convertible_deposit_facility_disabled",
  (t) => ({
    chainId: t.integer().notNull(),
    block: t.bigint().notNull(),
    logIndex: t.integer().notNull(),
    txHash: t.hex().notNull(),
    timestamp: t.bigint().notNull(),
    facility: t.hex().notNull(), // Facility address (FK)
  }),
  (table) => ({
    pk: primaryKey({ columns: [table.chainId, table.block, table.logIndex] }),
  }),
);

export const convertibleDepositFacilityOperatorAuthorized = onchainTable(
  "convertible_deposit_facility_operator_authorized",
  (t) => ({
    chainId: t.integer().notNull(),
    block: t.bigint().notNull(),
    logIndex: t.integer().notNull(),
    txHash: t.hex().notNull(),
    timestamp: t.bigint().notNull(),
    facility: t.hex().notNull(), // Facility address (FK)
    operator: t.hex().notNull(),
  }),
  (table) => ({
    pk: primaryKey({ columns: [table.chainId, table.block, table.logIndex] }),
  }),
);

export const convertibleDepositFacilityOperatorDeauthorized = onchainTable(
  "convertible_deposit_facility_operator_deauthorized",
  (t) => ({
    chainId: t.integer().notNull(),
    block: t.bigint().notNull(),
    logIndex: t.integer().notNull(),
    txHash: t.hex().notNull(),
    timestamp: t.bigint().notNull(),
    facility: t.hex().notNull(), // Facility address (FK)
    operator: t.hex().notNull(),
  }),
  (table) => ({
    pk: primaryKey({ columns: [table.chainId, table.block, table.logIndex] }),
  }),
);

export const convertibleDepositFacilityAssetCommitCancelled = onchainTable(
  "convertible_deposit_facility_asset_commit_cancelled",
  (t) => ({
    chainId: t.integer().notNull(),
    block: t.bigint().notNull(),
    logIndex: t.integer().notNull(),
    txHash: t.hex().notNull(),
    timestamp: t.bigint().notNull(),
    facility: t.hex().notNull(), // Facility address (FK)
    depositAsset: t.hex().notNull(), // Asset address (FK)
    operator: t.hex().notNull(),
    amount: t.bigint().notNull(),
    amountDecimal: t.text().notNull(), // BigDecimal as text
    committedAmount: t.bigint().notNull(),
    committedAmountDecimal: t.text().notNull(), // BigDecimal as text
  }),
  (table) => ({
    pk: primaryKey({ columns: [table.chainId, table.block, table.logIndex] }),
  }),
);

export const convertibleDepositFacilityAssetCommitWithdrawn = onchainTable(
  "convertible_deposit_facility_asset_commit_withdrawn",
  (t) => ({
    chainId: t.integer().notNull(),
    block: t.bigint().notNull(),
    logIndex: t.integer().notNull(),
    txHash: t.hex().notNull(),
    timestamp: t.bigint().notNull(),
    facility: t.hex().notNull(), // Facility address (FK)
    depositAsset: t.hex().notNull(), // Asset address (FK)
    operator: t.hex().notNull(),
    amount: t.bigint().notNull(),
    amountDecimal: t.text().notNull(), // BigDecimal as text
    committedAmount: t.bigint().notNull(),
    committedAmountDecimal: t.text().notNull(), // BigDecimal as text
  }),
  (table) => ({
    pk: primaryKey({ columns: [table.chainId, table.block, table.logIndex] }),
  }),
);

export const convertibleDepositFacilityAssetCommitted = onchainTable(
  "convertible_deposit_facility_asset_committed",
  (t) => ({
    chainId: t.integer().notNull(),
    block: t.bigint().notNull(),
    logIndex: t.integer().notNull(),
    txHash: t.hex().notNull(),
    timestamp: t.bigint().notNull(),
    facility: t.hex().notNull(), // Facility address (FK)
    depositAsset: t.hex().notNull(), // Asset address (FK)
    operator: t.hex().notNull(),
    amount: t.bigint().notNull(),
    amountDecimal: t.text().notNull(), // BigDecimal as text
    committedAmount: t.bigint().notNull(),
    committedAmountDecimal: t.text().notNull(), // BigDecimal as text
  }),
  (table) => ({
    pk: primaryKey({ columns: [table.chainId, table.block, table.logIndex] }),
  }),
);

export const convertibleDepositFacilityAssetPeriodReclaimRateSet = onchainTable(
  "convertible_deposit_facility_asset_period_reclaim_rate_set",
  (t) => ({
    chainId: t.integer().notNull(),
    block: t.bigint().notNull(),
    logIndex: t.integer().notNull(),
    txHash: t.hex().notNull(),
    timestamp: t.bigint().notNull(),
    facility: t.hex().notNull(), // Facility address (FK)
    depositAsset: t.hex().notNull(), // Asset address (FK)
    depositPeriod: t.integer().notNull(), // Period months (FK)
    reclaimRate: t.bigint().notNull(),
    reclaimRateDecimal: t.text().notNull(), // BigDecimal as text
  }),
  (table) => ({
    pk: primaryKey({ columns: [table.chainId, table.block, table.logIndex] }),
  }),
);

export const convertibleDepositFacilityCreatedDeposit = onchainTable(
  "convertible_deposit_facility_created_deposit",
  (t) => ({
    chainId: t.integer().notNull(),
    block: t.bigint().notNull(),
    logIndex: t.integer().notNull(),
    txHash: t.hex().notNull(),
    timestamp: t.bigint().notNull(),
    facility: t.hex().notNull(), // Facility address (FK)
    depositAsset: t.hex().notNull(), // Asset address (FK)
    depositPeriod: t.integer().notNull(), // Period months (FK)
    depositor: t.hex().notNull(), // Depositor address (FK)
    positionId: t.bigint().notNull(), // Position ID (FK)
    depositAmount: t.bigint().notNull(),
    depositAmountDecimal: t.text().notNull(), // BigDecimal as text
  }),
  (table) => ({
    pk: primaryKey({ columns: [table.chainId, table.block, table.logIndex] }),
  }),
);

export const convertibleDepositFacilityReclaimed = onchainTable(
  "convertible_deposit_facility_reclaimed",
  (t) => ({
    chainId: t.integer().notNull(),
    block: t.bigint().notNull(),
    logIndex: t.integer().notNull(),
    txHash: t.hex().notNull(),
    timestamp: t.bigint().notNull(),
    facility: t.hex().notNull(), // Facility address (FK)
    depositAsset: t.hex().notNull(), // Asset address (FK)
    depositPeriod: t.integer().notNull(), // Period months (FK)
    depositor: t.hex().notNull(), // Depositor address (FK)
    reclaimedAmount: t.bigint().notNull(),
    reclaimedAmountDecimal: t.text().notNull(), // BigDecimal as text
    forfeitedAmount: t.bigint().notNull(),
    forfeitedAmountDecimal: t.text().notNull(), // BigDecimal as text
  }),
  (table) => ({
    pk: primaryKey({ columns: [table.chainId, table.block, table.logIndex] }),
  }),
);

export const convertibleDepositAuctioneerBid = onchainTable(
  "convertible_deposit_auctioneer_bid",
  (t) => ({
    chainId: t.integer().notNull(),
    block: t.bigint().notNull(),
    logIndex: t.integer().notNull(),
    txHash: t.hex().notNull(),
    timestamp: t.bigint().notNull(),
    auctioneer: t.hex().notNull(), // Auctioneer address (FK)
    depositAsset: t.hex().notNull(), // Asset address (FK)
    depositPeriod: t.integer().notNull(), // Period months (FK)
    depositor: t.hex().notNull(), // Depositor address (FK)
    positionId: t.bigint().notNull(), // Position ID (FK)
    depositAmount: t.bigint().notNull(),
    depositAmountDecimal: t.text().notNull(), // BigDecimal as text
    convertedAmount: t.bigint().notNull(),
    convertedAmountDecimal: t.text().notNull(), // BigDecimal as text
    tickCapacity: t.bigint().notNull(),
    tickCapacityDecimal: t.text().notNull(), // BigDecimal as text
    tickPrice: t.bigint().notNull(),
    tickPriceDecimal: t.text().notNull(), // BigDecimal as text
  }),
  (table) => ({
    pk: primaryKey({ columns: [table.chainId, table.block, table.logIndex] }),
  }),
);

export const convertibleDepositFacilityConvertedDeposits = onchainTable(
  "convertible_deposit_facility_converted_deposits",
  (t) => ({
    chainId: t.integer().notNull(),
    block: t.bigint().notNull(),
    logIndex: t.integer().notNull(),
    txHash: t.hex().notNull(),
    timestamp: t.bigint().notNull(),
    facility: t.hex().notNull(), // Facility address (FK)
    depositAsset: t.hex().notNull(), // Asset address (FK)
    depositPeriod: t.integer().notNull(), // Period months (FK)
    depositAmount: t.bigint().notNull(),
    depositAmountDecimal: t.text().notNull(), // BigDecimal as text
    convertedAmount: t.bigint().notNull(),
    convertedAmountDecimal: t.text().notNull(), // BigDecimal as text
  }),
  (table) => ({
    pk: primaryKey({ columns: [table.chainId, table.block, table.logIndex] }),
  }),
);

export const convertibleDepositFacilityConvertedDeposit = onchainTable(
  "convertible_deposit_facility_converted_deposit",
  (t) => ({
    chainId: t.integer().notNull(),
    block: t.bigint().notNull(),
    logIndex: t.integer().notNull(),
    txHash: t.hex().notNull(),
    timestamp: t.bigint().notNull(),
    facility: t.hex().notNull(), // Facility address (FK)
    depositAsset: t.hex().notNull(), // Asset address (FK)
    depositPeriod: t.integer().notNull(), // Period months (FK)
    depositor: t.hex().notNull(), // Depositor address (FK)
    positionId: t.bigint().notNull(), // Position ID (FK)
    parentEventChainId: t.integer().notNull(), // Parent event chainId
    parentEventBlock: t.bigint().notNull(), // Parent event block
    parentEventLogIndex: t.integer().notNull(), // Parent event logIndex
    depositAmount: t.bigint().notNull(),
    depositAmountDecimal: t.text().notNull(), // BigDecimal as text
    convertedAmount: t.bigint().notNull(),
    convertedAmountDecimal: t.text().notNull(), // BigDecimal as text
  }),
  (table) => ({
    pk: primaryKey({ columns: [table.chainId, table.block, table.logIndex] }),
  }),
);

export const convertibleDepositAuctioneerAuctionParametersUpdated = onchainTable(
  "convertible_deposit_auctioneer_auction_parameters_updated",
  (t) => ({
    chainId: t.integer().notNull(),
    block: t.bigint().notNull(),
    logIndex: t.integer().notNull(),
    txHash: t.hex().notNull(),
    timestamp: t.bigint().notNull(),
    auctioneer: t.hex().notNull(), // Auctioneer address (FK)
    depositAsset: t.hex().notNull(), // Asset address (FK)
    target: t.bigint().notNull(),
    targetDecimal: t.text().notNull(), // BigDecimal as text
    tickSize: t.bigint().notNull(),
    tickSizeDecimal: t.text().notNull(), // BigDecimal as text
    minPrice: t.bigint().notNull(),
    minPriceDecimal: t.text().notNull(), // BigDecimal as text
  }),
  (table) => ({
    pk: primaryKey({ columns: [table.chainId, table.block, table.logIndex] }),
  }),
);

export const convertibleDepositAuctioneerAuctionResult = onchainTable(
  "convertible_deposit_auctioneer_auction_result",
  (t) => ({
    chainId: t.integer().notNull(),
    block: t.bigint().notNull(),
    logIndex: t.integer().notNull(),
    txHash: t.hex().notNull(),
    timestamp: t.bigint().notNull(),
    auctioneer: t.hex().notNull(), // Auctioneer address (FK)
    depositAsset: t.hex().notNull(), // Asset address (FK)
    ohmConvertible: t.bigint().notNull(),
    ohmConvertibleDecimal: t.text().notNull(), // BigDecimal as text
    target: t.bigint().notNull(),
    targetDecimal: t.text().notNull(), // BigDecimal as text
    periodIndex: t.integer().notNull(),
  }),
  (table) => ({
    pk: primaryKey({ columns: [table.chainId, table.block, table.logIndex] }),
  }),
);

export const convertibleDepositFacilityClaimedYield = onchainTable(
  "convertible_deposit_facility_claimed_yield",
  (t) => ({
    chainId: t.integer().notNull(),
    block: t.bigint().notNull(),
    logIndex: t.integer().notNull(),
    txHash: t.hex().notNull(),
    timestamp: t.bigint().notNull(),
    facility: t.hex().notNull(), // Facility address (FK)
    depositAsset: t.hex().notNull(), // Asset address (FK)
    amount: t.bigint().notNull(),
    amountDecimal: t.text().notNull(), // BigDecimal as text
  }),
  (table) => ({
    pk: primaryKey({ columns: [table.chainId, table.block, table.logIndex] }),
  }),
);

export const convertibleDepositFacilityClaimAllYieldFailed = onchainTable(
  "convertible_deposit_facility_claim_all_yield_failed",
  (t) => ({
    chainId: t.integer().notNull(),
    block: t.bigint().notNull(),
    logIndex: t.integer().notNull(),
    txHash: t.hex().notNull(),
    timestamp: t.bigint().notNull(),
    facility: t.hex().notNull(), // Facility address (FK)
  }),
  (table) => ({
    pk: primaryKey({ columns: [table.chainId, table.block, table.logIndex] }),
  }),
);

// DepositRedemptionVault Events
export const depositRedemptionVaultEnabled = onchainTable(
  "deposit_redemption_vault_enabled",
  (t) => ({
    chainId: t.integer().notNull(),
    block: t.bigint().notNull(),
    logIndex: t.integer().notNull(),
    txHash: t.hex().notNull(),
    timestamp: t.bigint().notNull(),
    redemptionVault: t.hex().notNull(), // Redemption vault address (FK)
  }),
  (table) => ({
    pk: primaryKey({ columns: [table.chainId, table.block, table.logIndex] }),
  }),
);

export const depositRedemptionVaultDisabled = onchainTable(
  "deposit_redemption_vault_disabled",
  (t) => ({
    chainId: t.integer().notNull(),
    block: t.bigint().notNull(),
    logIndex: t.integer().notNull(),
    txHash: t.hex().notNull(),
    timestamp: t.bigint().notNull(),
    redemptionVault: t.hex().notNull(), // Redemption vault address (FK)
  }),
  (table) => ({
    pk: primaryKey({ columns: [table.chainId, table.block, table.logIndex] }),
  }),
);

export const depositRedemptionVaultClaimDefaultRewardPercentageSet = onchainTable(
  "deposit_redemption_vault_claim_default_reward_percentage_set",
  (t) => ({
    chainId: t.integer().notNull(),
    block: t.bigint().notNull(),
    logIndex: t.integer().notNull(),
    txHash: t.hex().notNull(),
    timestamp: t.bigint().notNull(),
    redemptionVault: t.hex().notNull(), // Redemption vault address (FK)
    percent: t.bigint().notNull(),
    percentDecimal: t.text().notNull(), // BigDecimal as text (BPS)
  }),
  (table) => ({
    pk: primaryKey({ columns: [table.chainId, table.block, table.logIndex] }),
  }),
);

export const depositRedemptionVaultFacilityAuthorized = onchainTable(
  "deposit_redemption_vault_facility_authorized",
  (t) => ({
    chainId: t.integer().notNull(),
    block: t.bigint().notNull(),
    logIndex: t.integer().notNull(),
    txHash: t.hex().notNull(),
    timestamp: t.bigint().notNull(),
    redemptionVault: t.hex().notNull(), // Redemption vault address (FK)
    facility: t.hex().notNull(), // Facility address (FK)
  }),
  (table) => ({
    pk: primaryKey({ columns: [table.chainId, table.block, table.logIndex] }),
  }),
);

export const depositRedemptionVaultFacilityDeauthorized = onchainTable(
  "deposit_redemption_vault_facility_deauthorized",
  (t) => ({
    chainId: t.integer().notNull(),
    block: t.bigint().notNull(),
    logIndex: t.integer().notNull(),
    txHash: t.hex().notNull(),
    timestamp: t.bigint().notNull(),
    redemptionVault: t.hex().notNull(), // Redemption vault address (FK)
    facility: t.hex().notNull(), // Facility address (FK)
  }),
  (table) => ({
    pk: primaryKey({ columns: [table.chainId, table.block, table.logIndex] }),
  }),
);

export const depositRedemptionVaultAnnualInterestRateSet = onchainTable(
  "deposit_redemption_vault_annual_interest_rate_set",
  (t) => ({
    chainId: t.integer().notNull(),
    block: t.bigint().notNull(),
    logIndex: t.integer().notNull(),
    txHash: t.hex().notNull(),
    timestamp: t.bigint().notNull(),
    redemptionVault: t.hex().notNull(), // Redemption vault address (FK)
    facility: t.hex().notNull(), // Facility address (FK)
    depositAsset: t.hex().notNull(), // Asset address (FK)
    rate: t.bigint().notNull(),
    rateDecimal: t.text().notNull(), // BigDecimal as text (BPS)
  }),
  (table) => ({
    pk: primaryKey({ columns: [table.chainId, table.block, table.logIndex] }),
  }),
);

export const depositRedemptionVaultMaxBorrowPercentageSet = onchainTable(
  "deposit_redemption_vault_max_borrow_percentage_set",
  (t) => ({
    chainId: t.integer().notNull(),
    block: t.bigint().notNull(),
    logIndex: t.integer().notNull(),
    txHash: t.hex().notNull(),
    timestamp: t.bigint().notNull(),
    redemptionVault: t.hex().notNull(), // Redemption vault address (FK)
    facility: t.hex().notNull(), // Facility address (FK)
    depositAsset: t.hex().notNull(), // Asset address (FK)
    percent: t.bigint().notNull(),
    percentDecimal: t.text().notNull(), // BigDecimal as text (BPS)
  }),
  (table) => ({
    pk: primaryKey({ columns: [table.chainId, table.block, table.logIndex] }),
  }),
);

export const depositRedemptionVaultRedemptionStarted = onchainTable(
  "deposit_redemption_vault_redemption_started",
  (t) => ({
    chainId: t.integer().notNull(),
    block: t.bigint().notNull(),
    logIndex: t.integer().notNull(),
    txHash: t.hex().notNull(),
    timestamp: t.bigint().notNull(),
    redemptionVault: t.hex().notNull(), // Redemption vault address (FK)
    depositor: t.hex().notNull(), // Depositor address (FK)
    redemptionId: t.integer().notNull(), // Redemption ID (FK to redemption)
    depositAsset: t.hex().notNull(), // Asset address (FK)
    depositPeriod: t.integer().notNull(), // Period months (FK)
    facility: t.hex().notNull(), // Facility address (FK)
    amount: t.bigint().notNull(),
    amountDecimal: t.text().notNull(), // BigDecimal as text
  }),
  (table) => ({
    pk: primaryKey({ columns: [table.chainId, table.block, table.logIndex] }),
  }),
);

export const depositRedemptionVaultRedemptionFinished = onchainTable(
  "deposit_redemption_vault_redemption_finished",
  (t) => ({
    chainId: t.integer().notNull(),
    block: t.bigint().notNull(),
    logIndex: t.integer().notNull(),
    txHash: t.hex().notNull(),
    timestamp: t.bigint().notNull(),
    redemptionVault: t.hex().notNull(), // Redemption vault address (FK)
    depositor: t.hex().notNull(), // Depositor address (FK)
    redemptionId: t.integer().notNull(), // Redemption ID (FK to redemption)
    amount: t.bigint().notNull(),
    amountDecimal: t.text().notNull(), // BigDecimal as text
  }),
  (table) => ({
    pk: primaryKey({ columns: [table.chainId, table.block, table.logIndex] }),
  }),
);

export const depositRedemptionVaultRedemptionCancelled = onchainTable(
  "deposit_redemption_vault_redemption_cancelled",
  (t) => ({
    chainId: t.integer().notNull(),
    block: t.bigint().notNull(),
    logIndex: t.integer().notNull(),
    txHash: t.hex().notNull(),
    timestamp: t.bigint().notNull(),
    redemptionVault: t.hex().notNull(), // Redemption vault address (FK)
    depositor: t.hex().notNull(), // Depositor address (FK)
    redemptionId: t.integer().notNull(), // Redemption ID (FK to redemption)
    depositAsset: t.hex().notNull(), // Asset address (FK)
    depositPeriod: t.integer().notNull(), // Period months (FK)
    amount: t.bigint().notNull(),
    amountDecimal: t.text().notNull(), // BigDecimal as text
    remainingAmount: t.bigint().notNull(),
    remainingAmountDecimal: t.text().notNull(), // BigDecimal as text
  }),
  (table) => ({
    pk: primaryKey({ columns: [table.chainId, table.block, table.logIndex] }),
  }),
);

export const depositRedemptionVaultLoanCreated = onchainTable(
  "deposit_redemption_vault_loan_created",
  (t) => ({
    chainId: t.integer().notNull(),
    block: t.bigint().notNull(),
    logIndex: t.integer().notNull(),
    txHash: t.hex().notNull(),
    timestamp: t.bigint().notNull(),
    redemptionVault: t.hex().notNull(), // Redemption vault address (FK)
    depositor: t.hex().notNull(), // Depositor address (FK)
    redemptionId: t.integer().notNull(), // Redemption ID (FK to redemption)
    facility: t.hex().notNull(), // Facility address (FK)
    amount: t.bigint().notNull(),
    amountDecimal: t.text().notNull(), // BigDecimal as text
  }),
  (table) => ({
    pk: primaryKey({ columns: [table.chainId, table.block, table.logIndex] }),
  }),
);

export const depositRedemptionVaultLoanRepaid = onchainTable(
  "deposit_redemption_vault_loan_repaid",
  (t) => ({
    chainId: t.integer().notNull(),
    block: t.bigint().notNull(),
    logIndex: t.integer().notNull(),
    txHash: t.hex().notNull(),
    timestamp: t.bigint().notNull(),
    redemptionVault: t.hex().notNull(), // Redemption vault address (FK)
    depositor: t.hex().notNull(), // Depositor address (FK)
    redemptionId: t.integer().notNull(), // Redemption ID (FK to redemption)
    principal: t.bigint().notNull(),
    principalDecimal: t.text().notNull(), // BigDecimal as text
    interest: t.bigint().notNull(),
    interestDecimal: t.text().notNull(), // BigDecimal as text
  }),
  (table) => ({
    pk: primaryKey({ columns: [table.chainId, table.block, table.logIndex] }),
  }),
);

export const depositRedemptionVaultLoanDefaulted = onchainTable(
  "deposit_redemption_vault_loan_defaulted",
  (t) => ({
    chainId: t.integer().notNull(),
    block: t.bigint().notNull(),
    logIndex: t.integer().notNull(),
    txHash: t.hex().notNull(),
    timestamp: t.bigint().notNull(),
    redemptionVault: t.hex().notNull(), // Redemption vault address (FK)
    depositor: t.hex().notNull(), // Depositor address (FK)
    redemptionId: t.integer().notNull(), // Redemption ID (FK to redemption)
    principal: t.bigint().notNull(),
    principalDecimal: t.text().notNull(), // BigDecimal as text
    interest: t.bigint().notNull(),
    interestDecimal: t.text().notNull(), // BigDecimal as text
    remainingCollateral: t.bigint().notNull(),
    remainingCollateralDecimal: t.text().notNull(), // BigDecimal as text
  }),
  (table) => ({
    pk: primaryKey({ columns: [table.chainId, table.block, table.logIndex] }),
  }),
);

export const depositRedemptionVaultLoanExtended = onchainTable(
  "deposit_redemption_vault_loan_extended",
  (t) => ({
    chainId: t.integer().notNull(),
    block: t.bigint().notNull(),
    logIndex: t.integer().notNull(),
    txHash: t.hex().notNull(),
    timestamp: t.bigint().notNull(),
    redemptionVault: t.hex().notNull(), // Redemption vault address (FK)
    depositor: t.hex().notNull(), // Depositor address (FK)
    redemptionId: t.integer().notNull(), // Redemption ID (FK to redemption)
    newDueDate: t.bigint().notNull(),
  }),
  (table) => ({
    pk: primaryKey({ columns: [table.chainId, table.block, table.logIndex] }),
  }),
);

// Emission Manager Events
export const emissionManagerEnabled = onchainTable(
  "emission_manager_enabled",
  (t) => ({
    chainId: t.integer().notNull(),
    block: t.bigint().notNull(),
    logIndex: t.integer().notNull(),
    txHash: t.hex().notNull(),
    timestamp: t.bigint().notNull(),
    emissionManager: t.hex().notNull(),
  }),
  (table) => ({
    pk: primaryKey({ columns: [table.chainId, table.block, table.logIndex] }),
  }),
);

export const emissionManagerDisabled = onchainTable(
  "emission_manager_disabled",
  (t) => ({
    chainId: t.integer().notNull(),
    block: t.bigint().notNull(),
    logIndex: t.integer().notNull(),
    txHash: t.hex().notNull(),
    timestamp: t.bigint().notNull(),
    emissionManager: t.hex().notNull(),
  }),
  (table) => ({
    pk: primaryKey({ columns: [table.chainId, table.block, table.logIndex] }),
  }),
);

export const emissionManagerBackingChanged = onchainTable(
  "emission_manager_backing_changed",
  (t) => ({
    chainId: t.integer().notNull(),
    block: t.bigint().notNull(),
    logIndex: t.integer().notNull(),
    txHash: t.hex().notNull(),
    timestamp: t.bigint().notNull(),
    emissionManager: t.hex().notNull(),
    newBacking: t.bigint().notNull(), // Scale: reserve asset decimals
    newBackingDecimal: t.text().notNull(), // BigDecimal as text
  }),
  (table) => ({
    pk: primaryKey({ columns: [table.chainId, table.block, table.logIndex] }),
  }),
);

export const emissionManagerBackingUpdated = onchainTable(
  "emission_manager_backing_updated",
  (t) => ({
    chainId: t.integer().notNull(),
    block: t.bigint().notNull(),
    logIndex: t.integer().notNull(),
    txHash: t.hex().notNull(),
    timestamp: t.bigint().notNull(),
    emissionManager: t.hex().notNull(),
    newBacking: t.bigint().notNull(), // Scale: reserve asset decimals
    newBackingDecimal: t.text().notNull(), // BigDecimal as text
    supplyAdded: t.bigint().notNull(), // Scale: 1e9
    supplyAddedDecimal: t.text().notNull(), // BigDecimal as text
    reservesAdded: t.bigint().notNull(), // Scale: reserve asset decimals
    reservesAddedDecimal: t.text().notNull(), // BigDecimal as text
  }),
  (table) => ({
    pk: primaryKey({ columns: [table.chainId, table.block, table.logIndex] }),
  }),
);

export const emissionManagerBaseRateChanged = onchainTable(
  "emission_manager_base_rate_changed",
  (t) => ({
    chainId: t.integer().notNull(),
    block: t.bigint().notNull(),
    logIndex: t.integer().notNull(),
    txHash: t.hex().notNull(),
    timestamp: t.bigint().notNull(),
    emissionManager: t.hex().notNull(),
    changeBy: t.bigint().notNull(), // Scale: 1e9
    changeByDecimal: t.text().notNull(), // BigDecimal as text
    forNumBeats: t.bigint().notNull(), // Number of beats
    add: t.boolean().notNull(),
  }),
  (table) => ({
    pk: primaryKey({ columns: [table.chainId, table.block, table.logIndex] }),
  }),
);

export const emissionManagerBondContractsSet = onchainTable(
  "emission_manager_bond_contracts_set",
  (t) => ({
    chainId: t.integer().notNull(),
    block: t.bigint().notNull(),
    logIndex: t.integer().notNull(),
    txHash: t.hex().notNull(),
    timestamp: t.bigint().notNull(),
    emissionManager: t.hex().notNull(),
    bondMarketAuctioneer: t.hex().notNull(),
    bondMarketTeller: t.hex().notNull(),
  }),
  (table) => ({
    pk: primaryKey({ columns: [table.chainId, table.block, table.logIndex] }),
  }),
);

export const emissionManagerBondMarketCapacityScalarChanged = onchainTable(
  "emission_manager_bond_market_capacity_scalar_changed",
  (t) => ({
    chainId: t.integer().notNull(),
    block: t.bigint().notNull(),
    logIndex: t.integer().notNull(),
    txHash: t.hex().notNull(),
    timestamp: t.bigint().notNull(),
    emissionManager: t.hex().notNull(),
    newBondMarketCapacityScalar: t.bigint().notNull(), // Scale: 1e18 = 100%
    newBondMarketCapacityScalarDecimal: t.text().notNull(), // BigDecimal as text
  }),
  (table) => ({
    pk: primaryKey({ columns: [table.chainId, table.block, table.logIndex] }),
  }),
);

export const emissionManagerBondMarketCreationFailed = onchainTable(
  "emission_manager_bond_market_creation_failed",
  (t) => ({
    chainId: t.integer().notNull(),
    block: t.bigint().notNull(),
    logIndex: t.integer().notNull(),
    txHash: t.hex().notNull(),
    timestamp: t.bigint().notNull(),
    emissionManager: t.hex().notNull(),
    saleAmount: t.bigint().notNull(), // Scale: 1e9
    saleAmountDecimal: t.text().notNull(), // BigDecimal as text
  }),
  (table) => ({
    pk: primaryKey({ columns: [table.chainId, table.block, table.logIndex] }),
  }),
);

export const emissionManagerConvertibleDepositAuctioneerSet = onchainTable(
  "emission_manager_convertible_deposit_auctioneer_set",
  (t) => ({
    chainId: t.integer().notNull(),
    block: t.bigint().notNull(),
    logIndex: t.integer().notNull(),
    txHash: t.hex().notNull(),
    timestamp: t.bigint().notNull(),
    emissionManager: t.hex().notNull(),
    convertibleDepositAuctioneer: t.hex().notNull(),
  }),
  (table) => ({
    pk: primaryKey({ columns: [table.chainId, table.block, table.logIndex] }),
  }),
);

export const emissionManagerMinPriceScalarChanged = onchainTable(
  "emission_manager_min_price_scalar_changed",
  (t) => ({
    chainId: t.integer().notNull(),
    block: t.bigint().notNull(),
    logIndex: t.integer().notNull(),
    txHash: t.hex().notNull(),
    timestamp: t.bigint().notNull(),
    emissionManager: t.hex().notNull(),
    newMinPriceScalar: t.bigint().notNull(), // Scale: 1e18 = 100%
    newMinPriceScalarDecimal: t.text().notNull(), // BigDecimal as text
  }),
  (table) => ({
    pk: primaryKey({ columns: [table.chainId, table.block, table.logIndex] }),
  }),
);

export const emissionManagerMinimumPremiumChanged = onchainTable(
  "emission_manager_minimum_premium_changed",
  (t) => ({
    chainId: t.integer().notNull(),
    block: t.bigint().notNull(),
    logIndex: t.integer().notNull(),
    txHash: t.hex().notNull(),
    timestamp: t.bigint().notNull(),
    emissionManager: t.hex().notNull(),
    newMinimumPremium: t.bigint().notNull(), // Scale: 1e18 = 100%
    newMinimumPremiumDecimal: t.text().notNull(), // BigDecimal as text
  }),
  (table) => ({
    pk: primaryKey({ columns: [table.chainId, table.block, table.logIndex] }),
  }),
);

export const emissionManagerRestartTimeframeChanged = onchainTable(
  "emission_manager_restart_timeframe_changed",
  (t) => ({
    chainId: t.integer().notNull(),
    block: t.bigint().notNull(),
    logIndex: t.integer().notNull(),
    txHash: t.hex().notNull(),
    timestamp: t.bigint().notNull(),
    emissionManager: t.hex().notNull(),
    newRestartTimeframe: t.bigint().notNull(),
  }),
  (table) => ({
    pk: primaryKey({ columns: [table.chainId, table.block, table.logIndex] }),
  }),
);

export const emissionManagerBondMarketCreated = onchainTable(
  "emission_manager_bond_market_created",
  (t) => ({
    chainId: t.integer().notNull(),
    block: t.bigint().notNull(),
    logIndex: t.integer().notNull(),
    txHash: t.hex().notNull(),
    timestamp: t.bigint().notNull(),
    emissionManager: t.hex().notNull(),
    marketId: t.bigint().notNull(),
    saleAmount: t.bigint().notNull(), // Scale: 1e9
    saleAmountDecimal: t.text().notNull(), // BigDecimal as text
  }),
  (table) => ({
    pk: primaryKey({ columns: [table.chainId, table.block, table.logIndex] }),
  }),
);

export const emissionManagerTickSizeChanged = onchainTable(
  "emission_manager_tick_size_changed",
  (t) => ({
    chainId: t.integer().notNull(),
    block: t.bigint().notNull(),
    logIndex: t.integer().notNull(),
    txHash: t.hex().notNull(),
    timestamp: t.bigint().notNull(),
    emissionManager: t.hex().notNull(),
    newTickSize: t.bigint().notNull(), // Scale: 1e9
    newTickSizeDecimal: t.text().notNull(), // BigDecimal as text
  }),
  (table) => ({
    pk: primaryKey({ columns: [table.chainId, table.block, table.logIndex] }),
  }),
);

export const emissionManagerVestingPeriodChanged = onchainTable(
  "emission_manager_vesting_period_changed",
  (t) => ({
    chainId: t.integer().notNull(),
    block: t.bigint().notNull(),
    logIndex: t.integer().notNull(),
    txHash: t.hex().notNull(),
    timestamp: t.bigint().notNull(),
    emissionManager: t.hex().notNull(),
    newVestingPeriod: t.bigint().notNull(),
  }),
  (table) => ({
    pk: primaryKey({ columns: [table.chainId, table.block, table.logIndex] }),
  }),
);

// Snapshot entities for interval-based state tracking
export const auctioneerSnapshot = onchainTable(
  "auctioneer_snapshot",
  (t) => ({
    chainId: t.integer().notNull(),
    block: t.bigint().notNull(),
    timestamp: t.bigint().notNull(),
    auctioneer: t.hex().notNull(), // Auctioneer address (FK)
    // Day state from getDayState()
    dayInitTimestamp: t.bigint().notNull(),
    ohmSold: t.bigint().notNull(), // convertible from getDayState
    ohmSoldDecimal: t.text().notNull(), // BigDecimal as text
    // Auction parameters (from contract)
    isAuctionActive: t.boolean().notNull(),
    target: t.bigint().notNull(),
    targetDecimal: t.text().notNull(), // BigDecimal as text
    tickSize: t.bigint().notNull(),
    tickSizeDecimal: t.text().notNull(), // BigDecimal as text
    minPrice: t.bigint().notNull(),
    minPriceDecimal: t.text().notNull(), // BigDecimal as text
  }),
  (table) => ({
    pk: primaryKey({ columns: [table.chainId, table.block, table.auctioneer] }),
  }),
);

export const auctioneerDepositPeriodSnapshot = onchainTable(
  "auctioneer_deposit_period_snapshot",
  (t) => ({
    chainId: t.integer().notNull(),
    block: t.bigint().notNull(),
    timestamp: t.bigint().notNull(),
    auctioneer: t.hex().notNull(), // Auctioneer address (FK)
    depositAsset: t.hex().notNull(), // Asset address (FK)
    depositPeriod: t.integer().notNull(), // Period months (FK)
    // Current tick state for this specific period
    currentTickPrice: t.bigint().notNull(),
    currentTickPriceDecimal: t.text().notNull(), // BigDecimal as text
    currentTickCapacity: t.bigint().notNull(),
    currentTickCapacityDecimal: t.text().notNull(), // BigDecimal as text
  }),
  (table) => ({
    pk: primaryKey({
      columns: [
        table.chainId,
        table.block,
        table.auctioneer,
        table.depositAsset,
        table.depositPeriod,
      ],
    }),
  }),
);

export const depositFacilityAssetSnapshot = onchainTable(
  "deposit_facility_asset_snapshot",
  (t) => ({
    chainId: t.integer().notNull(),
    block: t.bigint().notNull(),
    timestamp: t.bigint().notNull(),
    facility: t.hex().notNull(), // Facility address (FK)
    depositAsset: t.hex().notNull(), // Asset address (FK)
    // Incremental counters (copied from previous snapshot, adjusted by events)
    // Includes pending redemption (still in the DepositManager), excludes borrowed amount
    totalDeposited: t.bigint().notNull(),
    totalDepositedDecimal: t.text().notNull(), // BigDecimal as text
    pendingRedemption: t.bigint().notNull(),
    pendingRedemptionDecimal: t.text().notNull(), // BigDecimal as text
    borrowedAmount: t.bigint().notNull(),
    borrowedAmountDecimal: t.text().notNull(), // BigDecimal as text
    // Claimable yield (from contract call)
    claimableYield: t.bigint().notNull(),
    claimableYieldDecimal: t.text().notNull(), // BigDecimal as text
  }),
  (table) => ({
    pk: primaryKey({ columns: [table.chainId, table.block, table.facility, table.depositAsset] }),
  }),
);

// DepositRedemptionVault Core Entity Relations
export const depositRedemptionVaultRelations = relations(depositRedemptionVault, ({ many }) => ({
  assetConfigurations: many(depositRedemptionVaultAssetConfiguration),
  redemptions: many(redemption),
  enabledEvents: many(depositRedemptionVaultEnabled),
  disabledEvents: many(depositRedemptionVaultDisabled),
  claimDefaultRewardPercentageSetEvents: many(
    depositRedemptionVaultClaimDefaultRewardPercentageSet,
  ),
  facilityAuthorizedEvents: many(depositRedemptionVaultFacilityAuthorized),
  facilityDeauthorizedEvents: many(depositRedemptionVaultFacilityDeauthorized),
}));

export const emissionManagerRelations = relations(emissionManager, ({ one, many }) => ({
  rConvertibleDepositAuctioneer: one(auctioneer, {
    fields: [emissionManager.chainId, emissionManager.convertibleDepositAuctioneer],
    references: [auctioneer.chainId, auctioneer.address],
  }),
  rReserveAsset: one(asset, {
    fields: [emissionManager.chainId, emissionManager.reserveAsset],
    references: [asset.chainId, asset.address],
  }),
  backingChangedEvents: many(emissionManagerBackingChanged),
  backingUpdatedEvents: many(emissionManagerBackingUpdated),
  baseRateChangedEvents: many(emissionManagerBaseRateChanged),
  bondContractsSetEvents: many(emissionManagerBondContractsSet),
  bondMarketCapacityScalarChangedEvents: many(emissionManagerBondMarketCapacityScalarChanged),
  bondMarketCreatedEvents: many(emissionManagerBondMarketCreated),
  bondMarketCreationFailedEvents: many(emissionManagerBondMarketCreationFailed),
  convertibleDepositAuctioneerSetEvents: many(emissionManagerConvertibleDepositAuctioneerSet),
  disabledEvents: many(emissionManagerDisabled),
  enabledEvents: many(emissionManagerEnabled),
  minimumPremiumChangedEvents: many(emissionManagerMinimumPremiumChanged),
  minPriceScalarChangedEvents: many(emissionManagerMinPriceScalarChanged),
  restartTimeframeChangedEvents: many(emissionManagerRestartTimeframeChanged),
  tickSizeChangedEvents: many(emissionManagerTickSizeChanged),
  vestingPeriodChangedEvents: many(emissionManagerVestingPeriodChanged),
}));

export const receiptTokenRelations = relations(receiptToken, ({ one, many }) => ({
  rFacility: one(depositFacility, {
    fields: [receiptToken.chainId, receiptToken.facility],
    references: [depositFacility.chainId, depositFacility.address],
  }),
  rAssetPeriod: one(depositAssetPeriod, {
    fields: [receiptToken.chainId, receiptToken.depositAsset, receiptToken.depositPeriod],
    references: [
      depositAssetPeriod.chainId,
      depositAssetPeriod.depositAsset,
      depositAssetPeriod.depositPeriod,
    ],
  }),
  positions: many(convertibleDepositPosition),
  redemptions: many(redemption),
}));

export const depositRedemptionVaultAssetConfigurationRelations = relations(
  depositRedemptionVaultAssetConfiguration,
  ({ one, many }) => ({
    rRedemptionVault: one(depositRedemptionVault, {
      fields: [
        depositRedemptionVaultAssetConfiguration.chainId,
        depositRedemptionVaultAssetConfiguration.redemptionVault,
      ],
      references: [depositRedemptionVault.chainId, depositRedemptionVault.address],
    }),
    rFacility: one(depositFacility, {
      fields: [
        depositRedemptionVaultAssetConfiguration.chainId,
        depositRedemptionVaultAssetConfiguration.facility,
      ],
      references: [depositFacility.chainId, depositFacility.address],
    }),
    rDepositAsset: one(depositAsset, {
      fields: [
        depositRedemptionVaultAssetConfiguration.chainId,
        depositRedemptionVaultAssetConfiguration.depositAsset,
      ],
      references: [depositAsset.chainId, depositAsset.asset],
    }),
    annualInterestRateSetEvents: many(depositRedemptionVaultAnnualInterestRateSet),
    maxBorrowPercentageSetEvents: many(depositRedemptionVaultMaxBorrowPercentageSet),
  }),
);

export const redemptionRelations = relations(redemption, ({ one, many }) => ({
  rRedemptionVault: one(depositRedemptionVault, {
    fields: [redemption.chainId, redemption.redemptionVault],
    references: [depositRedemptionVault.chainId, depositRedemptionVault.address],
  }),
  rDepositor: one(depositor, {
    fields: [redemption.chainId, redemption.depositor],
    references: [depositor.chainId, depositor.address],
  }),
  rAssetPeriod: one(depositAssetPeriod, {
    fields: [redemption.chainId, redemption.depositAsset, redemption.depositPeriod],
    references: [
      depositAssetPeriod.chainId,
      depositAssetPeriod.depositAsset,
      depositAssetPeriod.depositPeriod,
    ],
  }),
  rFacility: one(depositFacility, {
    fields: [redemption.chainId, redemption.facility],
    references: [depositFacility.chainId, depositFacility.address],
  }),
  rReceiptToken: one(receiptToken, {
    fields: [redemption.chainId, redemption.receiptTokenManager, redemption.receiptTokenId],
    references: [
      receiptToken.chainId,
      receiptToken.receiptTokenManager,
      receiptToken.receiptTokenId,
    ],
  }),
  // Position is optional (positionId can be null)
  // When positionId is null, this relation will be null
  rPosition: one(convertibleDepositPosition, {
    fields: [redemption.chainId, redemption.positionId],
    references: [convertibleDepositPosition.chainId, convertibleDepositPosition.positionId],
  }),
  startedEvents: many(depositRedemptionVaultRedemptionStarted),
  finishedEvents: many(depositRedemptionVaultRedemptionFinished),
  cancelledEvents: many(depositRedemptionVaultRedemptionCancelled),
  loans: many(redemptionLoan),
}));

export const redemptionLoanRelations = relations(redemptionLoan, ({ one, many }) => ({
  rRedemption: one(redemption, {
    fields: [
      redemptionLoan.chainId,
      redemptionLoan.redemptionVault,
      redemptionLoan.depositor,
      redemptionLoan.redemptionId,
    ],
    references: [
      redemption.chainId,
      redemption.redemptionVault,
      redemption.depositor,
      redemption.redemptionId,
    ],
  }),
  createdEvents: many(depositRedemptionVaultLoanCreated),
  repaidEvents: many(depositRedemptionVaultLoanRepaid),
  defaultedEvents: many(depositRedemptionVaultLoanDefaulted),
  extendedEvents: many(depositRedemptionVaultLoanExtended),
}));

// DepositRedemptionVault Event Relations
export const depositRedemptionVaultEnabledRelations = relations(
  depositRedemptionVaultEnabled,
  ({ one }) => ({
    rRedemptionVault: one(depositRedemptionVault, {
      fields: [
        depositRedemptionVaultEnabled.chainId,
        depositRedemptionVaultEnabled.redemptionVault,
      ],
      references: [depositRedemptionVault.chainId, depositRedemptionVault.address],
    }),
  }),
);

export const depositRedemptionVaultDisabledRelations = relations(
  depositRedemptionVaultDisabled,
  ({ one }) => ({
    rRedemptionVault: one(depositRedemptionVault, {
      fields: [
        depositRedemptionVaultDisabled.chainId,
        depositRedemptionVaultDisabled.redemptionVault,
      ],
      references: [depositRedemptionVault.chainId, depositRedemptionVault.address],
    }),
  }),
);

export const depositRedemptionVaultClaimDefaultRewardPercentageSetRelations = relations(
  depositRedemptionVaultClaimDefaultRewardPercentageSet,
  ({ one }) => ({
    rRedemptionVault: one(depositRedemptionVault, {
      fields: [
        depositRedemptionVaultClaimDefaultRewardPercentageSet.chainId,
        depositRedemptionVaultClaimDefaultRewardPercentageSet.redemptionVault,
      ],
      references: [depositRedemptionVault.chainId, depositRedemptionVault.address],
    }),
  }),
);

export const depositRedemptionVaultFacilityAuthorizedRelations = relations(
  depositRedemptionVaultFacilityAuthorized,
  ({ one }) => ({
    rRedemptionVault: one(depositRedemptionVault, {
      fields: [
        depositRedemptionVaultFacilityAuthorized.chainId,
        depositRedemptionVaultFacilityAuthorized.redemptionVault,
      ],
      references: [depositRedemptionVault.chainId, depositRedemptionVault.address],
    }),
    rFacility: one(depositFacility, {
      fields: [
        depositRedemptionVaultFacilityAuthorized.chainId,
        depositRedemptionVaultFacilityAuthorized.facility,
      ],
      references: [depositFacility.chainId, depositFacility.address],
    }),
  }),
);

export const depositRedemptionVaultFacilityDeauthorizedRelations = relations(
  depositRedemptionVaultFacilityDeauthorized,
  ({ one }) => ({
    rRedemptionVault: one(depositRedemptionVault, {
      fields: [
        depositRedemptionVaultFacilityDeauthorized.chainId,
        depositRedemptionVaultFacilityDeauthorized.redemptionVault,
      ],
      references: [depositRedemptionVault.chainId, depositRedemptionVault.address],
    }),
    rFacility: one(depositFacility, {
      fields: [
        depositRedemptionVaultFacilityDeauthorized.chainId,
        depositRedemptionVaultFacilityDeauthorized.facility,
      ],
      references: [depositFacility.chainId, depositFacility.address],
    }),
  }),
);

export const depositRedemptionVaultAnnualInterestRateSetRelations = relations(
  depositRedemptionVaultAnnualInterestRateSet,
  ({ one }) => ({
    rRedemptionVault: one(depositRedemptionVault, {
      fields: [
        depositRedemptionVaultAnnualInterestRateSet.chainId,
        depositRedemptionVaultAnnualInterestRateSet.redemptionVault,
      ],
      references: [depositRedemptionVault.chainId, depositRedemptionVault.address],
    }),
    rFacility: one(depositFacility, {
      fields: [
        depositRedemptionVaultAnnualInterestRateSet.chainId,
        depositRedemptionVaultAnnualInterestRateSet.facility,
      ],
      references: [depositFacility.chainId, depositFacility.address],
    }),
    rDepositAsset: one(depositAsset, {
      fields: [
        depositRedemptionVaultAnnualInterestRateSet.chainId,
        depositRedemptionVaultAnnualInterestRateSet.depositAsset,
      ],
      references: [depositAsset.chainId, depositAsset.asset],
    }),
    rAssetConfiguration: one(depositRedemptionVaultAssetConfiguration, {
      fields: [
        depositRedemptionVaultAnnualInterestRateSet.chainId,
        depositRedemptionVaultAnnualInterestRateSet.redemptionVault,
        depositRedemptionVaultAnnualInterestRateSet.facility,
        depositRedemptionVaultAnnualInterestRateSet.depositAsset,
      ],
      references: [
        depositRedemptionVaultAssetConfiguration.chainId,
        depositRedemptionVaultAssetConfiguration.redemptionVault,
        depositRedemptionVaultAssetConfiguration.facility,
        depositRedemptionVaultAssetConfiguration.depositAsset,
      ],
    }),
  }),
);

export const depositRedemptionVaultMaxBorrowPercentageSetRelations = relations(
  depositRedemptionVaultMaxBorrowPercentageSet,
  ({ one }) => ({
    rRedemptionVault: one(depositRedemptionVault, {
      fields: [
        depositRedemptionVaultMaxBorrowPercentageSet.chainId,
        depositRedemptionVaultMaxBorrowPercentageSet.redemptionVault,
      ],
      references: [depositRedemptionVault.chainId, depositRedemptionVault.address],
    }),
    rFacility: one(depositFacility, {
      fields: [
        depositRedemptionVaultMaxBorrowPercentageSet.chainId,
        depositRedemptionVaultMaxBorrowPercentageSet.facility,
      ],
      references: [depositFacility.chainId, depositFacility.address],
    }),
    rDepositAsset: one(depositAsset, {
      fields: [
        depositRedemptionVaultMaxBorrowPercentageSet.chainId,
        depositRedemptionVaultMaxBorrowPercentageSet.depositAsset,
      ],
      references: [depositAsset.chainId, depositAsset.asset],
    }),
    rAssetConfiguration: one(depositRedemptionVaultAssetConfiguration, {
      fields: [
        depositRedemptionVaultMaxBorrowPercentageSet.chainId,
        depositRedemptionVaultMaxBorrowPercentageSet.redemptionVault,
        depositRedemptionVaultMaxBorrowPercentageSet.facility,
        depositRedemptionVaultMaxBorrowPercentageSet.depositAsset,
      ],
      references: [
        depositRedemptionVaultAssetConfiguration.chainId,
        depositRedemptionVaultAssetConfiguration.redemptionVault,
        depositRedemptionVaultAssetConfiguration.facility,
        depositRedemptionVaultAssetConfiguration.depositAsset,
      ],
    }),
  }),
);

export const depositRedemptionVaultRedemptionStartedRelations = relations(
  depositRedemptionVaultRedemptionStarted,
  ({ one }) => ({
    rRedemptionVault: one(depositRedemptionVault, {
      fields: [
        depositRedemptionVaultRedemptionStarted.chainId,
        depositRedemptionVaultRedemptionStarted.redemptionVault,
      ],
      references: [depositRedemptionVault.chainId, depositRedemptionVault.address],
    }),
    rDepositor: one(depositor, {
      fields: [
        depositRedemptionVaultRedemptionStarted.chainId,
        depositRedemptionVaultRedemptionStarted.depositor,
      ],
      references: [depositor.chainId, depositor.address],
    }),
    rRedemption: one(redemption, {
      fields: [
        depositRedemptionVaultRedemptionStarted.chainId,
        depositRedemptionVaultRedemptionStarted.redemptionVault,
        depositRedemptionVaultRedemptionStarted.depositor,
        depositRedemptionVaultRedemptionStarted.redemptionId,
      ],
      references: [
        redemption.chainId,
        redemption.redemptionVault,
        redemption.depositor,
        redemption.redemptionId,
      ],
    }),
    rFacility: one(depositFacility, {
      fields: [
        depositRedemptionVaultRedemptionStarted.chainId,
        depositRedemptionVaultRedemptionStarted.facility,
      ],
      references: [depositFacility.chainId, depositFacility.address],
    }),
    rDepositAsset: one(depositAsset, {
      fields: [
        depositRedemptionVaultRedemptionStarted.chainId,
        depositRedemptionVaultRedemptionStarted.depositAsset,
      ],
      references: [depositAsset.chainId, depositAsset.asset],
    }),
  }),
);

export const depositRedemptionVaultRedemptionFinishedRelations = relations(
  depositRedemptionVaultRedemptionFinished,
  ({ one }) => ({
    rRedemptionVault: one(depositRedemptionVault, {
      fields: [
        depositRedemptionVaultRedemptionFinished.chainId,
        depositRedemptionVaultRedemptionFinished.redemptionVault,
      ],
      references: [depositRedemptionVault.chainId, depositRedemptionVault.address],
    }),
    rDepositor: one(depositor, {
      fields: [
        depositRedemptionVaultRedemptionFinished.chainId,
        depositRedemptionVaultRedemptionFinished.depositor,
      ],
      references: [depositor.chainId, depositor.address],
    }),
    rRedemption: one(redemption, {
      fields: [
        depositRedemptionVaultRedemptionFinished.chainId,
        depositRedemptionVaultRedemptionFinished.redemptionVault,
        depositRedemptionVaultRedemptionFinished.depositor,
        depositRedemptionVaultRedemptionFinished.redemptionId,
      ],
      references: [
        redemption.chainId,
        redemption.redemptionVault,
        redemption.depositor,
        redemption.redemptionId,
      ],
    }),
  }),
);

export const depositRedemptionVaultRedemptionCancelledRelations = relations(
  depositRedemptionVaultRedemptionCancelled,
  ({ one }) => ({
    rRedemptionVault: one(depositRedemptionVault, {
      fields: [
        depositRedemptionVaultRedemptionCancelled.chainId,
        depositRedemptionVaultRedemptionCancelled.redemptionVault,
      ],
      references: [depositRedemptionVault.chainId, depositRedemptionVault.address],
    }),
    rDepositor: one(depositor, {
      fields: [
        depositRedemptionVaultRedemptionCancelled.chainId,
        depositRedemptionVaultRedemptionCancelled.depositor,
      ],
      references: [depositor.chainId, depositor.address],
    }),
    rRedemption: one(redemption, {
      fields: [
        depositRedemptionVaultRedemptionCancelled.chainId,
        depositRedemptionVaultRedemptionCancelled.redemptionVault,
        depositRedemptionVaultRedemptionCancelled.depositor,
        depositRedemptionVaultRedemptionCancelled.redemptionId,
      ],
      references: [
        redemption.chainId,
        redemption.redemptionVault,
        redemption.depositor,
        redemption.redemptionId,
      ],
    }),
    rDepositAsset: one(depositAsset, {
      fields: [
        depositRedemptionVaultRedemptionCancelled.chainId,
        depositRedemptionVaultRedemptionCancelled.depositAsset,
      ],
      references: [depositAsset.chainId, depositAsset.asset],
    }),
  }),
);

export const depositRedemptionVaultLoanCreatedRelations = relations(
  depositRedemptionVaultLoanCreated,
  ({ one }) => ({
    rRedemptionVault: one(depositRedemptionVault, {
      fields: [
        depositRedemptionVaultLoanCreated.chainId,
        depositRedemptionVaultLoanCreated.redemptionVault,
      ],
      references: [depositRedemptionVault.chainId, depositRedemptionVault.address],
    }),
    rDepositor: one(depositor, {
      fields: [
        depositRedemptionVaultLoanCreated.chainId,
        depositRedemptionVaultLoanCreated.depositor,
      ],
      references: [depositor.chainId, depositor.address],
    }),
    rRedemption: one(redemption, {
      fields: [
        depositRedemptionVaultLoanCreated.chainId,
        depositRedemptionVaultLoanCreated.redemptionVault,
        depositRedemptionVaultLoanCreated.depositor,
        depositRedemptionVaultLoanCreated.redemptionId,
      ],
      references: [
        redemption.chainId,
        redemption.redemptionVault,
        redemption.depositor,
        redemption.redemptionId,
      ],
    }),
    rRedemptionLoan: one(redemptionLoan, {
      fields: [
        depositRedemptionVaultLoanCreated.chainId,
        depositRedemptionVaultLoanCreated.redemptionVault,
        depositRedemptionVaultLoanCreated.depositor,
        depositRedemptionVaultLoanCreated.redemptionId,
      ],
      references: [
        redemptionLoan.chainId,
        redemptionLoan.redemptionVault,
        redemptionLoan.depositor,
        redemptionLoan.redemptionId,
      ],
    }),
    rFacility: one(depositFacility, {
      fields: [
        depositRedemptionVaultLoanCreated.chainId,
        depositRedemptionVaultLoanCreated.facility,
      ],
      references: [depositFacility.chainId, depositFacility.address],
    }),
  }),
);

export const depositRedemptionVaultLoanRepaidRelations = relations(
  depositRedemptionVaultLoanRepaid,
  ({ one }) => ({
    rRedemptionVault: one(depositRedemptionVault, {
      fields: [
        depositRedemptionVaultLoanRepaid.chainId,
        depositRedemptionVaultLoanRepaid.redemptionVault,
      ],
      references: [depositRedemptionVault.chainId, depositRedemptionVault.address],
    }),
    rDepositor: one(depositor, {
      fields: [
        depositRedemptionVaultLoanRepaid.chainId,
        depositRedemptionVaultLoanRepaid.depositor,
      ],
      references: [depositor.chainId, depositor.address],
    }),
    rRedemption: one(redemption, {
      fields: [
        depositRedemptionVaultLoanRepaid.chainId,
        depositRedemptionVaultLoanRepaid.redemptionVault,
        depositRedemptionVaultLoanRepaid.depositor,
        depositRedemptionVaultLoanRepaid.redemptionId,
      ],
      references: [
        redemption.chainId,
        redemption.redemptionVault,
        redemption.depositor,
        redemption.redemptionId,
      ],
    }),
    rRedemptionLoan: one(redemptionLoan, {
      fields: [
        depositRedemptionVaultLoanRepaid.chainId,
        depositRedemptionVaultLoanRepaid.redemptionVault,
        depositRedemptionVaultLoanRepaid.depositor,
        depositRedemptionVaultLoanRepaid.redemptionId,
      ],
      references: [
        redemptionLoan.chainId,
        redemptionLoan.redemptionVault,
        redemptionLoan.depositor,
        redemptionLoan.redemptionId,
      ],
    }),
  }),
);

export const depositRedemptionVaultLoanDefaultedRelations = relations(
  depositRedemptionVaultLoanDefaulted,
  ({ one }) => ({
    rRedemptionVault: one(depositRedemptionVault, {
      fields: [
        depositRedemptionVaultLoanDefaulted.chainId,
        depositRedemptionVaultLoanDefaulted.redemptionVault,
      ],
      references: [depositRedemptionVault.chainId, depositRedemptionVault.address],
    }),
    rDepositor: one(depositor, {
      fields: [
        depositRedemptionVaultLoanDefaulted.chainId,
        depositRedemptionVaultLoanDefaulted.depositor,
      ],
      references: [depositor.chainId, depositor.address],
    }),
    rRedemption: one(redemption, {
      fields: [
        depositRedemptionVaultLoanDefaulted.chainId,
        depositRedemptionVaultLoanDefaulted.redemptionVault,
        depositRedemptionVaultLoanDefaulted.depositor,
        depositRedemptionVaultLoanDefaulted.redemptionId,
      ],
      references: [
        redemption.chainId,
        redemption.redemptionVault,
        redemption.depositor,
        redemption.redemptionId,
      ],
    }),
    rRedemptionLoan: one(redemptionLoan, {
      fields: [
        depositRedemptionVaultLoanDefaulted.chainId,
        depositRedemptionVaultLoanDefaulted.redemptionVault,
        depositRedemptionVaultLoanDefaulted.depositor,
        depositRedemptionVaultLoanDefaulted.redemptionId,
      ],
      references: [
        redemptionLoan.chainId,
        redemptionLoan.redemptionVault,
        redemptionLoan.depositor,
        redemptionLoan.redemptionId,
      ],
    }),
  }),
);

export const depositRedemptionVaultLoanExtendedRelations = relations(
  depositRedemptionVaultLoanExtended,
  ({ one }) => ({
    rRedemptionVault: one(depositRedemptionVault, {
      fields: [
        depositRedemptionVaultLoanExtended.chainId,
        depositRedemptionVaultLoanExtended.redemptionVault,
      ],
      references: [depositRedemptionVault.chainId, depositRedemptionVault.address],
    }),
    rDepositor: one(depositor, {
      fields: [
        depositRedemptionVaultLoanExtended.chainId,
        depositRedemptionVaultLoanExtended.depositor,
      ],
      references: [depositor.chainId, depositor.address],
    }),
    rRedemption: one(redemption, {
      fields: [
        depositRedemptionVaultLoanExtended.chainId,
        depositRedemptionVaultLoanExtended.redemptionVault,
        depositRedemptionVaultLoanExtended.depositor,
        depositRedemptionVaultLoanExtended.redemptionId,
      ],
      references: [
        redemption.chainId,
        redemption.redemptionVault,
        redemption.depositor,
        redemption.redemptionId,
      ],
    }),
    rRedemptionLoan: one(redemptionLoan, {
      fields: [
        depositRedemptionVaultLoanExtended.chainId,
        depositRedemptionVaultLoanExtended.redemptionVault,
        depositRedemptionVaultLoanExtended.depositor,
        depositRedemptionVaultLoanExtended.redemptionId,
      ],
      references: [
        redemptionLoan.chainId,
        redemptionLoan.redemptionVault,
        redemptionLoan.depositor,
        redemptionLoan.redemptionId,
      ],
    }),
  }),
);

export const emissionManagerEnabledRelations = relations(emissionManagerEnabled, ({ one }) => ({
  rEmissionManager: one(emissionManager, {
    fields: [emissionManagerEnabled.chainId, emissionManagerEnabled.emissionManager],
    references: [emissionManager.chainId, emissionManager.address],
  }),
}));

export const emissionManagerDisabledRelations = relations(emissionManagerDisabled, ({ one }) => ({
  rEmissionManager: one(emissionManager, {
    fields: [emissionManagerDisabled.chainId, emissionManagerDisabled.emissionManager],
    references: [emissionManager.chainId, emissionManager.address],
  }),
}));

export const emissionManagerBackingChangedRelations = relations(
  emissionManagerBackingChanged,
  ({ one }) => ({
    rEmissionManager: one(emissionManager, {
      fields: [
        emissionManagerBackingChanged.chainId,
        emissionManagerBackingChanged.emissionManager,
      ],
      references: [emissionManager.chainId, emissionManager.address],
    }),
  }),
);

export const emissionManagerBackingUpdatedRelations = relations(
  emissionManagerBackingUpdated,
  ({ one }) => ({
    rEmissionManager: one(emissionManager, {
      fields: [
        emissionManagerBackingUpdated.chainId,
        emissionManagerBackingUpdated.emissionManager,
      ],
      references: [emissionManager.chainId, emissionManager.address],
    }),
  }),
);

export const emissionManagerBaseRateChangedRelations = relations(
  emissionManagerBaseRateChanged,
  ({ one }) => ({
    rEmissionManager: one(emissionManager, {
      fields: [
        emissionManagerBaseRateChanged.chainId,
        emissionManagerBaseRateChanged.emissionManager,
      ],
      references: [emissionManager.chainId, emissionManager.address],
    }),
  }),
);

export const emissionManagerBondContractsSetRelations = relations(
  emissionManagerBondContractsSet,
  ({ one }) => ({
    rEmissionManager: one(emissionManager, {
      fields: [
        emissionManagerBondContractsSet.chainId,
        emissionManagerBondContractsSet.emissionManager,
      ],
      references: [emissionManager.chainId, emissionManager.address],
    }),
    rAuctioneer: one(auctioneer, {
      fields: [
        emissionManagerBondContractsSet.chainId,
        emissionManagerBondContractsSet.bondMarketAuctioneer,
      ],
      references: [auctioneer.chainId, auctioneer.address],
    }),
  }),
);

export const emissionManagerBondMarketCapacityScalarChangedRelations = relations(
  emissionManagerBondMarketCapacityScalarChanged,
  ({ one }) => ({
    rEmissionManager: one(emissionManager, {
      fields: [
        emissionManagerBondMarketCapacityScalarChanged.chainId,
        emissionManagerBondMarketCapacityScalarChanged.emissionManager,
      ],
      references: [emissionManager.chainId, emissionManager.address],
    }),
  }),
);

export const emissionManagerBondMarketCreationFailedRelations = relations(
  emissionManagerBondMarketCreationFailed,
  ({ one }) => ({
    rEmissionManager: one(emissionManager, {
      fields: [
        emissionManagerBondMarketCreationFailed.chainId,
        emissionManagerBondMarketCreationFailed.emissionManager,
      ],
      references: [emissionManager.chainId, emissionManager.address],
    }),
  }),
);

export const emissionManagerConvertibleDepositAuctioneerSetRelations = relations(
  emissionManagerConvertibleDepositAuctioneerSet,
  ({ one }) => ({
    rEmissionManager: one(emissionManager, {
      fields: [
        emissionManagerConvertibleDepositAuctioneerSet.chainId,
        emissionManagerConvertibleDepositAuctioneerSet.emissionManager,
      ],
      references: [emissionManager.chainId, emissionManager.address],
    }),
    rAuctioneer: one(auctioneer, {
      fields: [
        emissionManagerConvertibleDepositAuctioneerSet.chainId,
        emissionManagerConvertibleDepositAuctioneerSet.convertibleDepositAuctioneer,
      ],
      references: [auctioneer.chainId, auctioneer.address],
    }),
  }),
);

export const emissionManagerMinPriceScalarChangedRelations = relations(
  emissionManagerMinPriceScalarChanged,
  ({ one }) => ({
    rEmissionManager: one(emissionManager, {
      fields: [
        emissionManagerMinPriceScalarChanged.chainId,
        emissionManagerMinPriceScalarChanged.emissionManager,
      ],
      references: [emissionManager.chainId, emissionManager.address],
    }),
  }),
);

export const emissionManagerMinimumPremiumChangedRelations = relations(
  emissionManagerMinimumPremiumChanged,
  ({ one }) => ({
    rEmissionManager: one(emissionManager, {
      fields: [
        emissionManagerMinimumPremiumChanged.chainId,
        emissionManagerMinimumPremiumChanged.emissionManager,
      ],
      references: [emissionManager.chainId, emissionManager.address],
    }),
  }),
);

export const emissionManagerRestartTimeframeChangedRelations = relations(
  emissionManagerRestartTimeframeChanged,
  ({ one }) => ({
    rEmissionManager: one(emissionManager, {
      fields: [
        emissionManagerRestartTimeframeChanged.chainId,
        emissionManagerRestartTimeframeChanged.emissionManager,
      ],
      references: [emissionManager.chainId, emissionManager.address],
    }),
  }),
);

export const emissionManagerBondMarketCreatedRelations = relations(
  emissionManagerBondMarketCreated,
  ({ one }) => ({
    rEmissionManager: one(emissionManager, {
      fields: [
        emissionManagerBondMarketCreated.chainId,
        emissionManagerBondMarketCreated.emissionManager,
      ],
      references: [emissionManager.chainId, emissionManager.address],
    }),
  }),
);

export const emissionManagerTickSizeChangedRelations = relations(
  emissionManagerTickSizeChanged,
  ({ one }) => ({
    rEmissionManager: one(emissionManager, {
      fields: [
        emissionManagerTickSizeChanged.chainId,
        emissionManagerTickSizeChanged.emissionManager,
      ],
      references: [emissionManager.chainId, emissionManager.address],
    }),
  }),
);

export const emissionManagerVestingPeriodChangedRelations = relations(
  emissionManagerVestingPeriodChanged,
  ({ one }) => ({
    rEmissionManager: one(emissionManager, {
      fields: [
        emissionManagerVestingPeriodChanged.chainId,
        emissionManagerVestingPeriodChanged.emissionManager,
      ],
      references: [emissionManager.chainId, emissionManager.address],
    }),
  }),
);

// Snapshot Relations
export const auctioneerSnapshotRelations = relations(auctioneerSnapshot, ({ one, many }) => ({
  rAuctioneer: one(auctioneer, {
    fields: [auctioneerSnapshot.chainId, auctioneerSnapshot.auctioneer],
    references: [auctioneer.chainId, auctioneer.address],
  }),
  depositPeriodSnapshots: many(auctioneerDepositPeriodSnapshot),
}));

export const auctioneerDepositPeriodSnapshotRelations = relations(
  auctioneerDepositPeriodSnapshot,
  ({ one }) => ({
    rAuctioneerSnapshot: one(auctioneerSnapshot, {
      fields: [
        auctioneerDepositPeriodSnapshot.chainId,
        auctioneerDepositPeriodSnapshot.block,
        auctioneerDepositPeriodSnapshot.auctioneer,
      ],
      references: [
        auctioneerSnapshot.chainId,
        auctioneerSnapshot.block,
        auctioneerSnapshot.auctioneer,
      ],
    }),
    rAuctioneer: one(auctioneer, {
      fields: [auctioneerDepositPeriodSnapshot.chainId, auctioneerDepositPeriodSnapshot.auctioneer],
      references: [auctioneer.chainId, auctioneer.address],
    }),
    rAssetPeriod: one(depositAssetPeriod, {
      fields: [
        auctioneerDepositPeriodSnapshot.chainId,
        auctioneerDepositPeriodSnapshot.depositAsset,
        auctioneerDepositPeriodSnapshot.depositPeriod,
      ],
      references: [
        depositAssetPeriod.chainId,
        depositAssetPeriod.depositAsset,
        depositAssetPeriod.depositPeriod,
      ],
    }),
    rAuctioneerDepositPeriod: one(auctioneerDepositPeriod, {
      fields: [
        auctioneerDepositPeriodSnapshot.chainId,
        auctioneerDepositPeriodSnapshot.auctioneer,
        auctioneerDepositPeriodSnapshot.depositAsset,
        auctioneerDepositPeriodSnapshot.depositPeriod,
      ],
      references: [
        auctioneerDepositPeriod.chainId,
        auctioneerDepositPeriod.auctioneer,
        auctioneerDepositPeriod.depositAsset,
        auctioneerDepositPeriod.depositPeriod,
      ],
    }),
  }),
);

export const depositFacilityAssetSnapshotRelations = relations(
  depositFacilityAssetSnapshot,
  ({ one }) => ({
    rFacility: one(depositFacility, {
      fields: [depositFacilityAssetSnapshot.chainId, depositFacilityAssetSnapshot.facility],
      references: [depositFacility.chainId, depositFacility.address],
    }),
    rDepositAsset: one(depositAsset, {
      fields: [depositFacilityAssetSnapshot.chainId, depositFacilityAssetSnapshot.depositAsset],
      references: [depositAsset.chainId, depositAsset.asset],
    }),
  }),
);

// ============================================================================
// Relations
// ============================================================================

export const assetRelations = relations(asset, ({ many }) => ({
  depositAssets: many(depositAsset),
}));

export const depositAssetRelations = relations(depositAsset, ({ one, many }) => ({
  rAsset: one(asset, {
    fields: [depositAsset.chainId, depositAsset.asset],
    references: [asset.chainId, asset.address],
  }),
  periods: many(depositAssetPeriod),
  auctioneers: many(auctioneer),
}));

export const depositAssetPeriodRelations = relations(depositAssetPeriod, ({ one, many }) => ({
  rDepositAsset: one(depositAsset, {
    fields: [depositAssetPeriod.chainId, depositAssetPeriod.depositAsset],
    references: [depositAsset.chainId, depositAsset.asset],
  }),
  positions: many(convertibleDepositPosition),
  auctioneerDepositPeriods: many(auctioneerDepositPeriod),
  receiptTokens: many(receiptToken),
  redemptions: many(redemption),
}));

export const auctioneerRelations = relations(auctioneer, ({ one, many }) => ({
  rDepositAsset: one(depositAsset, {
    fields: [auctioneer.chainId, auctioneer.depositAsset],
    references: [depositAsset.chainId, depositAsset.asset],
  }),
  rEmissionManagers: many(emissionManager),
  depositPeriods: many(auctioneerDepositPeriod),
  enabledEvents: many(convertibleDepositAuctioneerEnabled),
  disabledEvents: many(convertibleDepositAuctioneerDisabled),
  tickStepUpdatedEvents: many(convertibleDepositAuctioneerTickStepUpdated),
  auctionTrackingPeriodUpdatedEvents: many(
    convertibleDepositAuctioneerAuctionTrackingPeriodUpdated,
  ),
  depositPeriodDisableQueuedEvents: many(convertibleDepositAuctioneerDepositPeriodDisableQueued),
  depositPeriodDisabledEvents: many(convertibleDepositAuctioneerDepositPeriodDisabled),
  depositPeriodEnableQueuedEvents: many(convertibleDepositAuctioneerDepositPeriodEnableQueued),
  depositPeriodEnabledEvents: many(convertibleDepositAuctioneerDepositPeriodEnabled),
  auctionParametersUpdatedEvents: many(convertibleDepositAuctioneerAuctionParametersUpdated),
  auctionResultEvents: many(convertibleDepositAuctioneerAuctionResult),
  snapshots: many(auctioneerSnapshot),
}));

export const auctioneerDepositPeriodRelations = relations(
  auctioneerDepositPeriod,
  ({ one, many }) => ({
    rAuctioneer: one(auctioneer, {
      fields: [auctioneerDepositPeriod.chainId, auctioneerDepositPeriod.auctioneer],
      references: [auctioneer.chainId, auctioneer.address],
    }),
    rAssetPeriod: one(depositAssetPeriod, {
      fields: [
        auctioneerDepositPeriod.chainId,
        auctioneerDepositPeriod.depositAsset,
        auctioneerDepositPeriod.depositPeriod,
      ],
      references: [
        depositAssetPeriod.chainId,
        depositAssetPeriod.depositAsset,
        depositAssetPeriod.depositPeriod,
      ],
    }),
    bidEvents: many(convertibleDepositAuctioneerBid),
    snapshots: many(auctioneerDepositPeriodSnapshot, {
      relationName: "auctioneerDepositPeriodSnapshots",
    }),
  }),
);

export const depositFacilityRelations = relations(depositFacility, ({ many }) => ({
  positions: many(convertibleDepositPosition),
  assets: many(depositFacilityAsset),
  assetSnapshots: many(depositFacilityAssetSnapshot),
  enabledEvents: many(convertibleDepositFacilityEnabled),
  disabledEvents: many(convertibleDepositFacilityDisabled),
  operatorAuthorizedEvents: many(convertibleDepositFacilityOperatorAuthorized),
  operatorDeauthorizedEvents: many(convertibleDepositFacilityOperatorDeauthorized),
  claimAllYieldFailedEvents: many(convertibleDepositFacilityClaimAllYieldFailed),
}));

export const depositFacilityAssetRelations = relations(depositFacilityAsset, ({ one, many }) => ({
  rFacility: one(depositFacility, {
    fields: [depositFacilityAsset.chainId, depositFacilityAsset.facility],
    references: [depositFacility.chainId, depositFacility.address],
  }),
  rDepositAsset: one(depositAsset, {
    fields: [depositFacilityAsset.chainId, depositFacilityAsset.depositAsset],
    references: [depositAsset.chainId, depositAsset.asset],
  }),
  periods: many(depositFacilityAssetPeriod),
  commitCancelledEvents: many(convertibleDepositFacilityAssetCommitCancelled),
  commitWithdrawnEvents: many(convertibleDepositFacilityAssetCommitWithdrawn),
  committedEvents: many(convertibleDepositFacilityAssetCommitted),
  claimedYieldEvents: many(convertibleDepositFacilityClaimedYield),
}));

export const depositFacilityAssetPeriodRelations = relations(
  depositFacilityAssetPeriod,
  ({ one, many }) => ({
    rFacilityAsset: one(depositFacilityAsset, {
      fields: [
        depositFacilityAssetPeriod.chainId,
        depositFacilityAssetPeriod.facility,
        depositFacilityAssetPeriod.depositAsset,
      ],
      references: [
        depositFacilityAsset.chainId,
        depositFacilityAsset.facility,
        depositFacilityAsset.depositAsset,
      ],
    }),
    rFacility: one(depositFacility, {
      fields: [depositFacilityAssetPeriod.chainId, depositFacilityAssetPeriod.facility],
      references: [depositFacility.chainId, depositFacility.address],
    }),
    rAssetPeriod: one(depositAssetPeriod, {
      fields: [
        depositFacilityAssetPeriod.chainId,
        depositFacilityAssetPeriod.depositAsset,
        depositFacilityAssetPeriod.depositPeriod,
      ],
      references: [
        depositAssetPeriod.chainId,
        depositAssetPeriod.depositAsset,
        depositAssetPeriod.depositPeriod,
      ],
    }),
    createdDepositEvents: many(convertibleDepositFacilityCreatedDeposit),
    reclaimedEvents: many(convertibleDepositFacilityReclaimed),
    convertedDepositsEvents: many(convertibleDepositFacilityConvertedDeposits),
  }),
);

export const depositorRelations = relations(depositor, ({ many }) => ({
  positions: many(convertibleDepositPosition),
  createdDepositEvents: many(convertibleDepositFacilityCreatedDeposit),
  reclaimedEvents: many(convertibleDepositFacilityReclaimed),
  bidEvents: many(convertibleDepositAuctioneerBid),
  convertedDepositEvents: many(convertibleDepositFacilityConvertedDeposit),
  redemptions: many(redemption),
  redemptionStartedEvents: many(depositRedemptionVaultRedemptionStarted),
  redemptionFinishedEvents: many(depositRedemptionVaultRedemptionFinished),
  redemptionCancelledEvents: many(depositRedemptionVaultRedemptionCancelled),
  loanCreatedEvents: many(depositRedemptionVaultLoanCreated),
  loanRepaidEvents: many(depositRedemptionVaultLoanRepaid),
  loanDefaultedEvents: many(depositRedemptionVaultLoanDefaulted),
  loanExtendedEvents: many(depositRedemptionVaultLoanExtended),
}));

export const convertibleDepositPositionRelations = relations(
  convertibleDepositPosition,
  ({ one, many }) => ({
    rFacility: one(depositFacility, {
      fields: [convertibleDepositPosition.chainId, convertibleDepositPosition.facility],
      references: [depositFacility.chainId, depositFacility.address],
    }),
    rDepositor: one(depositor, {
      fields: [convertibleDepositPosition.chainId, convertibleDepositPosition.depositor],
      references: [depositor.chainId, depositor.address],
    }),
    rAssetPeriod: one(depositAssetPeriod, {
      fields: [
        convertibleDepositPosition.chainId,
        convertibleDepositPosition.depositAsset,
        convertibleDepositPosition.depositPeriod,
      ],
      references: [
        depositAssetPeriod.chainId,
        depositAssetPeriod.depositAsset,
        depositAssetPeriod.depositPeriod,
      ],
    }),
    rReceiptToken: one(receiptToken, {
      fields: [
        convertibleDepositPosition.chainId,
        convertibleDepositPosition.receiptTokenManager,
        convertibleDepositPosition.receiptTokenId,
      ],
      references: [
        receiptToken.chainId,
        receiptToken.receiptTokenManager,
        receiptToken.receiptTokenId,
      ],
    }),
    createdDepositEvents: many(convertibleDepositFacilityCreatedDeposit),
    bidEvents: many(convertibleDepositAuctioneerBid),
    convertedDepositEvents: many(convertibleDepositFacilityConvertedDeposit),
    // Note: redemptions relation is omitted because positionId is optional in redemption
    // Use the reverse relation from redemption.position instead
  }),
);

// Event Relations
export const convertibleDepositAuctioneerEnabledRelations = relations(
  convertibleDepositAuctioneerEnabled,
  ({ one }) => ({
    rAuctioneer: one(auctioneer, {
      fields: [
        convertibleDepositAuctioneerEnabled.chainId,
        convertibleDepositAuctioneerEnabled.auctioneer,
      ],
      references: [auctioneer.chainId, auctioneer.address],
    }),
  }),
);

export const convertibleDepositAuctioneerDisabledRelations = relations(
  convertibleDepositAuctioneerDisabled,
  ({ one }) => ({
    rAuctioneer: one(auctioneer, {
      fields: [
        convertibleDepositAuctioneerDisabled.chainId,
        convertibleDepositAuctioneerDisabled.auctioneer,
      ],
      references: [auctioneer.chainId, auctioneer.address],
    }),
  }),
);

export const convertibleDepositFacilityEnabledRelations = relations(
  convertibleDepositFacilityEnabled,
  ({ one }) => ({
    rFacility: one(depositFacility, {
      fields: [
        convertibleDepositFacilityEnabled.chainId,
        convertibleDepositFacilityEnabled.facility,
      ],
      references: [depositFacility.chainId, depositFacility.address],
    }),
  }),
);

export const convertibleDepositFacilityDisabledRelations = relations(
  convertibleDepositFacilityDisabled,
  ({ one }) => ({
    rFacility: one(depositFacility, {
      fields: [
        convertibleDepositFacilityDisabled.chainId,
        convertibleDepositFacilityDisabled.facility,
      ],
      references: [depositFacility.chainId, depositFacility.address],
    }),
  }),
);

export const convertibleDepositAuctioneerTickStepUpdatedRelations = relations(
  convertibleDepositAuctioneerTickStepUpdated,
  ({ one }) => ({
    rAuctioneer: one(auctioneer, {
      fields: [
        convertibleDepositAuctioneerTickStepUpdated.chainId,
        convertibleDepositAuctioneerTickStepUpdated.auctioneer,
      ],
      references: [auctioneer.chainId, auctioneer.address],
    }),
  }),
);

export const convertibleDepositAuctioneerAuctionTrackingPeriodUpdatedRelations = relations(
  convertibleDepositAuctioneerAuctionTrackingPeriodUpdated,
  ({ one }) => ({
    rAuctioneer: one(auctioneer, {
      fields: [
        convertibleDepositAuctioneerAuctionTrackingPeriodUpdated.chainId,
        convertibleDepositAuctioneerAuctionTrackingPeriodUpdated.auctioneer,
      ],
      references: [auctioneer.chainId, auctioneer.address],
    }),
  }),
);

export const convertibleDepositFacilityOperatorAuthorizedRelations = relations(
  convertibleDepositFacilityOperatorAuthorized,
  ({ one }) => ({
    rFacility: one(depositFacility, {
      fields: [
        convertibleDepositFacilityOperatorAuthorized.chainId,
        convertibleDepositFacilityOperatorAuthorized.facility,
      ],
      references: [depositFacility.chainId, depositFacility.address],
    }),
  }),
);

export const convertibleDepositFacilityOperatorDeauthorizedRelations = relations(
  convertibleDepositFacilityOperatorDeauthorized,
  ({ one }) => ({
    rFacility: one(depositFacility, {
      fields: [
        convertibleDepositFacilityOperatorDeauthorized.chainId,
        convertibleDepositFacilityOperatorDeauthorized.facility,
      ],
      references: [depositFacility.chainId, depositFacility.address],
    }),
  }),
);

export const convertibleDepositAuctioneerDepositPeriodDisableQueuedRelations = relations(
  convertibleDepositAuctioneerDepositPeriodDisableQueued,
  ({ one }) => ({
    rAuctioneer: one(auctioneer, {
      fields: [
        convertibleDepositAuctioneerDepositPeriodDisableQueued.chainId,
        convertibleDepositAuctioneerDepositPeriodDisableQueued.auctioneer,
      ],
      references: [auctioneer.chainId, auctioneer.address],
    }),
    rAssetPeriod: one(depositAssetPeriod, {
      fields: [
        convertibleDepositAuctioneerDepositPeriodDisableQueued.chainId,
        convertibleDepositAuctioneerDepositPeriodDisableQueued.depositAsset,
        convertibleDepositAuctioneerDepositPeriodDisableQueued.depositPeriod,
      ],
      references: [
        depositAssetPeriod.chainId,
        depositAssetPeriod.depositAsset,
        depositAssetPeriod.depositPeriod,
      ],
    }),
  }),
);

export const convertibleDepositAuctioneerDepositPeriodDisabledRelations = relations(
  convertibleDepositAuctioneerDepositPeriodDisabled,
  ({ one }) => ({
    rAuctioneer: one(auctioneer, {
      fields: [
        convertibleDepositAuctioneerDepositPeriodDisabled.chainId,
        convertibleDepositAuctioneerDepositPeriodDisabled.auctioneer,
      ],
      references: [auctioneer.chainId, auctioneer.address],
    }),
    rAssetPeriod: one(depositAssetPeriod, {
      fields: [
        convertibleDepositAuctioneerDepositPeriodDisabled.chainId,
        convertibleDepositAuctioneerDepositPeriodDisabled.depositAsset,
        convertibleDepositAuctioneerDepositPeriodDisabled.depositPeriod,
      ],
      references: [
        depositAssetPeriod.chainId,
        depositAssetPeriod.depositAsset,
        depositAssetPeriod.depositPeriod,
      ],
    }),
  }),
);

export const convertibleDepositAuctioneerDepositPeriodEnableQueuedRelations = relations(
  convertibleDepositAuctioneerDepositPeriodEnableQueued,
  ({ one }) => ({
    rAuctioneer: one(auctioneer, {
      fields: [
        convertibleDepositAuctioneerDepositPeriodEnableQueued.chainId,
        convertibleDepositAuctioneerDepositPeriodEnableQueued.auctioneer,
      ],
      references: [auctioneer.chainId, auctioneer.address],
    }),
    rAssetPeriod: one(depositAssetPeriod, {
      fields: [
        convertibleDepositAuctioneerDepositPeriodEnableQueued.chainId,
        convertibleDepositAuctioneerDepositPeriodEnableQueued.depositAsset,
        convertibleDepositAuctioneerDepositPeriodEnableQueued.depositPeriod,
      ],
      references: [
        depositAssetPeriod.chainId,
        depositAssetPeriod.depositAsset,
        depositAssetPeriod.depositPeriod,
      ],
    }),
  }),
);

export const convertibleDepositAuctioneerDepositPeriodEnabledRelations = relations(
  convertibleDepositAuctioneerDepositPeriodEnabled,
  ({ one }) => ({
    rAuctioneer: one(auctioneer, {
      fields: [
        convertibleDepositAuctioneerDepositPeriodEnabled.chainId,
        convertibleDepositAuctioneerDepositPeriodEnabled.auctioneer,
      ],
      references: [auctioneer.chainId, auctioneer.address],
    }),
    rAssetPeriod: one(depositAssetPeriod, {
      fields: [
        convertibleDepositAuctioneerDepositPeriodEnabled.chainId,
        convertibleDepositAuctioneerDepositPeriodEnabled.depositAsset,
        convertibleDepositAuctioneerDepositPeriodEnabled.depositPeriod,
      ],
      references: [
        depositAssetPeriod.chainId,
        depositAssetPeriod.depositAsset,
        depositAssetPeriod.depositPeriod,
      ],
    }),
  }),
);

export const convertibleDepositFacilityAssetCommitCancelledRelations = relations(
  convertibleDepositFacilityAssetCommitCancelled,
  ({ one }) => ({
    rFacility: one(depositFacility, {
      fields: [
        convertibleDepositFacilityAssetCommitCancelled.chainId,
        convertibleDepositFacilityAssetCommitCancelled.facility,
      ],
      references: [depositFacility.chainId, depositFacility.address],
    }),
    rDepositAsset: one(depositAsset, {
      fields: [
        convertibleDepositFacilityAssetCommitCancelled.chainId,
        convertibleDepositFacilityAssetCommitCancelled.depositAsset,
      ],
      references: [depositAsset.chainId, depositAsset.asset],
    }),
    rFacilityAsset: one(depositFacilityAsset, {
      fields: [
        convertibleDepositFacilityAssetCommitCancelled.chainId,
        convertibleDepositFacilityAssetCommitCancelled.facility,
        convertibleDepositFacilityAssetCommitCancelled.depositAsset,
      ],
      references: [
        depositFacilityAsset.chainId,
        depositFacilityAsset.facility,
        depositFacilityAsset.depositAsset,
      ],
    }),
  }),
);

export const convertibleDepositFacilityAssetCommitWithdrawnRelations = relations(
  convertibleDepositFacilityAssetCommitWithdrawn,
  ({ one }) => ({
    rFacility: one(depositFacility, {
      fields: [
        convertibleDepositFacilityAssetCommitWithdrawn.chainId,
        convertibleDepositFacilityAssetCommitWithdrawn.facility,
      ],
      references: [depositFacility.chainId, depositFacility.address],
    }),
    rDepositAsset: one(depositAsset, {
      fields: [
        convertibleDepositFacilityAssetCommitWithdrawn.chainId,
        convertibleDepositFacilityAssetCommitWithdrawn.depositAsset,
      ],
      references: [depositAsset.chainId, depositAsset.asset],
    }),
    rFacilityAsset: one(depositFacilityAsset, {
      fields: [
        convertibleDepositFacilityAssetCommitWithdrawn.chainId,
        convertibleDepositFacilityAssetCommitWithdrawn.facility,
        convertibleDepositFacilityAssetCommitWithdrawn.depositAsset,
      ],
      references: [
        depositFacilityAsset.chainId,
        depositFacilityAsset.facility,
        depositFacilityAsset.depositAsset,
      ],
    }),
  }),
);

export const convertibleDepositFacilityAssetCommittedRelations = relations(
  convertibleDepositFacilityAssetCommitted,
  ({ one }) => ({
    rFacility: one(depositFacility, {
      fields: [
        convertibleDepositFacilityAssetCommitted.chainId,
        convertibleDepositFacilityAssetCommitted.facility,
      ],
      references: [depositFacility.chainId, depositFacility.address],
    }),
    rDepositAsset: one(depositAsset, {
      fields: [
        convertibleDepositFacilityAssetCommitted.chainId,
        convertibleDepositFacilityAssetCommitted.depositAsset,
      ],
      references: [depositAsset.chainId, depositAsset.asset],
    }),
    rFacilityAsset: one(depositFacilityAsset, {
      fields: [
        convertibleDepositFacilityAssetCommitted.chainId,
        convertibleDepositFacilityAssetCommitted.facility,
        convertibleDepositFacilityAssetCommitted.depositAsset,
      ],
      references: [
        depositFacilityAsset.chainId,
        depositFacilityAsset.facility,
        depositFacilityAsset.depositAsset,
      ],
    }),
  }),
);

export const convertibleDepositFacilityAssetPeriodReclaimRateSetRelations = relations(
  convertibleDepositFacilityAssetPeriodReclaimRateSet,
  ({ one }) => ({
    rFacility: one(depositFacility, {
      fields: [
        convertibleDepositFacilityAssetPeriodReclaimRateSet.chainId,
        convertibleDepositFacilityAssetPeriodReclaimRateSet.facility,
      ],
      references: [depositFacility.chainId, depositFacility.address],
    }),
    rDepositAsset: one(depositAsset, {
      fields: [
        convertibleDepositFacilityAssetPeriodReclaimRateSet.chainId,
        convertibleDepositFacilityAssetPeriodReclaimRateSet.depositAsset,
      ],
      references: [depositAsset.chainId, depositAsset.asset],
    }),
    facilityAssetPeriod: one(depositFacilityAssetPeriod, {
      fields: [
        convertibleDepositFacilityAssetPeriodReclaimRateSet.chainId,
        convertibleDepositFacilityAssetPeriodReclaimRateSet.facility,
        convertibleDepositFacilityAssetPeriodReclaimRateSet.depositAsset,
        convertibleDepositFacilityAssetPeriodReclaimRateSet.depositPeriod,
      ],
      references: [
        depositFacilityAssetPeriod.chainId,
        depositFacilityAssetPeriod.facility,
        depositFacilityAssetPeriod.depositAsset,
        depositFacilityAssetPeriod.depositPeriod,
      ],
    }),
  }),
);

export const convertibleDepositFacilityCreatedDepositRelations = relations(
  convertibleDepositFacilityCreatedDeposit,
  ({ one }) => ({
    rFacility: one(depositFacility, {
      fields: [
        convertibleDepositFacilityCreatedDeposit.chainId,
        convertibleDepositFacilityCreatedDeposit.facility,
      ],
      references: [depositFacility.chainId, depositFacility.address],
    }),
    rDepositAsset: one(depositAsset, {
      fields: [
        convertibleDepositFacilityCreatedDeposit.chainId,
        convertibleDepositFacilityCreatedDeposit.depositAsset,
      ],
      references: [depositAsset.chainId, depositAsset.asset],
    }),
    facilityAssetPeriod: one(depositFacilityAssetPeriod, {
      fields: [
        convertibleDepositFacilityCreatedDeposit.chainId,
        convertibleDepositFacilityCreatedDeposit.facility,
        convertibleDepositFacilityCreatedDeposit.depositAsset,
        convertibleDepositFacilityCreatedDeposit.depositPeriod,
      ],
      references: [
        depositFacilityAssetPeriod.chainId,
        depositFacilityAssetPeriod.facility,
        depositFacilityAssetPeriod.depositAsset,
        depositFacilityAssetPeriod.depositPeriod,
      ],
    }),
    rDepositor: one(depositor, {
      fields: [
        convertibleDepositFacilityCreatedDeposit.chainId,
        convertibleDepositFacilityCreatedDeposit.depositor,
      ],
      references: [depositor.chainId, depositor.address],
    }),
    rPosition: one(convertibleDepositPosition, {
      fields: [
        convertibleDepositFacilityCreatedDeposit.chainId,
        convertibleDepositFacilityCreatedDeposit.positionId,
      ],
      references: [convertibleDepositPosition.chainId, convertibleDepositPosition.positionId],
    }),
  }),
);

export const convertibleDepositFacilityReclaimedRelations = relations(
  convertibleDepositFacilityReclaimed,
  ({ one }) => ({
    rFacility: one(depositFacility, {
      fields: [
        convertibleDepositFacilityReclaimed.chainId,
        convertibleDepositFacilityReclaimed.facility,
      ],
      references: [depositFacility.chainId, depositFacility.address],
    }),
    rDepositAsset: one(depositAsset, {
      fields: [
        convertibleDepositFacilityReclaimed.chainId,
        convertibleDepositFacilityReclaimed.depositAsset,
      ],
      references: [depositAsset.chainId, depositAsset.asset],
    }),
    facilityAssetPeriod: one(depositFacilityAssetPeriod, {
      fields: [
        convertibleDepositFacilityReclaimed.chainId,
        convertibleDepositFacilityReclaimed.facility,
        convertibleDepositFacilityReclaimed.depositAsset,
        convertibleDepositFacilityReclaimed.depositPeriod,
      ],
      references: [
        depositFacilityAssetPeriod.chainId,
        depositFacilityAssetPeriod.facility,
        depositFacilityAssetPeriod.depositAsset,
        depositFacilityAssetPeriod.depositPeriod,
      ],
    }),
    rDepositor: one(depositor, {
      fields: [
        convertibleDepositFacilityReclaimed.chainId,
        convertibleDepositFacilityReclaimed.depositor,
      ],
      references: [depositor.chainId, depositor.address],
    }),
  }),
);

export const convertibleDepositAuctioneerBidRelations = relations(
  convertibleDepositAuctioneerBid,
  ({ one }) => ({
    rAuctioneer: one(auctioneer, {
      fields: [convertibleDepositAuctioneerBid.chainId, convertibleDepositAuctioneerBid.auctioneer],
      references: [auctioneer.chainId, auctioneer.address],
    }),
    rAuctioneerDepositPeriod: one(auctioneerDepositPeriod, {
      fields: [
        convertibleDepositAuctioneerBid.chainId,
        convertibleDepositAuctioneerBid.auctioneer,
        convertibleDepositAuctioneerBid.depositAsset,
        convertibleDepositAuctioneerBid.depositPeriod,
      ],
      references: [
        auctioneerDepositPeriod.chainId,
        auctioneerDepositPeriod.auctioneer,
        auctioneerDepositPeriod.depositAsset,
        auctioneerDepositPeriod.depositPeriod,
      ],
    }),
    rAssetPeriod: one(depositAssetPeriod, {
      fields: [
        convertibleDepositAuctioneerBid.chainId,
        convertibleDepositAuctioneerBid.depositAsset,
        convertibleDepositAuctioneerBid.depositPeriod,
      ],
      references: [
        depositAssetPeriod.chainId,
        depositAssetPeriod.depositAsset,
        depositAssetPeriod.depositPeriod,
      ],
    }),
    rDepositor: one(depositor, {
      fields: [convertibleDepositAuctioneerBid.chainId, convertibleDepositAuctioneerBid.depositor],
      references: [depositor.chainId, depositor.address],
    }),
    rPosition: one(convertibleDepositPosition, {
      fields: [convertibleDepositAuctioneerBid.chainId, convertibleDepositAuctioneerBid.positionId],
      references: [convertibleDepositPosition.chainId, convertibleDepositPosition.positionId],
    }),
  }),
);

export const convertibleDepositFacilityConvertedDepositsRelations = relations(
  convertibleDepositFacilityConvertedDeposits,
  ({ one, many }) => ({
    rFacility: one(depositFacility, {
      fields: [
        convertibleDepositFacilityConvertedDeposits.chainId,
        convertibleDepositFacilityConvertedDeposits.facility,
      ],
      references: [depositFacility.chainId, depositFacility.address],
    }),
    rDepositAsset: one(depositAsset, {
      fields: [
        convertibleDepositFacilityConvertedDeposits.chainId,
        convertibleDepositFacilityConvertedDeposits.depositAsset,
      ],
      references: [depositAsset.chainId, depositAsset.asset],
    }),
    facilityAssetPeriod: one(depositFacilityAssetPeriod, {
      fields: [
        convertibleDepositFacilityConvertedDeposits.chainId,
        convertibleDepositFacilityConvertedDeposits.facility,
        convertibleDepositFacilityConvertedDeposits.depositAsset,
        convertibleDepositFacilityConvertedDeposits.depositPeriod,
      ],
      references: [
        depositFacilityAssetPeriod.chainId,
        depositFacilityAssetPeriod.facility,
        depositFacilityAssetPeriod.depositAsset,
        depositFacilityAssetPeriod.depositPeriod,
      ],
    }),
    convertedDeposits: many(convertibleDepositFacilityConvertedDeposit),
  }),
);

export const convertibleDepositAuctioneerAuctionParametersUpdatedRelations = relations(
  convertibleDepositAuctioneerAuctionParametersUpdated,
  ({ one }) => ({
    rAuctioneer: one(auctioneer, {
      fields: [
        convertibleDepositAuctioneerAuctionParametersUpdated.chainId,
        convertibleDepositAuctioneerAuctionParametersUpdated.auctioneer,
      ],
      references: [auctioneer.chainId, auctioneer.address],
    }),
    rDepositAsset: one(depositAsset, {
      fields: [
        convertibleDepositAuctioneerAuctionParametersUpdated.chainId,
        convertibleDepositAuctioneerAuctionParametersUpdated.depositAsset,
      ],
      references: [depositAsset.chainId, depositAsset.asset],
    }),
  }),
);

export const convertibleDepositAuctioneerAuctionResultRelations = relations(
  convertibleDepositAuctioneerAuctionResult,
  ({ one }) => ({
    rAuctioneer: one(auctioneer, {
      fields: [
        convertibleDepositAuctioneerAuctionResult.chainId,
        convertibleDepositAuctioneerAuctionResult.auctioneer,
      ],
      references: [auctioneer.chainId, auctioneer.address],
    }),
    rDepositAsset: one(depositAsset, {
      fields: [
        convertibleDepositAuctioneerAuctionResult.chainId,
        convertibleDepositAuctioneerAuctionResult.depositAsset,
      ],
      references: [depositAsset.chainId, depositAsset.asset],
    }),
  }),
);

export const convertibleDepositFacilityClaimedYieldRelations = relations(
  convertibleDepositFacilityClaimedYield,
  ({ one }) => ({
    rFacility: one(depositFacility, {
      fields: [
        convertibleDepositFacilityClaimedYield.chainId,
        convertibleDepositFacilityClaimedYield.facility,
      ],
      references: [depositFacility.chainId, depositFacility.address],
    }),
    rDepositAsset: one(depositAsset, {
      fields: [
        convertibleDepositFacilityClaimedYield.chainId,
        convertibleDepositFacilityClaimedYield.depositAsset,
      ],
      references: [depositAsset.chainId, depositAsset.asset],
    }),
    rFacilityAsset: one(depositFacilityAsset, {
      fields: [
        convertibleDepositFacilityClaimedYield.chainId,
        convertibleDepositFacilityClaimedYield.facility,
        convertibleDepositFacilityClaimedYield.depositAsset,
      ],
      references: [
        depositFacilityAsset.chainId,
        depositFacilityAsset.facility,
        depositFacilityAsset.depositAsset,
      ],
    }),
  }),
);

export const convertibleDepositFacilityClaimAllYieldFailedRelations = relations(
  convertibleDepositFacilityClaimAllYieldFailed,
  ({ one }) => ({
    rFacility: one(depositFacility, {
      fields: [
        convertibleDepositFacilityClaimAllYieldFailed.chainId,
        convertibleDepositFacilityClaimAllYieldFailed.facility,
      ],
      references: [depositFacility.chainId, depositFacility.address],
    }),
  }),
);

export const convertibleDepositFacilityConvertedDepositRelations = relations(
  convertibleDepositFacilityConvertedDeposit,
  ({ one }) => ({
    rFacility: one(depositFacility, {
      fields: [
        convertibleDepositFacilityConvertedDeposit.chainId,
        convertibleDepositFacilityConvertedDeposit.facility,
      ],
      references: [depositFacility.chainId, depositFacility.address],
    }),
    rDepositAsset: one(depositAsset, {
      fields: [
        convertibleDepositFacilityConvertedDeposit.chainId,
        convertibleDepositFacilityConvertedDeposit.depositAsset,
      ],
      references: [depositAsset.chainId, depositAsset.asset],
    }),
    facilityAssetPeriod: one(depositFacilityAssetPeriod, {
      fields: [
        convertibleDepositFacilityConvertedDeposit.chainId,
        convertibleDepositFacilityConvertedDeposit.facility,
        convertibleDepositFacilityConvertedDeposit.depositAsset,
        convertibleDepositFacilityConvertedDeposit.depositPeriod,
      ],
      references: [
        depositFacilityAssetPeriod.chainId,
        depositFacilityAssetPeriod.facility,
        depositFacilityAssetPeriod.depositAsset,
        depositFacilityAssetPeriod.depositPeriod,
      ],
    }),
    rDepositor: one(depositor, {
      fields: [
        convertibleDepositFacilityConvertedDeposit.chainId,
        convertibleDepositFacilityConvertedDeposit.depositor,
      ],
      references: [depositor.chainId, depositor.address],
    }),
    rPosition: one(convertibleDepositPosition, {
      fields: [
        convertibleDepositFacilityConvertedDeposit.chainId,
        convertibleDepositFacilityConvertedDeposit.positionId,
      ],
      references: [convertibleDepositPosition.chainId, convertibleDepositPosition.positionId],
    }),
    rParentEvent: one(convertibleDepositFacilityConvertedDeposits, {
      fields: [
        convertibleDepositFacilityConvertedDeposit.parentEventChainId,
        convertibleDepositFacilityConvertedDeposit.parentEventBlock,
        convertibleDepositFacilityConvertedDeposit.parentEventLogIndex,
      ],
      references: [
        convertibleDepositFacilityConvertedDeposits.chainId,
        convertibleDepositFacilityConvertedDeposits.block,
        convertibleDepositFacilityConvertedDeposits.logIndex,
      ],
    }),
  }),
);
