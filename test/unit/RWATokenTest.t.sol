// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../../contracts/token/RWAToken.sol";

contract RWATokenTest is Test {
    RWAToken token;

    address user = address(1);

    function setUp() public {
        token = new RWAToken();
    }

    function testInitialSupply() public {
        assertEq(token.totalSupply(), 1_000_000 ether);
    }

    function testMint() public {
        token.mint(user, 100 ether);

        assertEq(token.balanceOf(user), 100 ether);
    }

    function testBurn() public {
        token.burn(100 ether);

        assertEq(token.totalSupply(), 999_900 ether);
    }

    function testOnlyIssuerCanMint() public {
        vm.prank(user);

        vm.expectRevert();

        token.mint(user, 100 ether);
    }

    function testGrantIssuerRole() public {
        token.grantRole(token.ISSUER_ROLE(), user);

        vm.prank(user);

        token.mint(user, 50 ether);

        assertEq(token.balanceOf(user), 50 ether);
    }

    function testTransfer() public {
        token.transfer(address(1), 100 ether);

        assertEq(token.balanceOf(address(1)), 100 ether);
    }

    function testApprove() public {
        token.approve(address(1), 500 ether);

        assertEq(token.allowance(address(this), address(1)), 500 ether);
    }

    function testTransferFrom() public {
        token.approve(address(1), 100 ether);

        vm.prank(address(1));

        token.transferFrom(address(this), address(2), 100 ether);

        assertEq(token.balanceOf(address(2)), 100 ether);
    }

    function testCannotBurnTooMuch() public {
        vm.prank(address(1));

        vm.expectRevert();

        token.burn(100 ether);
    }

    function testDelegate() public {
        token.delegate(address(1));

        assertEq(token.delegates(address(this)), address(1));
    }

    function testTransferReducesSenderBalance() public {
        uint256 beforeBalance = token.balanceOf(address(this));

        token.transfer(address(1), 100 ether);

        uint256 afterBalance = token.balanceOf(address(this));

        assertEq(beforeBalance - afterBalance, 100 ether);
    }

    function testApproveUpdatesAllowance() public {
        token.approve(address(1), 250 ether);

        assertEq(token.allowance(address(this), address(1)), 250 ether);
    }

    function testTransferToZeroAddressReverts() public {
        vm.expectRevert();

        token.transfer(address(0), 100 ether);
    }

    function testTransferFromWithoutApprovalReverts() public {
        vm.prank(address(1));

        vm.expectRevert();

        token.transferFrom(address(this), address(2), 100 ether);
    }

    function testTotalSupply() public {
        assertGt(token.totalSupply(), 0);
    }

    function testName() public {
        assertEq(token.name(), "RWA Token");
    }

    function testSymbol() public {
        assertEq(token.symbol(), "RWA");
    }

    function testDecimals() public {
        assertEq(token.decimals(), 18);
    }

    function testCannotTransferMoreThanBalance() public {
        vm.prank(address(1));

        vm.expectRevert();

        token.transfer(address(2), 100 ether);
    }
}