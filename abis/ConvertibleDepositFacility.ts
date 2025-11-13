export const ConvertibleDepositFacilityAbi = [
  {
    type: "constructor",
    inputs: [
      {
        name: "kernel_",
        type: "address",
        internalType: "address",
      },
      {
        name: "depositManager_",
        type: "address",
        internalType: "address",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "DEPOS",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "contract DEPOSv1",
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
        internalType: "contract IDepositManager",
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
    name: "ROLE_AUCTIONEER",
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
    name: "authorizeOperator",
    inputs: [
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
    name: "claimAllYield",
    inputs: [],
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
        name: "amount_",
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
    ],
    outputs: [
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
    name: "convert",
    inputs: [
      {
        name: "positionIds_",
        type: "uint256[]",
        internalType: "uint256[]",
      },
      {
        name: "amounts_",
        type: "uint256[]",
        internalType: "uint256[]",
      },
      {
        name: "wrappedReceipt_",
        type: "bool",
        internalType: "bool",
      },
    ],
    outputs: [
      {
        name: "receiptTokenIn",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "convertedTokenOut",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "convertedToken",
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
    name: "createPosition",
    inputs: [
      {
        name: "params_",
        type: "tuple",
        internalType: "struct IConvertibleDepositFacility.CreatePositionParams",
        components: [
          {
            name: "asset",
            type: "address",
            internalType: "contract IERC20",
          },
          {
            name: "periodMonths",
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
            name: "conversionPrice",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "wrapPosition",
            type: "bool",
            internalType: "bool",
          },
          {
            name: "wrapReceipt",
            type: "bool",
            internalType: "bool",
          },
        ],
      },
    ],
    outputs: [
      {
        name: "positionId",
        type: "uint256",
        internalType: "uint256",
      },
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
    name: "deauthorizeOperator",
    inputs: [
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
    name: "deposit",
    inputs: [
      {
        name: "asset_",
        type: "address",
        internalType: "contract IERC20",
      },
      {
        name: "periodMonths_",
        type: "uint8",
        internalType: "uint8",
      },
      {
        name: "amount_",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "wrapReceipt_",
        type: "bool",
        internalType: "bool",
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
    name: "getAssetPeriodReclaimRate",
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
    ],
    outputs: [
      {
        name: "reclaimRate",
        type: "uint16",
        internalType: "uint16",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getAvailableDeposits",
    inputs: [
      {
        name: "depositToken_",
        type: "address",
        internalType: "contract IERC20",
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
    name: "getCommittedDeposits",
    inputs: [
      {
        name: "depositToken_",
        type: "address",
        internalType: "contract IERC20",
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
    name: "getCommittedDeposits",
    inputs: [
      {
        name: "depositToken_",
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
    name: "getOperators",
    inputs: [],
    outputs: [
      {
        name: "operators",
        type: "address[]",
        internalType: "address[]",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "handleBorrow",
    inputs: [
      {
        name: "depositToken_",
        type: "address",
        internalType: "contract IERC20",
      },
      {
        name: "",
        type: "uint8",
        internalType: "uint8",
      },
      {
        name: "amount_",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "recipient_",
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
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "handleCommit",
    inputs: [
      {
        name: "depositToken_",
        type: "address",
        internalType: "contract IERC20",
      },
      {
        name: "depositPeriod_",
        type: "uint8",
        internalType: "uint8",
      },
      {
        name: "amount_",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "handleCommitCancel",
    inputs: [
      {
        name: "depositToken_",
        type: "address",
        internalType: "contract IERC20",
      },
      {
        name: "",
        type: "uint8",
        internalType: "uint8",
      },
      {
        name: "amount_",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "handleCommitWithdraw",
    inputs: [
      {
        name: "depositToken_",
        type: "address",
        internalType: "contract IERC20",
      },
      {
        name: "depositPeriod_",
        type: "uint8",
        internalType: "uint8",
      },
      {
        name: "amount_",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "recipient_",
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
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "handleLoanDefault",
    inputs: [
      {
        name: "depositToken_",
        type: "address",
        internalType: "contract IERC20",
      },
      {
        name: "depositPeriod_",
        type: "uint8",
        internalType: "uint8",
      },
      {
        name: "amount_",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "payer_",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "handleLoanRepay",
    inputs: [
      {
        name: "depositToken_",
        type: "address",
        internalType: "contract IERC20",
      },
      {
        name: "",
        type: "uint8",
        internalType: "uint8",
      },
      {
        name: "amount_",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "maxAmount_",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "payer_",
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
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "handlePositionCancelRedemption",
    inputs: [
      {
        name: "positionId_",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "amount_",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "handlePositionRedemption",
    inputs: [
      {
        name: "positionId_",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "amount_",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
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
    name: "isAuthorizedOperator",
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
    name: "previewClaimYield",
    inputs: [
      {
        name: "asset_",
        type: "address",
        internalType: "contract IERC20",
      },
    ],
    outputs: [
      {
        name: "yieldAssets",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "previewConvert",
    inputs: [
      {
        name: "depositor_",
        type: "address",
        internalType: "address",
      },
      {
        name: "positionIds_",
        type: "uint256[]",
        internalType: "uint256[]",
      },
      {
        name: "amounts_",
        type: "uint256[]",
        internalType: "uint256[]",
      },
    ],
    outputs: [
      {
        name: "receiptTokenIn",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "convertedTokenOut",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "previewReclaim",
    inputs: [
      {
        name: "depositToken_",
        type: "address",
        internalType: "contract IERC20",
      },
      {
        name: "depositPeriod_",
        type: "uint8",
        internalType: "uint8",
      },
      {
        name: "amount_",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "reclaimed",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "reclaim",
    inputs: [
      {
        name: "depositToken_",
        type: "address",
        internalType: "contract IERC20",
      },
      {
        name: "depositPeriod_",
        type: "uint8",
        internalType: "uint8",
      },
      {
        name: "amount_",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "reclaimed",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "nonpayable",
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
    name: "setAssetPeriodReclaimRate",
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
        name: "reclaimRate_",
        type: "uint16",
        internalType: "uint16",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "split",
    inputs: [
      {
        name: "positionId_",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "amount_",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "to_",
        type: "address",
        internalType: "address",
      },
      {
        name: "wrap_",
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
    ],
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
    name: "AssetCommitCancelled",
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
    name: "AssetCommitWithdrawn",
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
    name: "AssetCommitted",
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
    name: "AssetPeriodReclaimRateSet",
    inputs: [
      {
        name: "asset",
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
        name: "reclaimRate",
        type: "uint16",
        indexed: false,
        internalType: "uint16",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "ClaimAllYieldFailed",
    inputs: [],
    anonymous: false,
  },
  {
    type: "event",
    name: "ClaimedYield",
    inputs: [
      {
        name: "asset",
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
    name: "ConvertedDeposit",
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
        name: "periodMonths",
        type: "uint8",
        indexed: false,
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
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "CreatedDeposit",
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
        name: "positionId",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "periodMonths",
        type: "uint8",
        indexed: false,
        internalType: "uint8",
      },
      {
        name: "depositAmount",
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
    name: "OperatorAuthorized",
    inputs: [
      {
        name: "operator",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "OperatorDeauthorized",
    inputs: [
      {
        name: "operator",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "Reclaimed",
    inputs: [
      {
        name: "user",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "depositToken",
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
        name: "reclaimedAmount",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "forfeitedAmount",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
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
    name: "CDF_InvalidAmount",
    inputs: [
      {
        name: "positionId_",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "amount_",
        type: "uint256",
        internalType: "uint256",
      },
    ],
  },
  {
    type: "error",
    name: "CDF_InvalidArgs",
    inputs: [
      {
        name: "reason_",
        type: "string",
        internalType: "string",
      },
    ],
  },
  {
    type: "error",
    name: "CDF_InvalidToken",
    inputs: [
      {
        name: "positionId_",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "token_",
        type: "address",
        internalType: "address",
      },
      {
        name: "periodMonths_",
        type: "uint8",
        internalType: "uint8",
      },
    ],
  },
  {
    type: "error",
    name: "CDF_NotOwner",
    inputs: [
      {
        name: "positionId_",
        type: "uint256",
        internalType: "uint256",
      },
    ],
  },
  {
    type: "error",
    name: "CDF_PositionExpired",
    inputs: [
      {
        name: "positionId_",
        type: "uint256",
        internalType: "uint256",
      },
    ],
  },
  {
    type: "error",
    name: "CDF_Unsupported",
    inputs: [
      {
        name: "positionId_",
        type: "uint256",
        internalType: "uint256",
      },
    ],
  },
  {
    type: "error",
    name: "DEPOS_InvalidParams",
    inputs: [
      {
        name: "reason_",
        type: "string",
        internalType: "string",
      },
    ],
  },
  {
    type: "error",
    name: "DEPOS_NotOperator",
    inputs: [
      {
        name: "positionId_",
        type: "uint256",
        internalType: "uint256",
      },
    ],
  },
  {
    type: "error",
    name: "DEPOS_NotOwner",
    inputs: [
      {
        name: "positionId_",
        type: "uint256",
        internalType: "uint256",
      },
    ],
  },
  {
    type: "error",
    name: "DepositFacility_InsufficientCommitment",
    inputs: [
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
    name: "DepositFacility_InsufficientDeposits",
    inputs: [
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
    name: "DepositFacility_InvalidAddress",
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
    name: "DepositFacility_InvalidReclaimRate",
    inputs: [
      {
        name: "reclaimRate",
        type: "uint16",
        internalType: "uint16",
      },
      {
        name: "maxReclaimRate",
        type: "uint16",
        internalType: "uint16",
      },
    ],
  },
  {
    type: "error",
    name: "DepositFacility_UnauthorizedOperator",
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
    name: "DepositFacility_ZeroAmount",
    inputs: [],
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
  {
    type: "error",
    name: "ReentrancyGuardReentrantCall",
    inputs: [],
  },
] as const;
