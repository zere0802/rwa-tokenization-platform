// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";

import "../../contracts/mocks/VulnerableVault.sol";
import "../../contracts/mocks/ReentrancyAttacker.sol";

contract ReentrancyTest is Test {
    VulnerableVault vault;

    ReentrancyAttacker attacker;

    function setUp() public {
        vault = new VulnerableVault();

        attacker = new ReentrancyAttacker(address(vault));

        vm.deal(address(attacker), 1 ether);

        vm.deal(address(this), 10 ether);

        vault.deposit{value: 5 ether}();
    }

    function testReentrancyAttack() public {
        attacker.attack{value: 1 ether}();

        assertGt(address(attacker).balance, 1 ether);
    }
}
