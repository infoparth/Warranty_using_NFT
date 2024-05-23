# Warranty using NFT

This project provides a way for you to create your own NFT Factory contract, enabling you to effortlessly launch and manage your own NFT collections. The NFT Factory contract simplifies the process of deploying new NFTs, making it easy for users to mint and manage their unique digital assets.

### Getting Started

To start the project, run the following commands

```
cd d-warranty
```

```
npm i
```

in the terminal to install all the dependencies required.

To run the project, run the command,

```
npm run dev
```

To deploy your own Factory Contract, run

```
cd Warranty_Contract
```

Once, you are in the directory, open WSL in your terminal(if you're on windows) and run

```
forge build
```

This will compile the contract, create your .env file in the source directory and run

set your RPC_URL and private key in the .env and run

```
source .env
```

Then, run the following command, to deploy your contract on the Amoy testnet

```
forge script script/Token.s.sol --rpc-url $RPC_URL --broadcast --verify -vvvv
```

The contract is deployed on the Polygon Amoy Testnet at the address

```
0xd748d6aC387bBDf16a3940C0f7539D454FF00d0E
```

### Authors

Parth Verma

### License

This project is licensed under the MIT License - see the LICENSE.md file for details
