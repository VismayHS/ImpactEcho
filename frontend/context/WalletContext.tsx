'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ethers } from 'ethers';
import { contractABI, DONATION_REGISTRY_ADDRESS, CHAIN_ID } from '@/lib/contract';

interface WalletContextType {
  address: string | null;
  provider: ethers.BrowserProvider | null;
  signer: ethers.JsonRpcSigner | null;
  contract: ethers.Contract | null;
  chainId: number | null;
  connecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  switchNetwork: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [connecting, setConnecting] = useState(false);

  const setupProvider = async (ethereum: any) => {
    const web3Provider = new ethers.BrowserProvider(ethereum);
    const web3Signer = await web3Provider.getSigner();
    const network = await web3Provider.getNetwork();
    const userAddress = await web3Signer.getAddress();

    const donationContract = new ethers.Contract(
      DONATION_REGISTRY_ADDRESS,
      contractABI,
      web3Signer
    );

    setProvider(web3Provider);
    setSigner(web3Signer);
    setAddress(userAddress);
    setChainId(Number(network.chainId));
    setContract(donationContract);

    return web3Provider;
  };

  const connect = async () => {
    if (typeof window === 'undefined' || !window.ethereum) {
      alert('Please install MetaMask to use this feature');
      return;
    }

    try {
      setConnecting(true);
      
      // Request account access
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      await setupProvider(window.ethereum);
      
      // Check if on correct network
      const currentChainId = await window.ethereum.request({ method: 'eth_chainId' });
      if (parseInt(currentChainId, 16) !== CHAIN_ID) {
        await switchNetwork();
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      alert('Failed to connect wallet. Please try again.');
    } finally {
      setConnecting(false);
    }
  };

  const disconnect = () => {
    setAddress(null);
    setProvider(null);
    setSigner(null);
    setContract(null);
    setChainId(null);
  };

  const switchNetwork = async () => {
    if (!window.ethereum) return;

    const chainIdHex = `0x${CHAIN_ID.toString(16)}`;
    
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: chainIdHex }],
      });
    } catch (switchError: any) {
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: chainIdHex,
                chainName: CHAIN_ID === 80001 ? 'Polygon Mumbai' : 'Polygon',
                nativeCurrency: {
                  name: 'MATIC',
                  symbol: 'MATIC',
                  decimals: 18,
                },
                rpcUrls: [
                  CHAIN_ID === 80001
                    ? 'https://rpc-mumbai.maticvigil.com'
                    : 'https://polygon-rpc.com',
                ],
                blockExplorerUrls: [
                  CHAIN_ID === 80001
                    ? 'https://mumbai.polygonscan.com'
                    : 'https://polygonscan.com',
                ],
              },
            ],
          });
        } catch (addError) {
          console.error('Failed to add network:', addError);
        }
      }
    }
  };

  // Auto-connect if previously connected
  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      window.ethereum.request({ method: 'eth_accounts' }).then((accounts: string[]) => {
        if (accounts.length > 0) {
          setupProvider(window.ethereum);
        }
      });

      // Listen for account changes
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnect();
        } else {
          setupProvider(window.ethereum);
        }
      });

      // Listen for chain changes
      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }
  }, []);

  return (
    <WalletContext.Provider
      value={{
        address,
        provider,
        signer,
        contract,
        chainId,
        connecting,
        connect,
        disconnect,
        switchNetwork,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    ethereum?: any;
  }
}
