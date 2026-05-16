import './App.css'
import { useState, useEffect } from 'react'
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
  parseEther,
  createPublicClient,
  http,
  encodeFunctionData
} from 'viem'

import { baseSepolia } from 'viem/chains'

import {
  TOKEN_ADDRESS,
  GOVERNOR_ADDRESS,
  VAULT_ADDRESS,
  tokenABI,
  vaultABI,
  governorABI
} from './contracts'

const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(),
})

function App() {

  const { address, isConnected } = useAccount()

  const { connect } = useConnect()

  const { disconnect } = useDisconnect()

  const chainId = useChainId()

  const correctChain = 84532

  const [depositAmount, setDepositAmount] = useState('')
  const [proposalId, setProposalId] = useState('')
  const [proposalState, setProposalState] = useState('')
  const [delegateAddress, setDelegateAddress] = useState('')
  const [subgraphProposals, setSubgraphProposals] = useState([])

  const {
    writeContractAsync
  } = useWriteContract()

  const {
    data: balance,
    refetch: refetchBalance
  } = useReadContract({
    address: TOKEN_ADDRESS,
    abi: tokenABI,
    functionName: 'balanceOf',
    args: [address],
    query: {
      enabled: !!address,
    }
  })

  const {
    data: votes,
    refetch: refetchVotes
  } = useReadContract({
    address: TOKEN_ADDRESS,
    abi: tokenABI,
    functionName: 'getVotes',
    args: [address],
    query: {
      enabled: !!address,
    }
  })

  const {
    data: delegates,
    refetch: refetchDelegates
  } = useReadContract({
    address: TOKEN_ADDRESS,
    abi: tokenABI,
    functionName: 'delegates',
    args: [address],
    query: {
      enabled: !!address,
    }
  })

  async function handleDeposit() {

    try {

      const amount = parseEther(depositAmount)

      const approveHash = await writeContractAsync({
        address: TOKEN_ADDRESS,
        abi: tokenABI,
        functionName: 'approve',
        args: [VAULT_ADDRESS, amount],
      })

      await publicClient.waitForTransactionReceipt({
        hash: approveHash
      })

      const depositHash = await writeContractAsync({
        address: VAULT_ADDRESS,
        abi: vaultABI,
        functionName: 'deposit',
        args: [amount, address],
      })

      await publicClient.waitForTransactionReceipt({
        hash: depositHash
      })

      await refetchBalance()
      await refetchVotes()

      alert('Deposit successful')

    } catch (err) {

      console.log(err)

      if (err.shortMessage) {
        alert(err.shortMessage)
      } else {
        alert('Transaction failed')
      }

    }

  }

  async function delegateVotes() {

    try {

      const hash = await writeContractAsync({
        address: TOKEN_ADDRESS,
        abi: tokenABI,
        functionName: 'delegate',
        args: [delegateAddress],
      })

      await publicClient.waitForTransactionReceipt({
        hash
      })

      await refetchVotes()
      await refetchDelegates()

      alert('Delegation successful')

    } catch (err) {

      console.log(err)

      if (err.shortMessage) {
        alert(err.shortMessage)
      } else {
        alert('Delegation failed')
      }

    }


    try {

      await writeContractAsync({
        address: TOKEN_ADDRESS,
        abi: tokenABI,
        functionName: 'delegate',
        args: [delegateAddress],
      })

      await refetchVotes()
      await refetchDelegates()

      alert('Delegation successful')

    } catch (err) {

      console.log(err)

      if (err.shortMessage) {
        alert(err.shortMessage)
      } else {
        alert('Delegation failed')
      }

    }

  }

  async function createProposal() {

    try {

      const calldata = encodeFunctionData({
        abi: tokenABI,
        functionName: 'approve',
        args: [
          VAULT_ADDRESS,
          parseEther('1')
        ],
      })

      const hash = await writeContractAsync({
        address: GOVERNOR_ADDRESS,
        abi: governorABI,
        functionName: 'propose',

        args: [
          [TOKEN_ADDRESS],
          [0],
          [calldata],
          'Frontend Proposal ' + Date.now()
        ],
      })

      console.log(hash)

      alert('Proposal created')

    } catch (err) {

      console.log(err)

      if (err.shortMessage) {
        alert(err.shortMessage)
      } else {
        alert('Proposal failed')
      }

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
      })

      alert('Vote submitted')

    } catch (err) {

      console.log(err)

      if (err.shortMessage) {
        alert(err.shortMessage)
      } else {
        alert('Vote failed')
      }

    }

  }

  async function checkProposalState() {

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
  useEffect(() => {

    async function fetchSubgraphData() {

      try {

        const response = await fetch(
          'https://api.studio.thegraph.com/query/1753362/rwa-dao-subgraph/v0.0.2',
          {
            method: 'POST',

            headers: {
              'Content-Type': 'application/json',
            },

            body: JSON.stringify({
              query: `
              {
                proposals(first: 5, orderBy: timestamp, orderDirection: desc) {
                  proposalId
                  description
                  proposer
                }
              }
            `
            })
          }
        )

        const result = await response.json()

        setSubgraphProposals(result.data.proposals)

      } catch (err) {

        console.log(err)

      }

    }

    fetchSubgraphData()

  }, [])
  return (

    <div className="app">

      <div className="hero">

        <div className="navbar">

          <h1 className="logo">
            RWA DAO
          </h1>

          {
            !isConnected ? (

              <button
                onClick={() => connect({ connector: injected() })}
                className="button connect-btn"
              >
                Connect Wallet
              </button>

            ) : (

              <button
                onClick={() => disconnect()}
                className="button disconnect-btn"
              >
                Disconnect
              </button>

            )
          }

        </div>

        <div className="hero-grid">

          <div>

            <p className="hero-subtitle">
              Tokenize • Govern • Earn
            </p>

            <h1 className="hero-title">
              The future
              <br />
              of RWA
              <br />
              governance
            </h1>

            <p className="hero-description">
              A decentralized platform for tokenized real-world assets,
              vault deposits, DAO governance, and onchain voting.
            </p>

          </div>

          <div className="wallet-card-wrapper">

            <div className="wallet-card">

              <div className="wallet-header">

                <div>

                  <p className="wallet-title">
                    Connected Wallet
                  </p>

                  <p className="wallet-address">
                    {
                      address
                        ? address.slice(0, 6) +
                        '...' +
                        address.slice(-4)
                        : 'Not Connected'
                    }
                  </p>

                </div>

                <div className="network-badge">
                  Base Sepolia
                </div>

              </div>

              <div className="stats">

                <div className="stat-card balance">

                  <p className="stat-label">
                    Token Balance
                  </p>

                  <h2 className="stat-value">
                    {
                      balance
                        ? formatEther(balance)
                        : '0'
                    }
                  </h2>

                </div>

                <div className="stat-card votes">

                  <p className="stat-label">
                    Voting Power
                  </p>

                  <h2 className="stat-value">
                    {
                      votes
                        ? formatEther(votes)
                        : '0'
                    }
                  </h2>

                </div>

                <div className="stat-card delegate">

                  <p className="stat-label">
                    Delegate Address
                  </p>

                  <p className="delegate-value">
                    {
                      delegates
                        ? delegates.slice(0, 6) +
                        '...' +
                        delegates.slice(-4)
                        : 'No Delegate'
                    }
                  </p>

                  <input
                    type="text"
                    placeholder="Delegate address..."
                    value={delegateAddress}
                    onChange={(e) => setDelegateAddress(e.target.value)}
                    className="input input-light"
                    style={{ marginTop: '20px' }}
                  />

                  <button
                    onClick={delegateVotes}
                    className="button check-btn"
                  >
                    Delegate Votes
                  </button>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

      <div className="section">

        <div className="section-card deposit-card">

          <h2 className="section-title">
            Vault Deposit
          </h2>

          <div className="deposit-row">

            <input
              type="text"
              placeholder="Enter amount..."
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              className="input"
            />

            <button
              onClick={handleDeposit}
              className="button deposit-btn"
            >
              Deposit
            </button>

          </div>

        </div>

      </div>

      <div className="section">

        <div className="section-card governance-card">

          <div className="gov-header">

            <div>

              <p className="hero-subtitle">
                DAO Governance
              </p>

              <h2 className="section-title">
                Governance Portal
              </h2>

            </div>

            <button
              onClick={createProposal}
              className="button proposal-btn"
            >
              Create Proposal
            </button>

          </div>

          <div className="gov-grid">
            <div
  className="white-card"
  style={{ color: '#2f3b2f' }}
>

              <p className="stat-label">
                Indexed Governance Proposals
              </p>

              {
                subgraphProposals.length === 0 ? (

                  <p>No indexed proposals yet</p>

                ) : (

                  subgraphProposals.map((proposal, index) => (

                    <div
                      key={index}
                      style={{
                        marginBottom: '20px',
                        paddingBottom: '20px',
                        borderBottom: '1px solid #d6d3c9'
                      }}
                    >

                      <p
                        style={{
                          fontWeight: '700',
                          marginBottom: '10px'
                          
                        }}
                      >
                        Proposal #{proposal.proposalId}
                      </p>

                      <p
                        style={{
                          fontSize: '14px',
                          marginBottom: '10px'
                        }}
                      >
                        {proposal.description}
                      </p>

                      <p
                        style={{
                          fontSize: '12px',
                          opacity: 0.7
                        }}
                      >
                        {proposal.proposer}
                      </p>

                    </div>

                  ))

                )
              }

            </div>

            <div className="white-card">

              <p className="stat-label">
                Proposal ID
              </p>

              <input
                type="text"
                placeholder="Paste proposal ID..."
                value={proposalId}
                onChange={(e) => setProposalId(e.target.value)}
                className="input input-light"
              />

              <button
                onClick={checkProposalState}
                className="button check-btn"
              >
                Check Proposal State
              </button>

              <div className="state-box">

                <p className="stat-label">
                  Current State
                </p>

                <h3 className="state-value">
                  {proposalState || '—'}
                </h3>

              </div>

            </div>

            <div className="white-card">

              <p className="stat-label">
                Cast your governance vote
              </p>

              <div className="vote-buttons">

                <button
                  onClick={() => vote(1)}
                  className="button vote-for"
                >
                  Vote FOR
                </button>

                <button
                  onClick={() => vote(0)}
                  className="button vote-against"
                >
                  Vote AGAINST
                </button>

              </div>

              <div className="network-box">

                <p className="stat-label">
                  Network
                </p>

                <h3 className="network-value">
                  {
                    chainId === correctChain
                      ? 'Base Sepolia'
                      : 'Wrong Network'
                  }
                </h3>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>

  )
}

export default App