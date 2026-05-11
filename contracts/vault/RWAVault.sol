// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract RWAVault is ERC4626, AccessControl {
    bytes32 public constant MANAGER_ROLE =
        keccak256("MANAGER_ROLE");

    constructor(
        IERC20 asset_
    )
        ERC20("RWA Vault Share", "rvRWA")
        ERC4626(asset_)
    {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MANAGER_ROLE, msg.sender);
    }
}