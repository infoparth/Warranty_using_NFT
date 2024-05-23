import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "@radix-ui/react-label";
import { upload } from "thirdweb/storage";
import { useActiveAccount } from "thirdweb/react";
import { nftContract, client } from "@/constants/Constant";
import { prepareContractCall, sendAndConfirmTransaction } from "thirdweb";

const Mint: React.FC = () => {
  const navigate = useNavigate();
  const [nftAddress, setNFTAddress] = useState<string>();
  const [mintAddress, setMintAddress] = useState<string>();
  const [transactionReciept, setTransactionReciept] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false); // New state for loading

  const [file, setFile] = useState<File | null>(null);
  const [URI, setURI] = useState<string | null>(null);

  const account = useActiveAccount();
  const walletAddress = account?.address || "";

  const handleSubmit = async () => {
    if (!account) {
      alert("Wallet not Connected");
      return;
    }
    if (!nftAddress || !mintAddress) {
      alert("Cannot submit empty fields");
      return;
    }

    setLoading(true); // Set loading to true when the transaction starts

    const NftContract = nftContract(nftAddress);

    try {
      if (file !== null) {
        const uri = await upload({
          client,
          files: [file],
        });

        console.log("The URI is: " + uri);
        setURI(uri);
      } else {
        alert("File Upload Failed");
        setLoading(false);
        return;
      }

      const transaction = prepareContractCall({
        contract: NftContract,
        method: "mint",
        params: [mintAddress, URI],
      });

      console.log("here");
      if (transaction !== undefined && account) {
        const _transactionReceipt = await sendAndConfirmTransaction({
          account: account,
          transaction: transaction,
        });
        console.log("here 2");
        setTransactionReciept(_transactionReceipt);
      } else {
        console.log("Transaction not found");
      }
    } catch (error) {
      console.error("Transaction failed: ", error);
    } finally {
      setLoading(false); // Reset loading state after transaction completes or fails
    }
  };

  const HandleNFTChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNFTAddress(e.target.value);
  };

  console.log("The Values are:", nftAddress);

  const HandleMintAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMintAddress(e.target.value);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-[#c9def4] to-[#b8a4c9] p-8">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <Label className="block mb-2 font-bold text-gray-700">
          NFT Address
        </Label>
        <Input
          value={nftAddress}
          placeholder="NFT Address"
          type="text"
          onChange={(e) => HandleNFTChange(e)}
          className="w-full p-2 mb-4 border border-gray-300 rounded"
        />

        <Label className="block mb-2 font-bold text-gray-700">
          Mint Address
        </Label>
        <Input
          value={mintAddress}
          placeholder="Mint Address"
          type="text"
          onChange={(e) => HandleMintAddressChange(e)}
          className="w-full p-2 mb-4 border border-gray-300 rounded"
        />

        <Label className="block mb-2 font-bold text-gray-700">
          Upload File
        </Label>
        <Input
          id="picture"
          type="file"
          onChange={(e) => {
            if (e.target.files) {
              setFile(e.target.files[0]);
            }
          }}
          className="w-full p-2 mb-4 border border-gray-300 rounded"
        />

        <Button
          onClick={handleSubmit}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          disabled={loading} // Disable button while loading
        >
          {loading ? "Loading..." : "Mint New NFT"}
        </Button>
      </div>
    </div>
  );
};

export default Mint;
