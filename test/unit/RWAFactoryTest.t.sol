// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";

import "../../contracts/factory/RWAFactory.sol";
import "../../contracts/token/RWAToken.sol";

contract RWAFactoryTest is Test {
    RWAFactory factory;

    function setUp() public {
        factory = new RWAFactory();
    }

    function testCreateToken() public {
        address token =
            factory.createToken();

        assertTrue(
            token != address(0)
        );
    }

    function testCreate2Token() public {
        bytes32 salt =
            keccak256("RWA");

        address token =
            factory.createTokenDeterministic(
                salt
            );

        assertTrue(
            token != address(0)
        );
    }

    function testPredictAddress()
        public
    {
        bytes32 salt =
            keccak256("TEST");

        address predicted =
            factory.predictAddress(
                salt
            );

        address deployed =
            factory.createTokenDeterministic(
                salt
            );

        assertEq(
            predicted,
            deployed
        );
    }

    function testCannotReuseSalt()
        public
    {
        bytes32 salt =
            keccak256("DUPLICATE");

        factory
            .createTokenDeterministic(
                salt
            );

        vm.expectRevert();

        factory
            .createTokenDeterministic(
                salt
            );
    }

    function testCreatedTokenWorks()
        public
    {
        address tokenAddress =
            factory.createToken();

        RWAToken token =
            RWAToken(
                tokenAddress
            );

        assertEq(
            token.totalSupply(),
            1_000_000 ether
        );
    }
}