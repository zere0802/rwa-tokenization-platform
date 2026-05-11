// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";

interface IERC20 {
    function approve(address spender, uint256 amount) external returns (bool);

    function balanceOf(address account) external view returns (uint256);
}

interface IUniswapV2Router {
    function WETH() external pure returns (address);

    function swapExactETHForTokens(uint256 amountOutMin, address[] calldata path, address to, uint256 deadline)
        external
        payable
        returns (uint256[] memory amounts);
}

contract UniswapForkTest is Test {
    IERC20 usdc;

    IUniswapV2Router router;

    address user = address(this);

    function setUp() public {
        vm.createSelectFork(vm.rpcUrl("mainnet"));

        vm.deal(user, 10 ether);

        usdc = IERC20(0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48);

        router = IUniswapV2Router(0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D);
    }

    function testSwapETHForUSDC() public {
        address[] memory path = new address[](2);

        path[0] = router.WETH();

        path[1] = address(usdc);

        uint256 beforeBalance = usdc.balanceOf(user);

        router.swapExactETHForTokens{value: 1 ether}(0, path, user, block.timestamp + 1 hours);

        uint256 afterBalance = usdc.balanceOf(user);

        assertGt(afterBalance, beforeBalance);
    }
}
