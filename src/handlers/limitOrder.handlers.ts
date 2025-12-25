// Event handlers for ConvertibleDepositAuctioneerLimitOrders contract

import { ponder } from "ponder:registry";
import schema from "ponder:schema";
import type { Address } from "viem";
import {
  fetchLimitOrdersTotalUsdsDeposited,
  fetchLimitOrdersTotalUsdsOwed,
  fetchLimitOrdersUSDS,
} from "../contracts/limitOrder";
import { getAssetDecimals, getOrCreateDepositAssetPeriod } from "../entities/asset";
import { getOrCreateDepositor } from "../entities/depositor";
import {
  createLimitOrderSnapshot,
  getLatestLimitOrderSnapshot,
  getOrCreateLimitOrdersContract,
  getOrCreateLimitOrdersDepositPeriod,
  updateLimitOrder,
  updateLimitOrdersContract,
  updateLimitOrdersDepositPeriod,
} from "../entities/limitOrder";
import { toDecimal, toOhmDecimal } from "../utils/decimal";

ponder.on("ConvertibleDepositAuctioneerLimitOrders:Enabled", async ({ event, context }) => {
  const chainId = Number(context.chain.id);
  const contractAddress = event.log.address as Address;

  // Get or create contract
  await getOrCreateLimitOrdersContract(context, chainId, contractAddress);

  // Record the Enabled event
  await context.db.insert(schema.limitOrdersEnabled).values({
    chainId,
    block: BigInt(event.block.number),
    logIndex: event.log.logIndex,
    txHash: event.transaction.hash,
    timestamp: BigInt(event.block.timestamp),
    contractAddress: contractAddress.toLowerCase() as Address,
  });

  // Update contract status
  await updateLimitOrdersContract(context, chainId, contractAddress, { enabled: true });
});

ponder.on("ConvertibleDepositAuctioneerLimitOrders:Disabled", async ({ event, context }) => {
  const chainId = Number(context.chain.id);
  const contractAddress = event.log.address as Address;

  // Get or create contract
  await getOrCreateLimitOrdersContract(context, chainId, contractAddress);

  // Record the Disabled event
  await context.db.insert(schema.limitOrdersDisabled).values({
    chainId,
    block: BigInt(event.block.number),
    logIndex: event.log.logIndex,
    txHash: event.transaction.hash,
    timestamp: BigInt(event.block.timestamp),
    contractAddress: contractAddress.toLowerCase() as Address,
  });

  // Update contract status
  await updateLimitOrdersContract(context, chainId, contractAddress, { enabled: false });
});

ponder.on("ConvertibleDepositAuctioneerLimitOrders:OrderCreated", async ({ event, context }) => {
  const chainId = Number(context.chain.id);
  const contractAddress = event.log.address as Address;
  const orderId = BigInt(event.args.orderId);
  const ownerAddress = event.args.owner as Address;
  const depositPeriod = Number(event.args.depositPeriod);

  // Get or create entities
  await getOrCreateLimitOrdersContract(context, chainId, contractAddress);
  await getOrCreateDepositor(context, chainId, ownerAddress);

  // Get depositAsset from contract (USDS)
  const depositAsset = await fetchLimitOrdersUSDS(context.client, contractAddress);
  await getOrCreateDepositAssetPeriod(context, chainId, depositAsset, depositPeriod);

  // Get asset decimals
  const assetDecimals = await getAssetDecimals(context, chainId, depositAsset);

  // Extract common values from event
  const blockNumber = BigInt(event.block.number);
  const timestamp = BigInt(event.block.timestamp);
  const contractAddressLower = contractAddress.toLowerCase() as Address;
  const ownerLower = ownerAddress.toLowerCase() as Address;
  const depositBudget = BigInt(event.args.depositBudget);
  const depositBudgetDecimal = toDecimal(depositBudget, assetDecimals);
  const incentiveBudget = BigInt(event.args.incentiveBudget);
  const incentiveBudgetDecimal = toDecimal(incentiveBudget, assetDecimals);
  const maxPrice = BigInt(event.args.maxPrice);
  const maxPriceDecimal = toDecimal(maxPrice, assetDecimals);
  const minFillSize = BigInt(event.args.minFillSize);
  const minFillSizeDecimal = toDecimal(minFillSize, assetDecimals);

  // Record the OrderCreated event
  await context.db.insert(schema.limitOrderCreated).values({
    chainId,
    block: blockNumber,
    logIndex: event.log.logIndex,
    txHash: event.transaction.hash,
    timestamp,
    contractAddress: contractAddressLower,
    orderId,
    owner: ownerLower,
    depositPeriod,
    depositBudget,
    depositBudgetDecimal,
    incentiveBudget,
    incentiveBudgetDecimal,
    maxPrice,
    maxPriceDecimal,
    minFillSize,
    minFillSizeDecimal,
  });

  // Create order entity with initial state from event
  // OrderCreated always creates a new order ID, so no need to check for existing order
  await context.db.insert(schema.limitOrder).values({
    chainId,
    contractAddress: contractAddressLower,
    orderId,
    owner: ownerLower,
    depositPeriod,
    active: true,
    depositBudget,
    depositBudgetDecimal,
    incentiveBudget,
    incentiveBudgetDecimal,
    maxPrice,
    maxPriceDecimal,
    minFillSize,
    minFillSizeDecimal,
    createdAtBlock: blockNumber,
    createdAtTimestamp: timestamp,
  });

  // Fetch contract-level totals for snapshot
  const totalUsdsOwed = await fetchLimitOrdersTotalUsdsOwed(context.client, contractAddress);
  const totalUsdsDeposited = await fetchLimitOrdersTotalUsdsDeposited(
    context.client,
    contractAddress,
  );

  // Create snapshot explicitly with initial state (depositSpent=0, incentiveSpent=0 for new order)
  await context.db.insert(schema.limitOrderSnapshot).values({
    chainId,
    block: blockNumber,
    timestamp,
    contractAddress: contractAddressLower,
    orderId,
    owner: ownerLower,
    depositPeriod,
    active: true,
    completed: false,
    depositBudget,
    depositBudgetDecimal,
    incentiveBudget,
    incentiveBudgetDecimal,
    depositSpent: BigInt(0), // New order, nothing spent yet
    depositSpentDecimal: toDecimal(BigInt(0), assetDecimals),
    incentiveSpent: BigInt(0), // New order, nothing spent yet
    incentiveSpentDecimal: toDecimal(BigInt(0), assetDecimals),
    maxPrice,
    maxPriceDecimal,
    minFillSize,
    minFillSizeDecimal,
    totalUsdsOwed,
    totalUsdsOwedDecimal: toDecimal(totalUsdsOwed, assetDecimals),
    totalUsdsDeposited,
    totalUsdsDepositedDecimal: toDecimal(totalUsdsDeposited, assetDecimals),
  });
});

ponder.on("ConvertibleDepositAuctioneerLimitOrders:OrderFilled", async ({ event, context }) => {
  const chainId = Number(context.chain.id);
  const contractAddress = event.log.address as Address;
  const orderId = BigInt(event.args.orderId);

  // Get or create contract
  await getOrCreateLimitOrdersContract(context, chainId, contractAddress);

  // Get depositAsset from contract
  const depositAsset = await fetchLimitOrdersUSDS(context.client, contractAddress);
  const assetDecimals = await getAssetDecimals(context, chainId, depositAsset);

  // Extract event values
  const blockNumber = BigInt(event.block.number);
  const timestamp = BigInt(event.block.timestamp);
  const fillAmount = BigInt(event.args.fillAmount);
  const incentivePaid = BigInt(event.args.incentivePaid);

  // Record the OrderFilled event
  await context.db.insert(schema.limitOrderFilled).values({
    chainId,
    block: blockNumber,
    logIndex: event.log.logIndex,
    txHash: event.transaction.hash,
    timestamp,
    contractAddress: contractAddress.toLowerCase() as Address,
    orderId,
    filler: (event.args.filler as Address).toLowerCase() as Address,
    fillAmount,
    fillAmountDecimal: toDecimal(fillAmount, assetDecimals),
    incentivePaid,
    incentivePaidDecimal: toDecimal(incentivePaid, assetDecimals),
    ohmOut: BigInt(event.args.ohmOut),
    ohmOutDecimal: toOhmDecimal(BigInt(event.args.ohmOut)),
    positionId: BigInt(event.args.positionId),
  });

  // Get the latest previous snapshot to copy from
  const previousSnapshot = await getLatestLimitOrderSnapshot(
    context,
    chainId,
    contractAddress,
    orderId,
    blockNumber,
  );
  if (previousSnapshot === null) {
    throw new Error(`Previous snapshot not found for order ${orderId}`);
  }

  // Create snapshot by copying previous and adding fill amounts (additive tracking)
  await createLimitOrderSnapshot(
    context,
    chainId,
    blockNumber,
    timestamp,
    event.log.logIndex,
    contractAddress,
    orderId,
    previousSnapshot,
    {
      depositSpentDelta: fillAmount, // Add current fill to previous spent
      incentiveSpentDelta: incentivePaid, // Add current incentive to previous spent
    },
  );
});

ponder.on("ConvertibleDepositAuctioneerLimitOrders:OrderCancelled", async ({ event, context }) => {
  const chainId = Number(context.chain.id);
  const contractAddress = event.log.address as Address;
  const orderId = BigInt(event.args.orderId);

  // Get or create contract
  await getOrCreateLimitOrdersContract(context, chainId, contractAddress);

  // Get depositAsset from contract
  const depositAsset = await fetchLimitOrdersUSDS(context.client, contractAddress);
  const assetDecimals = await getAssetDecimals(context, chainId, depositAsset);

  const blockNumber = BigInt(event.block.number);
  const timestamp = BigInt(event.block.timestamp);

  // Record the OrderCancelled event
  await context.db.insert(schema.limitOrderCancelled).values({
    chainId,
    block: blockNumber,
    logIndex: event.log.logIndex,
    txHash: event.transaction.hash,
    timestamp,
    contractAddress: contractAddress.toLowerCase() as Address,
    orderId,
    usdsReturned: BigInt(event.args.usdsReturned),
    usdsReturnedDecimal: toDecimal(BigInt(event.args.usdsReturned), assetDecimals),
  });

  // Update order: set active = false
  await updateLimitOrder(context, chainId, contractAddress, orderId, {
    active: false,
  });

  // Get the latest previous snapshot to copy from
  const previousSnapshot = await getLatestLimitOrderSnapshot(
    context,
    chainId,
    contractAddress,
    orderId,
    blockNumber,
  );
  if (previousSnapshot === null) {
    throw new Error(`Previous snapshot not found for order ${orderId}`);
  }

  // Create final snapshot by copying previous and marking as inactive
  await createLimitOrderSnapshot(
    context,
    chainId,
    blockNumber,
    timestamp,
    event.log.logIndex,
    contractAddress,
    orderId,
    previousSnapshot,
    {
      active: false, // Mark as inactive on cancellation
      // All other fields copied from previous snapshot (including cumulative spent amounts)
    },
  );
});

ponder.on(
  "ConvertibleDepositAuctioneerLimitOrders:DepositPeriodAdded",
  async ({ event, context }) => {
    const chainId = Number(context.chain.id);
    const contractAddress = event.log.address as Address;
    const depositPeriod = Number(event.args.depositPeriod);
    const wrappedERC20Address = event.args.receiptToken as Address;

    // Get or create contract
    await getOrCreateLimitOrdersContract(context, chainId, contractAddress);

    // Get depositAsset from contract (USDS)
    const depositAsset = await fetchLimitOrdersUSDS(context.client, contractAddress);

    // Get or create deposit period entity
    // receiptTokenManager and receiptTokenId are fetched using fetchReceiptTokenData()
    await getOrCreateLimitOrdersDepositPeriod(
      context,
      chainId,
      contractAddress,
      depositPeriod,
      depositAsset,
    );

    // Update deposit period: set enabled=true
    await updateLimitOrdersDepositPeriod(context, chainId, contractAddress, depositPeriod, {
      enabled: true,
    });

    // Record the DepositPeriodAdded event
    await context.db.insert(schema.limitOrdersDepositPeriodAdded).values({
      chainId,
      block: BigInt(event.block.number),
      logIndex: event.log.logIndex,
      txHash: event.transaction.hash,
      timestamp: BigInt(event.block.timestamp),
      contractAddress: contractAddress.toLowerCase() as Address,
      depositPeriod,
      receiptToken: wrappedERC20Address.toLowerCase() as Address,
    });
  },
);

ponder.on(
  "ConvertibleDepositAuctioneerLimitOrders:DepositPeriodRemoved",
  async ({ event, context }) => {
    const chainId = Number(context.chain.id);
    const contractAddress = event.log.address as Address;
    const depositPeriod = Number(event.args.depositPeriod);

    // Get or create contract
    await getOrCreateLimitOrdersContract(context, chainId, contractAddress);

    // Get depositAsset from contract
    const depositAsset = await fetchLimitOrdersUSDS(context.client, contractAddress);

    // Get or create deposit period entity
    await getOrCreateLimitOrdersDepositPeriod(
      context,
      chainId,
      contractAddress,
      depositPeriod,
      depositAsset,
    );

    // Update deposit period: set enabled=false
    await updateLimitOrdersDepositPeriod(context, chainId, contractAddress, depositPeriod, {
      enabled: false,
    });

    // Record the DepositPeriodRemoved event
    await context.db.insert(schema.limitOrdersDepositPeriodRemoved).values({
      chainId,
      block: BigInt(event.block.number),
      logIndex: event.log.logIndex,
      txHash: event.transaction.hash,
      timestamp: BigInt(event.block.timestamp),
      contractAddress: contractAddress.toLowerCase() as Address,
      depositPeriod,
    });
  },
);

ponder.on(
  "ConvertibleDepositAuctioneerLimitOrders:YieldRecipientUpdated",
  async ({ event, context }) => {
    const chainId = Number(context.chain.id);
    const contractAddress = event.log.address as Address;

    // Get or create contract
    await getOrCreateLimitOrdersContract(context, chainId, contractAddress);

    // Record the YieldRecipientUpdated event
    await context.db.insert(schema.limitOrdersYieldRecipientUpdated).values({
      chainId,
      block: BigInt(event.block.number),
      logIndex: event.log.logIndex,
      txHash: event.transaction.hash,
      timestamp: BigInt(event.block.timestamp),
      contractAddress: contractAddress.toLowerCase() as Address,
      newRecipient: (event.args.newRecipient as Address).toLowerCase() as Address,
    });
  },
);

ponder.on("ConvertibleDepositAuctioneerLimitOrders:YieldSwept", async ({ event, context }) => {
  const chainId = Number(context.chain.id);
  const contractAddress = event.log.address as Address;

  // Get or create contract
  await getOrCreateLimitOrdersContract(context, chainId, contractAddress);

  // Get asset decimals (sUSDS uses 18 decimals)
  const assetDecimals = 18;

  // Record the YieldSwept event
  await context.db.insert(schema.limitOrdersYieldSwept).values({
    chainId,
    block: BigInt(event.block.number),
    logIndex: event.log.logIndex,
    txHash: event.transaction.hash,
    timestamp: BigInt(event.block.timestamp),
    contractAddress: contractAddress.toLowerCase() as Address,
    recipient: (event.args.recipient as Address).toLowerCase() as Address,
    sUsdsAmount: BigInt(event.args.sUsdsAmount),
    sUsdsAmountDecimal: toDecimal(BigInt(event.args.sUsdsAmount), assetDecimals),
  });
});
