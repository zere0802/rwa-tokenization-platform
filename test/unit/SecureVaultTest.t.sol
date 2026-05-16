// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";

import "../../contracts/utils/YulMath.sol";

contract YulMathTest is Test {
    YulMath math;

    function setUp() public {
        math = new YulMath();
    }

    function testAddYul() public {
        uint256 result = math.addYul(2, 3);

        assertEq(result, 5);
    }

    function testMultiplyYul() public {
        uint256 result = math.multiplyYul(4, 5);

        assertEq(result, 20);
    }

    function testCompareSolidityAndYul() public {
        uint256 solidityResult = math.addSolidity(10, 15);

        uint256 yulResult = math.addYul(10, 15);

        assertEq(solidityResult, yulResult);
    }
}