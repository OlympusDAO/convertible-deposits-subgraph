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
}));

export const auctioneerRelations = relations(auctioneer, ({ one }) => ({
  depositAsset: one(depositAsset, {
    fields: [auctioneer.chainId, auctioneer.depositAsset],
    references: [depositAsset.chainId, depositAsset.asset],
  }),
}));

export const depositFacilityRelations = relations(depositFacility, ({ many }) => ({
  positions: many(convertibleDepositPosition),
}));

export const depositorRelations = relations(depositor, ({ many }) => ({
  positions: many(convertibleDepositPosition),
}));

export const convertibleDepositPositionRelations = relations(
  convertibleDepositPosition,
  ({ one }) => ({
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
