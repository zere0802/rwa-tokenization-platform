// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";

import "../../contracts/mocks/SecureVault.sol";
import "../../contracts/mocks/ReentrancyAttacker.sol";

contract SecureVaultTest is Test {
    SecureVault vault;

    ReentrancyAttacker attacker;

    function setUp() public {
        vault = new SecureVault();

        attacker = new ReentrancyAttacker(address(vault));

        vm.deal(address(attacker), 1 ether);

        vm.deal(address(this), 10 ether);

        vault.deposit{value: 5 ether}();
    }

    function testAttackFails() public {
        vm.expectRevert();

        attacker.attack{value: 1 ether}();
    }
}
