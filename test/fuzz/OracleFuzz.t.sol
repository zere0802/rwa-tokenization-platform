// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";

import "../../contracts/oracle/OracleAdapter.sol";
import "../../contracts/mocks/MockV3Aggregator.sol";

contract OracleFuzzTest is Test {
    OracleAdapter oracle;

    MockV3Aggregator feed;

    function setUp() public {
        feed = new MockV3Aggregator(2000e8);

        oracle = new OracleAdapter(address(feed));
    }

    function testFuzzPrice(int256 price) public {
        price = int256(bound(uint256(price), 1e8, 100000e8));

        feed.updateAnswer(price);

        int256 latest = oracle.getLatestPrice();

        assertEq(latest, price);
    }

    function testFuzzFeedUpdate(uint256 value) public {
        value = bound(value, 1e8, 100000e8);

        MockV3Aggregator newFeed = new MockV3Aggregator(int256(value));

        oracle.setPriceFeed(address(newFeed));

        int256 latest = oracle.getLatestPrice();

        assertEq(latest, int256(value));
    }
}
