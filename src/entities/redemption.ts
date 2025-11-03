import type { Context } from "ponder:registry";
import schema from "ponder:schema";
import { and, eq } from "ponder";
import type { Address } from "viem";
import { fetchRedemption } from "../contracts/redemptionVault";
import { toDecimal } from "../utils/decimal";
import { getOrCreateDepositAssetPeriod } from "./asset";
import { getOrCreateDepositFacility } from "./depositFacility";
import { getOrCreateDepositor } from "./depositor";
import { getOrCreateReceiptToken } from "./receiptToken";
import { getOrCreateRedemptionVault } from "./redemptionVault";

/**
 * Get or create a Redemption entity (with nested asset relation for decimals)
 */
export async function getOrCreateRedemption(
  context: Context,
  chainId: number,
  redemptionVaultAddress: Address,
  facilityAddress: Address,
  depositAssetAddress: Address,
  depositAssetPeriodMonths: number,
  userAddress: Address,
  redemptionId: number,
): Promise<
  typeof schema.redemption.$inferSelect & {
    rAssetPeriod: typeof schema.depositAssetPeriod.$inferSelect & {
      rDepositAsset: typeof schema.depositAsset.$inferSelect & {
        rAsset: typeof schema.asset.$inferSelect;
      };
    };
  }
> {
  // Check if redemption already exists with nested relations
  const existing = await context.db.sql.query.redemption.findFirst({
    where: and(
      eq(schema.redemption.chainId, chainId),
      eq(schema.redemption.redemptionVault, redemptionVaultAddress.toLowerCase() as Address),
      eq(schema.redemption.depositor, userAddress.toLowerCase() as Address),
      eq(schema.redemption.redemptionId, redemptionId),
    ),
    with: {
      rAssetPeriod: {
        with: {
          rDepositAsset: {
            with: {
              rAsset: true,
            },
          },
        },
      },
    },
  });

  if (existing) {
    return existing;
  }

  // Get or create related entities
  await getOrCreateDepositor(context, chainId, userAddress);
  const receiptToken = await getOrCreateReceiptToken(
    context,
    chainId,
    facilityAddress,
    depositAssetAddress,
    depositAssetPeriodMonths,
  );
  await getOrCreateRedemptionVault(context, chainId, redemptionVaultAddress);
  await getOrCreateDepositFacility(context, chainId, facilityAddress);
  const depositAssetPeriod = await getOrCreateDepositAssetPeriod(
    context,
    chainId,
    depositAssetAddress,
    depositAssetPeriodMonths,
  );

  // Fetch redemption data from contract
  const redemptionData = await fetchRedemption(
    context.client,
    redemptionVaultAddress,
    userAddress,
    redemptionId,
  );

  // Create redemption record
  await context.db.insert(schema.redemption).values({
    chainId,
    redemptionVault: redemptionVaultAddress.toLowerCase() as Address,
    depositor: userAddress.toLowerCase() as Address,
    redemptionId,
    depositAsset: depositAssetAddress.toLowerCase() as Address,
    depositPeriod: depositAssetPeriodMonths,
    facility: facilityAddress.toLowerCase() as Address,
    receiptTokenManager: receiptToken.receiptTokenManager,
    receiptTokenId: receiptToken.receiptTokenId,
    positionId: redemptionData.positionId,
    amount: redemptionData.amount,
    amountDecimal: toDecimal(
      redemptionData.amount,
      depositAssetPeriod.rDepositAsset.rAsset.decimals,
    ),
    redeemableAt: redemptionData.redeemableAt,
  });

  // Re-query with relations to return consistent type
  const created = await context.db.sql.query.redemption.findFirst({
    where: and(
      eq(schema.redemption.chainId, chainId),
      eq(schema.redemption.redemptionVault, redemptionVaultAddress.toLowerCase() as Address),
      eq(schema.redemption.depositor, userAddress.toLowerCase() as Address),
      eq(schema.redemption.redemptionId, redemptionId),
    ),
    with: {
      rAssetPeriod: {
        with: {
          rDepositAsset: {
            with: {
              rAsset: true,
            },
          },
        },
      },
    },
  });

  if (!created) {
    throw new Error(
      `Failed to create redemption: ${chainId}, ${redemptionVaultAddress}, ${userAddress}, ${redemptionId}`,
    );
  }

  return created;
}

/**
 * Get an existing Redemption entity with nested asset relation (throws if not found)
 */
export async function getRedemption(
  context: Context,
  chainId: number,
  redemptionVaultAddress: Address,
  userAddress: Address,
  redemptionId: number,
): Promise<
  typeof schema.redemption.$inferSelect & {
    rAssetPeriod: typeof schema.depositAssetPeriod.$inferSelect & {
      rDepositAsset: typeof schema.depositAsset.$inferSelect & {
        rAsset: typeof schema.asset.$inferSelect;
      };
    };
  }
> {
  const redemption = await context.db.sql.query.redemption.findFirst({
    where: and(
      eq(schema.redemption.chainId, chainId),
      eq(schema.redemption.redemptionVault, redemptionVaultAddress.toLowerCase() as Address),
      eq(schema.redemption.depositor, userAddress.toLowerCase() as Address),
      eq(schema.redemption.redemptionId, redemptionId),
    ),
    with: {
      rAssetPeriod: {
        with: {
          rDepositAsset: {
            with: {
              rAsset: true,
            },
          },
        },
      },
    },
  });

  if (!redemption) {
    throw new Error(
      `Redemption not found: ${chainId}, ${redemptionVaultAddress}, ${userAddress}, ${redemptionId}`,
    );
  }

  return redemption;
}

/**
 * Update an existing Redemption entity
 */
export async function updateRedemption(
  context: Context,
  chainId: number,
  redemptionVaultAddress: Address,
  userAddress: Address,
  redemptionId: number,
  updates: Partial<
    Omit<
      typeof schema.redemption.$inferSelect,
      "chainId" | "redemptionVault" | "depositor" | "redemptionId"
    >
  >,
): Promise<void> {
  await context.db
    .update(schema.redemption, {
      chainId,
      redemptionVault: redemptionVaultAddress.toLowerCase() as Address,
      depositor: userAddress.toLowerCase() as Address,
      redemptionId,
    })
    .set(updates);
}
