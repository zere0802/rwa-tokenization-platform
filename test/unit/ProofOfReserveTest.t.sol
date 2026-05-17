// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../../contracts/oracle/ProofOfReserve.sol";
import "../../contracts/mocks/MockV3Aggregator.sol";

contract ProofOfReserveTest is Test {
    ProofOfReserve public por;
    MockV3Aggregator public feed;

    address public admin = address(this);
    address public unauthorized = address(0x99);

    // 1,000,000 units with 8 decimals (matching Chainlink PoR precision)
    int256 constant RESERVE_1M = 1_000_000 * 1e8;

    // 500,000 RWA tokens with 18 decimals (on-chain supply)
    uint256 constant SUPPLY_500K_WEI = 500_000 * 1e18;

    // 2,000,000 RWA tokens — exceeds reserves
    uint256 constant SUPPLY_2M_WEI = 2_000_000 * 1e18;

    function setUp() public {
        feed = new MockV3Aggregator(RESERVE_1M);
        por = new ProofOfReserve(address(feed));
    }

    // ─── getReserveBalance ────────────────────────────────────────────────────

    function testGetReserveBalanceReturnsAnswer() public view {
        int256 balance = por.getReserveBalance();
        assertEq(balance, RESERVE_1M);
    }

    function testGetReserveBalanceRevertsWhenStale() public {
        // Warp time past the staleness threshold
        vm.warp(block.timestamp + 2 days);
        vm.expectRevert(ProofOfReserve.StaleReserveData.selector);
        por.getReserveBalance();
    }

    function testGetReserveBalanceRevertsOnNegativeAnswer() public {
        feed.updateAnswer(-1);
        vm.expectRevert(ProofOfReserve.InvalidReserveData.selector);
        por.getReserveBalance();
    }

    function testGetReserveBalanceRevertsOnZeroAnswer() public {
        feed.updateAnswer(0);
        vm.expectRevert(ProofOfReserve.InvalidReserveData.selector);
        por.getReserveBalance();
    }

    // ─── checkReserves ────────────────────────────────────────────────────────

    function testCheckReservesPassesWhenSupplyBelowReserve() public {
        // 500k on-chain supply vs. 1M reserves → should pass
        por.checkReserves(SUPPLY_500K_WEI);
    }

    function testCheckReservesPassesWhenSupplyEqualsReserve() public {
        // Exactly 1M tokens (in wei), feed has exactly 1M in 8 decimals → should pass
        uint256 exactly1M = 1_000_000 * 1e18;
        por.checkReserves(exactly1M);
    }

    function testCheckReservesRevertsWhenSupplyExceedsReserve() public {
        // 2M on-chain supply vs. 1M reserves → must revert
        vm.expectRevert();
        por.checkReserves(SUPPLY_2M_WEI);
    }

    function testCheckReservesRevertsWhenStale() public {
        vm.warp(block.timestamp + 2 days);
        vm.expectRevert(ProofOfReserve.StaleReserveData.selector);
        por.checkReserves(SUPPLY_500K_WEI);
    }

    function testCheckReservesPassesAfterReserveIncreased() public {
        // Increase reserves to 5M → 2M supply now passes
        feed.updateAnswer(5_000_000 * 1e8);
        por.checkReserves(SUPPLY_2M_WEI);
    }

    // ─── setReserveFeed ───────────────────────────────────────────────────────

    function testAdminCanUpdateReserveFeed() public {
        MockV3Aggregator newFeed = new MockV3Aggregator(RESERVE_1M);
        por.setReserveFeed(address(newFeed));
        assertEq(address(por.reserveFeed()), address(newFeed));
    }

    function testSetReserveFeedEmitsEvent() public {
        MockV3Aggregator newFeed = new MockV3Aggregator(RESERVE_1M);
        vm.expectEmit(true, true, false, false);
        emit ProofOfReserve.ReserveFeedUpdated(address(feed), address(newFeed));
        por.setReserveFeed(address(newFeed));
    }

    function testUnauthorizedCannotUpdateReserveFeed() public {
        MockV3Aggregator newFeed = new MockV3Aggregator(RESERVE_1M);
        vm.prank(unauthorized);
        vm.expectRevert();
        por.setReserveFeed(address(newFeed));
    }

    // ─── Access Control ───────────────────────────────────────────────────────

    function testAdminCanGrantReserveAdminRole() public {
        address newAdmin = address(0xAA);
        por.grantRole(por.RESERVE_ADMIN_ROLE(), newAdmin);
        assertTrue(por.hasRole(por.RESERVE_ADMIN_ROLE(), newAdmin));
    }

    function testRevokedAdminCannotUpdateFeed() public {
        por.revokeRole(por.RESERVE_ADMIN_ROLE(), admin);
        MockV3Aggregator newFeed = new MockV3Aggregator(RESERVE_1M);
        vm.expectRevert();
        por.setReserveFeed(address(newFeed));
    }
}
