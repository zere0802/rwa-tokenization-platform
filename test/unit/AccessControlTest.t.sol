// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";

import "../../contracts/mocks/VulnerableTreasury.sol";
import "../../contracts/mocks/SecureTreasury.sol";

contract AccessControlTest is Test {
    VulnerableTreasury vulnerable;

    SecureTreasury secure;

    address attacker = address(1);

    function setUp() public {
        vulnerable = new VulnerableTreasury{value: 5 ether}();

        secure = new SecureTreasury{value: 5 ether}();
    }

    function testAnyoneCanDrainVulnerableTreasury() public {
        vm.prank(attacker);

        vulnerable.withdrawAll(payable(attacker));

        assertEq(attacker.balance, 5 ether);
    }

    function testUnauthorizedUserCannotDrainSecureTreasury() public {
        vm.prank(attacker);

        vm.expectRevert();

        secure.withdrawAll(payable(attacker));
    }

    function testAuthorizedTreasuryWithdraw() public {
        uint256 balanceBefore = attacker.balance;

        secure.withdrawAll(payable(attacker));

        uint256 balanceAfter = attacker.balance;

        assertGt(balanceAfter, balanceBefore);
    }

    function testTreasuryBalanceReduced() public {
        secure.withdrawAll(payable(attacker));

        assertEq(address(secure).balance, 0);
    }
}
