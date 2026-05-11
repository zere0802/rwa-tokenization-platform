// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract YulMath {
    function addSolidity(
        uint256 a,
        uint256 b
    )
        external
        pure
        returns (uint256)
    {
        return a + b;
    }

    function addYul(
        uint256 a,
        uint256 b
    )
        external
        pure
        returns (uint256 result)
    {
        assembly {
            result := add(a, b)
        }
    }

    function multiplyYul(
        uint256 a,
        uint256 b
    )
        external
        pure
        returns (uint256 result)
    {
        assembly {
            result := mul(a, b)
        }
    }
}