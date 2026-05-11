// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/AccessControl.sol";

import "../interfaces/AggregatorV3Interface.sol";
contract OracleAdapter is AccessControl {
    bytes32 public constant ORACLE_ADMIN_ROLE =
        keccak256("ORACLE_ADMIN_ROLE");

    AggregatorV3Interface public priceFeed;

    uint256 public constant STALE_TIME =
        1 days;

    error StalePrice();

    constructor(address feed) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);

        _grantRole(
            ORACLE_ADMIN_ROLE,
            msg.sender
        );

        priceFeed =
            AggregatorV3Interface(feed);
    }

    function getLatestPrice()
        external
        view
        returns (int256)
    {
        (
            ,
            int256 price,
            ,
            uint256 updatedAt,

        ) = priceFeed.latestRoundData();

        if (
            block.timestamp - updatedAt >
            STALE_TIME
        ) {
            revert StalePrice();
        }

        return price;
    }

    function setPriceFeed(
        address newFeed
    )
        external
        onlyRole(ORACLE_ADMIN_ROLE)
    {
        priceFeed =
            AggregatorV3Interface(
                newFeed
            );
    }
}