import { ethers } from "ethers";
import abi from "./Zero2Hero.json";

declare global {
  interface Window {
    ethereum: any;
  }
}

const contractAddress = "0x483c40387D66aD0E2eEf91BC97FEE759B113C198";

const getContractInstance = () => {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    return new ethers.Contract(contractAddress, abi.abi, signer);
  }
  throw new Error("Please install MetaMask!");
};

export const claimReward = async (amount: string) => {
  try {
    const contract = getContractInstance();
    const signer = await contract.signer.getAddress();
    const isEligible = await contract.isEligibleForReward(signer);

    if (!isEligible) {
      throw new Error("User is not eligible for reward");
    }

    const amountBN = ethers.utils.parseUnits(amount, 18);
    const tx = await contract.claimReward(amountBN);
    await tx.wait();
    return true;
  } catch (error) {
    console.error("Error claiming reward:", error);
    throw error;
  }
};

export const mintRWT = async (address: string, amount: string) => {
  try {
    const contract = getContractInstance();
    const amountBN = ethers.utils.parseUnits(amount, 18);
    const tx = await contract.claimReward(amountBN);
    await tx.wait();
    return true;
  } catch (error) {
    console.error("Error minting RWT:", error);
    throw new Error("Failed to mint RWT tokens");
  }
};

export const getTokenBalance = async (address: string): Promise<string> => {
  try {
    const contract = await getContractInstance();
    const balance = await contract.balanceOf(address);
    return ethers.utils.formatEther(balance.toString());
  } catch (error) {
    console.error("Error getting token balance:", error);
    return "0.000000";
  }
};

export const connectWallet = async (): Promise<string> => {
  if (typeof window.ethereum !== "undefined") {
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      return await signer.getAddress();
    } catch (error) {
      console.error("Error connecting wallet:", error);
      throw error;
    }
  }
  throw new Error("Please install MetaMask!");
};