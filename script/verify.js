async function main() {
  await hre.run("verify:verify", {
    address: "0xa146ad9e31bc7ced364871bfdc9530503cef079d",
    contract: "contracts/AIGC_Factory.sol:AIGC_Factory",
    constructorArguments: ["0x04FB15CE4920085B62C905DC372EaAE2d207c997"],
  });
}
main();
