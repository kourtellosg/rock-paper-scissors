const { expect } = require("chai");
import { ethers, network } from "hardhat";
import { RockPaperScissors__factory, RockPaperScissors } from "../dist/types";
import { Signer } from "ethers";

const BET_AMOUNT = ethers.parseEther("1");

enum Result {
  Win,
  Draw,
  Loss,
}

describe("RockPaperScissors", function () {
  let RockPaperScissors: RockPaperScissors__factory;
  let rps: RockPaperScissors;
  let owner: Signer;
  let player: Signer;
  let ownerAddress: string;
  let playerAddress: string;

  this.beforeAll(async function () {
    RockPaperScissors = await ethers.getContractFactory("RockPaperScissors");
    [owner, player] = await ethers.getSigners();

    ownerAddress = await owner.getAddress();
    playerAddress = await player.getAddress();

    rps = await RockPaperScissors.deploy({
      value: ethers.parseEther("20"),
    }); // Prefund the contract with 10 ETH
    await rps.waitForDeployment();
  });

  it("Should allow a player to play the game", async function () {
    for (let i = 0; i < 10; i++) {
      const playerMove = Math.floor(Math.random() * (2 + 1));

      const playerBalanceBefore = await ethers.provider.getBalance(
        playerAddress
      );

      const tx = await rps
        .connect(player)
        .play(playerMove, { value: BET_AMOUNT });
      const receipt = await tx.wait();

      const gasPrice = ethers.parseUnits(
        network.config.gasPrice.toString(),
        "wei"
      );
      const gasCost = receipt?.cumulativeGasUsed! * gasPrice;

      const playerBalanceAfter = await ethers.provider.getBalance(
        playerAddress
      );

      const logs = receipt!.logs.map((log) => rps.interface.parseLog(log));
      const gameResultFromLogs = logs[0]!.args[3];

      if (gameResultFromLogs == Result.Win) {
        // Player should have won 1 ETH - the gas costs
        expect(playerBalanceAfter - playerBalanceBefore).to.be.equal(
          ethers.parseEther("1") - gasCost!
        );
      } else if (gameResultFromLogs == Result.Draw) {
        // Player balance should stay the same, so the only difference in balance is the gas cost
        expect(playerBalanceAfter - playerBalanceBefore).to.be.equal(-gasCost!);
      } else if (gameResultFromLogs == Result.Loss) {
        // Player should have lost 1 ETH + the gas costs
        expect(playerBalanceAfter - playerBalanceBefore).to.be.equal(
          ethers.parseEther("-1") - gasCost!
        );
      } else {
        console.warn("!!! invalid result !!!");
      }
    }
  });

  it("Should not allow a player to play without the correct bet amount", async function () {
    const playerMove = 0; // Rock

    await expect(
      rps.connect(player).play(playerMove, { value: ethers.parseEther("0.5") })
    ).to.be.revertedWithCustomError(
      { interface: rps.interface },
      "InvalidBetAmout"
    );
  });

  it("Should allow the owner to withdraw funds", async function () {
    const ownerBalanceBefore = await ethers.provider.getBalance(ownerAddress);
    const withdrawAmount = ethers.parseEther("5");
    const tx = await rps.connect(owner).withdraw(withdrawAmount);
    const receipt = await tx.wait();
    // Calculate total gas cost with gas price of 10 gwei

    const gasPrice = ethers.parseUnits(
      network.config.gasPrice.toString(),
      "wei"
    );
    const gasCost = receipt?.cumulativeGasUsed! * gasPrice;

    const ownerBalanceAfter = await ethers.provider.getBalance(ownerAddress);

    expect(ownerBalanceAfter - ownerBalanceBefore).to.be.equal(
      ethers.parseEther("5") - gasCost!
    );
  });

  it("Should revert with '' error when trying to withdraw more ETH than the contract balance", async function () {
    const withdrawAmount = ethers.parseEther("50");

    await expect(
      rps.connect(owner).withdraw(withdrawAmount)
    ).to.be.revertedWithCustomError(
      { interface: rps.interface },
      "InsuficientFunds"
    );
  });

  it("Should not allow non-owners to withdraw funds", async function () {
    const withdrawAmount = ethers.parseEther("5");

    await expect(
      rps.connect(player).withdraw(withdrawAmount)
    ).to.be.revertedWith("Ownable: caller is not the owner");
  });
});
