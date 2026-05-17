// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "forge-std/console.sol";

import "../contracts/token/RWAToken.sol";
import "../contracts/vault/RWAVault.sol";
import "../contracts/governance/Governance.sol";

import "@openzeppelin/contracts/governance/TimelockController.sol";

contract Deploy is Script {
    function run() external {
        uint256 deployerKey = vm.envUint("PRIVATE_KEY");

        vm.startBroadcast(deployerKey);

        RWAToken token = new RWAToken();

        RWAVault vault = new RWAVault(token);

        address[] memory proposers = new address[](1);

        proposers[0] = address(0);

        address[] memory executors = new address[](1);

        executors[0] = address(0);

        TimelockController timelock = new TimelockController(2 days, proposers, executors, msg.sender);

        Governance governance = new Governance(token, timelock);

        console.log("RWAToken:", address(token));

        console.log("Vault:", address(vault));

        console.log("Governance:", address(governance));

        vm.stopBroadcast();
    }
}
