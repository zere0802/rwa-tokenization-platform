// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract VulnerableTreasury {
    uint256 public treasuryFunds;

    constructor() payable {
        treasuryFunds = msg.value;
    }

    function withdrawAll(
        address payable to
    ) external {
        uint256 amount =
            address(this).balance;

        (bool success, ) =
            to.call{value: amount}("");

        require(
            success,
            "Transfer failed"
        );
    }
}