async function main() {
  await hre.run("verify:verify", {
    address: "0x191Ad675CA576c8b8dE269548A87Cd3D60696B9e",
    contract: "contracts/AIGC_Factory.sol:AIGC_Factory",
    constructorArguments: ["0x209c87043f4d637f443dd9714d80a0c69e4298d2"],
  });
}
main();
