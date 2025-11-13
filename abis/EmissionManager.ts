export const EmissionManagerAbi = [
  {
    type: "constructor",
    inputs: [
      {
        name: "kernel_",
        type: "address",
        internalType: "contract Kernel",
      },
      {
        name: "ohm_",
        type: "address",
        internalType: "address",
      },
      {
        name: "gohm_",
        type: "address",
        internalType: "address",
      },
      {
        name: "reserve_",
        type: "address",
        internalType: "address",
      },
      {
        name: "sReserve_",
        type: "address",
        internalType: "address",
      },
      {
        name: "bondAuctioneer_",
        type: "address",
        internalType: "address",
      },
      {
        name: "cdAuctioneer_",
        type: "address",
        internalType: "address",
      },
      {
        name: "teller_",
        type: "address",
        internalType: "address",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "CHREG",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "contract CHREGv1",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "MINTR",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "contract MINTRv1",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "PRICE",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "contract PRICEv1",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "ROLES",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "contract ROLESv1",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "ROLE_EM_MANAGER",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "bytes32",
        internalType: "bytes32",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "ROLE_HEART",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "bytes32",
        internalType: "bytes32",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "TRSRY",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "contract TRSRYv1",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "VERSION",
    inputs: [],
    outputs: [
      {
        name: "major",
        type: "uint8",
        internalType: "uint8",
      },
      {
        name: "minor",
        type: "uint8",
        internalType: "uint8",
      },
    ],
    stateMutability: "pure",
  },
  {
    type: "function",
    name: "activeMarketId",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "backing",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "baseEmissionRate",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "beatCounter",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint8",
        internalType: "uint8",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "bondAuctioneer",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "contract IBondSDA",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "bondMarketCapacityScalar",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "bondMarketPendingCapacity",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "callback",
    inputs: [
      {
        name: "id_",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "inputAmount_",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "outputAmount_",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "cdAuctioneer",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "contract IConvertibleDepositAuctioneer",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "changeBaseRate",
    inputs: [
      {
        name: "changeBy_",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "forNumBeats_",
        type: "uint48",
        internalType: "uint48",
      },
      {
        name: "add",
        type: "bool",
        internalType: "bool",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "changeKernel",
    inputs: [
      {
        name: "newKernel_",
        type: "address",
        internalType: "contract Kernel",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "configureDependencies",
    inputs: [],
    outputs: [
      {
        name: "dependencies",
        type: "bytes5[]",
        internalType: "Keycode[]",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "createPendingBondMarket",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "disable",
    inputs: [
      {
        name: "disableData_",
        type: "bytes",
        internalType: "bytes",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "enable",
    inputs: [
      {
        name: "enableData_",
        type: "bytes",
        internalType: "bytes",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "execute",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "getMinPriceFor",
    inputs: [
      {
        name: "price",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getNextEmission",
    inputs: [],
    outputs: [
      {
        name: "premium",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "emissionRate",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "emission",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getPremium",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getReserves",
    inputs: [],
    outputs: [
      {
        name: "reserves",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getSizeFor",
    inputs: [
      {
        name: "target",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "size",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getSupply",
    inputs: [],
    outputs: [
      {
        name: "supply",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "gohm",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "contract IgOHM",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "isActive",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "bool",
        internalType: "bool",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "isEnabled",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "bool",
        internalType: "bool",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "kernel",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "contract Kernel",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "minPriceScalar",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "minimumPremium",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "ohm",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "contract ERC20",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "rateChange",
    inputs: [],
    outputs: [
      {
        name: "changeBy",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "daysLeft",
        type: "uint48",
        internalType: "uint48",
      },
      {
        name: "addition",
        type: "bool",
        internalType: "bool",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "requestPermissions",
    inputs: [],
    outputs: [
      {
        name: "permissions",
        type: "tuple[]",
        internalType: "struct Permissions[]",
        components: [
          {
            name: "keycode",
            type: "bytes5",
            internalType: "Keycode",
          },
          {
            name: "funcSelector",
            type: "bytes4",
            internalType: "bytes4",
          },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "rescue",
    inputs: [
      {
        name: "token_",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "reserve",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "contract ERC20",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "restart",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "restartTimeframe",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint48",
        internalType: "uint48",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "sReserve",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "contract ERC4626",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "setBacking",
    inputs: [
      {
        name: "newBacking",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setBondContracts",
    inputs: [
      {
        name: "bondAuctioneer_",
        type: "address",
        internalType: "address",
      },
      {
        name: "teller_",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setBondMarketCapacityScalar",
    inputs: [
      {
        name: "newScalar",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setCDAuctionContract",
    inputs: [
      {
        name: "cdAuctioneer_",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setMinPriceScalar",
    inputs: [
      {
        name: "newScalar",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setMinimumPremium",
    inputs: [
      {
        name: "newMinimumPremium_",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setRestartTimeframe",
    inputs: [
      {
        name: "newTimeframe",
        type: "uint48",
        internalType: "uint48",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setTickSize",
    inputs: [
      {
        name: "newTickSize_",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setVestingPeriod",
    inputs: [
      {
        name: "newVestingPeriod_",
        type: "uint48",
        internalType: "uint48",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "shutdownTimestamp",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint48",
        internalType: "uint48",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "supportsInterface",
    inputs: [
      {
        name: "interfaceId",
        type: "bytes4",
        internalType: "bytes4",
      },
    ],
    outputs: [
      {
        name: "",
        type: "bool",
        internalType: "bool",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "teller",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "address",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "tickSize",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "vestingPeriod",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint48",
        internalType: "uint48",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "event",
    name: "BackingChanged",
    inputs: [
      {
        name: "newBacking",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "BackingUpdated",
    inputs: [
      {
        name: "newBacking",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "supplyAdded",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "reservesAdded",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "BaseRateChanged",
    inputs: [
      {
        name: "changeBy",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "forNumBeats",
        type: "uint48",
        indexed: false,
        internalType: "uint48",
      },
      {
        name: "add",
        type: "bool",
        indexed: false,
        internalType: "bool",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "BondContractsSet",
    inputs: [
      {
        name: "auctioneer",
        type: "address",
        indexed: false,
        internalType: "address",
      },
      {
        name: "teller",
        type: "address",
        indexed: false,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "BondMarketCapacityScalarChanged",
    inputs: [
      {
        name: "newBondMarketCapacityScalar",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "BondMarketCreationFailed",
    inputs: [
      {
        name: "saleAmount",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "ConvertibleDepositAuctioneerSet",
    inputs: [
      {
        name: "auctioneer",
        type: "address",
        indexed: false,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "Disabled",
    inputs: [],
    anonymous: false,
  },
  {
    type: "event",
    name: "Enabled",
    inputs: [],
    anonymous: false,
  },
  {
    type: "event",
    name: "MinPriceScalarChanged",
    inputs: [
      {
        name: "newMinPriceScalar",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "MinimumPremiumChanged",
    inputs: [
      {
        name: "newMinimumPremium",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "RestartTimeframeChanged",
    inputs: [
      {
        name: "newRestartTimeframe",
        type: "uint48",
        indexed: false,
        internalType: "uint48",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "SaleCreated",
    inputs: [
      {
        name: "marketID",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "saleAmount",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "TickSizeChanged",
    inputs: [
      {
        name: "newTickSize",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "VestingPeriodChanged",
    inputs: [
      {
        name: "newVestingPeriod",
        type: "uint48",
        indexed: false,
        internalType: "uint48",
      },
    ],
    anonymous: false,
  },
  {
    type: "error",
    name: "CannotRestartYet",
    inputs: [
      {
        name: "availableAt",
        type: "uint48",
        internalType: "uint48",
      },
    ],
  },
  {
    type: "error",
    name: "InvalidCallback",
    inputs: [],
  },
  {
    type: "error",
    name: "InvalidMarket",
    inputs: [],
  },
  {
    type: "error",
    name: "InvalidParam",
    inputs: [
      {
        name: "parameter",
        type: "string",
        internalType: "string",
      },
    ],
  },
  {
    type: "error",
    name: "KernelAdapter_OnlyKernel",
    inputs: [
      {
        name: "caller_",
        type: "address",
        internalType: "address",
      },
    ],
  },
  {
    type: "error",
    name: "NotAuthorised",
    inputs: [],
  },
  {
    type: "error",
    name: "NotDisabled",
    inputs: [],
  },
  {
    type: "error",
    name: "NotEnabled",
    inputs: [],
  },
  {
    type: "error",
    name: "OnlyTeller",
    inputs: [],
  },
  {
    type: "error",
    name: "Policy_ModuleDoesNotExist",
    inputs: [
      {
        name: "keycode_",
        type: "bytes5",
        internalType: "Keycode",
      },
    ],
  },
  {
    type: "error",
    name: "Policy_WrongModuleVersion",
    inputs: [
      {
        name: "expected_",
        type: "bytes",
        internalType: "bytes",
      },
    ],
  },
  {
    type: "error",
    name: "ROLES_RequireRole",
    inputs: [
      {
        name: "role_",
        type: "bytes32",
        internalType: "bytes32",
      },
    ],
  },
  {
    type: "error",
    name: "RestartTimeframePassed",
    inputs: [],
  },
] as const;
