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
  const wrongNetwork =
    chainId !== 84532

  const [depositAmount, setDepositAmount] = useState('')
  const [proposalId, setProposalId] = useState('')
  const [proposalTitle, setProposalTitle] = useState('')
  const [proposalState, setProposalState] = useState('')
  const [delegateAddress, setDelegateAddress] = useState('')
  const [subgraphProposals, setSubgraphProposals] = useState([])
  const [subgraphVotes, setSubgraphVotes] = useState([])

  const [txMessage, setTxMessage] =
    useState('')

  const [txError, setTxError] =
    useState(false)

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

  async function depositToVault() {

    try {

      const hash = await writeContractAsync({

        address: VAULT_ADDRESS,

        abi: vaultABI,

        functionName: 'deposit',

        args: [
          parseEther(depositAmount),
          address
        ],

        gas: 500000n

      })

      const receipt =
        await publicClient.waitForTransactionReceipt({
          hash
        })

      console.log(receipt)

      setTxError(false)

setTxMessage(
  'Deposit successful'
)

      refetchBalance()
      refetchVotes()

    } catch (err) {

      setTxError(true)

setTxMessage(
  err.shortMessage ||
  'Transaction failed'
)

      if (
        err.message?.includes(
          'User rejected'
        )
      ) {

        setTxError(true)

setTxMessage(
  err.shortMessage ||
  'Transaction rejected by user'
)

      } else {

        setTxError(true)

setTxMessage(
  err.shortMessage ||
  'Transaction failed or reverted'
)

      }

    }

  }

  async function approveVault() {

  try {

    const hash = await writeContractAsync({
      address: TOKEN_ADDRESS,
      abi: tokenABI,
      functionName: 'approve',
      args: [
        VAULT_ADDRESS,
        parseEther('1000000')
      ],
    })

    await publicClient.waitForTransactionReceipt({
      hash
    })

    setTxError(false)

    setTxMessage(
      'Vault approved successfully'
    )

  } catch (err) {

    setTxError(true)

    setTxMessage(
      err.shortMessage ||
      'Approve transaction failed'
    )

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

    setTxError(false)

    setTxMessage(
      'Votes delegated successfully'
    )

    window.location.reload()

  } catch (err) {

    setTxError(true)

    setTxMessage(
      err.shortMessage ||
      'Delegation failed'
    )

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
        proposalTitle
      ],
    })

    setTxError(false)

    setTxMessage(
      'Proposal created successfully'
    )

  } catch (err) {

    setTxError(true)

    setTxMessage(
      err.shortMessage ||
      'Proposal creation failed'
    )

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

    setTxError(false)

    setTxMessage(
      support === 1
        ? 'Vote FOR submitted successfully'
        : 'Vote AGAINST submitted successfully'
    )

  } catch (err) {

    setTxError(true)

    setTxMessage(
      err.shortMessage ||
      'Vote transaction failed'
    )

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

      setTxError(true)

setTxMessage(
  err.shortMessage ||
  'Transaction failed'
)

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
              proposals(
                first: 5,
                orderBy: timestamp,
                orderDirection: desc
              ) {
                proposalId
                description
                proposer
              }

              votes(
                first: 10,
                orderBy: timestamp,
                orderDirection: desc
              ) {
                voter
                proposalId
                support
                weight
              }
            }
          `
            })
          }
        )

        const result = await response.json()

        setSubgraphProposals(
          result.data.proposals
        )

        setSubgraphVotes(
          result.data.votes
        )

      } catch (err) {

        setTxError(true)

setTxMessage(
  err.shortMessage ||
  'Transaction failed'
)

      }

    }

    fetchSubgraphData()

  }, [])

  return (

    <div className="app">

      <div className="hero">

        {
          wrongNetwork && (

            <div
              style={{
                background: '#ffdddd',
                color: '#7a1c1c',
                padding: '16px',
                borderRadius: '14px',
                marginBottom: '24px',
                fontWeight: '600',
                maxWidth: '1200px',
                marginInline: 'auto'
              }}
            >
              Wrong network detected.
              Please switch to Base Sepolia.
            </div>

          )
        }
{
  txMessage && (

    <div
      style={{
        position: 'fixed',
        top: '30px',
        right: '30px',
        zIndex: 9999,

        background: txError
          ? 'linear-gradient(135deg, #ffe1e1, #ffd3d3)'
          : 'linear-gradient(135deg, #dcffe0, #c8ffd0)',

        color: txError
          ? '#7a1c1c'
          : '#245c2a',

        padding: '20px',
        borderRadius: '22px',

        fontWeight: '600',

        border: txError
          ? '2px solid #ffb7b7'
          : '2px solid #bdf5c4',

        boxShadow:
          '0 15px 40px rgba(0,0,0,0.15)',

        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',

        gap: '20px',

        minWidth: '360px',
        maxWidth: '420px',

        animation: 'slideIn 0.3s ease'
      }}
    >

      <div>

        <div
          style={{
            fontSize: '20px',
            marginBottom: '8px',
            fontWeight: '700'
          }}
        >
          {
            txError
              ? 'Transaction Failed'
              : 'Transaction Successful'
          }
        </div>

        <div
          style={{
            fontSize: '14px',
            opacity: 0.9
          }}
        >
          {txMessage}
        </div>

      </div>

      <button
        onClick={() => setTxMessage('')}
        style={{
          border: 'none',
          background: 'transparent',
          fontSize: '24px',
          cursor: 'pointer',
          color: 'inherit',
          fontWeight: '700'
        }}
      >
        ×
      </button>

    </div>

  )
}
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
                    onChange={(e) =>
                      setDelegateAddress(e.target.value)
                    }
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
              onClick={approveVault}
              className="button deposit-btn"
              style={{
                minWidth: '220px',
                whiteSpace: 'nowrap'
              }}
            >
              Approve Vault
            </button>
            <button
              onClick={depositToVault}
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
            <input
              type="text"
              placeholder="Proposal title..."
              value={proposalTitle}
              onChange={(e) =>
                setProposalTitle(e.target.value)
              }
              className="input input-light"
              style={{
                marginRight: '16px',
                maxWidth: '260px'
              }}
            />

            <button
              onClick={createProposal}
              className="button proposal-btn"
            >
              Create Proposal
            </button>

          </div>

          <div
            className="gov-grid"
            style={{
              display: 'grid',
              gridTemplateColumns:
                'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '24px'
            }}
          >
            <div
              className="white-card"
              style={{
                color: '#2f3b2f',
                overflowWrap: 'break-word',
                wordBreak: 'break-word'
              }}
            >

              <p className="stat-label">
                Indexed Governance Proposals
              </p>

              {
                subgraphProposals.length === 0 ? (

                  <p>No governance proposals indexed yet.
                    Create your first DAO proposal.</p>

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
                        Proposal #
                        {
                          proposal.proposalId.slice(0, 12)
                        }
                        ...
                      </p>

                      <p
                        style={{
                          fontSize: '14px',
                          marginBottom: '10px'
                        }}
                      >
                        {proposal.description}
                      </p>
                      <a
                        href={`https://sepolia.basescan.org/address/${GOVERNOR_ADDRESS}`}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          color: '#5d6d50',
                          fontWeight: '600',
                          textDecoration: 'none',
                          marginTop: '12px',
                          display: 'inline-block'
                        }}
                      >
                        View Governance Contract →
                      </a>
                      <p
                        style={{
                          fontSize: '12px',
                          opacity: 0.7
                        }}
                      >
                        {
                          proposal.proposer.slice(0, 6) +
                          '...' +
                          proposal.proposer.slice(-4)
                        }
                      </p>

                    </div>

                  ))

                )
              }

            </div>
            <div
              className="white-card"
              style={{
                overflowWrap: 'break-word',
                wordBreak: 'break-word'
              }}
            >

              <p className="stat-label">
                Recent Governance Votes
              </p>

              {
                subgraphVotes.length === 0 ? (

                  <p>No votes indexed yet</p>

                ) : (

                  subgraphVotes.map((vote, index) => {

                    const proposal =
                      subgraphProposals.find(
                        (p) =>
                          p.proposalId === vote.proposalId
                      )

                    return (

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
                            marginBottom: '10px',
                            color: '#2f3b2f'
                          }}
                        >
                          {
                            proposal
                              ? proposal.description
                              : 'Vote Activity'
                          }
                        </p>

                        <p
                          style={{
                            fontSize: '14px',
                            marginBottom: '10px',
                            color: '#55624f'
                          }}
                        >
                          Support: {
                            Number(vote.support) === 0
                              ? 'AGAINST'
                              : Number(vote.support) === 1
                                ? 'FOR'
                                : 'ABSTAIN'
                          }
                        </p>

                        <p
                          style={{
                            fontSize: '14px',
                            marginBottom: '10px',
                            color: '#55624f'
                          }}
                        >
                          Weight:
                          {
                            formatEther(vote.weight)
                          }
                        </p>

                        <p
                          style={{
                            fontSize: '12px',
                            opacity: 0.7,
                            color: '#6b7466'
                          }}
                        >
                          {
                            vote.voter.slice(0, 6) +
                            '...' +
                            vote.voter.slice(-4)
                          }
                        </p>

                      </div>

                    )

                  })
                )
              }

            </div>
            <div
              className="white-card"
              style={{
                overflowWrap: 'break-word',
                wordBreak: 'break-word'
              }}
            >

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

            <div
              className="white-card"
              style={{
                overflowWrap: 'break-word',
                wordBreak: 'break-word'
              }}
            >

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