// Decimal normalization utilities
// Returns decimal representation as string (for storage as text in schema)

export function toDecimal(value: bigint | number, decimals: number): string {
  const valueBigInt = typeof value === "bigint" ? value : BigInt(value);
  const divisor = 10n ** BigInt(decimals);
  const whole = valueBigInt / divisor;
  const fractional = valueBigInt % divisor;
  const fractionalStr = fractional.toString().padStart(Number(decimals), "0");
  return `${whole}.${fractionalStr}`;
}

export function toOhmDecimal(value: bigint | number): string {
  return toDecimal(value, 9);
}

export function toBpsDecimal(value: bigint | number): string {
  return toDecimal(value, 4);
}
