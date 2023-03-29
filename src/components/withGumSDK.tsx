// This HOC enhances a component by providing the Gum SDK via the GumAppProvider context
// The Gum SDK is retrieved using the useGumSDK hook and passed as a prop to the GumAppProvider component
// The HOC is used to wrap any component that requires access to the Gum SDK
// Usage: withGumSDK(MyComponent)

import React, { useMemo } from 'react';
import { GRAPHQL_ENDPOINTS, GumProvider, SDK, SessionWalletProvider, useSessionKeyManager } from '@gumhq/react-sdk';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { AnchorWallet, useAnchorWallet, useConnection } from '@solana/wallet-adapter-react';
import { useGumSDK } from '@/hooks/useGumSDK';
import { Connection } from '@solana/web3.js';

interface WithGumSDKProps {
  sdk: SDK;
}

// Define the withGumSDK HOC that wraps a component and provides the Gum SDK
export const withGumSDK = (
  WrappedComponent: React.ComponentType<WithGumSDKProps>
) => {
  const HOC: React.FC<WithGumSDKProps> = (props) => {
    const network = WalletAdapterNetwork.Devnet;
    // const { connection } = useConnection();
    const connection = useMemo(() => new Connection("https://rpc-devnet.helius.xyz/?api-key=bd84f952-3b93-4911-8413-1617fe18f115", "confirmed"), []);
    const sdk = useGumSDK(connection, {preflightCommitment: 'confirmed'}, network, GRAPHQL_ENDPOINTS['devnet']);
    const wallet = useAnchorWallet() as AnchorWallet;
    
    const sessionWallet = useSessionKeyManager(wallet, connection, network);

    if (!sdk) {
      return null;
    }
    
    return (
      <GumProvider sdk={sdk}>
        <SessionWalletProvider sessionWallet={sessionWallet}>
          <WrappedComponent {...props} />
        </SessionWalletProvider>
      </GumProvider>
    );
  };

  return HOC;
};
