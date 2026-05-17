// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract SecureVault is ReentrancyGuard {
    mapping(address => uint256) public balances;

    function deposit() external payable {
        balances[msg.sender] += msg.value;
    }

    function withdraw() external nonReentrant {
        uint256 balance = balances[msg.sender];

        require(balance > 0, "No balance");

        balances[msg.sender] = 0;

        (bool success,) = msg.sender.call{value: balance}("");

        require(success, "Transfer failed");
    }
}
