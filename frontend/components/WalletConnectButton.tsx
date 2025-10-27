'use client';

import { useWallet } from '@/context/WalletContext';
import { Wallet, LogOut, CheckCircle } from 'lucide-react';

export default function WalletConnectButton() {
  const { address, connect, disconnect, connecting, chainId } = useWallet();

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const isCorrectNetwork = chainId === parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || '80001');

  if (address) {
    return (
      <div className="flex items-center gap-3">
        {isCorrectNetwork && (
          <div className="flex items-center gap-2 text-sm text-success">
            <CheckCircle className="w-4 h-4" />
            <span>Mumbai</span>
          </div>
        )}
        <div className="flex items-center gap-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white px-4 py-2 rounded-lg shadow-lg">
          <Wallet className="w-5 h-5" />
          <span className="font-mono font-semibold">{formatAddress(address)}</span>
        </div>
        <button
          onClick={disconnect}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          title="Disconnect"
        >
          <LogOut className="w-5 h-5 text-gray-600" />
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={connect}
      disabled={connecting}
      data-wallet-connect
      className="flex items-center gap-2 bg-gradient-to-r from-cyber-cyan via-cyber-blue to-cyber-purple hover:shadow-neon-strong text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed will-change-transform"
      style={{ transform: 'translateZ(0)' }}
    >
      <Wallet className="w-5 h-5" />
      <span>
        {connecting ? 'Connecting...' : 'Connect Wallet'}
      </span>
    </button>
  );
}
