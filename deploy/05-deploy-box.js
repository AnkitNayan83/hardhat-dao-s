const { network, ethers } = require("hardhat");
const { developmentChains } = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");

module.exports = async function ({ getNamedAccounts, deployments }) {
  const { deployer } = await getNamedAccounts();
  const { deploy, log } = deployments;
  const args = [];
  log("-----------------------------------------------------");
  log("Deploying Box Contract");
  const box = await deploy("Box", {
    from: deployer,
    args: args,
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  });

  const timeLock = await ethers.getContract("TimeLock");
  const boxContract = await ethers.getContractAt("Box", box.address);
  const tx = await boxContract.transferOwnership(timeLock.address);
  await tx.wait(1);

  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    log("Verifying Contract");
    verify(box.address, args);
    log("verified");
  }
  log("-----------------------------------------------------");
};

module.exports.tags = ["all", "box"];
