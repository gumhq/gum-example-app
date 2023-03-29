import { Adapter, WalletAdapterNetwork, WalletError } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { FC, ReactNode, useCallback } from 'react';
import dynamic from "next/dynamic";

export const ReactUIWalletModalProviderDynamic = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletModalProvider,
  { ssr: false }
);

export const WalletContextProvider: FC<{ children: ReactNode, endpoint: string, network: WalletAdapterNetwork, wallets?: Adapter[] }> = ({ children, endpoint, network, wallets = [] }) => {

    const onError = useCallback(
        (error: WalletError) => {
            console.error(error);
        },
        []
    );

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} onError={onError} autoConnect>
                <ReactUIWalletModalProviderDynamic>
                    {children}
                </ReactUIWalletModalProviderDynamic>
			</WalletProvider>
        </ConnectionProvider>
    );
};