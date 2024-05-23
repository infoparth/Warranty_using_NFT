import React, { useState } from "react";
import { useReadContract, useActiveAccount } from "thirdweb/react";

import { factoryContract } from "../../constants/Constant";
import FormCompo from "../Forms/Form";
import { Button } from "../ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import Mint from "../Mint/mint";

const Brand: React.FC = () => {
  const [clicked, setClicked] = useState(false);
  const [clickedMint, setClickedMint] = useState(false);

  const account = useActiveAccount();
  const walletAddress = account?.address || "";

  const { data: value, isLoading } = useReadContract({
    contract: factoryContract,
    method: "getBrandOwnedCollections",
    params: [walletAddress],
  });

  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        alert("Copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-[#c9def4] to-[#b8a4c9] p-8">
      {!clicked && !clickedMint && (
        <>
          <h1 className="text-3xl font-bold mb-4">Welcome to D-Warranty</h1>
          <p className="text-lg mb-4">Click to view your NFT collection</p>

          <DropdownMenu className="mb-4">
            <DropdownMenuTrigger className="border border-gray-500 px-4 py-2 rounded mr-2">
              Open
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>My Collection</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {isLoading || value === undefined ? (
                <DropdownMenuItem>Loading...</DropdownMenuItem>
              ) : (
                value.map((item: string, index) => (
                  <DropdownMenuItem
                    key={index}
                    onClick={() => copyToClipboard(item)}
                  >
                    {item}
                  </DropdownMenuItem>
                ))
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      )}

      {!clicked && (
        <Button
          onClick={() => setClicked((prev) => !prev)}
          className="mb-4"
          style={{ marginLeft: "0.5rem" }} // Add inline style to apply margin
        >
          Click to Create New Collection
        </Button>
      )}
      {!clickedMint && (
        <Button onClick={() => setClickedMint((prev) => !prev)}>
          Click to Mint NFT to an Address
        </Button>
      )}

      {clicked && (
        <div className="w-full max-w-md mx-auto">
          <Button
            onClick={() => setClicked(false)}
            className="mb-4"
            style={{ marginLeft: "0.5rem" }} // Add inline style to apply margin
          >
            Back
          </Button>
          <FormCompo />
        </div>
      )}

      {clickedMint && (
        <div className="w-full max-w-md mx-auto">
          <Button
            onClick={() => setClickedMint(false)}
            className="mb-4"
            style={{ marginLeft: "0.5rem" }} // Add inline style to apply margin
          >
            Back
          </Button>
          <Mint />
        </div>
      )}
    </div>
  );
};

export default Brand;
