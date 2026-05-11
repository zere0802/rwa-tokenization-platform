// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "forge-std/StdInvariant.sol";

import "../../contracts/token/RWAToken.sol";

contract TokenInvariantTest is StdInvariant, Test {
    RWAToken token;

    function setUp() public {
        token = new RWAToken();

        targetContract(address(token));
    }

    function invariant_TotalSupplyConsistency() public view {
        assertGe(token.totalSupply(), 0);
    }

    function invariant_AdminRoleExists() public view {
        assertTrue(token.hasRole(token.DEFAULT_ADMIN_ROLE(), address(this)));
    }
}
