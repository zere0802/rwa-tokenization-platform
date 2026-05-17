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

    function testReentrancyAttackFailsOnSecureVault() public {
        // The attack should revert because withdraw() is protected by nonReentrant
        vm.expectRevert();
        attacker.attack{value: 1 ether}();
        
        // Attacker balance should be less than or equal to 1 ether (it couldn't drain the vault)
        assertLe(address(attacker).balance, 1 ether);
    }
}