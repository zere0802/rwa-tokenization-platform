// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract SecureTreasury is AccessControl {
    bytes32 public constant TREASURY_ROLE = keccak256("TREASURY_ROLE");

    constructor() payable {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);

        _grantRole(TREASURY_ROLE, msg.sender);
    }

    function withdrawAll(address payable to) external onlyRole(TREASURY_ROLE) {
        uint256 amount = address(this).balance;

        (bool success,) = to.call{value: amount}("");

        require(success, "Transfer failed");
    }
}
