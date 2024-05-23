import { ThirdwebClient, createThirdwebClient, getContract } from "thirdweb";
import { polygonAmoy } from "thirdweb/chains";
import { factoryABI } from "./Factory";
import { nftABI } from "./NFT";

const clientId = "a81b28f71aa45b7499e14d244942b8b2";

export const factoryAddress = "0xd748d6aC387bBDf16a3940C0f7539D454FF00d0E"; //"0xA0707680850A6E64ED873466b8Df20A323f7025c"; // "0xF7632eb9Cba41Ba7D8C53EaD6135E950D78082C2"; //"0xd83A8b11E82d7f0De49B8E8d48251b8152cbF00b"; //"0xae1298bA6A426fC039341A0baA9e9a8eE3c42c33";

export const client: ThirdwebClient = createThirdwebClient({
  clientId: clientId,
});

export const chain = polygonAmoy;

export const factoryContract = getContract({
  client: client,
  chain: polygonAmoy,
  address: factoryAddress,
  abi: factoryABI,
});

export function nftContract(address: string) {
  const nftContract = getContract({
    client: client,
    chain: polygonAmoy,
    address: address,
    abi: nftABI,
  });

  return nftContract;
}
