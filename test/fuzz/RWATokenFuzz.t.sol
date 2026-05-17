// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";

import "../../contracts/token/RWAToken.sol";

contract RWATokenFuzzTest is Test {
    RWAToken token;

    address user = address(1);

    function setUp() public {
        token = new RWAToken();
    }

    function testFuzzMint(uint256 amount) public {
        amount = bound(amount, 1, 1_000_000 ether);

        token.mint(user, amount);

        assertEq(token.balanceOf(user), amount);
    }

    function testFuzzBurn(uint256 amount) public {
        amount = bound(amount, 1 ether, 1000 ether);

        token.mint(user, amount);

        vm.startPrank(user);

        token.burn(amount);

        vm.stopPrank();

        assertEq(token.balanceOf(user), 0);
    }

    function testFuzzTransfer(uint256 amount) public {
        amount = bound(amount, 1 ether, 1000 ether);

        token.transfer(user, amount);

        assertEq(token.balanceOf(user), amount);
    }
}