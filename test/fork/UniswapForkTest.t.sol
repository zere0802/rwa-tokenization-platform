// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";

interface IERC20 {
    function balanceOf(address account) external view returns (uint256);

    function transfer(address to, uint256 amount) external returns (bool);

    function decimals() external view returns (uint8);
}

contract USDCForkTest is Test {
    IERC20 usdc;

    address whale = 0x55FE002aefF02F77364de339a1292923A15844B8;

    address receiver = address(1);

    function setUp() public {
        vm.createSelectFork(vm.rpcUrl("mainnet"));

        usdc = IERC20(0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48);
    }

    function testUSDCDecimals() public view {
        assertEq(usdc.decimals(), 6);
    }

    function testTransferUSDC() public {
        uint256 amount = 1000 * 1e6;

        uint256 beforeBalance = usdc.balanceOf(receiver);

        vm.prank(whale);

        usdc.transfer(receiver, amount);

        uint256 afterBalance = usdc.balanceOf(receiver);

        assertEq(afterBalance - beforeBalance, amount);
    }
}
