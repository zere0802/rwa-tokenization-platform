// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";

import "../../contracts/token/RWAToken.sol";
import "../../contracts/vault/RWAVault.sol";

contract RWAVaultFuzzTest is Test {
    RWAToken token;

    RWAVault vault;

    address user = address(1);

    function setUp() public {
        token = new RWAToken();

        vault = new RWAVault(token);

        token.mint(user, 1_000_000 ether);
    }

    function testFuzzDeposit(uint256 amount) public {
        amount = bound(amount, 1 ether, 10_000 ether);

        vm.startPrank(user);

        token.approve(address(vault), amount);

        vault.deposit(amount, user);

        vm.stopPrank();

        assertEq(vault.balanceOf(user), amount);
    }

    function testFuzzWithdraw(uint256 amount) public {
        amount = bound(amount, 1 ether, 10_000 ether);

        vm.startPrank(user);

        token.approve(address(vault), amount);

        vault.deposit(amount, user);

        vault.withdraw(amount, user, user);

        vm.stopPrank();

        assertEq(vault.balanceOf(user), 0);
    }
}
