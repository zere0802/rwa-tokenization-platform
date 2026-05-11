// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";

import "../../contracts/token/RWAToken.sol";
import "../../contracts/vault/RWAVault.sol";

contract RWAVaultTest is Test {
    RWAToken token;

    RWAVault vault;

    address user = address(1);

    function setUp() public {
        token = new RWAToken();

        vault = new RWAVault(token);

        token.transfer(user, 1000 ether);
    }

    function testDeposit() public {
        vm.startPrank(user);

        token.approve(address(vault), 100 ether);

        vault.deposit(100 ether, user);

        vm.stopPrank();

        assertEq(vault.balanceOf(user), 100 ether);
    }

    function testWithdraw() public {
        vm.startPrank(user);

        token.approve(address(vault), 100 ether);

        vault.deposit(100 ether, user);

        vault.withdraw(100 ether, user, user);

        vm.stopPrank();

        assertEq(vault.balanceOf(user), 0);
    }

    function testWithdrawWithoutDepositReverts() public {
        vm.startPrank(user);

        vm.expectRevert();

        vault.withdraw(1 ether, user, user);

        vm.stopPrank();
    }

    function testPreviewDeposit() public {
        uint256 shares = vault.previewDeposit(100 ether);

        assertEq(shares, 100 ether);
    }

    function testPreviewWithdraw() public {
        uint256 shares = vault.previewWithdraw(100 ether);

        assertEq(shares, 100 ether);
    }

    function testTotalAssets() public {
        vm.startPrank(user);

        token.approve(address(vault), 100 ether);

        vault.deposit(100 ether, user);

        vm.stopPrank();

        assertEq(vault.totalAssets(), 100 ether);
    }

    function testConvertToShares() public {
        uint256 shares = vault.convertToShares(100 ether);

        assertEq(shares, 100 ether);
    }

    function testConvertToAssets() public {
        uint256 assets = vault.convertToAssets(100 ether);

        assertEq(assets, 100 ether);
    }

    function testMaxDeposit() public {
        uint256 max = vault.maxDeposit(user);

        assertGt(max, 0);
    }

    function testMaxWithdrawWithoutDeposit() public {
        uint256 max = vault.maxWithdraw(user);

        assertEq(max, 0);
    }

    function testVaultAsset() public {
        assertEq(address(vault.asset()), address(token));
    }

    function testPreviewRedeem() public {
        uint256 assets = vault.previewRedeem(100 ether);

        assertEq(assets, 100 ether);
    }

    function testMaxRedeemWithoutShares() public {
        uint256 shares = vault.maxRedeem(user);

        assertEq(shares, 0);
    }
}
