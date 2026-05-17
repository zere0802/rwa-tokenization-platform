// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";

import "../../contracts/upgrade/RWATokenUpgradeableV1.sol";
import "../../contracts/upgrade/RWATokenUpgradeableV2.sol";

import "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";

contract UpgradeableTest is Test {
    RWATokenUpgradeableV1 public v1;
    RWATokenUpgradeableV2 public v2;

    ERC1967Proxy public proxy;

    function setUp() public {
        v1 = new RWATokenUpgradeableV1();

        bytes memory data = abi.encodeWithSelector(RWATokenUpgradeableV1.initialize.selector);

        proxy = new ERC1967Proxy(address(v1), data);
    }

    function testProxyInitialization() public {
        RWATokenUpgradeableV1 token = RWATokenUpgradeableV1(address(proxy));

        assertEq(token.name(), "Upgradeable RWA");

        assertEq(token.symbol(), "uRWA");
    }

    function testUpgradeToV2() public {
        RWATokenUpgradeableV1 tokenV1 = RWATokenUpgradeableV1(address(proxy));

        uint256 initialSupply = tokenV1.totalSupply();

        v2 = new RWATokenUpgradeableV2();

        tokenV1.upgradeToAndCall(address(v2), "");

        RWATokenUpgradeableV2 tokenV2 = RWATokenUpgradeableV2(address(proxy));

        assertEq(tokenV2.version(), "V2");

        assertEq(tokenV2.totalSupply(), initialSupply);
    }

    function testMintAfterUpgrade() public {
        RWATokenUpgradeableV1 tokenV1 = RWATokenUpgradeableV1(address(proxy));

        v2 = new RWATokenUpgradeableV2();

        tokenV1.upgradeToAndCall(address(v2), "");

        RWATokenUpgradeableV2 tokenV2 = RWATokenUpgradeableV2(address(proxy));

        tokenV2.mint(address(1), 100 ether);

        assertEq(tokenV2.balanceOf(address(1)), 100 ether);
    }
}
