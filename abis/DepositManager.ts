export const DepositManagerAbi = [
  {
    type: "constructor",
    inputs: [
      {
        name: "kernel_",
        type: "address",
        internalType: "address",
      },
      {
        name: "tokenManager_",
        type: "address",
        internalType: "address",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "ONE_HUNDRED_PERCENT",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint16",
        internalType: "uint16",
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
    name: "ROLE_DEPOSIT_OPERATOR",
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
    name: "addAsset",
    inputs: [
      {
        name: "asset_",
        type: "address",
        internalType: "contract IERC20",
      },
      {
        name: "vault_",
        type: "address",
        internalType: "contract IERC4626",
      },
      {
        name: "depositCap_",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "minimumDeposit_",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "addAssetPeriod",
    inputs: [
      {
        name: "asset_",
        type: "address",
        internalType: "contract IERC20",
      },
      {
        name: "depositPeriod_",
        type: "uint8",
        internalType: "uint8",
      },
      {
        name: "operator_",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [
      {
        name: "receiptTokenId",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "borrowingDefault",
    inputs: [
      {
        name: "params_",
        type: "tuple",
        internalType: "struct IDepositManager.BorrowingDefaultParams",
        components: [
          {
            name: "asset",
            type: "address",
            internalType: "contract IERC20",
          },
          {
            name: "depositPeriod",
            type: "uint8",
            internalType: "uint8",
          },
          {
            name: "payer",
            type: "address",
            internalType: "address",
          },
          {
            name: "amount",
            type: "uint256",
            internalType: "uint256",
          },
        ],
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "borrowingRepay",
    inputs: [
      {
        name: "params_",
        type: "tuple",
        internalType: "struct IDepositManager.BorrowingRepayParams",
        components: [
          {
            name: "asset",
            type: "address",
            internalType: "contract IERC20",
          },
          {
            name: "payer",
            type: "address",
            internalType: "address",
          },
          {
            name: "amount",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "maxAmount",
            type: "uint256",
            internalType: "uint256",
          },
        ],
      },
    ],
    outputs: [
      {
        name: "actualAmount",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "borrowingWithdraw",
    inputs: [
      {
        name: "params_",
        type: "tuple",
        internalType: "struct IDepositManager.BorrowingWithdrawParams",
        components: [
          {
            name: "asset",
            type: "address",
            internalType: "contract IERC20",
          },
          {
            name: "recipient",
            type: "address",
            internalType: "address",
          },
          {
            name: "amount",
            type: "uint256",
            internalType: "uint256",
          },
        ],
      },
    ],
    outputs: [
      {
        name: "actualAmount",
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
    name: "claimYield",
    inputs: [
      {
        name: "asset_",
        type: "address",
        internalType: "contract IERC20",
      },
      {
        name: "recipient_",
        type: "address",
        internalType: "address",
      },
      {
        name: "amount_",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "actualAmount",
        type: "uint256",
        internalType: "uint256",
      },
    ],
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
    name: "deposit",
    inputs: [
      {
        name: "params_",
        type: "tuple",
        internalType: "struct IDepositManager.DepositParams",
        components: [
          {
            name: "asset",
            type: "address",
            internalType: "contract IERC20",
          },
          {
            name: "depositPeriod",
            type: "uint8",
            internalType: "uint8",
          },
          {
            name: "depositor",
            type: "address",
            internalType: "address",
          },
          {
            name: "amount",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "shouldWrap",
            type: "bool",
            internalType: "bool",
          },
        ],
      },
    ],
    outputs: [
      {
        name: "receiptTokenId",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "actualAmount",
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
    name: "disableAssetPeriod",
    inputs: [
      {
        name: "asset_",
        type: "address",
        internalType: "contract IERC20",
      },
      {
        name: "depositPeriod_",
        type: "uint8",
        internalType: "uint8",
      },
      {
        name: "operator_",
        type: "address",
        internalType: "address",
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
    name: "enableAssetPeriod",
    inputs: [
      {
        name: "asset_",
        type: "address",
        internalType: "contract IERC20",
      },
      {
        name: "depositPeriod_",
        type: "uint8",
        internalType: "uint8",
      },
      {
        name: "operator_",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "getAssetConfiguration",
    inputs: [
      {
        name: "asset_",
        type: "address",
        internalType: "contract IERC20",
      },
    ],
    outputs: [
      {
        name: "configuration",
        type: "tuple",
        internalType: "struct IAssetManager.AssetConfiguration",
        components: [
          {
            name: "isConfigured",
            type: "bool",
            internalType: "bool",
          },
          {
            name: "depositCap",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "minimumDeposit",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "vault",
            type: "address",
            internalType: "address",
          },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getAssetPeriod",
    inputs: [
      {
        name: "tokenId_",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "",
        type: "tuple",
        internalType: "struct IDepositManager.AssetPeriod",
        components: [
          {
            name: "isEnabled",
            type: "bool",
            internalType: "bool",
          },
          {
            name: "depositPeriod",
            type: "uint8",
            internalType: "uint8",
          },
          {
            name: "asset",
            type: "address",
            internalType: "address",
          },
          {
            name: "operator",
            type: "address",
            internalType: "address",
          },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getAssetPeriod",
    inputs: [
      {
        name: "asset_",
        type: "address",
        internalType: "contract IERC20",
      },
      {
        name: "depositPeriod_",
        type: "uint8",
        internalType: "uint8",
      },
      {
        name: "operator_",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [
      {
        name: "",
        type: "tuple",
        internalType: "struct IDepositManager.AssetPeriod",
        components: [
          {
            name: "isEnabled",
            type: "bool",
            internalType: "bool",
          },
          {
            name: "depositPeriod",
            type: "uint8",
            internalType: "uint8",
          },
          {
            name: "asset",
            type: "address",
            internalType: "address",
          },
          {
            name: "operator",
            type: "address",
            internalType: "address",
          },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getAssetPeriods",
    inputs: [],
    outputs: [
      {
        name: "assetPeriods",
        type: "tuple[]",
        internalType: "struct IDepositManager.AssetPeriod[]",
        components: [
          {
            name: "isEnabled",
            type: "bool",
            internalType: "bool",
          },
          {
            name: "depositPeriod",
            type: "uint8",
            internalType: "uint8",
          },
          {
            name: "asset",
            type: "address",
            internalType: "address",
          },
          {
            name: "operator",
            type: "address",
            internalType: "address",
          },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getBorrowedAmount",
    inputs: [
      {
        name: "asset_",
        type: "address",
        internalType: "contract IERC20",
      },
      {
        name: "operator_",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [
      {
        name: "borrowed",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getBorrowingCapacity",
    inputs: [
      {
        name: "asset_",
        type: "address",
        internalType: "contract IERC20",
      },
      {
        name: "operator_",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [
      {
        name: "capacity",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getConfiguredAssets",
    inputs: [],
    outputs: [
      {
        name: "assets",
        type: "address[]",
        internalType: "contract IERC20[]",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getOperatorAssets",
    inputs: [
      {
        name: "asset_",
        type: "address",
        internalType: "contract IERC20",
      },
      {
        name: "operator_",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [
      {
        name: "shares",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "sharesInAssets",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getOperatorLiabilities",
    inputs: [
      {
        name: "asset_",
        type: "address",
        internalType: "contract IERC20",
      },
      {
        name: "operator_",
        type: "address",
        internalType: "address",
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
    name: "getOperatorName",
    inputs: [
      {
        name: "operator_",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [
      {
        name: "",
        type: "string",
        internalType: "string",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getReceiptToken",
    inputs: [
      {
        name: "asset_",
        type: "address",
        internalType: "contract IERC20",
      },
      {
        name: "depositPeriod_",
        type: "uint8",
        internalType: "uint8",
      },
      {
        name: "operator_",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [
      {
        name: "tokenId",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "wrappedToken",
        type: "address",
        internalType: "address",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getReceiptTokenId",
    inputs: [
      {
        name: "asset_",
        type: "address",
        internalType: "contract IERC20",
      },
      {
        name: "depositPeriod_",
        type: "uint8",
        internalType: "uint8",
      },
      {
        name: "operator_",
        type: "address",
        internalType: "address",
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
    name: "getReceiptTokenIds",
    inputs: [],
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
    name: "getReceiptTokenManager",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "contract IReceiptTokenManager",
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
    name: "isAssetPeriod",
    inputs: [
      {
        name: "asset_",
        type: "address",
        internalType: "contract IERC20",
      },
      {
        name: "depositPeriod_",
        type: "uint8",
        internalType: "uint8",
      },
      {
        name: "operator_",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [
      {
        name: "status",
        type: "tuple",
        internalType: "struct IDepositManager.AssetPeriodStatus",
        components: [
          {
            name: "isConfigured",
            type: "bool",
            internalType: "bool",
          },
          {
            name: "isEnabled",
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
    name: "maxClaimYield",
    inputs: [
      {
        name: "asset_",
        type: "address",
        internalType: "contract IERC20",
      },
      {
        name: "operator_",
        type: "address",
        internalType: "address",
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
    name: "setAssetDepositCap",
    inputs: [
      {
        name: "asset_",
        type: "address",
        internalType: "contract IERC20",
      },
      {
        name: "depositCap_",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setAssetMinimumDeposit",
    inputs: [
      {
        name: "asset_",
        type: "address",
        internalType: "contract IERC20",
      },
      {
        name: "minimumDeposit_",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setOperatorName",
    inputs: [
      {
        name: "operator_",
        type: "address",
        internalType: "address",
      },
      {
        name: "name_",
        type: "string",
        internalType: "string",
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
    name: "withdraw",
    inputs: [
      {
        name: "params_",
        type: "tuple",
        internalType: "struct IDepositManager.WithdrawParams",
        components: [
          {
            name: "asset",
            type: "address",
            internalType: "contract IERC20",
          },
          {
            name: "depositPeriod",
            type: "uint8",
            internalType: "uint8",
          },
          {
            name: "depositor",
            type: "address",
            internalType: "address",
          },
          {
            name: "recipient",
            type: "address",
            internalType: "address",
          },
          {
            name: "amount",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "isWrapped",
            type: "bool",
            internalType: "bool",
          },
        ],
      },
    ],
    outputs: [
      {
        name: "actualAmount",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "event",
    name: "AssetConfigured",
    inputs: [
      {
        name: "asset",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "vault",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "AssetDepositCapSet",
    inputs: [
      {
        name: "asset",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "depositCap",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "AssetDeposited",
    inputs: [
      {
        name: "asset",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "depositor",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "operator",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "amount",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "shares",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "AssetMinimumDepositSet",
    inputs: [
      {
        name: "asset",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "minimumDeposit",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "AssetPeriodConfigured",
    inputs: [
      {
        name: "receiptTokenId",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "asset",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "operator",
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
    name: "AssetPeriodDisabled",
    inputs: [
      {
        name: "receiptTokenId",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "asset",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "operator",
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
    name: "AssetPeriodEnabled",
    inputs: [
      {
        name: "receiptTokenId",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "asset",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "operator",
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
    name: "AssetWithdrawn",
    inputs: [
      {
        name: "asset",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "withdrawer",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "operator",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "amount",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "shares",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "BorrowingDefault",
    inputs: [
      {
        name: "asset",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "operator",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "payer",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "amount",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "BorrowingRepayment",
    inputs: [
      {
        name: "asset",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "operator",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "payer",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "amount",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "BorrowingWithdrawal",
    inputs: [
      {
        name: "asset",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "operator",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "recipient",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "amount",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
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
    name: "OperatorNameSet",
    inputs: [
      {
        name: "operator",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "name",
        type: "string",
        indexed: false,
        internalType: "string",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "OperatorYieldClaimed",
    inputs: [
      {
        name: "asset",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "depositor",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "operator",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "amount",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "TokenRescued",
    inputs: [
      {
        name: "token",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "amount",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "error",
    name: "AssetManager_AssetAlreadyConfigured",
    inputs: [],
  },
  {
    type: "error",
    name: "AssetManager_DepositCapExceeded",
    inputs: [
      {
        name: "asset",
        type: "address",
        internalType: "address",
      },
      {
        name: "existingDepositAmount",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "depositCap",
        type: "uint256",
        internalType: "uint256",
      },
    ],
  },
  {
    type: "error",
    name: "AssetManager_InvalidAsset",
    inputs: [],
  },
  {
    type: "error",
    name: "AssetManager_MinimumDepositExceedsDepositCap",
    inputs: [
      {
        name: "asset",
        type: "address",
        internalType: "address",
      },
      {
        name: "minimumDeposit",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "depositCap",
        type: "uint256",
        internalType: "uint256",
      },
    ],
  },
  {
    type: "error",
    name: "AssetManager_MinimumDepositNotMet",
    inputs: [
      {
        name: "asset",
        type: "address",
        internalType: "address",
      },
      {
        name: "depositAmount",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "minimumDeposit",
        type: "uint256",
        internalType: "uint256",
      },
    ],
  },
  {
    type: "error",
    name: "AssetManager_NotConfigured",
    inputs: [],
  },
  {
    type: "error",
    name: "AssetManager_VaultAssetMismatch",
    inputs: [],
  },
  {
    type: "error",
    name: "AssetManager_ZeroAmount",
    inputs: [],
  },
  {
    type: "error",
    name: "DepositManager_AssetPeriodDisabled",
    inputs: [
      {
        name: "asset",
        type: "address",
        internalType: "address",
      },
      {
        name: "depositPeriod",
        type: "uint8",
        internalType: "uint8",
      },
      {
        name: "operator",
        type: "address",
        internalType: "address",
      },
    ],
  },
  {
    type: "error",
    name: "DepositManager_AssetPeriodEnabled",
    inputs: [
      {
        name: "asset",
        type: "address",
        internalType: "address",
      },
      {
        name: "depositPeriod",
        type: "uint8",
        internalType: "uint8",
      },
      {
        name: "operator",
        type: "address",
        internalType: "address",
      },
    ],
  },
  {
    type: "error",
    name: "DepositManager_AssetPeriodExists",
    inputs: [
      {
        name: "asset",
        type: "address",
        internalType: "address",
      },
      {
        name: "depositPeriod",
        type: "uint8",
        internalType: "uint8",
      },
      {
        name: "operator",
        type: "address",
        internalType: "address",
      },
    ],
  },
  {
    type: "error",
    name: "DepositManager_BorrowedAmountExceeded",
    inputs: [
      {
        name: "asset",
        type: "address",
        internalType: "address",
      },
      {
        name: "operator",
        type: "address",
        internalType: "address",
      },
      {
        name: "amount",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "borrowed",
        type: "uint256",
        internalType: "uint256",
      },
    ],
  },
  {
    type: "error",
    name: "DepositManager_BorrowingLimitExceeded",
    inputs: [
      {
        name: "asset",
        type: "address",
        internalType: "address",
      },
      {
        name: "operator",
        type: "address",
        internalType: "address",
      },
      {
        name: "requested",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "available",
        type: "uint256",
        internalType: "uint256",
      },
    ],
  },
  {
    type: "error",
    name: "DepositManager_CannotRescueAsset",
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
    name: "DepositManager_Insolvent",
    inputs: [
      {
        name: "asset",
        type: "address",
        internalType: "address",
      },
      {
        name: "requiredAssets",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "depositedSharesInAssets",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "borrowedAmount",
        type: "uint256",
        internalType: "uint256",
      },
    ],
  },
  {
    type: "error",
    name: "DepositManager_InvalidAssetPeriod",
    inputs: [
      {
        name: "asset",
        type: "address",
        internalType: "address",
      },
      {
        name: "depositPeriod",
        type: "uint8",
        internalType: "uint8",
      },
      {
        name: "operator",
        type: "address",
        internalType: "address",
      },
    ],
  },
  {
    type: "error",
    name: "DepositManager_InvalidParams",
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
    name: "DepositManager_OperatorNameInUse",
    inputs: [
      {
        name: "name",
        type: "string",
        internalType: "string",
      },
    ],
  },
  {
    type: "error",
    name: "DepositManager_OperatorNameInvalid",
    inputs: [],
  },
  {
    type: "error",
    name: "DepositManager_OperatorNameNotSet",
    inputs: [
      {
        name: "operator",
        type: "address",
        internalType: "address",
      },
    ],
  },
  {
    type: "error",
    name: "DepositManager_OperatorNameSet",
    inputs: [
      {
        name: "operator",
        type: "address",
        internalType: "address",
      },
    ],
  },
  {
    type: "error",
    name: "DepositManager_OutOfBounds",
    inputs: [],
  },
  {
    type: "error",
    name: "DepositManager_ZeroAddress",
    inputs: [],
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
