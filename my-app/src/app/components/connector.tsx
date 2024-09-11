"use client";
import React, { useState } from 'react';
import { ethers } from 'ethers';
import factoryABI from "../abi/CollectionFactory.json";
import * as dotenv from "dotenv";

dotenv.config();

const factoryAddress = "0x2D290455b532a9E805b1ba1e8b9DCE3cf06E29e7"; // process.env.FACTORY_ADDRESS!;

const MetaMaskConnector: React.FC = () => {
    const [account, setAccount] = useState<string | null>(null);
    const [balance, setBalance] = useState<string | null>(null);
    const [name, setName] = useState<string>('');
    const [symbol, setSymbol] = useState<string>('');
    const [collectionAddress, setCollectionAddress] = useState<string>('');
    const [recipient, setRecipient] = useState<string>('');
    const [tokenId, setTokenId] = useState<string>('');
    const [tokenUri, setTokenUri] = useState<string>('');
    const [transactionHash, setTransactionHash] = useState<string | null>(null);

    const connectWallet = async () => {
        try {
            if ((window as any).ethereum) {
                const provider = new ethers.BrowserProvider((window as any).ethereum);
                const accounts = await provider.send("eth_requestAccounts", []);
                setAccount(accounts[0]);

                const balance = await provider.getBalance(accounts[0]);
                setBalance(ethers.formatEther(balance));
            } else {
                alert("MetaMask is not installed");
            }
        } catch (error) {
            console.error("Connection error", error);
        }
    };

    const sendCreateCollection = async () => {
        try {
            if (!account || !name || !symbol) {
                alert("Fill in all fields");
                return;
            }

            const provider = new ethers.BrowserProvider((window as any).ethereum);
            const signer = await provider.getSigner();

            const factory = new ethers.Contract(factoryAddress, factoryABI, signer);

            const tx = await factory.createCollection(name, symbol);

            setTransactionHash(tx.hash);
            alert(`Transaction hash: ${tx.hash}`);
        } catch (error) {
            console.error("Error: ", error);
        }
    };

    const sendMintNFT = async () => {
        try {
            if (!account || !collectionAddress || !recipient || !tokenId || !tokenUri) {
                alert("Fill in all fields");
                return;
            }

            const provider = new ethers.BrowserProvider((window as any).ethereum);
            const signer = await provider.getSigner();

            const factory = new ethers.Contract(factoryAddress, factoryABI, signer);

            const tx = await factory.mintNFT(collectionAddress, recipient, tokenId, tokenUri);

            setTransactionHash(tx.hash);
            alert(`Transaction hash: ${tx.hash}`);
        } catch (error) {
            console.error("Error: ", error);
        }
    };

    return (
        <div>
            <h1>Create collections and mint NFTs</h1>
            <button onClick={connectWallet}>
                {account ? `Connected: ${account}` : 'Connect MetaMask'}
            </button>

            {balance && (
                <p>Balance: {balance} ETH</p>
            )}

            <h1>Create collections:</h1>
            <div>
                <label>Collection name:</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="NAME"
                />
            </div>

            <div>
                <label>Collection symbol:</label>
                <input
                    type="text"
                    value={symbol}
                    onChange={(e) => setSymbol(e.target.value)}
                    placeholder="SYMBOL"
                />
            </div>

            <button onClick={sendCreateCollection} disabled={!account}>
                Create collection
            </button>

            <h1>Mint NFTs:</h1>
            <div>
                <label>Collection address:</label>
                <input
                    type="text"
                    value={collectionAddress}
                    onChange={(e) => setCollectionAddress(e.target.value)}
                    placeholder="0x.........."
                />
            </div>

            <div>
                <label>Recipient address:</label>
                <input
                    type="text"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    placeholder="0x.........."
                />
            </div>

            <div>
                <label>Token ID:</label>
                <input
                    type="text"
                    value={tokenId}
                    onChange={(e) => setTokenId(e.target.value)}
                    placeholder="100"
                />
            </div>

            <div>
                <label>Token URI:</label>
                <input
                    type="text"
                    value={tokenUri}
                    onChange={(e) => setTokenUri(e.target.value)}
                    placeholder="https://........"
                />
            </div>

            <button onClick={sendMintNFT} disabled={!account}>
                Mint NFT
            </button>

            {transactionHash && (
                <p> Transaction hash: {transactionHash}</p>
            )}
        </div>
    );
};

export default MetaMaskConnector;
