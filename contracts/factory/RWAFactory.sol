// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "../token/RWAToken.sol";

contract RWAFactory {
    event TokenCreated(address token);

    function createToken() public returns (address) {
        RWAToken token = new RWAToken();

        emit TokenCreated(address(token));

        return address(token);
    }

    function createTokenDeterministic(bytes32 salt) public returns (address) {
        RWAToken token = new RWAToken{salt: salt}();

        emit TokenCreated(address(token));

        return address(token);
    }

    function predictAddress(bytes32 salt) public view returns (address) {
        bytes memory bytecode = type(RWAToken).creationCode;

        bytes32 hash = keccak256(abi.encodePacked(bytes1(0xff), address(this), salt, keccak256(bytecode)));

        return address(uint160(uint256(hash)));
    }
}
