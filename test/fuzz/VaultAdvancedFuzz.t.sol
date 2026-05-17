// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";

import "../../contracts/token/RWAToken.sol";
import "../../contracts/vault/RWAVault.sol";

contract VaultAdvancedFuzzTest is Test {
    RWAToken token;

    RWAVault vault;

    address user = address(1);

    function setUp() public {
        token = new RWAToken();

        vault = new RWAVault(token);

        token.transfer(user, 1_000_000 ether);
    }

    function testFuzzPreviewDeposit(uint256 assets) public {
        assets = bound(assets, 1 ether, 10_000 ether);

        uint256 shares = vault.previewDeposit(assets);

        assertEq(shares, assets);
    }

    function testFuzzPreviewWithdraw(uint256 assets) public {
        assets = bound(assets, 1 ether, 10_000 ether);

        uint256 shares = vault.previewWithdraw(assets);

        assertEq(shares, assets);
    }
}
