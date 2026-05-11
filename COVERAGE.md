Compiling 111 files with Solc 0.8.33
Solc 0.8.33 finished in 1.64s
Compiler run successful with warnings:
Warning (2072): Unused local variable.
  --> script/DeployGovernance.s.sol:27:9:
   |
27 |         Governance governance = new Governance(token, timelock);
   |         ^^^^^^^^^^^^^^^^^^^^^

Warning (2018): Function state mutability can be restricted to view
  --> test/fuzz/GovernanceFuzz.t.sol:62:5:
   |
62 |     function testFuzzProposalThreshold(uint256 amount) public {
   |     ^ (Relevant source part starts here and spans across multiple lines).

Warning (2018): Function state mutability can be restricted to view
  --> test/fuzz/VaultAdvancedFuzz.t.sol:24:5:
   |
24 |     function testFuzzPreviewDeposit(uint256 assets) public {
   |     ^ (Relevant source part starts here and spans across multiple lines).

Warning (2018): Function state mutability can be restricted to view
  --> test/fuzz/VaultAdvancedFuzz.t.sol:32:5:
   |
32 |     function testFuzzPreviewWithdraw(uint256 assets) public {
   |     ^ (Relevant source part starts here and spans across multiple lines).

Warning (2018): Function state mutability can be restricted to view
  --> test/invariant/RWAVaultInvariant.t.sol:27:5:
   |
27 |     function invariant_TotalAssetsMatchVaultBalance() public {
   |     ^ (Relevant source part starts here and spans across multiple lines).

Warning (2018): Function state mutability can be restricted to view
  --> test/unit/OracleAdapterTest.t.sol:20:5:
   |
20 |     function testGetPrice() public {
   |     ^ (Relevant source part starts here and spans across multiple lines).

Warning (2018): Function state mutability can be restricted to view
  --> test/unit/OracleAdapterTest.t.sol:52:5:
   |
52 |     function testPriceFeedAddress() public {
   |     ^ (Relevant source part starts here and spans across multiple lines).

Warning (2018): Function state mutability can be restricted to view
  --> test/unit/OracleAdapterTest.t.sol:56:5:
   |
56 |     function testLatestPricePositive() public {
   |     ^ (Relevant source part starts here and spans across multiple lines).

Warning (2018): Function state mutability can be restricted to view
  --> test/unit/RWATokenTest.t.sol:16:5:
   |
16 |     function testInitialSupply() public {
   |     ^ (Relevant source part starts here and spans across multiple lines).

Warning (2018): Function state mutability can be restricted to view
   --> test/unit/RWATokenTest.t.sol:116:5:
    |
116 |     function testTotalSupply() public {
    |     ^ (Relevant source part starts here and spans across multiple lines).

Warning (2018): Function state mutability can be restricted to view
   --> test/unit/RWATokenTest.t.sol:120:5:
    |
120 |     function testName() public {
    |     ^ (Relevant source part starts here and spans across multiple lines).

Warning (2018): Function state mutability can be restricted to view
   --> test/unit/RWATokenTest.t.sol:124:5:
    |
124 |     function testSymbol() public {
    |     ^ (Relevant source part starts here and spans across multiple lines).

Warning (2018): Function state mutability can be restricted to view
   --> test/unit/RWATokenTest.t.sol:128:5:
    |
128 |     function testDecimals() public {
    |     ^ (Relevant source part starts here and spans across multiple lines).

Warning (2018): Function state mutability can be restricted to view
  --> test/unit/RWAVaultTest.t.sol:60:5:
   |
60 |     function testPreviewDeposit() public {
   |     ^ (Relevant source part starts here and spans across multiple lines).

Warning (2018): Function state mutability can be restricted to view
  --> test/unit/RWAVaultTest.t.sol:66:5:
   |
66 |     function testPreviewWithdraw() public {
   |     ^ (Relevant source part starts here and spans across multiple lines).

Warning (2018): Function state mutability can be restricted to view
  --> test/unit/RWAVaultTest.t.sol:84:5:
   |
84 |     function testConvertToShares() public {
   |     ^ (Relevant source part starts here and spans across multiple lines).

Warning (2018): Function state mutability can be restricted to view
  --> test/unit/RWAVaultTest.t.sol:90:5:
   |
90 |     function testConvertToAssets() public {
   |     ^ (Relevant source part starts here and spans across multiple lines).

Warning (2018): Function state mutability can be restricted to view
  --> test/unit/RWAVaultTest.t.sol:96:5:
   |
96 |     function testMaxDeposit() public {
   |     ^ (Relevant source part starts here and spans across multiple lines).

Warning (2018): Function state mutability can be restricted to view
   --> test/unit/RWAVaultTest.t.sol:102:5:
    |
102 |     function testMaxWithdrawWithoutDeposit() public {
    |     ^ (Relevant source part starts here and spans across multiple lines).

Warning (2018): Function state mutability can be restricted to view
   --> test/unit/RWAVaultTest.t.sol:108:5:
    |
108 |     function testVaultAsset() public {
    |     ^ (Relevant source part starts here and spans across multiple lines).

Warning (2018): Function state mutability can be restricted to view
   --> test/unit/RWAVaultTest.t.sol:112:5:
    |
112 |     function testPreviewRedeem() public {
    |     ^ (Relevant source part starts here and spans across multiple lines).

Warning (2018): Function state mutability can be restricted to view
   --> test/unit/RWAVaultTest.t.sol:118:5:
    |
118 |     function testMaxRedeemWithoutShares() public {
    |     ^ (Relevant source part starts here and spans across multiple lines).

Warning (2018): Function state mutability can be restricted to view
  --> test/unit/YulMathTest.t.sol:15:5:
   |
15 |     function testAddYul() public {
   |     ^ (Relevant source part starts here and spans across multiple lines).

Warning (2018): Function state mutability can be restricted to view
  --> test/unit/YulMathTest.t.sol:21:5:
   |
21 |     function testMultiplyYul() public {
   |     ^ (Relevant source part starts here and spans across multiple lines).

Warning (2018): Function state mutability can be restricted to view
  --> test/unit/YulMathTest.t.sol:27:5:
   |
27 |     function testCompareSolidityAndYul() public {
   |     ^ (Relevant source part starts here and spans across multiple lines).

Analysing contracts...
Running tests...

Ran 6 tests for test/unit/OracleAdapterTest.t.sol:OracleAdapterTest
[PASS] testAdminCanUpdateFeed() (gas: 189305)
[PASS] testGetPrice() (gas: 17004)
[PASS] testLatestPricePositive() (gas: 16935)
[PASS] testOnlyAdminCanSetFeed() (gas: 14285)
[PASS] testPriceFeedAddress() (gas: 10343)
[PASS] testRevertOnStalePrice() (gas: 20238)
Suite result: ok. 6 passed; 0 failed; 0 skipped; finished in 1.21ms (535.46µs CPU time)

Ran 4 tests for test/unit/AccessControlTest.t.sol:AccessControlTest
[PASS] testAnyoneCanDrainVulnerableTreasury() (gas: 46618)
[PASS] testAuthorizedTreasuryWithdraw() (gas: 46182)
[PASS] testTreasuryBalanceReduced() (gas: 45915)
[PASS] testUnauthorizedUserCannotDrainSecureTreasury() (gas: 14325)
Suite result: ok. 4 passed; 0 failed; 0 skipped; finished in 1.37ms (769.88µs CPU time)

Ran 9 tests for test/unit/GovernanceTest.t.sol:GovernanceTest
[PASS] testCannotVoteTwice() (gas: 145903)
[PASS] testProposalLifecycle() (gas: 370543)
[PASS] testProposalNeedsVotes() (gas: 24472)
[PASS] testProposalStatePending() (gas: 79714)
[PASS] testProposalThreshold() (gas: 8015)
[PASS] testQuorum() (gas: 24563)
[PASS] testTimelockAddress() (gas: 10239)
[PASS] testVotingDelay() (gas: 8058)
[PASS] testVotingPeriod() (gas: 8001)
Suite result: ok. 9 passed; 0 failed; 0 skipped; finished in 6.30ms (4.83ms CPU time)

Ran 2 tests for test/fuzz/OracleFuzz.t.sol:OracleFuzzTest
[PASS] testFuzzFeedUpdate(uint256) (runs: 256, μ: 190946, ~: 191120)
[PASS] testFuzzPrice(int256) (runs: 256, μ: 25048, ~: 25122)
Suite result: ok. 2 passed; 0 failed; 0 skipped; finished in 27.37ms (42.65ms CPU time)

Ran 1 test for test/unit/ReentrancyTest.t.sol:ReentrancyTest
[PASS] testReentrancyAttack() (gas: 77314)
Suite result: ok. 1 passed; 0 failed; 0 skipped; finished in 537.38µs (252.29µs CPU time)

Ran 1 test for test/unit/SecureVaultTest.t.sol:SecureVaultTest
[PASS] testAttackFails() (gas: 64087)
Suite result: ok. 1 passed; 0 failed; 0 skipped; finished in 345.58µs (80.92µs CPU time)

Ran 19 tests for test/unit/RWATokenTest.t.sol:RWATokenTest
[PASS] testApprove() (gas: 33539)
[PASS] testApproveUpdatesAllowance() (gas: 33537)
[PASS] testBurn() (gas: 33907)
[PASS] testCannotBurnTooMuch() (gas: 12158)
[PASS] testCannotTransferMoreThanBalance() (gas: 12799)
[PASS] testDecimals() (gas: 5931)
[PASS] testDelegate() (gas: 82830)
[PASS] testGrantIssuerRole() (gas: 90324)
[PASS] testInitialSupply() (gas: 7970)
[PASS] testMint() (gas: 56999)
[PASS] testName() (gas: 12989)
[PASS] testOnlyIssuerCanMint() (gas: 14777)
[PASS] testSymbol() (gas: 13009)
[PASS] testTotalSupply() (gas: 7989)
[PASS] testTransfer() (gas: 43114)
[PASS] testTransferFrom() (gas: 54785)
[PASS] testTransferFromWithoutApprovalReverts() (gas: 13147)
[PASS] testTransferReducesSenderBalance() (gas: 45112)
[PASS] testTransferToZeroAddressReverts() (gas: 9735)
Suite result: ok. 19 passed; 0 failed; 0 skipped; finished in 1.95ms (1.51ms CPU time)

Ran 3 tests for test/fuzz/RWATokenFuzz.t.sol:RWATokenFuzzTest
[PASS] testFuzzBurn(uint256) (runs: 256, μ: 51309, ~: 51435)
[PASS] testFuzzMint(uint256) (runs: 256, μ: 57876, ~: 57277)
[PASS] testFuzzTransfer(uint256) (runs: 256, μ: 47037, ~: 47200)
Suite result: ok. 3 passed; 0 failed; 0 skipped; finished in 71.44ms (70.46ms CPU time)

Ran 13 tests for test/unit/RWAVaultTest.t.sol:RWAVaultTest
[PASS] testConvertToAssets() (gas: 16224)
[PASS] testConvertToShares() (gas: 16179)
[PASS] testDeposit() (gas: 114842)
[PASS] testMaxDeposit() (gas: 8472)
[PASS] testMaxRedeemWithoutShares() (gas: 10677)
[PASS] testMaxWithdrawWithoutDeposit() (gas: 20662)
[PASS] testPreviewDeposit() (gas: 16177)
[PASS] testPreviewRedeem() (gas: 16179)
[PASS] testPreviewWithdraw() (gas: 16220)
[PASS] testTotalAssets() (gas: 115544)
[PASS] testVaultAsset() (gas: 8088)
[PASS] testWithdraw() (gas: 119904)
[PASS] testWithdrawWithoutDepositReverts() (gas: 26559)
Suite result: ok. 13 passed; 0 failed; 0 skipped; finished in 2.31ms (1.64ms CPU time)

Ran 3 tests for test/unit/YulMathTest.t.sol:YulMathTest
[PASS] testAddYul() (gas: 6688)
[PASS] testCompareSolidityAndYul() (gas: 8824)
[PASS] testMultiplyYul() (gas: 6758)
Suite result: ok. 3 passed; 0 failed; 0 skipped; finished in 180.54µs (91.17µs CPU time)

Ran 1 test for test/fork/ChainlinkForkTest.t.sol:ChainlinkForkTest
[PASS] testETHUSDPrice() (gas: 21804)
Suite result: ok. 1 passed; 0 failed; 0 skipped; finished in 2.73s (1.09s CPU time)

Ran 2 tests for test/fork/USDCForkTest.t.sol:USDCForkTest
[PASS] testTransferUSDC() (gas: 41479)
[PASS] testUSDCDecimals() (gas: 15122)
Suite result: ok. 2 passed; 0 failed; 0 skipped; finished in 2.87s (1.44s CPU time)

Ran 2 tests for test/fuzz/GovernanceFuzz.t.sol:GovernanceFuzzTest
[PASS] testFuzzProposalThreshold(uint256) (runs: 256, μ: 9782, ~: 9939)
[PASS] testFuzzVotingPower(uint256) (runs: 256, μ: 72807, ~: 72962)
Suite result: ok. 2 passed; 0 failed; 0 skipped; finished in 2.90s (67.91ms CPU time)

Ran 1 test for test/fork/UniswapForkTest.t.sol:UniswapForkTest
[PASS] testSwapETHForUSDC() (gas: 132455)
Suite result: ok. 1 passed; 0 failed; 0 skipped; finished in 4.08s (2.45s CPU time)

Ran 2 tests for test/invariant/TreasuryInvariant.t.sol:TreasuryInvariantTest
[PASS] invariant_TreasuryAddressValid() (runs: 256, calls: 128000, reverts: 127400)

╭----------------+--------------+-------+---------+----------╮
| Contract       | Selector     | Calls | Reverts | Discards |
+============================================================+
| SecureTreasury | grantRole    | 32005 | 31811   | 0        |
|----------------+--------------+-------+---------+----------|
| SecureTreasury | renounceRole | 32233 | 32182   | 0        |
|----------------+--------------+-------+---------+----------|
| SecureTreasury | revokeRole   | 32000 | 31841   | 0        |
|----------------+--------------+-------+---------+----------|
| SecureTreasury | withdrawAll  | 31762 | 31566   | 0        |
╰----------------+--------------+-------+---------+----------╯

[PASS] invariant_TreasuryBalanceNeverNegative() (runs: 256, calls: 128000, reverts: 127400)

╭----------------+--------------+-------+---------+----------╮
| Contract       | Selector     | Calls | Reverts | Discards |
+============================================================+
| SecureTreasury | grantRole    | 32005 | 31811   | 0        |
|----------------+--------------+-------+---------+----------|
| SecureTreasury | renounceRole | 32233 | 32182   | 0        |
|----------------+--------------+-------+---------+----------|
| SecureTreasury | revokeRole   | 32000 | 31841   | 0        |
|----------------+--------------+-------+---------+----------|
| SecureTreasury | withdrawAll  | 31762 | 31566   | 0        |
╰----------------+--------------+-------+---------+----------╯

Suite result: ok. 2 passed; 0 failed; 0 skipped; finished in 4.73s (4.73s CPU time)

Ran 2 tests for test/fuzz/VaultAdvancedFuzz.t.sol:VaultAdvancedFuzzTest
[PASS] testFuzzPreviewDeposit(uint256) (runs: 256, μ: 17878, ~: 18035)
[PASS] testFuzzPreviewWithdraw(uint256) (runs: 256, μ: 17812, ~: 17969)
Suite result: ok. 2 passed; 0 failed; 0 skipped; finished in 4.73s (47.17ms CPU time)

Ran 2 tests for test/invariant/TokenInvariant.t.sol:TokenInvariantTest
[PASS] invariant_AdminRoleExists() (runs: 256, calls: 128000, reverts: 104150)

╭----------+---------------+-------+---------+----------╮
| Contract | Selector      | Calls | Reverts | Discards |
+=======================================================+
| RWAToken | approve       | 11617 | 24      | 0        |
|----------+---------------+-------+---------+----------|
| RWAToken | burn          | 11642 | 11486   | 0        |
|----------+---------------+-------+---------+----------|
| RWAToken | delegate      | 11819 | 0       | 0        |
|----------+---------------+-------+---------+----------|
| RWAToken | delegateBySig | 11504 | 11504   | 0        |
|----------+---------------+-------+---------+----------|
| RWAToken | grantRole     | 11540 | 11540   | 0        |
|----------+---------------+-------+---------+----------|
| RWAToken | mint          | 11873 | 11873   | 0        |
|----------+---------------+-------+---------+----------|
| RWAToken | permit        | 11702 | 11702   | 0        |
|----------+---------------+-------+---------+----------|
| RWAToken | renounceRole  | 11480 | 11478   | 0        |
|----------+---------------+-------+---------+----------|
| RWAToken | revokeRole    | 11514 | 11513   | 0        |
|----------+---------------+-------+---------+----------|
| RWAToken | transfer      | 11705 | 11567   | 0        |
|----------+---------------+-------+---------+----------|
| RWAToken | transferFrom  | 11604 | 11463   | 0        |
╰----------+---------------+-------+---------+----------╯

[PASS] invariant_TotalSupplyConsistency() (runs: 256, calls: 128000, reverts: 104145)

╭----------+---------------+-------+---------+----------╮
| Contract | Selector      | Calls | Reverts | Discards |
+=======================================================+
| RWAToken | approve       | 11617 | 21      | 0        |
|----------+---------------+-------+---------+----------|
| RWAToken | burn          | 11642 | 11486   | 0        |
|----------+---------------+-------+---------+----------|
| RWAToken | delegate      | 11819 | 0       | 0        |
|----------+---------------+-------+---------+----------|
| RWAToken | delegateBySig | 11504 | 11504   | 0        |
|----------+---------------+-------+---------+----------|
| RWAToken | grantRole     | 11540 | 11539   | 0        |
|----------+---------------+-------+---------+----------|
| RWAToken | mint          | 11873 | 11873   | 0        |
|----------+---------------+-------+---------+----------|
| RWAToken | permit        | 11702 | 11702   | 0        |
|----------+---------------+-------+---------+----------|
| RWAToken | renounceRole  | 11480 | 11477   | 0        |
|----------+---------------+-------+---------+----------|
| RWAToken | revokeRole    | 11514 | 11513   | 0        |
|----------+---------------+-------+---------+----------|
| RWAToken | transfer      | 11705 | 11567   | 0        |
|----------+---------------+-------+---------+----------|
| RWAToken | transferFrom  | 11604 | 11463   | 0        |
╰----------+---------------+-------+---------+----------╯

Suite result: ok. 2 passed; 0 failed; 0 skipped; finished in 4.99s (9.70s CPU time)

Ran 2 tests for test/fuzz/RWAVaultFuzz.t.sol:RWAVaultFuzzTest
[PASS] testFuzzDeposit(uint256) (runs: 256, μ: 116329, ~: 116486)
[PASS] testFuzzWithdraw(uint256) (runs: 256, μ: 120979, ~: 121100)
Suite result: ok. 2 passed; 0 failed; 0 skipped; finished in 5.49s (4.80s CPU time)

Ran 2 tests for test/invariant/RWAVaultInvariant.t.sol:RWAVaultInvariantTest
[PASS] invariant_TotalAssetsMatchVaultBalance() (runs: 256, calls: 128000, reverts: 114297)

╭----------+--------------+-------+---------+----------╮
| Contract | Selector     | Calls | Reverts | Discards |
+======================================================+
| RWAVault | approve      | 12761 | 22      | 0        |
|----------+--------------+-------+---------+----------|
| RWAVault | deposit      | 12807 | 12642   | 0        |
|----------+--------------+-------+---------+----------|
| RWAVault | grantRole    | 12865 | 12863   | 0        |
|----------+--------------+-------+---------+----------|
| RWAVault | mint         | 12794 | 12626   | 0        |
|----------+--------------+-------+---------+----------|
| RWAVault | redeem       | 12836 | 12659   | 0        |
|----------+--------------+-------+---------+----------|
| RWAVault | renounceRole | 12853 | 12852   | 0        |
|----------+--------------+-------+---------+----------|
| RWAVault | revokeRole   | 12862 | 12862   | 0        |
|----------+--------------+-------+---------+----------|
| RWAVault | transfer     | 12851 | 12697   | 0        |
|----------+--------------+-------+---------+----------|
| RWAVault | transferFrom | 12809 | 12658   | 0        |
|----------+--------------+-------+---------+----------|
| RWAVault | withdraw     | 12562 | 12416   | 0        |
╰----------+--------------+-------+---------+----------╯

[PASS] invariant_TotalSupplyNotZero() (runs: 256, calls: 128000, reverts: 114301)

╭----------+--------------+-------+---------+----------╮
| Contract | Selector     | Calls | Reverts | Discards |
+======================================================+
| RWAVault | approve      | 12761 | 24      | 0        |
|----------+--------------+-------+---------+----------|
| RWAVault | deposit      | 12807 | 12642   | 0        |
|----------+--------------+-------+---------+----------|
| RWAVault | grantRole    | 12865 | 12865   | 0        |
|----------+--------------+-------+---------+----------|
| RWAVault | mint         | 12794 | 12626   | 0        |
|----------+--------------+-------+---------+----------|
| RWAVault | redeem       | 12836 | 12659   | 0        |
|----------+--------------+-------+---------+----------|
| RWAVault | renounceRole | 12853 | 12852   | 0        |
|----------+--------------+-------+---------+----------|
| RWAVault | revokeRole   | 12862 | 12862   | 0        |
|----------+--------------+-------+---------+----------|
| RWAVault | transfer     | 12851 | 12697   | 0        |
|----------+--------------+-------+---------+----------|
| RWAVault | transferFrom | 12809 | 12658   | 0        |
|----------+--------------+-------+---------+----------|
| RWAVault | withdraw     | 12562 | 12416   | 0        |
╰----------+--------------+-------+---------+----------╯

Suite result: ok. 2 passed; 0 failed; 0 skipped; finished in 5.97s (11.37s CPU time)

Ran 19 test suites in 5.97s (38.60s CPU time): 77 tests passed, 0 failed, 0 skipped (77 total tests)

╭----------------------------------------+-----------------+-----------------+---------------+----------------╮
| File                                   | % Lines         | % Statements    | % Branches    | % Funcs        |
+=============================================================================================================+
| contracts/governance/Governance.sol    | 77.27% (17/22)  | 78.95% (15/19)  | 100.00% (0/0) | 80.00% (8/10)  |
|----------------------------------------+-----------------+-----------------+---------------+----------------|
| contracts/mocks/MockV3Aggregator.sol   | 100.00% (8/8)   | 100.00% (5/5)   | 100.00% (0/0) | 100.00% (3/3)  |
|----------------------------------------+-----------------+-----------------+---------------+----------------|
| contracts/mocks/ReentrancyAttacker.sol | 100.00% (9/9)   | 100.00% (5/5)   | 100.00% (1/1) | 100.00% (3/3)  |
|----------------------------------------+-----------------+-----------------+---------------+----------------|
| contracts/mocks/SecureTreasury.sol     | 100.00% (8/8)   | 100.00% (6/6)   | 100.00% (2/2) | 100.00% (2/2)  |
|----------------------------------------+-----------------+-----------------+---------------+----------------|
| contracts/mocks/SecureVault.sol        | 100.00% (9/9)   | 100.00% (7/7)   | 50.00% (2/4)  | 100.00% (2/2)  |
|----------------------------------------+-----------------+-----------------+---------------+----------------|
| contracts/mocks/VulnerableTreasury.sol | 100.00% (7/7)   | 100.00% (5/5)   | 50.00% (1/2)  | 100.00% (2/2)  |
|----------------------------------------+-----------------+-----------------+---------------+----------------|
| contracts/mocks/VulnerableVault.sol    | 100.00% (9/9)   | 100.00% (7/7)   | 50.00% (2/4)  | 100.00% (2/2)  |
|----------------------------------------+-----------------+-----------------+---------------+----------------|
| contracts/oracle/OracleAdapter.sol     | 100.00% (13/13) | 100.00% (10/10) | 100.00% (1/1) | 100.00% (3/3)  |
|----------------------------------------+-----------------+-----------------+---------------+----------------|
| contracts/token/RWAToken.sol           | 83.33% (10/12)  | 75.00% (6/8)    | 100.00% (0/0) | 80.00% (4/5)   |
|----------------------------------------+-----------------+-----------------+---------------+----------------|
| contracts/utils/YulMath.sol            | 100.00% (6/6)   | 100.00% (4/4)   | 100.00% (0/0) | 100.00% (3/3)  |
|----------------------------------------+-----------------+-----------------+---------------+----------------|
| contracts/vault/RWAVault.sol           | 100.00% (3/3)   | 100.00% (2/2)   | 100.00% (0/0) | 100.00% (1/1)  |
|----------------------------------------+-----------------+-----------------+---------------+----------------|
| Total                                  | 93.40% (99/106) | 92.31% (72/78)  | 64.29% (9/14) | 91.67% (33/36) |
╰----------------------------------------+-----------------+-----------------+---------------+----------------╯
