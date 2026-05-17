// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "forge-std/console.sol";

import "../contracts/token/RWAToken.sol";
import "../contracts/governance/Governance.sol";
import "../contracts/vault/RWAVault.sol";

import "@openzeppelin/contracts/governance/TimelockController.sol";

contract DeployGovernance is Script {
    function run() external {
        vm.startBroadcast();

        RWAToken token = new RWAToken();

        address[] memory proposers = new address[](1);

        proposers[0] = msg.sender;

        address[] memory executors = new address[](1);

        executors[0] = address(0);

        TimelockController timelock = new TimelockController(2 days, proposers, executors, msg.sender);

        Governance governance = new Governance(token, timelock);

        RWAVault vault = new RWAVault(IERC20(address(token)));

        token.delegate(msg.sender);

        console.log("TOKEN:", address(token));

        console.log("GOVERNANCE:", address(governance));

        console.log("VAULT:", address(vault));

        vm.stopBroadcast();
    }
}
