const index = 0;
const fs = require("fs");
const { network, ethers } = require("hardhat");
const {
  proposalsFile,
  developmentChains,
  VOTING_PERIOD,
} = require("../helper-hardhat-config");
const { moveBlocks } = require("../utils/moveBlocks");

async function main(proposalIndex) {
  const proposal = JSON.parse(fs.readFileSync(proposalsFile, "utf8"));
  const processId = proposal[network.config.chainId][proposalIndex];
  // 0 is against
  // 1 is for
  // 2 is abstain
  const voteWay = 1;
  const governor = await ethers.getContract("GovernorContract");
  const reason = "Bas yu hi mann kiya";
  const voteTxResponse = await governor.castVoteWithReason(
    processId,
    voteWay,
    reason
  );

  const voteTxReceipt = await voteTxResponse.wait(1);
  console.log(voteTxReceipt.events[0].args.reason);
  const proposalState = await governor.state(processId);

  if (developmentChains.includes(network.name)) {
    await moveBlocks(VOTING_PERIOD + 1);
  }
  console.log(`Current Proposal State: ${proposalState}`);

  console.log("Voted......................");
}

main(index)
  .then(() => process.exit(0))
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
