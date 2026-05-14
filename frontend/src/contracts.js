export const TOKEN_ADDRESS =
  "0x9ad1de2a6b9d13cd1622ca473f5ffa1723df67da"

export const GOVERNOR_ADDRESS =
  "0x9104016f4393b80f86357db0e27fe1fd49642aa5"

export const VAULT_ADDRESS =
  "0x359289a6f7800ccfdbfa3ca97cb047263e009132"

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