const { network } = require("hardhat");
const { MIN_DELAY, developmentChains } = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");

module.exports = async function ({ getNamedAccounts, deployments }) {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  log("----------------------------------------------------");
  log("Deploying TimeLock");
  const args = [MIN_DELAY, [], []];
  const timeLock = await deploy("TimeLock", {
    from: deployer,
    args: args,
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  });
  log("----------------------------------------------------------");
  if (!developmentChains.includes(network.name)) {
    log("Verifying Contract");
    verify(timeLock.address, args);
    log("Verified");
  }
};

module.exports.tags = ["all", "timelock"];
