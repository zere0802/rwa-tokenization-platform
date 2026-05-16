// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "forge-std/StdInvariant.sol";

import "../../contracts/token/RWAToken.sol";
import "../../contracts/vault/RWAVault.sol";

contract RWAVaultInvariantTest is StdInvariant, Test {
    RWAToken token;

    RWAVault vault;

    address user = address(1);

    function setUp() public {
        token = new RWAToken();

        vault = new RWAVault(token);

        token.mint(user, 1_000_000 ether);

        targetContract(address(vault));
    }

    function invariant_TotalAssetsMatchVaultBalance() public {
        assertEq(vault.totalAssets(), token.balanceOf(address(vault)));
    }

    function invariant_TotalSupplyNotZero() public view {
        assertGe(token.totalSupply(), 0);
    }
}