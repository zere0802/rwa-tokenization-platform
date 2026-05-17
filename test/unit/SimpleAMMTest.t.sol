// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";

import "../../contracts/token/RWAToken.sol";
import "../../contracts/amm/SimpleAMM.sol";

contract SimpleAMMTest is Test {
    RWAToken public tokenA;
    RWAToken public tokenB;

    SimpleAMM public amm;

    address public user =
        address(1);

    function setUp() public {
        tokenA =
            new RWAToken();

        tokenB =
            new RWAToken();

        amm =
            new SimpleAMM(
                tokenA,
                tokenB
            );

        tokenA.transfer(
            user,
            1000 ether
        );

        tokenB.transfer(
            user,
            1000 ether
        );

        vm.startPrank(user);

        tokenA.approve(
            address(amm),
            type(uint256).max
        );

        tokenB.approve(
            address(amm),
            type(uint256).max
        );

        vm.stopPrank();
    }

    function testAddLiquidity()
        public
    {
        vm.startPrank(user);

        amm.addLiquidity(
            100 ether,
            100 ether
        );

        vm.stopPrank();

        assertEq(
            amm.reserveA(),
            100 ether
        );

        assertEq(
            amm.reserveB(),
            100 ether
        );

        assertGt(
            amm.totalSupply(),
            0
        );
    }

    function testRemoveLiquidity()
        public
    {
        vm.startPrank(user);

        amm.addLiquidity(
            100 ether,
            100 ether
        );

        uint256 shares =
            amm.lpBalance(user);

        amm.removeLiquidity(
            shares
        );

        vm.stopPrank();

        assertEq(
            amm.reserveA(),
            0
        );

        assertEq(
            amm.reserveB(),
            0
        );
    }

    function testSwapAForB()
        public
    {
        vm.startPrank(user);

        amm.addLiquidity(
            100 ether,
            100 ether
        );

        uint256 beforeBalance =
            tokenB.balanceOf(user);

        amm.swapAForB(
            10 ether
        );

        uint256 afterBalance =
            tokenB.balanceOf(user);

        vm.stopPrank();

        assertGt(
            afterBalance,
            beforeBalance
        );
    }

    function testSwapBForA()
        public
    {
        vm.startPrank(user);

        amm.addLiquidity(
            100 ether,
            100 ether
        );

        uint256 beforeBalance =
            tokenA.balanceOf(user);

        amm.swapBForA(
            10 ether
        );

        uint256 afterBalance =
            tokenA.balanceOf(user);

        vm.stopPrank();

        assertGt(
            afterBalance,
            beforeBalance
        );
    }

    function testKInvariant()
        public
    {
        vm.startPrank(user);

        amm.addLiquidity(
            100 ether,
            100 ether
        );

        uint256 kBefore =
            amm.getK();

        amm.swapAForB(
            10 ether
        );

        uint256 kAfter =
            amm.getK();

        vm.stopPrank();

        assertGe(
            kAfter,
            kBefore
        );
    }
}