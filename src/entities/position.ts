// Entity helpers for ConvertibleDepositPosition
// In Ponder, we use context.db for database operations and context.client for contract calls

import type { Context } from "ponder:registry";
import schema from "ponder:schema";
import type { Address } from "viem";
import { fetchPosition } from "../contracts/position";
import { toDecimal } from "../utils/decimal";
import { getOrCreateDepositAssetPeriod } from "./asset";
import { getOrCreateDepositFacility } from "./depositFacility";
import { getOrCreateDepositor } from "./depositor";
import { getOrCreateReceiptToken } from "./receiptToken";

const UINT256_MAX = BigInt(
  "115792089237316195423570985008687907853269984665640564039457584007913129639935",
);

/**
 * Get or create a ConvertibleDepositPosition
 */
export async function getOrCreatePosition(
  context: Context,
  chainId: number,
  facilityAddress: Address,
  depositAssetAddress: Address,
  depositPeriod: number,
  positionId: bigint,
  depositorAddress: Address,
  txHash: Address,
  block: bigint,
  timestamp: bigint,
): Promise<typeof schema.convertibleDepositPosition.$inferSelect> {
  // Check if position exists
  const existing = await context.db.find(schema.convertibleDepositPosition, {
    chainId,
    positionId,
  });

  if (existing) {
    return existing;
  }

  // Get or create related entities
  await getOrCreateDepositFacility(context, chainId, facilityAddress);
  await getOrCreateDepositor(context, chainId, depositorAddress);
  // Get deposit asset period with nested asset relation for decimals
  const depositAssetPeriod = await getOrCreateDepositAssetPeriod(
    context,
    chainId,
    depositAssetAddress,
    depositPeriod,
  );
  const assetDecimals = depositAssetPeriod.depositAsset.asset.decimals;

  // Fetch receipt token data
  const receiptToken = await getOrCreateReceiptToken(
    context,
    chainId,
    facilityAddress,
    depositAssetAddress,
    depositPeriod,
  );

  // Fetch position data from contract
  const position = await fetchPosition(context.client, positionId);

  // Determine the conversion price (UINT256_MAX means not set)
  let conversionPrice: bigint | null = null;
  let conversionPriceDecimal: string | null = null;
  if (position.conversionPrice !== UINT256_MAX) {
    conversionPrice = position.conversionPrice;
    conversionPriceDecimal = toDecimal(position.conversionPrice, assetDecimals);
  }

  // Insert new position
  const newPosition = {
    chainId,
    positionId,
    txHash: txHash.toLowerCase() as Address,
    block,
    timestamp,
    facility: facilityAddress.toLowerCase() as Address,
    depositor: depositorAddress.toLowerCase() as Address,
    depositAsset: depositAssetAddress.toLowerCase() as Address,
    depositPeriod,
    receiptTokenManager: receiptToken.receiptTokenManager,
    receiptTokenId: receiptToken.receiptTokenId,
    initialAmount: position.remainingDeposit,
    initialAmountDecimal: toDecimal(position.remainingDeposit, assetDecimals),
    remainingAmount: position.remainingDeposit,
    remainingAmountDecimal: toDecimal(position.remainingDeposit, assetDecimals),
    conversionPrice,
    conversionPriceDecimal,
  };

  await context.db.insert(schema.convertibleDepositPosition).values(newPosition);

  return newPosition;
}

/**
 * Get a ConvertibleDepositPosition by ID
 */
export async function getPosition(
  context: Context,
  chainId: number,
  positionId: bigint,
): Promise<typeof schema.convertibleDepositPosition.$inferSelect> {
  const existing = await context.db.find(schema.convertibleDepositPosition, {
    chainId,
    positionId,
  });

  if (!existing) {
    throw new Error(`Position not found: ${chainId}:${positionId}`);
  }

  return existing;
}

/**
 * Update a position with new values
 */
export async function updatePosition(
  context: Context,
  chainId: number,
  positionId: bigint,
  updates: Partial<
    Omit<typeof schema.convertibleDepositPosition.$inferSelect, "chainId" | "positionId">
  >,
): Promise<void> {
  await context.db
    .update(schema.convertibleDepositPosition, {
      chainId,
      positionId,
    })
    .set(updates);
}

/**
 * Update a position from contract state
 * Note: In Ponder, we use insert with the same primary key to update
 */
export async function updatePositionFromContract(
  context: Context,
  chainId: number,
  positionId: bigint,
  assetDecimals: number,
): Promise<void> {
  const _position = await getPosition(context, chainId, positionId);

  // Fetch updated position data from contract
  const contractPosition = await fetchPosition(context.client, positionId);

  // Update the position with the latest remainingAmount from the contract
  const updatedPosition = {
    remainingAmount: contractPosition.remainingDeposit,
    remainingAmountDecimal: toDecimal(contractPosition.remainingDeposit, assetDecimals),
  };

  // In Ponder, insert with same primary key updates the record
  await context.db
    .update(schema.convertibleDepositPosition, {
      chainId,
      positionId,
    })
    .set(updatedPosition);
}
