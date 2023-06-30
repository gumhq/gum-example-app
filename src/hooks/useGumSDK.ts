import { AnchorWallet, useAnchorWallet } from '@solana/wallet-adapter-react';
import { GRAPHQL_ENDPOINTS, useGum } from '@gumhq/react-sdk';
import { useConnection } from '@solana/wallet-adapter-react';
import { useMemo } from 'react';
import { GraphQLClient } from "graphql-request";

export const useGumSDK = () => {
  const { connection } = useConnection();
  const anchorWallet = useAnchorWallet() as AnchorWallet;
  const cluster = (process.env.NEXT_PUBLIC_SOLANA_NETWORK as "devnet" | "mainnet-beta") || 'devnet';

  // GraphQL endpoint is chosen based on the network
  const graphqlEndpoint = GRAPHQL_ENDPOINTS[cluster];

  const gqlClient = useMemo(() => new GraphQLClient(graphqlEndpoint), [graphqlEndpoint]);

  const sdk = useGum(anchorWallet, connection, {preflightCommitment: 'confirmed'}, cluster, gqlClient);

  return sdk;
};
