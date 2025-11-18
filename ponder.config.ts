import { createConfig } from "ponder";

import { ConvertibleDepositAuctioneerAbi } from "./abis/ConvertibleDepositAuctioneer";
import { ConvertibleDepositFacilityAbi } from "./abis/ConvertibleDepositFacility";
import { DepositRedemptionVaultAbi } from "./abis/DepositRedemptionVault";
import { EmissionManagerAbi } from "./abis/EmissionManager";
import { getTransport } from "./src/utils/rpc";

const START_BLOCK_SEPOLIA = 9180152;
const START_BLOCK_MAINNET = 23747531;

export default createConfig({
  chains: {
    mainnet: {
      id: 1,
      rpc: getTransport(1),
    },
    sepolia: {
      id: 11155111,
      rpc: getTransport(11155111),
    },
  },
  contracts: {
    ConvertibleDepositAuctioneer: {
      abi: ConvertibleDepositAuctioneerAbi,
      chain: {
        mainnet: {
          address: [
            "0xF35193DA8C10e44aF10853Ba5a3a1a6F7529E39a", // Commit SHA: 06cd3728b58af36639dea8a6f0a3c4d79f557b65
          ],
          startBlock: START_BLOCK_MAINNET,
        },
        sepolia: {
          address: [
            "0xc14156AF3bF6c11b1c40C8f51f64bA5496870126", // Commit SHA: dfae803d86eb902c328dd81bbe6162eb69c7cbd8
            "0x247f1989aDc0F63D07b91Bf645De879b9de06fbB", // Commit SHA: bad6eee15e2c2c2bdfd128e5516f680e16633bef
          ],
          startBlock: START_BLOCK_SEPOLIA,
        },
      },
    },
    ConvertibleDepositFacility: {
      abi: ConvertibleDepositFacilityAbi,
      chain: {
        mainnet: {
          address: [
            "0xEBDe552D851DD6Dfd3D360C596D3F4aF6e5F9678", // Commit SHA: 06cd3728b58af36639dea8a6f0a3c4d79f557b65
          ],
          startBlock: START_BLOCK_MAINNET,
        },
        sepolia: {
          address: [
            "0x87568265eb6Ea27f37613d242D4192B6f6771269", // Commit SHA: dfae803d86eb902c328dd81bbe6162eb69c7cbd8
            "0x0bE69702E83f06A027E6841B614f6946d1265441", // Commit SHA: bad6eee15e2c2c2bdfd128e5516f680e16633bef
          ],
          startBlock: START_BLOCK_SEPOLIA,
        },
      },
    },
    DepositRedemptionVault: {
      abi: DepositRedemptionVaultAbi,
      chain: {
        mainnet: {
          address: [
            "0x20a3d8510f2e1176E8Db4CeA9883a8287a9029Db", // Commit SHA: 06cd3728b58af36639dea8a6f0a3c4d79f557b65
          ],
          startBlock: START_BLOCK_MAINNET,
        },
        sepolia: {
          address: [
            "0x69b2Be653BAB628116b360818BE75a2d97b45C4a", // Commit SHA: dfae803d86eb902c328dd81bbe6162eb69c7cbd8
            "0x93AcaDa86ad23C85e96869D46945fA6FFb7a4036", // Commit SHA: bad6eee15e2c2c2bdfd128e5516f680e16633bef
          ],
          startBlock: START_BLOCK_SEPOLIA,
        },
      },
    },
    EmissionManager: {
      abi: EmissionManagerAbi,
      chain: {
        mainnet: {
          address: [
            "0xA61b846D5D8b757e3d541E0e4F80390E28f0B6Ff", // Commit SHA: 958ed6e1242d8aa6c4fa17edf6738a98a3f9102c
          ],
          startBlock: START_BLOCK_MAINNET,
        },
        sepolia: {
          address: [
            "0x9dC1920981Fcf74786C838Bf6f6c3683a8713576", // Commit SHA: dfae803d86eb902c328dd81bbe6162eb69c7cbd8
            "0x84785E392BfD02F97A9b84F85d86DEc11933ef81", // Commit SHA: bad6eee15e2c2c2bdfd128e5516f680e16633bef
          ],
          startBlock: START_BLOCK_SEPOLIA,
        },
      },
    },
  },
  blocks: {
    Snapshot: {
      chain: {
        mainnet: {
          interval: 3000, // ~1 hour at 12s block time
          startBlock: START_BLOCK_MAINNET,
        },
        sepolia: {
          interval: 3000, // ~1 hour at 12s block time
          startBlock: START_BLOCK_SEPOLIA,
        },
      },
    },
  },
});
