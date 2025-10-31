// Event handlers for ConvertibleDepositFacility contract

import { ponder } from "ponder:registry";
import type { Address } from "viem";
import schema from "ponder:schema";
import { getOrCreateDepositFacility, updateDepositFacility } from "../entities/depositFacility";

ponder.on("ConvertibleDepositFacility:Enabled", async ({ event, context }) => {
  const chainId = Number(context.chain.id);
  const facilityAddress = event.log.address as Address;

  // Get or create facility
  const facility = await getOrCreateDepositFacility(
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
  const facility = await getOrCreateDepositFacility(
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

