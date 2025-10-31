// Event handlers for ConvertibleDepositAuctioneer contract

import { ponder } from "ponder:registry";
import type { Address } from "viem";
import schema from "ponder:schema";
import { getOrCreateAuctioneer, updateAuctioneer } from "../entities/auctioneer";

ponder.on("ConvertibleDepositAuctioneer:Enabled", async ({ event, context }) => {
  const chainId = Number(context.chain.id);
  const auctioneerAddress = event.log.address as Address;

  // Get or create auctioneer
  const auctioneer = await getOrCreateAuctioneer(
    context,
    chainId,
    auctioneerAddress,
  );

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
  const auctioneer = await getOrCreateAuctioneer(
    context,
    chainId,
    auctioneerAddress,
  );

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

