// Block handler for periodic snapshot creation
// Creates snapshots every 3000 blocks (~1 hour at 12s block time)

import { ponder } from "ponder:registry";
import schema from "ponder:schema";
import { and, eq } from "ponder";
import {
  getOrCreateAuctioneerSnapshot,
  getOrCreateDepositFacilityAssetSnapshot,
} from "../entities/snapshot";

ponder.on("Snapshot:block", async ({ event, context }) => {
  const chainId = Number(context.chain.id);
  const blockNumber = BigInt(event.block.number);
  const timestamp = BigInt(event.block.timestamp);

  // Get all enabled auctioneers for this chain
  const auctioneers = await context.db.sql
    .select()
    .from(schema.auctioneer)
    .where(and(eq(schema.auctioneer.chainId, chainId), eq(schema.auctioneer.enabled, true)));

  for (const auctioneer of auctioneers) {
    await getOrCreateAuctioneerSnapshot(
      context,
      chainId,
      blockNumber,
      timestamp,
      auctioneer.address,
    );
  }

  // Get all enabled facilities for this chain
  const facilities = await context.db.sql
    .select()
    .from(schema.depositFacility)
    .where(
      and(eq(schema.depositFacility.chainId, chainId), eq(schema.depositFacility.enabled, true)),
    );

  for (const facility of facilities) {
    // Get all deposit facility assets for this facility
    const facilityAssets = await context.db.sql
      .select()
      .from(schema.depositFacilityAsset)
      .where(
        and(
          eq(schema.depositFacilityAsset.chainId, chainId),
          eq(schema.depositFacilityAsset.facility, facility.address),
        ),
      );

    // Create snapshots for each asset
    for (const facilityAsset of facilityAssets) {
      await getOrCreateDepositFacilityAssetSnapshot(
        context,
        chainId,
        blockNumber,
        timestamp,
        facility.address,
        facilityAsset.depositAsset,
      );
    }
  }
});
