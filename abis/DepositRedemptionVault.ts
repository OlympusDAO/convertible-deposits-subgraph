export const DepositRedemptionVaultAbi = [
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
    name: "authorizeFacility",
    inputs: [
      {
        name: "facility_",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "borrowAgainstRedemption",
    inputs: [
      {
        name: "redemptionId_",
        type: "uint16",
        internalType: "uint16",
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
    name: "cancelRedemption",
    inputs: [
      {
        name: "redemptionId_",
        type: "uint16",
        internalType: "uint16",
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
    name: "claimDefaultedLoan",
    inputs: [
      {
        name: "user_",
        type: "address",
        internalType: "address",
      },
      {
        name: "redemptionId_",
        type: "uint16",
        internalType: "uint16",
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
    name: "deauthorizeFacility",
    inputs: [
      {
        name: "facility_",
        type: "address",
        internalType: "address",
      },
    ],
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
    name: "extendLoan",
    inputs: [
      {
        name: "redemptionId_",
        type: "uint16",
        internalType: "uint16",
      },
      {
        name: "months_",
        type: "uint8",
        internalType: "uint8",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "finishRedemption",
    inputs: [
      {
        name: "redemptionId_",
        type: "uint16",
        internalType: "uint16",
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
    name: "getAnnualInterestRate",
    inputs: [
      {
        name: "asset_",
        type: "address",
        internalType: "contract IERC20",
      },
      {
        name: "facility_",
        type: "address",
        internalType: "address",
      },
    ],
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
    name: "getAuthorizedFacilities",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address[]",
        internalType: "address[]",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getClaimDefaultRewardPercentage",
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
    name: "getMaxBorrowPercentage",
    inputs: [
      {
        name: "asset_",
        type: "address",
        internalType: "contract IERC20",
      },
      {
        name: "facility_",
        type: "address",
        internalType: "address",
      },
    ],
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
    name: "getRedemptionLoan",
    inputs: [
      {
        name: "user_",
        type: "address",
        internalType: "address",
      },
      {
        name: "redemptionId_",
        type: "uint16",
        internalType: "uint16",
      },
    ],
    outputs: [
      {
        name: "",
        type: "tuple",
        internalType: "struct IDepositRedemptionVault.Loan",
        components: [
          {
            name: "initialPrincipal",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "principal",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "interest",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "dueDate",
            type: "uint48",
            internalType: "uint48",
          },
          {
            name: "isDefaulted",
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
    name: "getUserRedemption",
    inputs: [
      {
        name: "user_",
        type: "address",
        internalType: "address",
      },
      {
        name: "redemptionId_",
        type: "uint16",
        internalType: "uint16",
      },
    ],
    outputs: [
      {
        name: "redemption",
        type: "tuple",
        internalType: "struct IDepositRedemptionVault.UserRedemption",
        components: [
          {
            name: "depositToken",
            type: "address",
            internalType: "address",
          },
          {
            name: "depositPeriod",
            type: "uint8",
            internalType: "uint8",
          },
          {
            name: "redeemableAt",
            type: "uint48",
            internalType: "uint48",
          },
          {
            name: "amount",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "facility",
            type: "address",
            internalType: "address",
          },
          {
            name: "positionId",
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
    name: "getUserRedemptionCount",
    inputs: [
      {
        name: "user_",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [
      {
        name: "count",
        type: "uint16",
        internalType: "uint16",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getUserRedemptions",
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
        type: "tuple[]",
        internalType: "struct IDepositRedemptionVault.UserRedemption[]",
        components: [
          {
            name: "depositToken",
            type: "address",
            internalType: "address",
          },
          {
            name: "depositPeriod",
            type: "uint8",
            internalType: "uint8",
          },
          {
            name: "redeemableAt",
            type: "uint48",
            internalType: "uint48",
          },
          {
            name: "amount",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "facility",
            type: "address",
            internalType: "address",
          },
          {
            name: "positionId",
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
    name: "isAuthorizedFacility",
    inputs: [
      {
        name: "facility_",
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
    name: "previewBorrowAgainstRedemption",
    inputs: [
      {
        name: "user_",
        type: "address",
        internalType: "address",
      },
      {
        name: "redemptionId_",
        type: "uint16",
        internalType: "uint16",
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
        type: "uint48",
        internalType: "uint48",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "previewExtendLoan",
    inputs: [
      {
        name: "user_",
        type: "address",
        internalType: "address",
      },
      {
        name: "redemptionId_",
        type: "uint16",
        internalType: "uint16",
      },
      {
        name: "months_",
        type: "uint8",
        internalType: "uint8",
      },
    ],
    outputs: [
      {
        name: "",
        type: "uint48",
        internalType: "uint48",
      },
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
    name: "repayLoan",
    inputs: [
      {
        name: "redemptionId_",
        type: "uint16",
        internalType: "uint16",
      },
      {
        name: "amount_",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "maxSlippage_",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [],
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
    stateMutability: "pure",
  },
  {
    type: "function",
    name: "setAnnualInterestRate",
    inputs: [
      {
        name: "asset_",
        type: "address",
        internalType: "contract IERC20",
      },
      {
        name: "facility_",
        type: "address",
        internalType: "address",
      },
      {
        name: "rate_",
        type: "uint16",
        internalType: "uint16",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setClaimDefaultRewardPercentage",
    inputs: [
      {
        name: "percent_",
        type: "uint16",
        internalType: "uint16",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setMaxBorrowPercentage",
    inputs: [
      {
        name: "asset_",
        type: "address",
        internalType: "contract IERC20",
      },
      {
        name: "facility_",
        type: "address",
        internalType: "address",
      },
      {
        name: "percent_",
        type: "uint16",
        internalType: "uint16",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "startRedemption",
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
    outputs: [
      {
        name: "redemptionId",
        type: "uint16",
        internalType: "uint16",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "startRedemption",
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
        name: "facility_",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [
      {
        name: "redemptionId",
        type: "uint16",
        internalType: "uint16",
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
    name: "AnnualInterestRateSet",
    inputs: [
      {
        name: "asset",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "facility",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "rate",
        type: "uint16",
        indexed: false,
        internalType: "uint16",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "ClaimDefaultRewardPercentageSet",
    inputs: [
      {
        name: "percent",
        type: "uint16",
        indexed: false,
        internalType: "uint16",
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
    name: "FacilityAuthorized",
    inputs: [
      {
        name: "facility",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "FacilityDeauthorized",
    inputs: [
      {
        name: "facility",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "LoanCreated",
    inputs: [
      {
        name: "user",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "redemptionId",
        type: "uint16",
        indexed: true,
        internalType: "uint16",
      },
      {
        name: "amount",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "facility",
        type: "address",
        indexed: false,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "LoanDefaulted",
    inputs: [
      {
        name: "user",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "redemptionId",
        type: "uint16",
        indexed: true,
        internalType: "uint16",
      },
      {
        name: "principal",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "interest",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "remainingCollateral",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "LoanExtended",
    inputs: [
      {
        name: "user",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "redemptionId",
        type: "uint16",
        indexed: true,
        internalType: "uint16",
      },
      {
        name: "newDueDate",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "LoanRepaid",
    inputs: [
      {
        name: "user",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "redemptionId",
        type: "uint16",
        indexed: true,
        internalType: "uint16",
      },
      {
        name: "principal",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "interest",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "MaxBorrowPercentageSet",
    inputs: [
      {
        name: "asset",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "facility",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "percent",
        type: "uint16",
        indexed: false,
        internalType: "uint16",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "RedemptionCancelled",
    inputs: [
      {
        name: "user",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "redemptionId",
        type: "uint16",
        indexed: true,
        internalType: "uint16",
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
        name: "amount",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "remainingAmount",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "RedemptionFinished",
    inputs: [
      {
        name: "user",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "redemptionId",
        type: "uint16",
        indexed: true,
        internalType: "uint16",
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
    name: "RedemptionStarted",
    inputs: [
      {
        name: "user",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "redemptionId",
        type: "uint16",
        indexed: true,
        internalType: "uint16",
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
        name: "amount",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "facility",
        type: "address",
        indexed: false,
        internalType: "address",
      },
    ],
    anonymous: false,
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
    name: "RedemptionVault_AlreadyRedeemed",
    inputs: [
      {
        name: "user",
        type: "address",
        internalType: "address",
      },
      {
        name: "redemptionId",
        type: "uint16",
        internalType: "uint16",
      },
    ],
  },
  {
    type: "error",
    name: "RedemptionVault_FacilityExists",
    inputs: [
      {
        name: "facility",
        type: "address",
        internalType: "address",
      },
    ],
  },
  {
    type: "error",
    name: "RedemptionVault_FacilityNotRegistered",
    inputs: [
      {
        name: "facility",
        type: "address",
        internalType: "address",
      },
    ],
  },
  {
    type: "error",
    name: "RedemptionVault_InterestRateNotSet",
    inputs: [
      {
        name: "asset",
        type: "address",
        internalType: "address",
      },
      {
        name: "facility",
        type: "address",
        internalType: "address",
      },
    ],
  },
  {
    type: "error",
    name: "RedemptionVault_InvalidAmount",
    inputs: [
      {
        name: "user",
        type: "address",
        internalType: "address",
      },
      {
        name: "redemptionId",
        type: "uint16",
        internalType: "uint16",
      },
      {
        name: "amount",
        type: "uint256",
        internalType: "uint256",
      },
    ],
  },
  {
    type: "error",
    name: "RedemptionVault_InvalidDepositManager",
    inputs: [
      {
        name: "depositManager",
        type: "address",
        internalType: "address",
      },
    ],
  },
  {
    type: "error",
    name: "RedemptionVault_InvalidFacility",
    inputs: [
      {
        name: "facility",
        type: "address",
        internalType: "address",
      },
    ],
  },
  {
    type: "error",
    name: "RedemptionVault_InvalidLoan",
    inputs: [
      {
        name: "user",
        type: "address",
        internalType: "address",
      },
      {
        name: "redemptionId",
        type: "uint16",
        internalType: "uint16",
      },
    ],
  },
  {
    type: "error",
    name: "RedemptionVault_InvalidRedemptionId",
    inputs: [
      {
        name: "user",
        type: "address",
        internalType: "address",
      },
      {
        name: "redemptionId",
        type: "uint16",
        internalType: "uint16",
      },
    ],
  },
  {
    type: "error",
    name: "RedemptionVault_LoanAmountExceeded",
    inputs: [
      {
        name: "user",
        type: "address",
        internalType: "address",
      },
      {
        name: "redemptionId",
        type: "uint16",
        internalType: "uint16",
      },
      {
        name: "amount",
        type: "uint256",
        internalType: "uint256",
      },
    ],
  },
  {
    type: "error",
    name: "RedemptionVault_LoanIncorrectState",
    inputs: [
      {
        name: "user",
        type: "address",
        internalType: "address",
      },
      {
        name: "redemptionId",
        type: "uint16",
        internalType: "uint16",
      },
    ],
  },
  {
    type: "error",
    name: "RedemptionVault_MaxSlippageExceeded",
    inputs: [
      {
        name: "user",
        type: "address",
        internalType: "address",
      },
      {
        name: "redemptionId",
        type: "uint16",
        internalType: "uint16",
      },
      {
        name: "actualAmount",
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
  {
    type: "error",
    name: "RedemptionVault_OutOfBounds",
    inputs: [
      {
        name: "rate",
        type: "uint16",
        internalType: "uint16",
      },
    ],
  },
  {
    type: "error",
    name: "RedemptionVault_TooEarly",
    inputs: [
      {
        name: "user",
        type: "address",
        internalType: "address",
      },
      {
        name: "redemptionId",
        type: "uint16",
        internalType: "uint16",
      },
      {
        name: "redeemableAt",
        type: "uint48",
        internalType: "uint48",
      },
    ],
  },
  {
    type: "error",
    name: "RedemptionVault_UnpaidLoan",
    inputs: [
      {
        name: "user",
        type: "address",
        internalType: "address",
      },
      {
        name: "redemptionId",
        type: "uint16",
        internalType: "uint16",
      },
    ],
  },
  {
    type: "error",
    name: "RedemptionVault_ZeroAddress",
    inputs: [],
  },
  {
    type: "error",
    name: "RedemptionVault_ZeroAmount",
    inputs: [],
  },
] as const;
