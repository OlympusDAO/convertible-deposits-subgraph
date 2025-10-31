import { createConfig } from "ponder";

import { ConvertibleDepositAuctioneerAbi } from "./abis/ConvertibleDepositAuctioneer";
import { ConvertibleDepositFacilityAbi } from "./abis/ConvertibleDepositFacility";
import { DepositRedemptionVaultAbi } from "./abis/DepositRedemptionVault";
import { getEnv } from "./src/utils/env";

export default createConfig({
  chains: {
    sepolia: {
      id: 11155111,
      rpc: [getEnv("PONDER_RPC_URL_11155111")],
    },
  },
  contracts: {
    ConvertibleDepositAuctioneer: {
      chain: "sepolia",
      abi: ConvertibleDepositAuctioneerAbi,
      address: "0xc14156AF3bF6c11b1c40C8f51f64bA5496870126",
      startBlock: 9180152,
    },
    ConvertibleDepositFacility: {
      chain: "sepolia",
      abi: ConvertibleDepositFacilityAbi,
      address: "0x87568265eb6Ea27f37613d242D4192B6f6771269",
      startBlock: 9180152,
    },
    DepositRedemptionVault: {
      chain: "sepolia",
      abi: DepositRedemptionVaultAbi,
      address: "0x69b2Be653BAB628116b360818BE75a2d97b45C4a",
      startBlock: 9180152,
    },
  },
});
