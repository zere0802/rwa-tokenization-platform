import './App.css'
import { useState, useEffect } from 'react'
import {
  useAccount,
  useConnect,
  useDisconnect,
  useChainId,
  useReadContract,
  useWriteContract,
  usePublicClient
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
import { anvil } from './wagmi'

import {
  CONTRACTS,
  tokenABI,
  vaultABI,
  governorABI
} from './contracts'

function App() {

  const { address, isConnected } = useAccount()

  const { connect } = useConnect()

  const { disconnect } = useDisconnect()

  const chainId = useChainId()
  const publicClient = usePublicClient()

  const addresses = CONTRACTS[chainId] || CONTRACTS[31337]
  const tokenAddress = addresses.TOKEN
  const governorAddress = addresses.GOVERNOR
  const vaultAddress = addresses.VAULT

  const correctChain = 84532
  const wrongNetwork =
    isConnected && chainId !== 84532 && chainId !== 31337

  const [depositAmount, setDepositAmount] = useState('')
  const [proposalId, setProposalId] = useState('')
  const [proposalTitle, setProposalTitle] = useState('')
  const [proposalState, setProposalState] = useState('')
  const [delegateAddress, setDelegateAddress] = useState('')
  const [subgraphProposals, setSubgraphProposals] = useState([])
  const [subgraphVotes, setSubgraphVotes] = useState([])
  const [proposalStatesMap, setProposalStatesMap] = useState({})
  useEffect(() => {
    console.log("=== RWA PLATFORM DEBUG INFO ===");
    console.log("Wallet Connected:", isConnected);
    console.log("Connected Address:", address);
    console.log("Active Chain ID:", chainId);
    console.log("Active RPC Client:", publicClient ? "Ready" : "Missing");
    console.log("Resolved Token Address:", tokenAddress);
    console.log("Resolved Governor Address:", governorAddress);
    console.log("Resolved Vault Address:", vaultAddress);
    console.log("===============================");
  }, [isConnected, address, chainId, publicClient, tokenAddress, governorAddress, vaultAddress])

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
    address: tokenAddress,
    abi: tokenABI,
    functionName: 'balanceOf',
    args: [address],
    query: {
      enabled: !!address && !!tokenAddress,
    }
  })

  const {
    data: votes,
    refetch: refetchVotes
  } = useReadContract({
    address: tokenAddress,
    abi: tokenABI,
    functionName: 'getVotes',
    args: [address],
    query: {
      enabled: !!address && !!tokenAddress,
    }
  })

  const {
    data: delegates,
    refetch: refetchDelegates
  } = useReadContract({
    address: tokenAddress,
    abi: tokenABI,
    functionName: 'delegates',
    args: [address],
    query: {
      enabled: !!address && !!tokenAddress,
    }
  })

  async function depositToVault() {

    try {

      const hash = await writeContractAsync({

        address: vaultAddress,

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
      address: tokenAddress,
      abi: tokenABI,
      functionName: 'approve',
      args: [
        vaultAddress,
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
      address: tokenAddress,
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
        vaultAddress,
        parseEther('1')
      ],
    })

    const hash = await writeContractAsync({
      address: governorAddress,
      abi: governorABI,
      functionName: 'propose',

      args: [
        [tokenAddress],
        [0],
        [calldata],
        proposalTitle
      ],
    })

    await publicClient.waitForTransactionReceipt({ hash })

    setTxError(false)

    setTxMessage(
      'Proposal created successfully'
    )

    // Delay reload to let user see success message, then reload to update on-chain list
    setTimeout(() => {
      window.location.reload()
    }, 1500)

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

    const hash = await writeContractAsync({
      address: governorAddress,
      abi: governorABI,
      functionName: 'castVote',

      args: [
        BigInt(proposalId),
        support
      ],
    })

    await publicClient.waitForTransactionReceipt({ hash })

    setTxError(false)

    setTxMessage(
      support === 1
        ? 'Vote FOR submitted successfully'
        : 'Vote AGAINST submitted successfully'
    )

    setTimeout(() => {
      window.location.reload()
    }, 1500)

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
        address: governorAddress,
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

    async function fetchData() {
      if (chainId === 31337) {
        if (!publicClient || !governorAddress) return
        try {
          // Dynamic query direct from local Anvil node using Event Logs!
          const proposalLogs = await publicClient.getLogs({
            address: governorAddress,
            event: {
              type: 'event',
              name: 'ProposalCreated',
              inputs: [
                { type: 'uint256', name: 'proposalId', indexed: false },
                { type: 'address', name: 'proposer', indexed: true },
                { type: 'address[]', name: 'targets', indexed: false },
                { type: 'uint256[]', name: 'values', indexed: false },
                { type: 'string[]', name: 'signatures', indexed: false },
                { type: 'bytes[]', name: 'calldatas', indexed: false },
                { type: 'uint256', name: 'voteStart', indexed: false },
                { type: 'uint256', name: 'voteEnd', indexed: false },
                { type: 'string', name: 'description', indexed: false },
              ],
            },
            fromBlock: 0n,
          })

          const parsedProposals = proposalLogs.map(log => ({
            proposalId: log.args.proposalId.toString(),
            description: log.args.description,
            proposer: log.args.proposer,
          })).reverse() // show latest first

          setSubgraphProposals(parsedProposals)

          const voteLogs = await publicClient.getLogs({
            address: governorAddress,
            event: {
              type: 'event',
              name: 'VoteCast',
              inputs: [
                { type: 'address', name: 'voter', indexed: true },
                { type: 'uint256', name: 'proposalId', indexed: true },
                { type: 'uint8', name: 'support', indexed: false },
                { type: 'uint256', name: 'weight', indexed: false },
                { type: 'string', name: 'reason', indexed: false },
              ],
            },
            fromBlock: 0n,
          })

          const parsedVotes = voteLogs.map(log => ({
            voter: log.args.voter,
            proposalId: log.args.proposalId.toString(),
            support: log.args.support,
            weight: log.args.weight.toString(),
          })).reverse() // show latest first

          setSubgraphVotes(parsedVotes)

        } catch (err) {
          console.error("Error fetching local event logs:", err)
        }
      } else {
        // Sepolia: Query from The Graph subgraph
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
          if (result?.data) {
            setSubgraphProposals(result.data.proposals || [])
            setSubgraphVotes(result.data.votes || [])
          }
        } catch (err) {
          console.error("Error fetching subgraph data:", err)
        }
      }
    }

    fetchData()

  }, [chainId, publicClient, governorAddress])

  // Fetch state for all loaded proposals
  useEffect(() => {
    if (!publicClient || !governorAddress || subgraphProposals.length === 0) return

    const fetchStates = async () => {
      const states = {}
      const stateLabels = [
        "Pending",
        "Active",
        "Canceled",
        "Defeated",
        "Succeeded",
        "Queued",
        "Expired",
        "Executed"
      ]

      for (const p of subgraphProposals) {
        try {
          const stateData = await publicClient.readContract({
            address: governorAddress,
            abi: governorABI,
            functionName: 'state',
            args: [BigInt(p.proposalId)]
          })
          states[p.proposalId] = stateLabels[stateData] || "Unknown"
        } catch (err) {
          states[p.proposalId] = "Pending"
        }
      }
      setProposalStatesMap(states)
    }

    fetchStates()
  }, [subgraphProposals, publicClient, governorAddress])

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
              Please switch to Base Sepolia or Localhost.
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
                  {chainId === 31337 ? 'Localhost (Anvil)' : 'Base Sepolia'}
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

                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '10px' }}>
                        <span style={{
                          background: proposalStatesMap[proposal.proposalId] === 'Active' ? '#dcffe0' : '#f0f0f0',
                          color: proposalStatesMap[proposal.proposalId] === 'Active' ? '#245c2a' : '#555',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: 'bold'
                        }}>
                          {proposalStatesMap[proposal.proposalId] || 'Loading...'}
                        </span>

                        {proposalStatesMap[proposal.proposalId] === 'Active' && (
                          <button
                            onClick={() => {
                              setProposalId(proposal.proposalId)
                              vote()
                            }}
                            className="button"
                            style={{ padding: '4px 12px', fontSize: '12px', background: '#36b359' }}
                          >
                            Vote (For)
                          </button>
                        )}
                      </div>

                      <a
                        href={chainId === 31337 ? '#' : `https://sepolia.basescan.org/address/${governorAddress}`}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          color: '#5d6d50',
                          fontWeight: '600',
                          textDecoration: 'none',
                          marginTop: '12px',
                          display: 'inline-block',
                          opacity: chainId === 31337 ? 0.5 : 1,
                          pointerEvents: chainId === 31337 ? 'none' : 'auto'
                        }}
                      >
                        {chainId === 31337 ? 'Governance Contract (Local)' : 'View Governance Contract →'}
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
                    chainId === 84532
                      ? 'Base Sepolia'
                      : chainId === 31337
                        ? 'Localhost (Anvil)'
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