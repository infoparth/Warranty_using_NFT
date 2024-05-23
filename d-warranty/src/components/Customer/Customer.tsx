import React, { useState } from "react";
import {
  ConnectButton,
  useReadContract,
  useActiveAccount,
} from "thirdweb/react";
import { createWallet, inAppWallet } from "thirdweb/wallets";
import { client, factoryContract, nftContract } from "../../constants/Constant";
import { useNavigate } from "react-router-dom";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { readContract } from "thirdweb";

const Customer: React.FC = () => {
  const [balance, setBalance] = useState<bigint>();
  const [nftAddress, setNFTAddress] = useState<string>();
  const [tokenId, setTokenId] = useState<number>();
  const [result, setResult] = useState<boolean>(); // Changed result state type to any

  const account = useActiveAccount();
  const walletAddress = account?.address || "";

  const callFunct = async () => {
    console.log("Clicked");
    if (nftAddress && tokenId) {
      const NFTContract = nftContract(nftAddress);
      const result = await readContract({
        contract: NFTContract,
        method: "hasValidWarranty",
        params: [BigInt(tokenId)],
      });

      console.log("The result is: " + result);
      setResult(result);
    } else {
      console.log("No NFT Address");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-[#c9def4] to-[#b8a4c9] p-8">
      <h1 className="text-3xl font-bold mb-4">Welcome to D-Warranty</h1>
      <p className="text-lg mb-4">
        Enter your TokenId and NFT Collection Address
      </p>
      <div className="mb-4 flex">
        <Input
          value={nftAddress}
          onChange={(e) => setNFTAddress(e.target.value)} // Added event parameter
          className="mr-2"
          type="text"
          placeholder="NFT Address"
        />
        <Input
          value={tokenId}
          onChange={(e) => setTokenId(e.target.value)} // Added event parameter
          className=""
          type="number"
          placeholder="TokenId"
        />
      </div>
      <Button onClick={callFunct} className="mb-4">
        Check Warranty
      </Button>
      {result !== undefined ? (
        <p> Your Warranty is: {result?.toString()}</p>
      ) : null}
    </div>
  );
};

export default Customer;
