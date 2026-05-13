// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./RWATokenUpgradeableV1.sol";

contract RWATokenUpgradeableV2 is
    RWATokenUpgradeableV1
{
    function version()
        public
        pure
        returns (string memory)
    {
        return "V2";
    }

    function mint(
        address to,
        uint256 amount
    )
        public
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        _mint(
            to,
            amount
        );
    }
}