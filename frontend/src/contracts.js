export const CONTRACTS = {
  31337: {
    TOKEN: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    GOVERNOR: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
    VAULT: "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9",
  },
  84532: {
    TOKEN: "0x7B3B6F99ada780d409bD713d32896f81006350F9",
    GOVERNOR: "0xdebd86C48B54a421B2C8ba90eF4117B7D5Aa78e5",
    VAULT: "0x94de1B8d49a036ddD287bC5eEA5879C9924D6e45",
  }
}

export const TOKEN_ADDRESS = CONTRACTS[31337].TOKEN
export const GOVERNOR_ADDRESS = CONTRACTS[31337].GOVERNOR
export const VAULT_ADDRESS = CONTRACTS[31337].VAULT

export const tokenABI = [

  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address"
      }
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },

  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address"
      }
    ],
    name: "getVotes",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },

  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256"
      }
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
  "inputs": [
    {
      "internalType": "address",
      "name": "delegatee",
      "type": "address"
    }
  ],
  "name": "delegate",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
},
{
  "inputs": [
    {
      "internalType": "address",
      "name": "account",
      "type": "address"
    }
  ],
  "name": "delegates",
  "outputs": [
    {
      "internalType": "address",
      "name": "",
      "type": "address"
    }
  ],
  "stateMutability": "view",
  "type": "function"
}

]

export const vaultABI = [

  {
    inputs: [
      {
        internalType: "uint256",
        name: "assets",
        type: "uint256"
      },
      {
        internalType: "address",
        name: "receiver",
        type: "address"
      }
    ],
    name: "deposit",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  }

]
export const governorABI = [

  {
    inputs: [
      {
        internalType: "address[]",
        name: "targets",
        type: "address[]"
      },
      {
        internalType: "uint256[]",
        name: "values",
        type: "uint256[]"
      },
      {
        internalType: "bytes[]",
        name: "calldatas",
        type: "bytes[]"
      },
      {
        internalType: "string",
        name: "description",
        type: "string"
      }
    ],
    name: "propose",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },

  {
    inputs: [
      {
        internalType: "uint256",
        name: "proposalId",
        type: "uint256"
      },
      {
        internalType: "uint8",
        name: "support",
        type: "uint8"
      }
    ],
    name: "castVote",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },

  {
    inputs: [
      {
        internalType: "uint256",
        name: "proposalId",
        type: "uint256"
      }
    ],
    name: "state",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8"
      }
    ],
    stateMutability: "view",
    type: "function"
  }

]