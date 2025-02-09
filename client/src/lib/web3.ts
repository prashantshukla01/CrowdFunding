import { ethers } from "ethers";
import { create } from "zustand";

// Add window.ethereum type definition
declare global {
  interface Window {
    ethereum?: ethers.Eip1193Provider;
  }
}

interface Web3State {
  provider: ethers.BrowserProvider | null;
  address: string | null;
  balance: string | null;
  loading: boolean;
  error: Error | null;
  connect: () => Promise<void>;
  disconnect: () => void;
}

export const useWeb3 = create<Web3State>((set) => ({
  provider: null,
  address: null,
  balance: null,
  loading: false,
  error: null,
  connect: async () => {
    try {
      set({ loading: true });

      if (!window.ethereum) {
        throw new Error("Please install MetaMask!");
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      const balance = ethers.formatEther(await provider.getBalance(address));

      set({ 
        provider, 
        address, 
        balance,
        loading: false,
        error: null 
      });
    } catch (error) {
      set({ 
        error: error as Error,
        loading: false
      });
    }
  },
  disconnect: () => {
    set({ 
      provider: null, 
      address: null, 
      balance: null 
    });
  },
}));