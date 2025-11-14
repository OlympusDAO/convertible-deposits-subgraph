# Olympus Convertible Deposits Ponder Indexer

A Ponder indexer for tracking Olympus Protocol's Convertible Deposits system. This indexer replaces the original Envio implementation and provides comprehensive indexing of events from three main contracts with real-time snapshot tracking.

## Overview

The Olympus Convertible Deposits system allows users to deposit various assets (starting with USDS) for fixed periods and receive OHM tokens through an auction mechanism. The system includes:

- **ConvertibleDepositAuctioneer**: Manages auctions for converting deposits to OHM
- **ConvertibleDepositFacility**: Handles deposit creation, conversion, and yield management
- **DepositRedemptionVault**: Manages redemption of deposits with loan mechanisms

## Key Features

### 🏦 Deposit Management
- Track deposit positions across different assets and time periods
- Monitor deposit creation, conversion, and remaining balances
- Support for multiple deposit periods (e.g., 3, 6, 12 months)
- Receipt token tracking for each position

### 🎯 Auction System
- Auction mechanism for converting deposits to OHM
- Real-time auction parameter tracking (target, tick size, minimum price)
- Bid tracking and auction result monitoring
- Deposit period enable/disable management
- Automatic snapshot updates on bids and auction results

### 💰 Yield & Redemption
- Early redemption system with loan mechanisms
- Interest rate tracking and loan management
- Yield claiming and asset commitment tracking
- Reclaim rate configuration per asset period
- Redemption lifecycle tracking with loan details

### 📊 Comprehensive Analytics
- Real-time snapshots of auctioneer and facility states
- Historical tracking of all events and state changes
- Multi-asset support with proper decimal normalization
- Cross-contract relationship mapping
- Periodic snapshot creation via block handler (every 3000 blocks)

## Architecture

### Entity Relationship Diagram

See [SCHEMA.md](./SCHEMA.md) for a detailed visualization of the schema.

### Core Entities

- **Asset**: Supported deposit assets (USDS, etc.)
- **DepositAsset**: Asset configuration within the system
- **DepositAssetPeriod**: Time-based deposit periods (3, 6, 12 months)
- **ConvertibleDepositPosition**: Individual user deposit positions
- **Auctioneer**: Auction management per asset
- **AuctioneerDepositPeriod**: Period configuration for auctioneers
- **DepositFacility**: Main deposit management contract
- **DepositFacilityAsset**: Asset management within facilities
- **DepositFacilityAssetPeriod**: Period configuration for facility assets
- **DepositRedemptionVault**: Redemption and loan system
- **DepositRedemptionVaultAssetConfiguration**: Asset-specific redemption configuration
- **Redemption**: Redemption lifecycle tracking
- **RedemptionLoan**: Loan details for redemptions
- **ReceiptToken**: Receipt token tracking
- **Depositor**: User addresses who have created deposits

### Event Tracking

The indexer tracks 37 event types across three contracts:

**Auctioneer Events (11):**
- `Enabled`, `Disabled`
- `TickStepUpdated`, `AuctionTrackingPeriodUpdated`
- `DepositPeriodEnableQueued`, `DepositPeriodEnabled`
- `DepositPeriodDisableQueued`, `DepositPeriodDisabled`
- `Bid`, `AuctionParametersUpdated`, `AuctionResult`

**Facility Events (11):**
- `Enabled`, `Disabled`
- `OperatorAuthorized`, `OperatorDeauthorized`
- `AssetCommitted`, `AssetCommitCancelled`, `AssetCommitWithdrawn`
- `AssetPeriodReclaimRateSet`
- `CreatedDeposit`, `Reclaimed`
- `ConvertedDeposits`, `ConvertedDeposit`
- `ClaimedYield`

**Redemption Vault Events (12):**
- `Enabled`, `Disabled`
- `ClaimDefaultRewardPercentageSet`
- `FacilityAuthorized`, `FacilityDeauthorized`
- `AnnualInterestRateSet`, `MaxBorrowPercentageSet`
- `RedemptionStarted`, `RedemptionFinished`, `RedemptionCancelled`
- `LoanCreated`, `LoanRepaid`, `LoanDefaulted`, `LoanExtended`

### Snapshot System

The indexer maintains periodic snapshots of contract state:

- **AuctioneerSnapshot**: Auctioneer state (day state, auction parameters)
- **AuctioneerDepositPeriodSnapshot**: Tick data per deposit period
- **DepositFacilityAssetSnapshot**: Asset-specific metrics (total deposits, pending redemptions, borrowed amounts, claimable yield)

Snapshots are created:
- Periodically via block handler (every 3000 blocks ≈ 1 hour)
- On-demand after state-changing events (bids, auction results, deposits, redemptions, etc.)

## Quick Start

### Prerequisites

- [Node.js v18.14+](https://nodejs.org/)
- [pnpm v8+](https://pnpm.io/installation)
- PostgreSQL (optional, for local development)

### Installation

```bash
# Navigate to the ponder-indexer directory
cd ponder-indexer

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
# Edit .env and set PONDER_RPC_URL_11155111 for Sepolia
```

### Development

```bash
# Start the development server
pnpm dev
```

The indexer will:
- Start indexing from block 9180152
- Create snapshots every 3000 blocks
- Provide GraphQL API at http://localhost:42069
- Provide REST API at http://localhost:42069/api

### Type Checking & Linting

```bash
# Check TypeScript compilation
pnpm typecheck

# Run linting and formatting checks
pnpm lint:check

# Run linting with auto-fix
pnpm lint
```

## Configuration

### Network Support

Currently configured for:
- **Sepolia Testnet** (Chain ID: 11155111)

### Contract Addresses

- **ConvertibleDepositAuctioneer**: `0xc14156AF3bF6c11b1c40C8f51f64bA5496870126`
- **ConvertibleDepositFacility**: `0x87568265eb6Ea27f37613d242D4192B6f6771269`
- **DepositRedemptionVault**: `0x69b2Be653BAB628116b360818BE75a2d97b45C4a`

### Block Intervals

- **Snapshot**: Every 3000 blocks (≈ 1 hour at 12s block time)
- Starting from block 9180152

## GraphQL API

Ponder automatically generates a GraphQL API based on the schema. Example queries:

```graphql
# Query deposit positions
query GetPositions($depositor: String!) {
  convertibleDepositPositions(
    where: { rDepositor: { address: { equals: $depositor } } }
  ) {
    positionId
    initialAmount
    remainingAmount
    conversionPrice
    rAssetPeriod {
      depositPeriod
      rDepositAsset {
        asset
        rAsset {
          symbol
        }
      }
    }
  }
}

# Query auction snapshots
query GetAuctionSnapshots($auctioneer: String!, $limit: Int = 10) {
  auctioneerSnapshots(
    where: { rAuctioneer: { address: { equals: $auctioneer } } }
    orderBy: timestamp
    orderDirection: desc
    limit: $limit
  ) {
    block
    timestamp
    ohmSold
    isAuctionActive
    depositPeriodSnapshots {
      depositPeriod
      currentTickPrice
      currentTickCapacity
    }
  }
}

# Query redemptions with loans
query GetRedemptions($depositor: String!) {
  redemptions(where: { rDepositor: { address: { equals: $depositor } } }) {
    redemptionId
    amount
    redeemableAt
    loans {
      principal
      interest
      status
    }
  }
}
```

## Key Design Decisions

### Composite Primary Keys

All entities use composite primary keys:
- **Address-based**: `(chainId, address)` for contracts, assets, depositors
- **Asset-based**: `(chainId, asset)` for DepositAsset
- **Period-based**: `(chainId, depositAsset, depositPeriod)` for periods
- **Position-based**: `(chainId, positionId)` for positions
- **Event-based**: `(chainId, block, logIndex)` for events
- **Snapshot-based**: `(chainId, block, auctioneer)` or `(chainId, block, facility, depositAsset)` for snapshots

### Relation Naming Convention

All relation names use the `r` prefix (e.g., `rAsset`, `rDepositAsset`, `rFacility`, `rAssetPeriod`). This convention is necessary because:

1. **Avoiding Naming Conflicts**: Database tables have columns with names like `asset`, `depositAsset`, `facility`, etc. If relations had the same names, Ponder's type system and query builder would have ambiguity issues when accessing these properties.

2. **Type Safety**: The `r` prefix clearly distinguishes between:
   - Database fields: `depositAsset.asset` (the address string)
   - Relations: `depositAsset.rAsset` (the related Asset entity with decimals, symbol, etc.)

3. **Field Length Limits**: Some database systems or ORMs have field length limitations, and the short `r` prefix keeps relation names concise while remaining clear.

4. **Consistency**: All relations follow the same pattern, making the codebase easier to understand and maintain.

Example usage:
```typescript
// Access the asset address (database field)
const assetAddress = depositAsset.asset;

// Access the full Asset entity with decimals (relation)
const decimals = depositAsset.rAsset.decimals;
```

### Data Type Conventions

- **Addresses**: Stored as `hex` type (lowercase)
- **BigInt**: Stored as `bigint` type (not text)
- **BigDecimal**: Stored as `text` type (decimal normalization handled in application layer)
- **Timestamps**: Stored as `bigint` type

### Contract Call Optimization

- Batch contract calls using `client.multicall()` where possible
- Fetch decimals inline using `with` parameters to avoid multiple DB calls
- Cache asset decimals to reduce redundant queries

### Error Handling

- Fail loudly: All errors throw instead of being logged and skipped
- Position lookups revert if position not found (no silent failures)
- Snapshot creation fails if any period snapshot fails

## Project Structure

```
ponder-indexer/
├── abis/                      # Contract ABIs (TypeScript format)
│   ├── ConvertibleDepositAuctioneer.ts
│   ├── ConvertibleDepositFacility.ts
│   ├── DepositRedemptionVault.ts
│   ├── DepositManager.ts
│   └── DepositPositionManager.ts
├── src/
│   ├── contracts/             # Contract interaction utilities
│   │   ├── asset.ts
│   │   ├── auctioneer.ts
│   │   ├── depositFacility.ts
│   │   ├── position.ts
│   │   └── redemptionVault.ts
│   ├── entities/               # Entity creation/management
│   │   ├── asset.ts
│   │   ├── auctioneer.ts
│   │   ├── depositFacility.ts
│   │   ├── depositor.ts
│   │   ├── position.ts
│   │   ├── receiptToken.ts
│   │   ├── redemption.ts
│   │   ├── redemptionLoan.ts
│   │   ├── redemptionVault.ts
│   │   └── snapshot.ts
│   ├── handlers/               # Event handlers
│   │   ├── auctioneer.handlers.ts
│   │   ├── block.handlers.ts   # Block-based snapshot creation
│   │   ├── depositFacility.handlers.ts
│   │   └── redemptionVault.handlers.ts
│   ├── utils/                  # Utility functions
│   │   ├── decimal.ts         # Decimal normalization
│   │   ├── ids.ts             # ID generation helpers
│   │   └── env.ts             # Environment variable helpers
│   ├── api/                    # Custom API routes (if needed)
│   │   └── index.ts
│   ├── types.ts               # Shared TypeScript types
│   └── index.ts               # Main entry point (imports all handlers)
├── ponder.config.ts           # Ponder configuration
├── ponder.schema.ts           # Schema definition
├── SCHEMA.md                  # Schema visualization and documentation
└── package.json
```

## Development Workflow

### After Schema Changes

```bash
# Regenerate GraphQL schema
pnpm codegen
```

### After TypeScript Changes

```bash
# Check for type errors
pnpm typecheck
```

### Linting

```bash
# Check linting without fixing
pnpm lint:check

# Auto-fix linting issues
pnpm lint
```

## Migration from Envio

This Ponder indexer is a complete migration from the original Envio implementation. Key differences:

1. **TypeScript Schema**: Uses Ponder's TypeScript-based schema instead of GraphQL
2. **Direct Contract Calls**: Uses `client.readContract()` and `client.multicall()` instead of Envio's Effect API
3. **Composite Primary Keys**: Uses Ponder's `primaryKey()` helper for composite keys
4. **Simplified Snapshots**: Removed `latestSnapshot` entity - query by timestamp instead
5. **Block Handlers**: Uses Ponder's block interval system for periodic snapshots
6. **Relations**: Explicitly defined using Ponder's `relations()` helper

## Snapshot System

Snapshots are created:

1. **Periodically**: Every 3000 blocks (≈1 hour) via block handler
   - Creates snapshots for all enabled auctioneers
   - Creates snapshots for all facility assets

2. **On State Changes**:
   - After each bid → updates auctioneer and period snapshots
   - After auction results → updates auctioneer snapshots
   - After deposits → updates facility asset snapshots
   - After redemptions → updates facility asset snapshots (pending redemption, borrowed amount)
   - After conversions → updates facility asset snapshots (total deposited)

The `refreshAuctionState()` function creates:
- Main `auctioneerSnapshot` with day state and auction parameters
- `auctioneerDepositPeriodSnapshot` for all deposit periods (enabled or not)

## Performance Optimizations

- **Batched Contract Calls**: Multiple reads combined into single `multicall()` requests
- **Decimal Caching**: Asset decimals fetched once and reused
- **Efficient Queries**: Uses `context.db.sql.select()` for complex queries instead of iterative lookups
- **Snapshot Updates**: Direct updates to existing snapshots instead of creating new ones

## Documentation

- [Ponder Documentation](https://ponder.sh)
- [Schema Visualization](./SCHEMA.md)

## License

This project is part of the Olympus Protocol ecosystem.

