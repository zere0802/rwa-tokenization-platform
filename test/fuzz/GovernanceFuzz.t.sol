// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";

import "../../contracts/token/RWAToken.sol";
import "../../contracts/governance/Governance.sol";

import "@openzeppelin/contracts/governance/TimelockController.sol";

contract GovernanceFuzzTest is Test {
    RWAToken token;

    Governance governance;

    TimelockController timelock;

    address voter = address(1);

    function setUp() public {
        token = new RWAToken();

        address[] memory proposers = new address[](1);

        proposers[0] = address(this);

        address[] memory executors = new address[](1);

        executors[0] = address(0);

        timelock = new TimelockController(2 days, proposers, executors, address(this));

        governance = new Governance(token, timelock);

        token.mint(address(this), 1_000_000 ether);

        token.transfer(voter, 500_000 ether);

        vm.prank(voter);

        token.delegate(voter);

        vm.roll(block.number + 1);
    }

    function testFuzzVotingPower(uint256 amount) public {
        amount = bound(amount, 1 ether, 1000 ether);

        token.transfer(voter, amount);

        vm.prank(voter);

        token.delegate(voter);

        vm.roll(block.number + 1);

        uint256 votes = token.getVotes(voter);

        assertGe(votes, amount);
    }

    function testFuzzProposalThreshold(uint256 amount) public {
        amount = bound(amount, 1 ether, 10000 ether);

        assertGe(amount, governance.proposalThreshold());
    }
}
