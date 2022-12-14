const { ethers } = require("hardhat");
const { ADDRESS_ZERO } = require("../helper-hardhat-config");

module.exports = async function ({ getNamedAccounts, deployments }) {
  const { log } = deployments;
  const { deployer } = await getNamedAccounts();
  const governanceToken = await ethers.getContract("GovernanceToken");
  const timeLock = await ethers.getContract("TimeLock");
  const governor = await ethers.getContract("GovernorContract");

  log("------------------------------------------------------------");
  log("Setting up role...");

  const proposelRole = await timeLock.PROPOSER_ROLE();
  const executorRole = await timeLock.EXECUTOR_ROLE();
  const adminRole = await timeLock.TIMELOCK_ADMIN_ROLE();

  proposerTx = await timeLock.grantRole(proposelRole, governor.address);
  await proposerTx.wait(1);

  const executorTx = await timeLock.grantRole(executorRole, ADDRESS_ZERO);
  await executorTx.wait(1);

  const revokeTx = await timeLock.revokeRole(adminRole, deployer);
  await revokeTx.wait(1);
};
