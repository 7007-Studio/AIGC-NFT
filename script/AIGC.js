const { expect } = require("chai");

async function main() {
  const [owner] = await ethers.getSigners();

  const AIGC_Factory = await ethers.getContractFactory("AIGC_Factory");
  const AIGC_factory = await AIGC_Factory.deploy();
  await AIGC_factory.deployed();

  const modelName = "Stable Diffusion";
  const modelSymbol = "SD";
  const tokenPrice = 1; // initial price to buy model's token
  const costToken = 1; // cost of token to mint AIGC nft
  const aiModelVm = 0x00;
  const opmlLib = 0x00;
  const tokenMaxSupply = 1000;
  const ownerReservePercent = 10;
  const royalty = 10;

  await AIGC_factory.createAIGC(
    modelName,
    modelSymbol,
    tokenPrice,
    costToken,
    aiModelVm,
    opmlLib,
    tokenMaxSupply,
    ownerReservePercent,
    royalty
  );

  const aigcAddr = await AIGC_factory.deployedAIGCs(0);
  const aigtAddr = await AIGC_factory.deployedAIGTs(0);

  const AIGC = await ethers.getContractFactory("AIGC");
  const aigc = await AIGC.attach(aigcAddr);

  const AIGT = await ethers.getContractFactory("AIGT");
  const aigt = await AIGT.attach(aigtAddr);

  // mint aigc nft
  await aigc.mint("tokenuri", 0x0, 0x0);
}
main();
// curation mechanism
// register as ipa after it's good enough
