const { expect } = require("chai");

async function main() {
  const [owner] = await ethers.getSigners();

  const AIGC = await ethers.getContractFactory("AIGC");
  const _aigc = await AIGC.deploy();
  await _aigc.waitForDeployment();

  const AIGC_Factory = await ethers.getContractFactory("AIGC_Factory");
  const AIGC_factory = await AIGC_Factory.deploy(_aigc.target);
  // const AIGC_factory = await AIGC_Factory.attach(
  //   "0xee536864561171617955c4F6C6893B9Cd2399683"
  // );

  // await AIGC_factory.waitForDeployment();

  // wait for 10 seconds
  // await new Promise((r) => setTimeout(r, 10000));

  console.log("AIGC_factory deployed to:", AIGC_factory.target);

  // verify on etherscan
  // await hre.run("verify:verify", {
  //   address: AIGC_factory.target,
  //   contract: "contracts/AIGC_Factory.sol:AIGC_Factory",
  //   constructorArguments: [_aigc.target],
  // });

  // const AIGC_factory = await AIGC_Factory.attach(
  //   "0x48A4F096634680606F3184525B4Dd9eC19755AaB"
  // );

  const MockOpmlLib = await ethers.getContractFactory("MockOpmlLib");
  // const mockOpmlLib = await MockOpmlLib.deploy();

  const mockOpmlLib = await MockOpmlLib.attach(
    "0xfEBfdE43561Bc74e4F982cdEB40A29966708E035"
  );
  // verify on etherscan
  // await hre.run("verify:verify", {
  //   address: "0xfEBfdE43561Bc74e4F982cdEB40A29966708E035",
  //   contract: "contracts/MockOpmlLib.sol:MockOpmlLib",
  //   constructorArguments: [],
  // });

  const modelName = "Stable Diffusion v2";
  const modelSymbol = "SD";
  const tokenPrice = 0; // initial price to buy model's token
  const costToken = 1; // cost of token to mint AIGC nft
  const aiModelVm = ethers.encodeBytes32String("text");
  const opmlLib = mockOpmlLib.target;
  const tokenMaxSupply = 1000;
  const ownerReservePercent = 10;
  const royalty = 10;

  await AIGC_factory.createAIGC(
    modelName,
    modelSymbol,
    tokenPrice,
    costToken,
    aiModelVm,
    ownerReservePercent,
    royalty
  );

  // wait for 5 seconds
  await new Promise((r) => setTimeout(r, 5000));

  const ipOrgAddr = await AIGC_factory.modelIndexToIpOrgAddr(1);
  console.log("ipOrgAddr", ipOrgAddr);

  const aigcAddr = await AIGC_factory.getAIGC(1);
  const aigtAddr = await AIGC_factory.getAIGT(1);

  const aigc = await AIGC.attach(aigcAddr);

  // verify on etherscan
  // await hre.run("verify:verify", {
  //   address: aigcAddr,
  //   contract: "contracts/AIGC.sol:AIGC",
  //   constructorArguments: [
  //     0,
  //     modelName,
  //     modelSymbol,
  //     aigtAddr,
  //     costToken,
  //     aiModelVm,
  //     opmlLib,
  //     royalty,
  //     ipOrgAddr,
  //     owner.address,
  //   ],
  // });

  const AIGT = await ethers.getContractFactory("AIGT");
  const aigt = await AIGT.attach(aigtAddr);

  // verify on etherscan
  // await hre.run("verify:verify", {
  //   address: aigtAddr,
  //   contract: "contracts/AIGT.sol:AIGT",
  //   constructorArguments: [
  //     0,
  //     modelName,
  //     modelSymbol,
  //     tokenPrice,
  //     owner.address,
  //     tokenMaxSupply,
  //     ownerReservePercent,
  //   ],
  // });

  // buy one aigt
  await aigt.mint(1);

  // approve token
  await aigt.approve(aigcAddr, 1000);

  await aigc.mint(
    "tokenuri",
    ethers.encodeBytes32String("text"),
    ethers.encodeBytes32String("text"),
    "ipfsMediaUrl"
  );
}
main();
// curation mechanism
// register as ipa after it's good enough
