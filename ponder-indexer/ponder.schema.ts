import { onchainTable, relations, primaryKey } from "ponder";

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
  })
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
  })
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
  })
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
  })
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
  })
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
  })
);

export const depositor = onchainTable(
  "depositor",
  (t) => ({
    chainId: t.integer().notNull(),
    address: t.hex().notNull(),
  }),
  (table) => ({
    pk: primaryKey({ columns: [table.chainId, table.address] }),
  })
);

export const auctioneerDepositPeriod = onchainTable(
  "auctioneer_deposit_period",
  (t) => ({
    chainId: t.integer().notNull(),
    auctioneer: t.hex().notNull(), // Auctioneer address (FK)
    depositAsset: t.hex().notNull(), // Asset address (FK to depositAssetPeriod)
    depositPeriod: t.integer().notNull(), // Period months (FK to depositAssetPeriod)
    enabled: t.boolean().notNull(),
    // Current tick data (updated on each bid)
    // TODO consider if this is needed? vs having snapshot
    currentTickCapacity: t.bigint(),
    currentTickCapacityDecimal: t.text(), // BigDecimal as text
    currentTickPrice: t.bigint(),
    currentTickPriceDecimal: t.text(), // BigDecimal as text
  }),
  (table) => ({
    pk: primaryKey({
      columns: [table.chainId, table.auctioneer, table.depositAsset, table.depositPeriod],
    }),
  })
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
  })
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
  })
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
  })
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
  })
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
  })
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
  })
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
  })
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
  })
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
  })
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
  })
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
  })
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
  })
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
  })
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
  })
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
  })
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
  })
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
  })
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
  })
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
  })
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
  })
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
  })
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
  })
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
  })
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
    // TODO this PK might not be unique, add index?
    pk: primaryKey({ columns: [table.chainId, table.block, table.logIndex] }),
  })
);

// ============================================================================
// Relations
// ============================================================================

export const assetRelations = relations(asset, ({ many }) => ({
  depositAssets: many(depositAsset),
}));

export const depositAssetRelations = relations(depositAsset, ({ one, many }) => ({
  asset: one(asset, {
    fields: [depositAsset.chainId, depositAsset.asset],
    references: [asset.chainId, asset.address],
  }),
  periods: many(depositAssetPeriod),
  auctioneers: many(auctioneer),
}));

export const depositAssetPeriodRelations = relations(depositAssetPeriod, ({ one, many }) => ({
  depositAsset: one(depositAsset, {
    fields: [depositAssetPeriod.chainId, depositAssetPeriod.depositAsset],
    references: [depositAsset.chainId, depositAsset.asset],
  }),
  positions: many(convertibleDepositPosition),
  auctioneerDepositPeriods: many(auctioneerDepositPeriod),
}));

export const auctioneerRelations = relations(auctioneer, ({ one, many }) => ({
  depositAsset: one(depositAsset, {
    fields: [auctioneer.chainId, auctioneer.depositAsset],
    references: [depositAsset.chainId, depositAsset.asset],
  }),
  depositPeriods: many(auctioneerDepositPeriod),
  enabledEvents: many(convertibleDepositAuctioneerEnabled),
  disabledEvents: many(convertibleDepositAuctioneerDisabled),
  tickStepUpdatedEvents: many(convertibleDepositAuctioneerTickStepUpdated),
  auctionTrackingPeriodUpdatedEvents: many(convertibleDepositAuctioneerAuctionTrackingPeriodUpdated),
  depositPeriodDisableQueuedEvents: many(convertibleDepositAuctioneerDepositPeriodDisableQueued),
  depositPeriodDisabledEvents: many(convertibleDepositAuctioneerDepositPeriodDisabled),
  depositPeriodEnableQueuedEvents: many(convertibleDepositAuctioneerDepositPeriodEnableQueued),
  depositPeriodEnabledEvents: many(convertibleDepositAuctioneerDepositPeriodEnabled),
}));

export const auctioneerDepositPeriodRelations = relations(auctioneerDepositPeriod, ({ one, many }) => ({
  auctioneer: one(auctioneer, {
    fields: [auctioneerDepositPeriod.chainId, auctioneerDepositPeriod.auctioneer],
    references: [auctioneer.chainId, auctioneer.address],
  }),
  assetPeriod: one(depositAssetPeriod, {
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
}));

export const depositFacilityRelations = relations(depositFacility, ({ many }) => ({
  positions: many(convertibleDepositPosition),
  assets: many(depositFacilityAsset),
  enabledEvents: many(convertibleDepositFacilityEnabled),
  disabledEvents: many(convertibleDepositFacilityDisabled),
  operatorAuthorizedEvents: many(convertibleDepositFacilityOperatorAuthorized),
  operatorDeauthorizedEvents: many(convertibleDepositFacilityOperatorDeauthorized),
}));

export const depositFacilityAssetRelations = relations(depositFacilityAsset, ({ one, many }) => ({
  facility: one(depositFacility, {
    fields: [depositFacilityAsset.chainId, depositFacilityAsset.facility],
    references: [depositFacility.chainId, depositFacility.address],
  }),
  depositAsset: one(depositAsset, {
    fields: [depositFacilityAsset.chainId, depositFacilityAsset.depositAsset],
    references: [depositAsset.chainId, depositAsset.asset],
  }),
  periods: many(depositFacilityAssetPeriod),
  commitCancelledEvents: many(convertibleDepositFacilityAssetCommitCancelled),
  commitWithdrawnEvents: many(convertibleDepositFacilityAssetCommitWithdrawn),
  committedEvents: many(convertibleDepositFacilityAssetCommitted),
}));

export const depositFacilityAssetPeriodRelations = relations(
  depositFacilityAssetPeriod,
  ({ one, many }) => ({
    facilityAsset: one(depositFacilityAsset, {
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
    facility: one(depositFacility, {
      fields: [depositFacilityAssetPeriod.chainId, depositFacilityAssetPeriod.facility],
      references: [depositFacility.chainId, depositFacility.address],
    }),
    assetPeriod: one(depositAssetPeriod, {
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
  })
);

export const depositorRelations = relations(depositor, ({ many }) => ({
  positions: many(convertibleDepositPosition),
  createdDepositEvents: many(convertibleDepositFacilityCreatedDeposit),
  reclaimedEvents: many(convertibleDepositFacilityReclaimed),
  bidEvents: many(convertibleDepositAuctioneerBid),
  convertedDepositEvents: many(convertibleDepositFacilityConvertedDeposit),
}));

export const convertibleDepositPositionRelations = relations(
  convertibleDepositPosition,
  ({ one, many }) => ({
    facility: one(depositFacility, {
      fields: [convertibleDepositPosition.chainId, convertibleDepositPosition.facility],
      references: [depositFacility.chainId, depositFacility.address],
    }),
    depositor: one(depositor, {
      fields: [convertibleDepositPosition.chainId, convertibleDepositPosition.depositor],
      references: [depositor.chainId, depositor.address],
    }),
    assetPeriod: one(depositAssetPeriod, {
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
    createdDepositEvents: many(convertibleDepositFacilityCreatedDeposit),
    bidEvents: many(convertibleDepositAuctioneerBid),
    convertedDepositEvents: many(convertibleDepositFacilityConvertedDeposit),
    // ReceiptToken relation will be added when we create that entity
  })
);

// Event Relations
export const convertibleDepositAuctioneerEnabledRelations = relations(
  convertibleDepositAuctioneerEnabled,
  ({ one }) => ({
    auctioneer: one(auctioneer, {
      fields: [convertibleDepositAuctioneerEnabled.chainId, convertibleDepositAuctioneerEnabled.auctioneer],
      references: [auctioneer.chainId, auctioneer.address],
    }),
  })
);

export const convertibleDepositAuctioneerDisabledRelations = relations(
  convertibleDepositAuctioneerDisabled,
  ({ one }) => ({
    auctioneer: one(auctioneer, {
      fields: [convertibleDepositAuctioneerDisabled.chainId, convertibleDepositAuctioneerDisabled.auctioneer],
      references: [auctioneer.chainId, auctioneer.address],
    }),
  })
);

export const convertibleDepositFacilityEnabledRelations = relations(
  convertibleDepositFacilityEnabled,
  ({ one }) => ({
    facility: one(depositFacility, {
      fields: [convertibleDepositFacilityEnabled.chainId, convertibleDepositFacilityEnabled.facility],
      references: [depositFacility.chainId, depositFacility.address],
    }),
  })
);

export const convertibleDepositFacilityDisabledRelations = relations(
  convertibleDepositFacilityDisabled,
  ({ one }) => ({
    facility: one(depositFacility, {
      fields: [convertibleDepositFacilityDisabled.chainId, convertibleDepositFacilityDisabled.facility],
      references: [depositFacility.chainId, depositFacility.address],
    }),
  })
);

export const convertibleDepositAuctioneerTickStepUpdatedRelations = relations(
  convertibleDepositAuctioneerTickStepUpdated,
  ({ one }) => ({
    auctioneer: one(auctioneer, {
      fields: [convertibleDepositAuctioneerTickStepUpdated.chainId, convertibleDepositAuctioneerTickStepUpdated.auctioneer],
      references: [auctioneer.chainId, auctioneer.address],
    }),
  })
);

export const convertibleDepositAuctioneerAuctionTrackingPeriodUpdatedRelations = relations(
  convertibleDepositAuctioneerAuctionTrackingPeriodUpdated,
  ({ one }) => ({
    auctioneer: one(auctioneer, {
      fields: [convertibleDepositAuctioneerAuctionTrackingPeriodUpdated.chainId, convertibleDepositAuctioneerAuctionTrackingPeriodUpdated.auctioneer],
      references: [auctioneer.chainId, auctioneer.address],
    }),
  })
);

export const convertibleDepositFacilityOperatorAuthorizedRelations = relations(
  convertibleDepositFacilityOperatorAuthorized,
  ({ one }) => ({
    facility: one(depositFacility, {
      fields: [convertibleDepositFacilityOperatorAuthorized.chainId, convertibleDepositFacilityOperatorAuthorized.facility],
      references: [depositFacility.chainId, depositFacility.address],
    }),
  })
);

export const convertibleDepositFacilityOperatorDeauthorizedRelations = relations(
  convertibleDepositFacilityOperatorDeauthorized,
  ({ one }) => ({
    facility: one(depositFacility, {
      fields: [convertibleDepositFacilityOperatorDeauthorized.chainId, convertibleDepositFacilityOperatorDeauthorized.facility],
      references: [depositFacility.chainId, depositFacility.address],
    }),
  })
);

export const convertibleDepositAuctioneerDepositPeriodDisableQueuedRelations = relations(
  convertibleDepositAuctioneerDepositPeriodDisableQueued,
  ({ one }) => ({
    auctioneer: one(auctioneer, {
      fields: [convertibleDepositAuctioneerDepositPeriodDisableQueued.chainId, convertibleDepositAuctioneerDepositPeriodDisableQueued.auctioneer],
      references: [auctioneer.chainId, auctioneer.address],
    }),
    assetPeriod: one(depositAssetPeriod, {
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
  })
);

export const convertibleDepositAuctioneerDepositPeriodDisabledRelations = relations(
  convertibleDepositAuctioneerDepositPeriodDisabled,
  ({ one }) => ({
    auctioneer: one(auctioneer, {
      fields: [convertibleDepositAuctioneerDepositPeriodDisabled.chainId, convertibleDepositAuctioneerDepositPeriodDisabled.auctioneer],
      references: [auctioneer.chainId, auctioneer.address],
    }),
    assetPeriod: one(depositAssetPeriod, {
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
  })
);

export const convertibleDepositAuctioneerDepositPeriodEnableQueuedRelations = relations(
  convertibleDepositAuctioneerDepositPeriodEnableQueued,
  ({ one }) => ({
    auctioneer: one(auctioneer, {
      fields: [convertibleDepositAuctioneerDepositPeriodEnableQueued.chainId, convertibleDepositAuctioneerDepositPeriodEnableQueued.auctioneer],
      references: [auctioneer.chainId, auctioneer.address],
    }),
    assetPeriod: one(depositAssetPeriod, {
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
  })
);

export const convertibleDepositAuctioneerDepositPeriodEnabledRelations = relations(
  convertibleDepositAuctioneerDepositPeriodEnabled,
  ({ one }) => ({
    auctioneer: one(auctioneer, {
      fields: [convertibleDepositAuctioneerDepositPeriodEnabled.chainId, convertibleDepositAuctioneerDepositPeriodEnabled.auctioneer],
      references: [auctioneer.chainId, auctioneer.address],
    }),
    assetPeriod: one(depositAssetPeriod, {
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
  })
);

export const convertibleDepositFacilityAssetCommitCancelledRelations = relations(
  convertibleDepositFacilityAssetCommitCancelled,
  ({ one }) => ({
    facility: one(depositFacility, {
      fields: [convertibleDepositFacilityAssetCommitCancelled.chainId, convertibleDepositFacilityAssetCommitCancelled.facility],
      references: [depositFacility.chainId, depositFacility.address],
    }),
    depositAsset: one(depositAsset, {
      fields: [convertibleDepositFacilityAssetCommitCancelled.chainId, convertibleDepositFacilityAssetCommitCancelled.depositAsset],
      references: [depositAsset.chainId, depositAsset.asset],
    }),
    facilityAsset: one(depositFacilityAsset, {
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
  })
);

export const convertibleDepositFacilityAssetCommitWithdrawnRelations = relations(
  convertibleDepositFacilityAssetCommitWithdrawn,
  ({ one }) => ({
    facility: one(depositFacility, {
      fields: [convertibleDepositFacilityAssetCommitWithdrawn.chainId, convertibleDepositFacilityAssetCommitWithdrawn.facility],
      references: [depositFacility.chainId, depositFacility.address],
    }),
    depositAsset: one(depositAsset, {
      fields: [convertibleDepositFacilityAssetCommitWithdrawn.chainId, convertibleDepositFacilityAssetCommitWithdrawn.depositAsset],
      references: [depositAsset.chainId, depositAsset.asset],
    }),
    facilityAsset: one(depositFacilityAsset, {
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
  })
);

export const convertibleDepositFacilityAssetCommittedRelations = relations(
  convertibleDepositFacilityAssetCommitted,
  ({ one }) => ({
    facility: one(depositFacility, {
      fields: [convertibleDepositFacilityAssetCommitted.chainId, convertibleDepositFacilityAssetCommitted.facility],
      references: [depositFacility.chainId, depositFacility.address],
    }),
    depositAsset: one(depositAsset, {
      fields: [convertibleDepositFacilityAssetCommitted.chainId, convertibleDepositFacilityAssetCommitted.depositAsset],
      references: [depositAsset.chainId, depositAsset.asset],
    }),
    facilityAsset: one(depositFacilityAsset, {
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
  })
);

export const convertibleDepositFacilityAssetPeriodReclaimRateSetRelations = relations(
  convertibleDepositFacilityAssetPeriodReclaimRateSet,
  ({ one }) => ({
    facility: one(depositFacility, {
      fields: [convertibleDepositFacilityAssetPeriodReclaimRateSet.chainId, convertibleDepositFacilityAssetPeriodReclaimRateSet.facility],
      references: [depositFacility.chainId, depositFacility.address],
    }),
    depositAsset: one(depositAsset, {
      fields: [convertibleDepositFacilityAssetPeriodReclaimRateSet.chainId, convertibleDepositFacilityAssetPeriodReclaimRateSet.depositAsset],
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
  })
);

export const convertibleDepositFacilityCreatedDepositRelations = relations(
  convertibleDepositFacilityCreatedDeposit,
  ({ one }) => ({
    facility: one(depositFacility, {
      fields: [convertibleDepositFacilityCreatedDeposit.chainId, convertibleDepositFacilityCreatedDeposit.facility],
      references: [depositFacility.chainId, depositFacility.address],
    }),
    depositAsset: one(depositAsset, {
      fields: [convertibleDepositFacilityCreatedDeposit.chainId, convertibleDepositFacilityCreatedDeposit.depositAsset],
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
    depositor: one(depositor, {
      fields: [convertibleDepositFacilityCreatedDeposit.chainId, convertibleDepositFacilityCreatedDeposit.depositor],
      references: [depositor.chainId, depositor.address],
    }),
    position: one(convertibleDepositPosition, {
      fields: [convertibleDepositFacilityCreatedDeposit.chainId, convertibleDepositFacilityCreatedDeposit.positionId],
      references: [convertibleDepositPosition.chainId, convertibleDepositPosition.positionId],
    }),
  })
);

export const convertibleDepositFacilityReclaimedRelations = relations(
  convertibleDepositFacilityReclaimed,
  ({ one }) => ({
    facility: one(depositFacility, {
      fields: [convertibleDepositFacilityReclaimed.chainId, convertibleDepositFacilityReclaimed.facility],
      references: [depositFacility.chainId, depositFacility.address],
    }),
    depositAsset: one(depositAsset, {
      fields: [convertibleDepositFacilityReclaimed.chainId, convertibleDepositFacilityReclaimed.depositAsset],
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
    depositor: one(depositor, {
      fields: [convertibleDepositFacilityReclaimed.chainId, convertibleDepositFacilityReclaimed.depositor],
      references: [depositor.chainId, depositor.address],
    }),
  })
);

export const convertibleDepositAuctioneerBidRelations = relations(
  convertibleDepositAuctioneerBid,
  ({ one }) => ({
    auctioneer: one(auctioneer, {
      fields: [convertibleDepositAuctioneerBid.chainId, convertibleDepositAuctioneerBid.auctioneer],
      references: [auctioneer.chainId, auctioneer.address],
    }),
    auctioneerDepositPeriod: one(auctioneerDepositPeriod, {
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
    assetPeriod: one(depositAssetPeriod, {
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
    depositor: one(depositor, {
      fields: [convertibleDepositAuctioneerBid.chainId, convertibleDepositAuctioneerBid.depositor],
      references: [depositor.chainId, depositor.address],
    }),
    position: one(convertibleDepositPosition, {
      fields: [convertibleDepositAuctioneerBid.chainId, convertibleDepositAuctioneerBid.positionId],
      references: [convertibleDepositPosition.chainId, convertibleDepositPosition.positionId],
    }),
  })
);

export const convertibleDepositFacilityConvertedDepositsRelations = relations(
  convertibleDepositFacilityConvertedDeposits,
  ({ one, many }) => ({
    facility: one(depositFacility, {
      fields: [convertibleDepositFacilityConvertedDeposits.chainId, convertibleDepositFacilityConvertedDeposits.facility],
      references: [depositFacility.chainId, depositFacility.address],
    }),
    depositAsset: one(depositAsset, {
      fields: [convertibleDepositFacilityConvertedDeposits.chainId, convertibleDepositFacilityConvertedDeposits.depositAsset],
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
  })
);

export const convertibleDepositFacilityConvertedDepositRelations = relations(
  convertibleDepositFacilityConvertedDeposit,
  ({ one }) => ({
    facility: one(depositFacility, {
      fields: [convertibleDepositFacilityConvertedDeposit.chainId, convertibleDepositFacilityConvertedDeposit.facility],
      references: [depositFacility.chainId, depositFacility.address],
    }),
    depositAsset: one(depositAsset, {
      fields: [convertibleDepositFacilityConvertedDeposit.chainId, convertibleDepositFacilityConvertedDeposit.depositAsset],
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
    depositor: one(depositor, {
      fields: [convertibleDepositFacilityConvertedDeposit.chainId, convertibleDepositFacilityConvertedDeposit.depositor],
      references: [depositor.chainId, depositor.address],
    }),
    position: one(convertibleDepositPosition, {
      fields: [convertibleDepositFacilityConvertedDeposit.chainId, convertibleDepositFacilityConvertedDeposit.positionId],
      references: [convertibleDepositPosition.chainId, convertibleDepositPosition.positionId],
    }),
    parentEvent: one(convertibleDepositFacilityConvertedDeposits, {
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
  })
);
