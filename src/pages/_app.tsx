import { WalletContextProvider } from '@/contexts/WalletContextProvider';
import '@/styles/globals.css'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { PhantomWalletAdapter, SolflareWalletAdapter} from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';
import type { AppProps } from 'next/app';
import React, { useMemo } from 'react';

// Use require instead of import since order matters
require('@solana/wallet-adapter-react-ui/styles.css');

export default function App({ Component, pageProps }: AppProps) {
    const network = WalletAdapterNetwork.Devnet;
    const endpoint = useMemo(() => clusterApiUrl(network), [network]);
    const wallets = useMemo(
        () => [
            new PhantomWalletAdapter({ network }),
            new SolflareWalletAdapter({ network }),
        ],
        [network]
    );

    return (
        <WalletContextProvider endpoint={endpoint} network={network} wallets={wallets} >
                    <Component {...pageProps} />
        </WalletContextProvider>
    );
}
