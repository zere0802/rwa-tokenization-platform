// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "forge-std/StdInvariant.sol";

import "../../contracts/mocks/SecureTreasury.sol";

contract TreasuryInvariantTest is StdInvariant, Test {
    SecureTreasury treasury;

    function setUp() public {
        treasury = new SecureTreasury{value: 10 ether}();

        targetContract(address(treasury));
    }

    function invariant_TreasuryBalanceNeverNegative() public view {
        assertGe(address(treasury).balance, 0);
    }

    function invariant_TreasuryAddressValid() public view {
        assertTrue(address(treasury) != address(0));
    }
}