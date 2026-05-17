// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract SimpleAMM {
    IERC20 public tokenA;
    IERC20 public tokenB;

    uint256 public reserveA;
    uint256 public reserveB;

    uint256 public totalSupply;

    mapping(address => uint256)
        public lpBalance;

    constructor(
        IERC20 _tokenA,
        IERC20 _tokenB
    ) {
        tokenA = _tokenA;
        tokenB = _tokenB;
    }

    function addLiquidity(
        uint256 amountA,
        uint256 amountB
    )
        external
    {
        tokenA.transferFrom(
            msg.sender,
            address(this),
            amountA
        );

        tokenB.transferFrom(
            msg.sender,
            address(this),
            amountB
        );

        uint256 shares;

        if (totalSupply == 0) {
            shares =
                sqrt(
                    amountA *
                    amountB
                );
        } else {
            uint256 shareA =
                (
                    amountA *
                    totalSupply
                ) / reserveA;

            uint256 shareB =
                (
                    amountB *
                    totalSupply
                ) / reserveB;

            shares =
                shareA <
                shareB
                    ? shareA
                    : shareB;
        }

        require(
            shares > 0,
            "zero shares"
        );

        lpBalance[msg.sender] +=
            shares;

        totalSupply += shares;

        reserveA += amountA;
        reserveB += amountB;
    }

    function removeLiquidity(
        uint256 shares
    )
        external
    {
        require(
            lpBalance[msg.sender]
                >= shares,
            "not enough shares"
        );

        uint256 amountA =
            (
                shares *
                reserveA
            ) / totalSupply;

        uint256 amountB =
            (
                shares *
                reserveB
            ) / totalSupply;

        lpBalance[msg.sender] -=
            shares;

        totalSupply -= shares;

        reserveA -= amountA;
        reserveB -= amountB;

        tokenA.transfer(
            msg.sender,
            amountA
        );

        tokenB.transfer(
            msg.sender,
            amountB
        );
    }

    function swapAForB(
        uint256 amountAIn
    )
        external
    {
        require(
            amountAIn > 0,
            "zero input"
        );

        tokenA.transferFrom(
            msg.sender,
            address(this),
            amountAIn
        );

        uint256 amountBOut =
            getAmountOut(
                amountAIn,
                reserveA,
                reserveB
            );

        reserveA += amountAIn;
        reserveB -= amountBOut;

        tokenB.transfer(
            msg.sender,
            amountBOut
        );
    }

    function swapBForA(
        uint256 amountBIn
    )
        external
    {
        require(
            amountBIn > 0,
            "zero input"
        );

        tokenB.transferFrom(
            msg.sender,
            address(this),
            amountBIn
        );

        uint256 amountAOut =
            getAmountOut(
                amountBIn,
                reserveB,
                reserveA
            );

        reserveB += amountBIn;
        reserveA -= amountAOut;

        tokenA.transfer(
            msg.sender,
            amountAOut
        );
    }

    function getAmountOut(
        uint256 amountIn,
        uint256 reserveIn,
        uint256 reserveOut
    )
        public
        pure
        returns (uint256)
    {
        require(
            reserveIn > 0 &&
            reserveOut > 0,
            "bad reserves"
        );

        return
            (
                amountIn *
                reserveOut
            ) /
            (
                reserveIn +
                amountIn
            );
    }

    function getK()
        public
        view
        returns (uint256)
    {
        return
            reserveA *
            reserveB;
    }

    function sqrt(
        uint256 y
    )
        internal
        pure
        returns (uint256 z)
    {
        if (y > 3) {
            z = y;

            uint256 x =
                y / 2 + 1;

            while (x < z) {
                z = x;

                x =
                    (
                        y / x + x
                    ) / 2;
            }
        } else if (y != 0) {
            z = 1;
        }
    }
}