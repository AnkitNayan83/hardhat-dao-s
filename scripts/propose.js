const { ethers } = require("hardhat");
const {
  NEW_STORE_VALUE,
  FUNC,
  PROPOSAL_DESCRIPTION,
} = require("../helper-hardhat-config");

async function porpose(args, functionToCall, proposalDescription) {
  const governor = await ethers.getContract("GovernorContract");
  const box = await ethers.getContract("Box");

  const encodedFunctionCall = box.interface.encodeFunctionData(
    functionToCall,
    args
  );
  console.log(`Proposing ${functionToCall} on ${box.address} with ${args}`);
  console.log(`Proposal Description:\n  ${proposalDescription}`);
}

porpose([NEW_STORE_VALUE], FUNC, PROPOSAL_DESCRIPTION)
  .then(() => process.exit(0))
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
