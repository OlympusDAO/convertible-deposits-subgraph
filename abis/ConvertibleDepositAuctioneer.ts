export const ConvertibleDepositAuctioneerAbi = [
  {
    type: "constructor",
    inputs: [
      {
        name: "kernel_",
        type: "address",
        internalType: "address",
      },
      {
        name: "cdFacility_",
        type: "address",
        internalType: "address",
      },
      {
        name: "depositAsset_",
        type: "address",
        internalType: "address",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "CD_FACILITY",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "contract ConvertibleDepositFacility",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "ONE_HUNDRED_PERCENT",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint24",
        internalType: "uint24",
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
    name: "ROLE_EMISSION_MANAGER",
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
    name: "bid",
    inputs: [
      {
        name: "depositPeriod_",
        type: "uint8",
        internalType: "uint8",
      },
      {
        name: "depositAmount_",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "minOhmOut_",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "wrapPosition_",
        type: "bool",
        internalType: "bool",
      },
      {
        name: "wrapReceipt_",
        type: "bool",
        internalType: "bool",
      },
    ],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
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
    name: "disableDepositPeriod",
    inputs: [
      {
        name: "depositPeriod_",
        type: "uint8",
        internalType: "uint8",
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
    name: "enableDepositPeriod",
    inputs: [
      {
        name: "depositPeriod_",
        type: "uint8",
        internalType: "uint8",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "getAuctionParameters",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "tuple",
        internalType: "struct IConvertibleDepositAuctioneer.AuctionParameters",
        components: [
          {
            name: "target",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "tickSize",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "minPrice",
            type: "uint256",
            internalType: "uint256",
          },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getAuctionResults",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "int256[]",
        internalType: "int256[]",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getAuctionResultsNextIndex",
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
    name: "getAuctionTrackingPeriod",
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
    name: "getCurrentTick",
    inputs: [
      {
        name: "depositPeriod_",
        type: "uint8",
        internalType: "uint8",
      },
    ],
    outputs: [
      {
        name: "tick",
        type: "tuple",
        internalType: "struct IConvertibleDepositAuctioneer.Tick",
        components: [
          {
            name: "price",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "capacity",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "lastUpdate",
            type: "uint48",
            internalType: "uint48",
          },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getCurrentTickSize",
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
    name: "getDayState",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "tuple",
        internalType: "struct IConvertibleDepositAuctioneer.Day",
        components: [
          {
            name: "initTimestamp",
            type: "uint48",
            internalType: "uint48",
          },
          {
            name: "convertible",
            type: "uint256",
            internalType: "uint256",
          },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getDepositAsset",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "contract IERC20",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getDepositPeriods",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint8[]",
        internalType: "uint8[]",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getDepositPeriodsCount",
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
    name: "getMinimumBid",
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
    name: "getPendingDepositPeriodChanges",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "tuple[]",
        internalType: "struct ConvertibleDepositAuctioneer.PendingDepositPeriodChange[]",
        components: [
          {
            name: "depositPeriod",
            type: "uint8",
            internalType: "uint8",
          },
          {
            name: "enable",
            type: "bool",
            internalType: "bool",
          },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getPreviousTick",
    inputs: [
      {
        name: "depositPeriod_",
        type: "uint8",
        internalType: "uint8",
      },
    ],
    outputs: [
      {
        name: "tick",
        type: "tuple",
        internalType: "struct IConvertibleDepositAuctioneer.Tick",
        components: [
          {
            name: "price",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "capacity",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "lastUpdate",
            type: "uint48",
            internalType: "uint48",
          },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getTickSizeBase",
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
    name: "getTickStep",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint24",
        internalType: "uint24",
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
    name: "isAuctionActive",
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
    name: "isDepositPeriodEnabled",
    inputs: [
      {
        name: "depositPeriod_",
        type: "uint8",
        internalType: "uint8",
      },
    ],
    outputs: [
      {
        name: "isEnabled",
        type: "bool",
        internalType: "bool",
      },
      {
        name: "isPendingEnabled",
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
    name: "previewBid",
    inputs: [
      {
        name: "depositPeriod_",
        type: "uint8",
        internalType: "uint8",
      },
      {
        name: "bidAmount_",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "ohmOut",
        type: "uint256",
        internalType: "uint256",
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
    name: "setAuctionParameters",
    inputs: [
      {
        name: "target_",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "tickSize_",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "minPrice_",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setAuctionTrackingPeriod",
    inputs: [
      {
        name: "days_",
        type: "uint8",
        internalType: "uint8",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setMinimumBid",
    inputs: [
      {
        name: "minimumBid_",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setTickSizeBase",
    inputs: [
      {
        name: "newBase_",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setTickStep",
    inputs: [
      {
        name: "newStep_",
        type: "uint24",
        internalType: "uint24",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
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
    type: "event",
    name: "AuctionParametersUpdated",
    inputs: [
      {
        name: "depositAsset",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "newTarget",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "newTickSize",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "newMinPrice",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "AuctionResult",
    inputs: [
      {
        name: "depositAsset",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "ohmConvertible",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "target",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "periodIndex",
        type: "uint8",
        indexed: false,
        internalType: "uint8",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "AuctionTrackingPeriodUpdated",
    inputs: [
      {
        name: "depositAsset",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "newAuctionTrackingPeriod",
        type: "uint8",
        indexed: false,
        internalType: "uint8",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "Bid",
    inputs: [
      {
        name: "bidder",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "depositAsset",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "depositPeriod",
        type: "uint8",
        indexed: true,
        internalType: "uint8",
      },
      {
        name: "depositAmount",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "convertedAmount",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "positionId",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "DepositPeriodDisableQueued",
    inputs: [
      {
        name: "depositAsset",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "depositPeriod",
        type: "uint8",
        indexed: false,
        internalType: "uint8",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "DepositPeriodDisabled",
    inputs: [
      {
        name: "depositAsset",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "depositPeriod",
        type: "uint8",
        indexed: false,
        internalType: "uint8",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "DepositPeriodEnableQueued",
    inputs: [
      {
        name: "depositAsset",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "depositPeriod",
        type: "uint8",
        indexed: false,
        internalType: "uint8",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "DepositPeriodEnabled",
    inputs: [
      {
        name: "depositAsset",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "depositPeriod",
        type: "uint8",
        indexed: false,
        internalType: "uint8",
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
    name: "MinimumBidUpdated",
    inputs: [
      {
        name: "depositAsset",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "newMinimumBid",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "TickSizeBaseUpdated",
    inputs: [
      {
        name: "depositAsset",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "newBase",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "TickStepUpdated",
    inputs: [
      {
        name: "depositAsset",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "newTickStep",
        type: "uint24",
        indexed: false,
        internalType: "uint24",
      },
    ],
    anonymous: false,
  },
  {
    type: "error",
    name: "ConvertibleDepositAuctioneer_BidBelowMinimum",
    inputs: [
      {
        name: "bidAmount",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "minimumBid",
        type: "uint256",
        internalType: "uint256",
      },
    ],
  },
  {
    type: "error",
    name: "ConvertibleDepositAuctioneer_ConvertedAmountSlippage",
    inputs: [
      {
        name: "ohmOut",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "minOhmOut",
        type: "uint256",
        internalType: "uint256",
      },
    ],
  },
  {
    type: "error",
    name: "ConvertibleDepositAuctioneer_ConvertedAmountZero",
    inputs: [],
  },
  {
    type: "error",
    name: "ConvertibleDepositAuctioneer_DepositPeriodInvalidState",
    inputs: [
      {
        name: "depositAsset",
        type: "address",
        internalType: "address",
      },
      {
        name: "depositPeriod",
        type: "uint8",
        internalType: "uint8",
      },
      {
        name: "isEnabled",
        type: "bool",
        internalType: "bool",
      },
    ],
  },
  {
    type: "error",
    name: "ConvertibleDepositAuctioneer_DepositPeriodNotEnabled",
    inputs: [
      {
        name: "depositAsset",
        type: "address",
        internalType: "address",
      },
      {
        name: "depositPeriod",
        type: "uint8",
        internalType: "uint8",
      },
    ],
  },
  {
    type: "error",
    name: "ConvertibleDepositAuctioneer_InvalidParams",
    inputs: [
      {
        name: "reason",
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
] as const;
