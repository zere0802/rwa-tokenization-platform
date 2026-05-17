// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../../contracts/token/RWADeedNFT.sol";

contract RWADeedNFTTest is Test {
    RWADeedNFT public nft;

    address public admin = address(this);
    address public user1 = address(0x1);
    address public user2 = address(0x2);
    address public unauthorized = address(0x3);

    string constant URI_A = "ipfs://QmAssetDeedA";
    string constant URI_B = "ipfs://QmAssetDeedB";

    function setUp() public {
        nft = new RWADeedNFT();
    }

    // --- Minting ---

    function testMintDeedSucceeds() public {
        uint256 tokenId = nft.mintDeed(user1, URI_A);
        assertEq(nft.ownerOf(tokenId), user1);
    }

    function testMintDeedIncrementsTokenId() public {
        uint256 id0 = nft.mintDeed(user1, URI_A);
        uint256 id1 = nft.mintDeed(user2, URI_B);
        assertEq(id0, 0);
        assertEq(id1, 1);
    }

    function testMintDeedEmitsEvent() public {
        vm.expectEmit(true, true, false, true);
        emit RWADeedNFT.DeedMinted(user1, 0, URI_A);
        nft.mintDeed(user1, URI_A);
    }

    function testUnauthorizedCannotMint() public {
        vm.prank(unauthorized);
        vm.expectRevert();
        nft.mintDeed(user1, URI_A);
    }

    // --- Metadata ---

    function testTokenURIReturnsCorrectURI() public {
        uint256 tokenId = nft.mintDeed(user1, URI_A);
        assertEq(nft.tokenURI(tokenId), URI_A);
    }

    function testTokenURIRevertsForNonexistentToken() public {
        vm.expectRevert();
        nft.tokenURI(999);
    }

    // --- totalSupply ---

    function testTotalSupplyStartsAtZero() public view {
        assertEq(nft.totalSupply(), 0);
    }

    function testTotalSupplyIncreasesOnMint() public {
        nft.mintDeed(user1, URI_A);
        assertEq(nft.totalSupply(), 1);
        nft.mintDeed(user2, URI_B);
        assertEq(nft.totalSupply(), 2);
    }

    // --- Transfers ---

    function testOwnerCanTransferDeed() public {
        uint256 tokenId = nft.mintDeed(user1, URI_A);
        vm.prank(user1);
        nft.transferFrom(user1, user2, tokenId);
        assertEq(nft.ownerOf(tokenId), user2);
    }

    function testNonOwnerCannotTransferDeed() public {
        uint256 tokenId = nft.mintDeed(user1, URI_A);
        vm.prank(unauthorized);
        vm.expectRevert();
        nft.transferFrom(user1, user2, tokenId);
    }

    // --- Access Control ---

    function testAdminCanGrantMinterRole() public {
        bytes32 minterRole = nft.MINTER_ROLE();
        nft.grantRole(minterRole, user1);
        assertTrue(nft.hasRole(minterRole, user1));
    }

    function testGrantedMinterCanMint() public {
        bytes32 minterRole = nft.MINTER_ROLE();
        nft.grantRole(minterRole, user1);
        vm.prank(user1);
        uint256 tokenId = nft.mintDeed(user2, URI_B);
        assertEq(nft.ownerOf(tokenId), user2);
    }

    function testRevokedMinterCannotMint() public {
        bytes32 minterRole = nft.MINTER_ROLE();
        nft.grantRole(minterRole, user1);
        nft.revokeRole(minterRole, user1);
        vm.prank(user1);
        vm.expectRevert();
        nft.mintDeed(user2, URI_B);
    }

    // --- ERC165 ---

    function testSupportsERC721Interface() public view {
        assertTrue(nft.supportsInterface(type(IERC721).interfaceId));
    }

    function testSupportsAccessControlInterface() public view {
        assertTrue(nft.supportsInterface(type(IAccessControl).interfaceId));
    }
}
