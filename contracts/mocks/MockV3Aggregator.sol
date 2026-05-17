// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract MockV3Aggregator {
    int256 private answer;

    uint256 private updatedAt;

    constructor(int256 _answer) {
        answer = _answer;
        updatedAt = block.timestamp;
    }

    function latestRoundData() external view returns (uint80, int256, uint256, uint256, uint80) {
        return (0, answer, updatedAt, updatedAt, 0);
    }

    function updateAnswer(int256 newAnswer) external {
        answer = newAnswer;

        updatedAt = block.timestamp;
    }
}
