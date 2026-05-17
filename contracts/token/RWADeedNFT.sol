// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/// @title RWADeedNFT
/// @notice ERC-721 NFT representing a unique real-world asset legal deed or certificate.
///         Each NFT corresponds to a distinct physical asset (e.g., a property, a bond tranche).
///         The fractionalized ERC-20 RWAToken represents shares of the asset represented by this deed.
contract RWADeedNFT is ERC721, AccessControl {
    using Strings for uint256;

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    uint256 private _nextTokenId;

    /// @notice URI of asset metadata (e.g., IPFS link to legal deed document)
    mapping(uint256 => string) private _tokenURIs;

    event DeedMinted(address indexed to, uint256 indexed tokenId, string metadataURI);

    constructor() ERC721("RWA Asset Deed", "RWADEED") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
    }

    /// @notice Mint a new deed NFT to a recipient, with a metadata URI pointing to legal deed documents
    /// @param to  Recipient of the deed NFT
    /// @param metadataURI  IPFS or HTTPS link to the off-chain legal deed document
    function mintDeed(address to, string calldata metadataURI)
        external
        onlyRole(MINTER_ROLE)
        returns (uint256 tokenId)
    {
        tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        _tokenURIs[tokenId] = metadataURI;
        emit DeedMinted(to, tokenId, metadataURI);
    }

    /// @notice Returns the metadata URI for a given deed token
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        _requireOwned(tokenId);
        return _tokenURIs[tokenId];
    }

    /// @notice Total number of deeds minted so far
    function totalSupply() external view returns (uint256) {
        return _nextTokenId;
    }

    /// @dev Resolve diamond inheritance for supportsInterface
    function supportsInterface(bytes4 interfaceId) public view override(ERC721, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
