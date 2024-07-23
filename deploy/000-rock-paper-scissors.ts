import "@nomiclabs/hardhat-ethers";
import "hardhat-deploy";
import { Signer } from "ethers";
import hre from "hardhat";
import {
  DeployFunction,
  DeploymentSubmission,
} from "hardhat-deploy/dist/types";

export const rockPaperScissorName = "RockPaperScissors";

const deployrockPaperScissors: DeployFunction = async function () {
  console.log("Deploying payments notary contract");
  const signers = await hre.ethers.getSigners();
  const adminSigner = signers[0];

  const rockPaperScissors = await hre.ethers.deployContract(
    rockPaperScissorName,
    [],
    adminSigner as unknown as Signer
  );

  await rockPaperScissors.waitForDeployment();

  const rockPaperScissorAddress = await rockPaperScissors.getAddress();
  const artifact = await hre.deployments.getExtendedArtifact(
    rockPaperScissorName
  );

  await hre.deployments.save(rockPaperScissorName, {
    ...artifact,
    ...{ address: rockPaperScissorAddress },
  } as DeploymentSubmission);

  console.log("Contract deployed to:", rockPaperScissorAddress);

  if (hre.network.name !== "hardhat") {
    console.log("Contract verification started ...");
    console.log(
      `contracts/${rockPaperScissorName}.sol:${rockPaperScissorName}`
    );
    await hre.run("verify:verify", {
      address: rockPaperScissorAddress,
      contract: `contracts/${rockPaperScissorName}.sol:${rockPaperScissorName}`,
      constructorArguments: [],
    });
    console.log("Contract verification completed ...");
  }
};

deployrockPaperScissors.id = "deploy-rps";
deployrockPaperScissors.tags = ["rock-paper-scissor", "test"];
export default deployrockPaperScissors;
