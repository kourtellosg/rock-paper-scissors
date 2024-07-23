## Rock - Papers - Scissors 

![Coverage](./coverage_badge.svg)

### Intro 

This is a smart contract that allows players to play rock-paper-scissors. 

#### Single Player Experience
The current smart contract facilitates a single player experience:
The player needs to deposit 1 ETH to participate. If they win they receive 2 ETH (assume the contract is pre-funded), 
otherwise if they lose they relinquish their deposit. In case of draw, the deposited 1 ETH is returned to them.

#### Multiplayer Experience
For multiplier experience where players can play each other, the best approach would be to use latest developments in the [Fully Ηomomorphic Encryption (FHE)](https://www.zama.ai/introduction-to-homomorphic-encryption) space.
More specifically, there are libraries such as [fhEVM](https://docs.zama.ai/fhevm) that provide this cababilities to the solidity language and allows for the user to store anything on-chain encrypted. So,
in a multiplayer scenario, player 1 would deposit 1 ETH and store their move encrypted on the smart contract. Then player 2, would do the same and part of the logic
would be to compare the 2 encrypted values and distribute the funds to the winner.


### How-to

1. Install all the required packages 
```sh
pnpm install
```
2. Build the smart contract
```sh
pnpm build
```
3. Run the tests for the smart contract
```sh
pnpm test
## For code coverage
pnpm run test:coverage
```
4. For deploying the contract 
   1. Create a `.env` file based on the `.env.example`
   2. Update with the correct values required for the deployment
   3. Run the following
```sh
pnpm deploy --network <NETWORK_NAME>
## Valid network names mumbail // sepolia 
## you can add more by updating the hardhat.config.ts file 
```