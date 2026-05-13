import {
  useAccount,
  useConnect,
  useDisconnect,
  useChainId,
  useReadContract,
  useWriteContract
} from 'wagmi'

import { injected } from 'wagmi/connectors'

import {
  formatEther,
  parseEther
} from 'viem'

import { useState } from 'react'
import { createPublicClient, http } from 'viem'
import { arbitrumSepolia } from 'viem/chains'

import {
  TOKEN_ADDRESS,
  GOVERNOR_ADDRESS,
  VAULT_ADDRESS,
  tokenABI,
  vaultABI,
  governorABI
} from './contracts'

const publicClient = createPublicClient({
  chain: arbitrumSepolia,
  transport: http(),
})

function App() {

  const { address, isConnected } = useAccount()

  const { connect } = useConnect()

  const { disconnect } = useDisconnect()

  const chainId = useChainId()

  const correctChain = 421614

  const [depositAmount, setDepositAmount] = useState('')
  const [proposalId, setProposalId] = useState('')
const [proposalState, setProposalState] = useState('')

  const {
    writeContractAsync
  } = useWriteContract()

  const { data: balance } = useReadContract({
    address: TOKEN_ADDRESS,
    abi: tokenABI,
    functionName: 'balanceOf',
    args: [address],
    query: {
      enabled: !!address,
    }
  })

  const { data: votes } = useReadContract({
    address: TOKEN_ADDRESS,
    abi: tokenABI,
    functionName: 'getVotes',
    args: [address],
    query: {
      enabled: !!address,
    }
  })

  async function handleDeposit() {

    try {

      const amount = parseEther(depositAmount)

      // approve
      await writeContractAsync({
  address: TOKEN_ADDRESS,
  abi: tokenABI,
  functionName: 'approve',
  args: [VAULT_ADDRESS, amount],

  gas: 300000n,
  maxFeePerGas: parseEther('0.0000001'),
  maxPriorityFeePerGas: parseEther('0.00000005'),
})
      // deposit
      await writeContractAsync({
  address: VAULT_ADDRESS,
  abi: vaultABI,
  functionName: 'deposit',
  args: [amount, address],

  gas: 300000n,
  maxFeePerGas: parseEther('0.0000001'),
  maxPriorityFeePerGas: parseEther('0.00000005'),
})

      alert('Deposit successful')

    } catch (err) {

      console.log(err)

      alert('Transaction failed')

    }

  }
  async function createProposal() {

  try {

    const calldata = '0x'

    const hash = await writeContractAsync({
      address: GOVERNOR_ADDRESS,
      abi: governorABI,
      functionName: 'propose',

      args: [
        [TOKEN_ADDRESS],
        [0],
        [calldata],
        ['Frontend Proposal ' + Date.now()]
      ],

      gas: 500000n,
      maxFeePerGas: parseEther('0.0000001'),
      maxPriorityFeePerGas: parseEther('0.00000005'),
    })

    console.log('TX HASH:', hash)

    alert('Proposal transaction sent')

  } catch (err) {

    console.log(err)

    alert('Proposal failed')

  }

}
async function vote(support) {

  try {

    await writeContractAsync({
      address: GOVERNOR_ADDRESS,
      abi: governorABI,
      functionName: 'castVote',

      args: [
        BigInt(proposalId),
        support
      ],

      gas: 300000n,
      maxFeePerGas: parseEther('0.0000001'),
      maxPriorityFeePerGas: parseEther('0.00000005'),
    })

    alert('Vote submitted')

  } catch (err) {

    console.log(err)

    alert('Vote failed')

  }

}async function checkProposalState() {

  try {

    const result = await publicClient.readContract({
      address: GOVERNOR_ADDRESS,
      abi: governorABI,
      functionName: 'state',
      args: [BigInt(proposalId)],
    })

    const states = [
      'Pending',
      'Active',
      'Canceled',
      'Defeated',
      'Succeeded',
      'Queued',
      'Expired',
      'Executed'
    ]

    setProposalState(states[Number(result)])

  } catch (err) {

    console.log(err)

  }

}

  return (

    <div className="min-h-screen bg-[#0b0b0f] text-white p-10">

      <h1 className="text-4xl font-bold text-center mb-10">
        RWA Tokenization Platform
      </h1>

      <div className="flex justify-center mb-10">

        {
          !isConnected ? (

            <button
              onClick={() => connect({ connector: injected() })}
              className="bg-blue-600 px-6 py-3 rounded-xl"
            >
              Connect MetaMask
            </button>

          ) : (

            <button
              onClick={() => disconnect()}
              className="bg-red-600 px-6 py-3 rounded-xl"
            >
              Disconnect
            </button>

          )
        }

      </div>

      {
        isConnected && (

          <div className="max-w-xl mx-auto bg-[#16161f] p-6 rounded-2xl">

            <p className="mb-2">
              Wallet Address
            </p>

            <p className="text-green-400 break-all mb-6">
              {address}
            </p>

            <p>
              Chain ID: {chainId}
            </p>

            <p className="mt-4">
              Token Balance:
            </p>

            <p className="text-blue-400 mb-4">
              {
                balance
                  ? formatEther(balance)
                  : '0'
              }
            </p>

            <p>
              Voting Power:
            </p>

            <p className="text-yellow-400">
              {
                votes
                  ? formatEther(votes)
                  : '0'
              }
            </p>

            {
              chainId !== correctChain && (
                <p className="mt-4 text-red-500 font-bold">
                  Wrong network. Switch to Arbitrum Sepolia.
                </p>
              )
            }

          </div>

        )
      }

      {
        isConnected && (

          <div className="max-w-xl mx-auto bg-[#16161f] p-6 rounded-2xl mt-10">

            <h2 className="text-2xl mb-6">
              Vault Deposit
            </h2>

            <input
              type="text"
              placeholder="Amount"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              className="w-full p-3 rounded-xl bg-[#0b0b0f] border border-gray-700 mb-4"
            />

            <button
              onClick={handleDeposit}
              className="bg-green-600 px-6 py-3 rounded-xl"
            >
              Deposit
            </button>

          </div>

        )
      }
{
  isConnected && (

    <div className="max-w-xl mx-auto bg-[#16161f] p-6 rounded-2xl mt-10">

      <h2 className="text-2xl mb-6">
        Governance
      </h2>

      <button
        onClick={createProposal}
        className="bg-purple-600 px-6 py-3 rounded-xl mb-6"
      >
        Create Proposal
      </button>

      <input
        type="text"
        placeholder="Proposal ID"
        value={proposalId}
        onChange={(e) => setProposalId(e.target.value)}
        className="w-full p-3 rounded-xl bg-[#0b0b0f] border border-gray-700 mb-4"
      />

      <div className="flex gap-4 mb-4">

        <button
          onClick={() => vote(1)}
          className="bg-green-600 px-4 py-2 rounded-xl"
        >
          FOR
        </button>

        <button
          onClick={() => vote(0)}
          className="bg-red-600 px-4 py-2 rounded-xl"
        >
          AGAINST
        </button>

      </div>

      <button
        onClick={checkProposalState}
        className="bg-blue-600 px-6 py-3 rounded-xl"
      >
        Check Proposal State
      </button>

      <p className="mt-4 text-yellow-400">
        {proposalState}
      </p>

    </div>

  )
}
    </div>

  )
}

export default App