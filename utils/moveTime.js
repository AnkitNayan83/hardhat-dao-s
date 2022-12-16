const { network } = require("hardhat");

module.exports = async function moveTime(amount) {
  console.log("Moving Time with time stone💎");

  await network.provider.send("evm_increaseTime", [amount]);

  console.log(`Moved forward ${amount} seconds`);
};
