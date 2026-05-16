````md
# Yul Optimization Benchmark

## Overview

This benchmark compares standard Solidity arithmetic implementations with low-level Yul (inline assembly) implementations.

The goal was to evaluate:
- gas efficiency
- execution overhead
- tradeoffs between readability and optimization

 
# Compared Implementations

## Solidity Version

Standard Solidity multiplication function:

```solidity
function multiply(uint256 a, uint256 b)
    public
    pure
    returns (uint256)
{
    return a * b;
}
````

 
## Yul Version

Inline assembly implementation:

```solidity
function multiplyYul(uint256 a, uint256 b)
    public
    pure
    returns (uint256 result)
{
    assembly {
        result := mul(a, b)
    }
}
```

 
# Benchmark Results

| Implementation | Approx Gas |
| -------------- | ---------- |
| Solidity       | Higher     |
| Yul Assembly   | Lower      |

 
# Observations

## Advantages of Yul

* lower gas consumption
* direct EVM instruction access
* reduced abstraction overhead

## Disadvantages of Yul

* reduced readability
* harder debugging
* increased development complexity
* greater security risk if misused

 
# Conclusion

The benchmark demonstrated that Yul can provide measurable gas savings for low-level arithmetic operations.

However, Solidity remains preferable for most application logic due to:

* readability
* maintainability
* safety
* easier auditing

For this reason, the project primarily uses Solidity with selective optimization where appropriate.

```
```
