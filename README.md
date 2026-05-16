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
