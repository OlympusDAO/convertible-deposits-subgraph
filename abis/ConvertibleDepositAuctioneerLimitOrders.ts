export const ConvertibleDepositAuctioneerLimitOrdersAbi = [
  {
    type: "constructor",
    inputs: [
      {
        name: "owner_",
        type: "address",
        internalType: "address",
      },
      {
        name: "depositManager_",
        type: "address",
        internalType: "address",
      },
      {
        name: "cdAuctioneer_",
        type: "address",
        internalType: "address",
      },
      {
        name: "usds_",
        type: "address",
        internalType: "address",
      },
      {
        name: "sUsds_",
        type: "address",
        internalType: "address",
      },
      {
        name: "positionNft_",
        type: "address",
        internalType: "address",
      },
      {
        name: "yieldRecipient_",
        type: "address",
        internalType: "address",
      },
      {
        name: "depositPeriods_",
        type: "uint8[]",
        internalType: "uint8[]",
      },
      {
        name: "receiptTokens_",
        type: "address[]",
        internalType: "address[]",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "CD_AUCTIONEER",
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
    name: "DEPOSIT_MANAGER",
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
    name: "POSITION_NFT",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "contract ERC721",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "SUSDS",
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
    name: "USDS",
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
    name: "addDepositPeriod",
    inputs: [
      {
        name: "depositPeriod_",
        type: "uint8",
        internalType: "uint8",
      },
      {
        name: "receiptToken_",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "calculateIncentive",
    inputs: [
      {
        name: "orderId_",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "fillAmount_",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "incentive",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "incentiveRate",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "canFillOrder",
    inputs: [
      {
        name: "orderId_",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "fillAmount_",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "canFill",
        type: "bool",
        internalType: "bool",
      },
      {
        name: "reason",
        type: "string",
        internalType: "string",
      },
      {
        name: "effectivePrice",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "cancelOrder",
    inputs: [
      {
        name: "orderId_",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "createOrder",
    inputs: [
      {
        name: "depositPeriod_",
        type: "uint8",
        internalType: "uint8",
      },
      {
        name: "depositBudget_",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "incentiveBudget_",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "maxPrice_",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "minFillSize_",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "orderId",
        type: "uint256",
        internalType: "uint256",
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
    name: "fillOrder",
    inputs: [
      {
        name: "orderId_",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "fillAmount_",
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
    name: "getAccruedYield",
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
    name: "getAccruedYieldShares",
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
    name: "getExecutionPrice",
    inputs: [
      {
        name: "depositPeriod_",
        type: "uint8",
        internalType: "uint8",
      },
      {
        name: "fillAmount_",
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
    name: "getFillableOrders",
    inputs: [
      {
        name: "depositPeriod_",
        type: "uint8",
        internalType: "uint8",
      },
      {
        name: "index0",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "index1",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "",
        type: "uint256[]",
        internalType: "uint256[]",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getFillableOrders",
    inputs: [
      {
        name: "depositPeriod_",
        type: "uint8",
        internalType: "uint8",
      },
    ],
    outputs: [
      {
        name: "",
        type: "uint256[]",
        internalType: "uint256[]",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getOrder",
    inputs: [
      {
        name: "orderId_",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "",
        type: "tuple",
        internalType: "struct ILimitOrders.LimitOrder",
        components: [
          {
            name: "owner",
            type: "address",
            internalType: "address",
          },
          {
            name: "depositPeriod",
            type: "uint8",
            internalType: "uint8",
          },
          {
            name: "active",
            type: "bool",
            internalType: "bool",
          },
          {
            name: "depositBudget",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "incentiveBudget",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "depositSpent",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "incentiveSpent",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "maxPrice",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "minFillSize",
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
    name: "getOrdersForUser",
    inputs: [
      {
        name: "user_",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [
      {
        name: "",
        type: "uint256[]",
        internalType: "uint256[]",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getRemaining",
    inputs: [
      {
        name: "orderId_",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "deposit",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "incentive",
        type: "uint256",
        internalType: "uint256",
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
    name: "nextOrderId",
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
    name: "onERC721Received",
    inputs: [
      {
        name: "",
        type: "address",
        internalType: "address",
      },
      {
        name: "",
        type: "address",
        internalType: "address",
      },
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "",
        type: "bytes",
        internalType: "bytes",
      },
    ],
    outputs: [
      {
        name: "",
        type: "bytes4",
        internalType: "bytes4",
      },
    ],
    stateMutability: "pure",
  },
  {
    type: "function",
    name: "owner",
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
    name: "previewFillOrder",
    inputs: [
      {
        name: "orderId_",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "fillAmount_",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "canFill",
        type: "bool",
        internalType: "bool",
      },
      {
        name: "reason",
        type: "string",
        internalType: "string",
      },
      {
        name: "effectivePrice",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "incentive",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "receiptTokens",
    inputs: [
      {
        name: "depositPeriod",
        type: "uint8",
        internalType: "uint8",
      },
    ],
    outputs: [
      {
        name: "receiptToken",
        type: "address",
        internalType: "contract ERC20",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "removeDepositPeriod",
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
    name: "renounceOwnership",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setYieldRecipient",
    inputs: [
      {
        name: "newRecipient_",
        type: "address",
        internalType: "address",
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
    type: "function",
    name: "sweepYield",
    inputs: [],
    outputs: [
      {
        name: "shares",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "totalUsdsOwed",
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
    name: "transferOwnership",
    inputs: [
      {
        name: "newOwner",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "yieldRecipient",
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
    type: "event",
    name: "DepositPeriodAdded",
    inputs: [
      {
        name: "depositPeriod",
        type: "uint8",
        indexed: true,
        internalType: "uint8",
      },
      {
        name: "receiptToken",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "DepositPeriodRemoved",
    inputs: [
      {
        name: "depositPeriod",
        type: "uint8",
        indexed: true,
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
    name: "OrderCancelled",
    inputs: [
      {
        name: "orderId",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "usdsReturned",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "OrderCreated",
    inputs: [
      {
        name: "orderId",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "owner",
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
      {
        name: "depositBudget",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "incentiveBudget",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "maxPrice",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "minFillSize",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "OrderFilled",
    inputs: [
      {
        name: "orderId",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "filler",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "fillAmount",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "incentivePaid",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "ohmOut",
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
    name: "OwnershipTransferred",
    inputs: [
      {
        name: "previousOwner",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "newOwner",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "YieldRecipientUpdated",
    inputs: [
      {
        name: "newRecipient",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "YieldSwept",
    inputs: [
      {
        name: "recipient",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "sUsdsAmount",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "error",
    name: "ArrayLengthMismatch",
    inputs: [],
  },
  {
    type: "error",
    name: "DepositPeriodNotEnabled",
    inputs: [],
  },
  {
    type: "error",
    name: "ERC721InvalidReceiver",
    inputs: [
      {
        name: "receiver",
        type: "address",
        internalType: "address",
      },
    ],
  },
  {
    type: "error",
    name: "FillBelowMinimum",
    inputs: [],
  },
  {
    type: "error",
    name: "InvalidParam",
    inputs: [
      {
        name: "param",
        type: "string",
        internalType: "string",
      },
    ],
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
    name: "NotOrderOwner",
    inputs: [],
  },
  {
    type: "error",
    name: "OrderFullySpent",
    inputs: [],
  },
  {
    type: "error",
    name: "OrderNotActive",
    inputs: [],
  },
  {
    type: "error",
    name: "OwnableInvalidOwner",
    inputs: [
      {
        name: "owner",
        type: "address",
        internalType: "address",
      },
    ],
  },
  {
    type: "error",
    name: "OwnableUnauthorizedAccount",
    inputs: [
      {
        name: "account",
        type: "address",
        internalType: "address",
      },
    ],
  },
  {
    type: "error",
    name: "PriceAboveMax",
    inputs: [],
  },
  {
    type: "error",
    name: "ReceiptTokenNotConfigured",
    inputs: [],
  },
  {
    type: "error",
    name: "ReentrancyGuardReentrantCall",
    inputs: [],
  },
  {
    type: "error",
    name: "SafeERC20FailedOperation",
    inputs: [
      {
        name: "token",
        type: "address",
        internalType: "address",
      },
    ],
  },
  {
    type: "error",
    name: "ZeroOhmOut",
    inputs: [],
  },
] as const;
