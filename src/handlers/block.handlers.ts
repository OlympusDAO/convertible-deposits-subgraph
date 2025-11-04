// Block handler for periodic snapshot creation
// Creates snapshots every 3000 blocks (~1 hour at 12s block time)

import { ponder } from "ponder:registry";
import schema from "ponder:schema";
import { and, eq, inArray } from "ponder";
import type { Address } from "viem";
import { fetchFacilityClaimableYieldBatch } from "../contracts/depositFacility";
import { getOrCreateDepositFacilityAssetSnapshot, refreshAuctionState } from "../entities/snapshot";

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
    await refreshAuctionState(context, chainId, blockNumber, timestamp, auctioneer.address);
  }

  // Get all enabled facilities for this chain
  const facilities = await context.db.sql
    .select()
    .from(schema.depositFacility)
    .where(
      and(eq(schema.depositFacility.chainId, chainId), eq(schema.depositFacility.enabled, true)),
    );

  // If no facilities, skip
  if (facilities.length === 0) {
    return;
  }

  // Batch query all facility assets for all facilities in a single query
  const facilityAddresses = facilities.map((f) => f.address.toLowerCase() as Address);
  const allFacilityAssets = await context.db.sql
    .select()
    .from(schema.depositFacilityAsset)
    .where(
      and(
        eq(schema.depositFacilityAsset.chainId, chainId),
        inArray(schema.depositFacilityAsset.facility, facilityAddresses),
      ),
    );

  // Group facility assets by facility address
  const facilityAssetMap = new Map<Address, Address[]>();

  for (const facilityAsset of allFacilityAssets) {
    const facilityAddress = facilityAsset.facility;
    const assetAddress = facilityAsset.depositAsset;

    // Group by facility
    let assets = facilityAssetMap.get(facilityAddress);
    if (!assets) {
      assets = [];
      facilityAssetMap.set(facilityAddress, assets);
    }
    assets.push(assetAddress);
  }

  // Batch fetch all claimable yields in a single multicall
  const claimableYieldMap = await fetchFacilityClaimableYieldBatch(
    context.client,
    facilityAssetMap,
  );

  // Create snapshots for each facility/asset pair with pre-fetched claimable yields
  for (const [facilityAddress, assetAddresses] of facilityAssetMap) {
    const facilityYieldMap = claimableYieldMap.get(facilityAddress);
    if (!facilityYieldMap) {
      throw new Error(`Claimable yield map not found for facility ${facilityAddress}`);
    }

    for (const assetAddress of assetAddresses) {
      const claimableYield = facilityYieldMap.get(assetAddress);
      if (claimableYield === undefined) {
        throw new Error(
          `Claimable yield not found for facility ${facilityAddress} asset ${assetAddress}`,
        );
      }

      await getOrCreateDepositFacilityAssetSnapshot(
        context,
        chainId,
        blockNumber,
        timestamp,
        facilityAddress,
        assetAddress,
        claimableYield,
      );
    }
  }
});
