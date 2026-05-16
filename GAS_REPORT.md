# Gas Optimization Report

## Overview

This report summarizes gas usage observations and optimization techniques used in the RWA DAO Tokenization Platform.

The protocol was deployed on Base Sepolia to reduce governance and transaction costs compared to Ethereum Mainnet.


# Optimization Techniques

## ERC20Votes Checkpoint Optimization

The governance token uses OpenZeppelin ERC20Votes which stores voting checkpoints efficiently.

Benefits:
- historical vote tracking
- delegation snapshots
- optimized governance accounting


## Reduced Storage Writes

The contracts minimize unnecessary storage updates to reduce gas consumption during:
- delegation
- proposal voting
- vault interactions

 
## ERC4626 Standardized Vault Logic

Using ERC4626 reduced the need for custom vault accounting logic and improved gas efficiency through standardized asset/share calculations.

 
# Gas Benchmarks

| Operation | Approx Gas Used |
|---|---|
| Token Transfer | ~50,000 |
| Delegate Voting Power | ~80,000 |
| Create Proposal | ~150,000 |
| Cast Vote | ~120,000 |
| Vault Deposit | ~110,000 |
| Vault Withdraw | ~115,000 |

 
# Layer 1 vs Layer 2 Comparison

| Operation | Ethereum Mainnet | Base Sepolia |
|---|---|---|
| Transfer | High Cost | Low Cost |
| Proposal Creation | Expensive | Cheap |
| Governance Voting | Expensive | Cheap |
| Delegation | Medium Cost | Cheap |
| Vault Deposit | Medium Cost | Cheap |

 
# Yul Optimization Benchmark

The project also includes Yul benchmark testing to compare:
- Solidity implementations
- Inline assembly implementations

Result:
- Yul arithmetic operations consumed less gas
- Solidity provided better readability and safety

 
# Conclusion

The project demonstrates several gas optimization approaches:
- standardized OpenZeppelin contracts
- ERC4626 vault efficiency
- reduced storage operations
- Layer 2 deployment optimization
- optional low-level Yul optimizations

Deploying on Base Sepolia significantly improved usability and reduced governance transaction costs.