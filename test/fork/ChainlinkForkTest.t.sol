// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";

interface AggregatorV3Interface {
    function latestRoundData() external view returns (uint80, int256, uint256, uint256, uint80);
}

contract ChainlinkForkTest is Test {
    AggregatorV3Interface feed;

    function setUp() public {
        vm.createSelectFork(vm.rpcUrl("mainnet"));

        feed = AggregatorV3Interface(0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419);
    }

    function testETHUSDPrice() public view {
        (, int256 price,,,) = feed.latestRoundData();

        assertGt(price, 0);
    }
}