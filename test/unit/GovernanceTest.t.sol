// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";

import "../../contracts/token/RWAToken.sol";
import "../../contracts/governance/Governance.sol";

import "@openzeppelin/contracts/governance/TimelockController.sol";

contract GovernanceTest is Test {
    RWAToken token;

    Governance governance;

    TimelockController timelock;

    address voter = address(1);

    function setUp() public {
        token = new RWAToken();

        address[] memory proposers = new address[](1);

        address[] memory executors = new address[](1);

        executors[0] = address(0);

        timelock = new TimelockController(2 days, proposers, executors, address(this));

        governance = new Governance(token, timelock);

        proposers[0] = address(governance);

        bytes32 proposerRole = keccak256("PROPOSER_ROLE");

        bytes32 executorRole = keccak256("EXECUTOR_ROLE");

        bytes32 adminRole = keccak256("TIMELOCK_ADMIN_ROLE");

        timelock.grantRole(proposerRole, address(governance));

        timelock.grantRole(executorRole, address(0));

        timelock.revokeRole(adminRole, address(this));

        token.transfer(voter, 100_000 ether);

        vm.prank(voter);

        token.delegate(voter);

        vm.roll(block.number + 1);

        token.grantRole(token.ISSUER_ROLE(), address(timelock));
    }

    function testProposalLifecycle() public {
        address[] memory targets = new address[](1);

        targets[0] = address(token);

        uint256[] memory values = new uint256[](1);

        values[0] = 0;

        bytes[] memory calldatas = new bytes[](1);

        calldatas[0] = abi.encodeWithSignature("mint(address,uint256)", voter, 100 ether);

        string memory description = "Mint tokens";

        vm.prank(voter);

        uint256 proposalId = governance.propose(targets, values, calldatas, description);

        vm.roll(block.number + 7201);

        vm.prank(voter);

        governance.castVote(proposalId, 1);

        vm.roll(block.number + 50401);

        bytes32 descriptionHash = keccak256(bytes(description));

        governance.queue(targets, values, calldatas, descriptionHash);

        vm.warp(block.timestamp + 2 days + 1);

        governance.execute(targets, values, calldatas, descriptionHash);

        assertEq(token.balanceOf(voter), 100_100 ether);
    }

    function testProposalStatePending() public {
        address[] memory targets = new address[](1);

        targets[0] = address(token);

        uint256[] memory values = new uint256[](1);

        values[0] = 0;

        bytes[] memory calldatas = new bytes[](1);

        calldatas[0] = abi.encodeWithSignature("mint(address,uint256)", voter, 100 ether);

        vm.prank(voter);

        uint256 proposalId = governance.propose(targets, values, calldatas, "Pending proposal");

        uint8 state = uint8(governance.state(proposalId));

        assertEq(state, 0);
    }

    function testCannotVoteTwice() public {
        address[] memory targets = new address[](1);

        targets[0] = address(token);

        uint256[] memory values = new uint256[](1);

        values[0] = 0;

        bytes[] memory calldatas = new bytes[](1);

        calldatas[0] = abi.encodeWithSignature("mint(address,uint256)", voter, 100 ether);

        vm.prank(voter);

        uint256 proposalId = governance.propose(targets, values, calldatas, "Double vote");

        vm.roll(block.number + 7201);

        vm.prank(voter);

        governance.castVote(proposalId, 1);

        vm.prank(voter);

        vm.expectRevert();

        governance.castVote(proposalId, 1);
    }

    function testProposalThreshold() public view {
        assertGt(governance.proposalThreshold(), 0);
    }

    function testVotingDelay() public view {
        assertEq(governance.votingDelay(), 7200);
    }

    function testVotingPeriod() public view {
        assertEq(governance.votingPeriod(), 50400);
    }

    function testQuorum() public {
        vm.roll(block.number + 1);

        uint256 quorum = governance.quorum(block.number - 1);

        assertGt(quorum, 0);
    }

    function testProposalNeedsVotes() public {
        address user2 = address(2);

        vm.prank(user2);

        vm.expectRevert();

        governance.propose(new address[](0), new uint256[](0), new bytes[](0), "fail");
    }

    function testTimelockAddress() public view {
        assertEq(address(governance.timelock()), address(timelock));
    }
}
