// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";

import "../../contracts/oracle/OracleAdapter.sol";
import "../../contracts/mocks/MockV3Aggregator.sol";

contract OracleAdapterTest is Test {
    OracleAdapter oracle;

    MockV3Aggregator feed;

    function setUp() public {
        feed = new MockV3Aggregator(2000e8);

        oracle = new OracleAdapter(address(feed));
    }

    function testGetPrice() public {
        int256 price = oracle.getLatestPrice();

        assertEq(price, 2000e8);
    }

    function testOnlyAdminCanSetFeed() public {
        vm.prank(address(1));

        vm.expectRevert();

        oracle.setPriceFeed(address(feed));
    }

    function testAdminCanUpdateFeed() public {
        MockV3Aggregator newFeed = new MockV3Aggregator(3000e8);

        oracle.setPriceFeed(address(newFeed));

        int256 price = oracle.getLatestPrice();

        assertEq(price, 3000e8);
    }

    function testRevertOnStalePrice() public {
        vm.warp(block.timestamp + 2 days);

        vm.expectRevert();

        oracle.getLatestPrice();
    }

    function testPriceFeedAddress() public {
        assertEq(address(oracle.priceFeed()), address(feed));
    }

    function testLatestPricePositive() public {
        int256 price = oracle.getLatestPrice();

        assertGt(price, 0);
    }
}