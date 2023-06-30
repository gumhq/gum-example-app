// The GumSDKProvider component initializes the Gum SDK and SessionKeyManager and provides it to its children via context.

import { GumProvider, SessionWalletProvider, UploaderProvider, useSessionKeyManager } from '@gumhq/react-sdk';
import { AnchorWallet, useAnchorWallet, useConnection } from '@solana/wallet-adapter-react';
import { useGumSDK } from '@/hooks/useGumSDK';

interface GumSDKProviderProps {
  children: React.ReactNode;
}

const GumSDKProvider: React.FC<GumSDKProviderProps> = ({ children }) => {
  const cluster = (process.env.NEXT_PUBLIC_SOLANA_NETWORK as "devnet" | "mainnet-beta") || 'devnet';
  const { connection } = useConnection();
  const anchorWallet = useAnchorWallet() as AnchorWallet;
  const sdk = useGumSDK();
  const sessionWallet = useSessionKeyManager(anchorWallet, connection, cluster);

  if (!sdk) {
    return null;
  }

  return (
    <GumProvider sdk={sdk}>
      <SessionWalletProvider sessionWallet={sessionWallet}>
        <UploaderProvider
            uploaderType="arweave"
            connection={connection}
            cluster={cluster}
          >
            {children}
        </UploaderProvider>
      </SessionWalletProvider>
    </GumProvider>
  );
};

export default GumSDKProvider;
