import { rateLimit } from "ponder";
import { fallback, http, type Transport, webSocket } from "viem";

function getRateLimit(rpcUrlRateLimit?: string): number | undefined {
  if (!rpcUrlRateLimit) {
    return undefined;
  }

  const rps = Number(rpcUrlRateLimit);
  if (Number.isNaN(rps) || rps <= 0) {
    return undefined;
  }

  return rps;
}

function getRpcTransport(chainId: number, rpcUrl: string, rpcUrlRateLimit?: string): Transport {
  // Check if URL uses websocket protocol (case-insensitive)
  const isWebSocket =
    rpcUrl.toLowerCase().startsWith("wss://") || rpcUrl.toLowerCase().startsWith("ws://");

  // Check for rate-limiting
  const rps = getRateLimit(rpcUrlRateLimit);

  let transport: Transport;

  if (isWebSocket) {
    console.log(`Using websocket transport for chain ${chainId}`);
    transport = webSocket(rpcUrl);
  } else {
    console.log(`Using HTTP transport for chain ${chainId}`);
    transport = http(rpcUrl);
  }

  if (rps) {
    console.log(`Rate limiting transport for chain ${chainId} to ${rps} requests per second`);
    transport = rateLimit(transport, { requestsPerSecond: rps });
  }

  return transport;
}

/**
 * Gets the appropriate viem transport for a given chain ID
 * - Uses websocket transport if the RPC URL starts with "wss"
 * - Otherwise uses HTTP transport
 * - Applies rate limiting to HTTP transport if PONDER_RPC_URL_RATE_LIMIT_<chainId> is set
 * - If PONDER_RPC_URL_FALLBACK_<chainId> is set, provides a fallback transport
 */
export function getTransport(chainId: number): Transport {
  const envVarName = `PONDER_RPC_URL_${chainId}`;
  const rpcUrl = process.env[envVarName];
  const rpcUrlFallback = process.env[`PONDER_RPC_URL_FALLBACK_${chainId}`];
  const rpcUrlRateLimit = process.env[`PONDER_RPC_URL_RATE_LIMIT_${chainId}`];

  if (!rpcUrl) {
    throw new Error(
      `RPC URL not found for chain ${chainId}. Set ${envVarName} environment variable.`,
    );
  }

  const rpcTransport = getRpcTransport(chainId, rpcUrl, rpcUrlRateLimit);

  // If no fallback URL is set, return the transport
  if (!rpcUrlFallback) {
    return rpcTransport;
  }

  console.log(`Setting up fallback transport for chain ${chainId}`);
  const rpcTransportFallback = getRpcTransport(chainId, rpcUrlFallback, rpcUrlRateLimit);

  return fallback([rpcTransport, rpcTransportFallback]);
}
