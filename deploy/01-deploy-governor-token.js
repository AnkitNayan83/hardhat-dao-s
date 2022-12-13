const { network, ethers } = require("hardhat");
const { developmentChains } = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");

module.exports = async function ({ getNamedAccounts, deployments }) {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  log("---------------------------------------------------");
  log("Deploying GovernanceToken Contract");
  const args = [];
  const governanceToken = await deploy("GovernanceToken", {
    from: deployer,
    log: true,
    args: args,
    waitConfirmations: network.config.blockConfirmations || 1,
  });
  log("-------------------------------------------------------");
  if (!developmentChains.includes(network.name)) {
    log("Verifying Contract");
    await verify(governanceToken.address, args);
    log("Verified");
  }
  log(`Delegating to ${deployer}`);
  await delegate(governanceToken.address, deployer);
  log("Delegated");
};

const delegate = async function (governanceTokenAddress, delegateAccount) {
  const governanceToken = await ethers.getContractAt(
    "GovernanceToken",
    governanceTokenAddress
  );
  const tx = await governanceToken.delegate(delegateAccount);
  await tx.wait(1);
  console.log(
    `Checkpoints: ${await governanceToken.numCheckpoints(delegateAccount)}`
  );
};

module.exports.tags = ["all", "governancetoken"];
