// Shared types for Ponder handlers
// Based on Ponder documentation: https://ponder.sh/docs/indexing/overview

// Context type from Ponder handler - imported from ponder:registry
// Can be generic: Context<"EventName"> for type-safe event handling
import type { Context } from "ponder:registry";
export type { Context };

// Ponder read-only client type - used for contract calls in indexing functions
export type PonderClient = Context["client"];
