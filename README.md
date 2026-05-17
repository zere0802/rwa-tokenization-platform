# RWA DAO Tokenization Platform

A full-stack decentralized protocol for real-world asset (RWA) tokenization, governance, and yield vault management built on Base Sepolia.

This project was developed as the final capstone project for Blockchain Technologies 2.

 
# Overview

The platform combines:

- ERC20 governance token
- DAO governance system
- ERC4626 tokenized vault
- Onchain delegation and voting
- The Graph indexing
- L2 deployment on Base Sepolia
- React frontend with Wagmi integration

Users can:

- Connect their wallet
- Delegate governance voting power
- Create DAO proposals
- Vote on governance proposals
- Deposit tokens into the ERC4626 vault
- View indexed governance activity from The Graph

 
# Architecture

## Smart Contracts

### RWAToken

ERC20 governance token with:

- ERC20Votes
- ERC20Permit
- Role-based minting
- Delegated governance voting

### Governance

OpenZeppelin Governor implementation featuring:

- Proposal creation
- Voting system
- Timelock governance
- Proposal state management

### TimelockController

Secures governance execution through delayed proposal execution.

### RWAVault

ERC4626 tokenized vault for RWA deposits and yield accounting.

 
# Tech Stack

## Smart Contracts

- Solidity
- OpenZeppelin
- Foundry

## Frontend

- React
- Wagmi
- Viem

## Indexing

- The Graph

## Deployment

- Base Sepolia
- BaseScan

 
# Frontend Features

- MetaMask wallet connection
- Wrong network detection
- Token balance display
- Governance voting power display
- Delegate address management
- Proposal creation UI
- Proposal state tracking
- Governance vote interface
- ERC4626 approve/deposit flow
- Indexed proposal activity
- Indexed vote activity
- Transaction notifications and error handling

 
# Governance Flow

1. User connects wallet
2. User delegates voting power
3. User creates proposal
4. DAO proposal becomes active
5. Users vote FOR or AGAINST
6. Proposal state is tracked onchain
7. Governance events are indexed by The Graph

 
# ERC4626 Vault Flow

1. User approves vault allowance
2. User deposits RWA tokens
3. Vault receives assets
4. Deposit activity becomes visible onchain

 
# The Graph Integration

The protocol uses a custom subgraph for indexing governance and vault events.

## Indexed Entities

- Proposal
- Vote
- Deposit
- DelegateChange

 
# GraphQL Queries

## Get Proposals

graphql
{
  proposals(first: 5) {
    proposalId
    description
    proposer
  }
}


## Get Votes

graphql
{
  votes(first: 5) {
    voter
    proposalId
    support
    weight
  }
}


## Get Deposits

graphql
{
  deposits(first: 5) {
    owner
    assets
    shares
  }
}


## Get Delegate Changes

graphql
{
  delegateChanges(first: 5) {
    delegator
    fromDelegate
    toDelegate
  }
}


## Get Proposal Activity

graphql
{
  proposals(first: 5) {
    proposalId
    description
  }

  votes(first: 5) {
    voter
    support
  }
}




# Verified Contracts

## RWAToken

[https://sepolia.basescan.org/address/0x7B3B6F99ada780d409bD713d32896f81006350F9](https://sepolia.basescan.org/address/0x7B3B6F99ada780d409bD713d32896f81006350F9)

## Governance

[https://sepolia.basescan.org/address/0xdebd86C48B54a421B2C8ba90eF4117B7D5Aa78e5](https://sepolia.basescan.org/address/0xdebd86C48B54a421B2C8ba90eF4117B7D5Aa78e5)

## RWAVault

[https://sepolia.basescan.org/address/0x94de1B8d49a036ddD287bC5eEA5879C9924D6e45](https://sepolia.basescan.org/address/0x94de1B8d49a036ddD287bC5eEA5879C9924D6e45)

 
# Subgraph

## Subgraph Studio

[https://thegraph.com/studio/subgraph/rwa-dao-subgraph](https://thegraph.com/studio/subgraph/rwa-dao-subgraph)

## Query Endpoint

[https://api.studio.thegraph.com/query/1753362/rwa-dao-subgraph/v0.0.2](https://api.studio.thegraph.com/query/1753362/rwa-dao-subgraph/v0.0.2)

 
# Layer 2 Deployment

The protocol is deployed on Base Sepolia to reduce gas costs and improve governance usability.

## Example L2 Advantages

| Operation         | Ethereum Mainnet | Base Sepolia |
| ----------------- | ---------------- | ------------ |
| Token Transfer    | High Cost        | Low Cost     |
| Proposal Creation | Expensive        | Cheap        |
| Governance Voting | Expensive        | Cheap        |
| Vault Deposit     | Medium Cost      | Cheap        |
| Delegation        | Medium Cost      | Cheap        |

 
# Running Locally

## Install Dependencies

```bash
forge install
npm install
```

## Build Contracts

```bash
forge build
```

## Run Tests

```bash
forge test
```

## Start Frontend

```bash
cd frontend
npm install
npm run dev
```

 
# Deployment

## Deploy Contracts

```bash
forge script script/DeployGovernance.s.sol \
--rpc-url https://sepolia.base.org \
--broadcast
```

## Deploy Subgraph

```bash
graph deploy rwa-dao-subgraph
```

 
# Screenshots

## Governance Dashboard

![Governance Dashboard](images/dashboard.png)

## Proposal Creation

![Proposal Creation](images/proposal.png)

## Governance Voting

![Governance Voting](images/voting.png)

## Vault Deposit

![Vault Deposit](images/deposit.png)

 
# Security

The protocol uses:

* OpenZeppelin Governor
* TimelockController
* AccessControl
* ERC20Votes
* ERC4626
* Role-based authorization
* Reentrancy-safe architecture
* Safe transaction handling

 
# Team Contributions

## Smart Contracts

* DAO governance
* ERC20 token
* Vault architecture
* Timelock system

## Frontend + Subgraph + L2

* React governance dashboard
* Wagmi integration
* The Graph indexing
* GraphQL integration
* Base Sepolia deployment
* Contract verification
* Governance activity feed

 
# RWA Tokenization Platform

## Overview

A production-style Real World Asset (RWA) tokenization platform developed with Solidity and Foundry.

The project demonstrates advanced smart contract engineering concepts including governance, vault tokenization, oracle integrations, upgradeable contracts, automated testing, and DeFi AMM mechanics.

The platform includes:

* ERC20 governance token
* ERC4626 vault
* DAO governance using Governor + Timelock
* Chainlink oracle integration
* CREATE2 deterministic deployments
* UUPS upgradeable contracts
* AMM liquidity pool
* Security testing
* Fuzz testing
* Invariant testing
* Fork testing
* CI/CD pipeline
* Slither static analysis

---

# Architecture

## Core Contracts

### RWAToken

ERC20 governance token with:

* ERC20Votes
* ERC20Permit
* AccessControl
* Minting and burning
* Vote delegation
* Governance voting power snapshots

---

### RWAVault

ERC4626 tokenized vault supporting:

* Deposits
* Withdrawals
* Share accounting
* Asset conversions
* Preview functions
* Treasury-style vault management

---

### Governance

DAO governance system built using OpenZeppelin Governor and TimelockController.

Features include:

* Proposal creation
* Voting lifecycle
* Timelock execution
* Proposal threshold
* Quorum enforcement
* Delayed governance execution

---

### OracleAdapter

Chainlink oracle adapter supporting:

* Decentralized price feeds
* Stale price protection
* Admin-controlled feed updates
* External oracle integrations

---

### RWAFactory

Factory contract supporting:

* CREATE deployments
* CREATE2 deterministic deployments
* Address prediction
* Token deployment automation

---

### RWATokenUpgradeableV1 / V2

Upgradeable governance token implementation using the UUPS proxy pattern.

Features include:

* UUPS upgradeability
* Proxy deployment
* Upgrade authorization
* Storage persistence
* Versioned implementations

---

### SimpleAMM

Simple automated market maker implementation supporting:

* Liquidity pools
* Token swaps
* LP share accounting
* Constant product invariant (x * y = k)

---

# Security Features

## Reentrancy Protection

The project includes:

* Vulnerable vault example
* Secure vault implementation
* Reentrancy attack demonstrations
* Reentrancy security tests

---

## Access Control

Role-based permissions implemented using OpenZeppelin AccessControl.

Protected functionality includes:

* Minting
* Governance execution
* Oracle management
* Treasury withdrawal
* Upgrade authorization

---

## Governance Security

Governance protections include:

* Timelock delays
* Proposal thresholds
* Quorum enforcement
* Double-voting prevention
* Snapshot voting using ERC20Votes

---

## Oracle Security

Oracle protections include:

* Stale price validation
* Controlled feed updates
* Chainlink integration
* Timestamp verification

---

# Testing

## Unit Tests

Comprehensive unit tests exist for:

* RWAToken
* RWAVault
* Governance
* OracleAdapter
* Factory
* Upgradeable contracts
* AMM contracts
* Security contracts
* Yul utilities

Current status:

* 90+ passing tests

---

# Fuzz Testing

Fuzz testing validates:

* Token transfers
* Governance voting logic
* Vault accounting
* Oracle interactions
* Share calculations
* Deposit and withdrawal edge cases

---

# Invariant Testing

Invariant testing validates:

* Total supply consistency
* Treasury accounting
* Vault solvency
* Share accounting
* Governance invariants

---

# Fork Testing

Fork tests interact with real protocols and infrastructure:

* USDC
* Uniswap V2
* Chainlink ETH/USD feeds

---

# Upgradeability

The project implements the UUPS proxy upgrade pattern.

The upgrade flow includes:

* Initial proxy deployment
* V1 implementation
* Upgrade to V2
* Storage persistence verification
* Post-upgrade functionality testing

---

# AMM Functionality

The protocol includes a custom AMM implementation supporting:

* Liquidity provision
* Liquidity withdrawal
* Token swaps
* LP share minting
* Constant product invariant

AMM tests validate:

* Swap correctness
* Reserve accounting
* Liquidity accounting
* Invariant preservation

---

# Coverage

Current coverage metrics:

| Metric             | Result |
| ------------------ | ------ |
| Line Coverage      | 94.21% |
| Statement Coverage | 93.33% |
| Function Coverage  | 92.31% |

Coverage report:

COVERAGE.md

---

# Static Analysis

Security analysis performed using:

* Slither
* Manual review
* Fuzz testing
* Invariant testing

No unresolved Critical or High severity vulnerabilities remain in the reviewed version.

---

# CI/CD

GitHub Actions CI pipeline automatically runs:

* forge build
* forge test
* forge coverage

Workflow location:

.github/workflows/test.yml

---

# L2 Deployment

The protocol supports deployment to Base Sepolia.

Deployed contracts include:

* RWAToken
* RWAVault
* Governance
* Upgradeable token implementations

---

# Tech Stack

* Solidity 0.8.24
* Foundry
* OpenZeppelin
* Chainlink
* GitHub Actions
* Slither

---

# Installation

## Clone Repository

git clone [https://github.com/zere0802/rwa-tokenization-platform.git](https://github.com/zere0802/rwa-tokenization-platform.git)

---

## Install Dependencies

forge install

---

## Build

forge build

---

## Run Tests

forge test

---

## Run Coverage

forge coverage --no-match-coverage "script/*"

---

## Run Slither

slither .

---

# Project Structure

contracts/
├── amm/
├── factory/
├── governance/
├── interfaces/
├── mocks/
├── oracle/
├── token/
├── upgrade/
├── utils/
└── vault/

script/

test/
├── unit/
├── fuzz/
├── invariant/
└── fork/

---

# Governance Parameters

| Parameter      | Value        |
| -------------- | ------------ |
| Voting Delay   | 7200 blocks  |
| Voting Period  | 50400 blocks |
| Timelock Delay | 2 days       |

---

# Security Testing Included

* Reentrancy attack simulation
* Access control validation
* Oracle stale price protection
* Proposal voting restrictions
* Double-voting prevention
* Treasury withdrawal protection
* Upgradeability testing
* AMM reserve validation

---

# Contributors

* Smart Contracts & Testing
* Governance & Security
* Upgradeability & AMM
* Documentation & Architecture
* Frontend & Integration

---

# Future Improvements

Potential future improvements include:

* Advanced oracle aggregation
* Emergency pause functionality
* Cross-chain deployments
* Improved AMM pricing
* Subgraph indexing
* Frontend dashboard enhancements

---

# License

MIT
