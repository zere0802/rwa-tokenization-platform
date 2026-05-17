// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "../interfaces/AggregatorV3Interface.sol";

/// @title ProofOfReserve
/// @notice Validates that the total on-chain RWA token supply does not exceed the
///         off-chain collateral reserves as reported by a Chainlink Proof of Reserve feed.
///         Authorized issuers must call `checkReserves()` before minting is allowed.
///
/// @dev The PoR feed returns the off-chain reserve balance (e.g., USD value of real-world assets).
///      We compare this against the current on-chain token supply (scaled to 8 decimals to match
///      the Chainlink PoR feed precision).
contract ProofOfReserve is AccessControl {
    bytes32 public constant RESERVE_ADMIN_ROLE = keccak256("RESERVE_ADMIN_ROLE");

    /// @notice The Chainlink Proof of Reserve aggregator feed
    AggregatorV3Interface public reserveFeed;

    /// @notice Maximum age of a reserve report before it is considered stale
    uint256 public constant STALE_TIME = 1 days;

    // ─── Errors ──────────────────────────────────────────────────────────────

    error StaleReserveData();
    error InsufficientReserves(int256 reserveBalance, uint256 onChainSupply);
    error InvalidReserveData();

    // ─── Events ──────────────────────────────────────────────────────────────

    event ReserveFeedUpdated(address indexed oldFeed, address indexed newFeed);
    event ReserveCheckPassed(int256 reserveBalance, uint256 onChainSupply);

    constructor(address feed) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(RESERVE_ADMIN_ROLE, msg.sender);
        reserveFeed = AggregatorV3Interface(feed);
    }

    /// @notice Returns the latest reserve balance reported by the Chainlink PoR feed.
    ///         Reverts if the data is stale (older than STALE_TIME).
    function getReserveBalance() public view returns (int256 balance) {
        (, int256 answer,, uint256 updatedAt,) = reserveFeed.latestRoundData();

        // Checks: data must be fresh
        if (block.timestamp - updatedAt > STALE_TIME) {
            revert StaleReserveData();
        }

        // Checks: answer must be positive
        if (answer <= 0) {
            revert InvalidReserveData();
        }

        return answer;
    }

    /// @notice Verifies that off-chain reserves cover on-chain supply.
    ///         Call this before minting new RWA tokens.
    /// @param onChainSupplyWei  Current total supply of the RWA token (18-decimal wei)
    /// @dev   The PoR feed uses 8 decimals. We scale the on-chain supply down to 8 decimals
    ///        for a like-for-like comparison.
    function checkReserves(uint256 onChainSupplyWei) external {
        int256 reserveBalance = getReserveBalance();

        // Convert 18-decimal supply to 8-decimal for comparison with PoR feed
        uint256 supplyIn8Decimals = onChainSupplyWei / 1e10;

        // Checks: reserves must cover supply
        if (reserveBalance < int256(supplyIn8Decimals)) {
            revert InsufficientReserves(reserveBalance, supplyIn8Decimals);
        }

        emit ReserveCheckPassed(reserveBalance, supplyIn8Decimals);
    }

    /// @notice Update the PoR feed address (e.g., if Chainlink rotates the feed)
    /// @param newFeed  New Chainlink PoR aggregator address
    function setReserveFeed(address newFeed) external onlyRole(RESERVE_ADMIN_ROLE) {
        address old = address(reserveFeed);
        reserveFeed = AggregatorV3Interface(newFeed);
        emit ReserveFeedUpdated(old, newFeed);
    }
}
