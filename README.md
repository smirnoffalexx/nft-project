# NFT project

This project is used for creating collections and minting NFTs and contains 3 parts: Solidity smart contract, golang backend, nextjs frontend.

Collection factory contract has been deployed to the sepolia testnet:
https://sepolia.etherscan.io/address/0x2D290455b532a9E805b1ba1e8b9DCE3cf06E29e7

For running this project provide environment variables to the .env.frontend and .env.backend (as in the example.env) and then run:

```bash
cd app
sudo docker-compose up
```

Also you can run backend and frontend separately (in different terminals) without Docker:

```bash
go mod download
go run main.go

npm install
npm run dev
```
