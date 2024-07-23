// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RockPaperScissors is ReentrancyGuard, Ownable {
    enum Move {
        Rock,
        Paper,
        Scissors
    }
    enum Result {
        Win,
        Draw,
        Loss
    }

    event GameResult(
        address indexed player,
        Move playerMove,
        Move computerMove,
        Result result
    );

    error InsuficientFunds();
    error InvalidBetAmout();

    uint256 public immutable BET_AMOUNT = 1 ether;
    uint256 private gameId;

    constructor() payable {}

    // Fallback function to receive Ether
    receive() external payable {}

    // Public methods
    // Admin Only
    function withdraw(uint256 amount) external onlyOwner nonReentrant {
        if (address(this).balance <= amount) revert InsuficientFunds();
        payable(owner()).transfer(amount);
    }

    //
    function play(Move playerMove) external payable nonReentrant {
        if (msg.value != BET_AMOUNT) revert InvalidBetAmout();

        Move computerMove = _generateComputerMove();
        Result gameResult = _determineWinner(playerMove, computerMove);

        if (gameResult == Result.Win) {
            _transferEth(2 * BET_AMOUNT);
        }
        // In case of Draw, send the bet amount back to user
        if (gameResult == Result.Draw) {
            _transferEth(BET_AMOUNT);
        }

        emit GameResult(msg.sender, playerMove, computerMove, gameResult);
    }

    function _generateComputerMove() private returns (Move) {
        gameId++;
        uint256 random = uint256(
            keccak256(
                abi.encodePacked(
                    block.timestamp,
                    block.prevrandao,
                    msg.sender,
                    blockhash(block.number - 1),
                    gasleft(),
                    gameId
                )
            )
        );
        return Move(random % 3);
    }

    function _determineWinner(
        Move playerMove,
        Move computerMove
    ) private pure returns (Result) {
        if (playerMove == computerMove) {
            return Result.Draw;
        }
        if (
            (playerMove == Move.Rock && computerMove == Move.Scissors) ||
            (playerMove == Move.Paper && computerMove == Move.Rock) ||
            (playerMove == Move.Scissors && computerMove == Move.Paper)
        ) {
            return Result.Win;
        }
        return Result.Loss;
    }

    function _transferEth(uint256 amount) private {
        if (address(this).balance <= amount) revert InsuficientFunds();
        payable(msg.sender).transfer(amount);
    }
}
