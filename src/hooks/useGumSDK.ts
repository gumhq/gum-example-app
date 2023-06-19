import { AnchorWallet, useAnchorWallet } from '@solana/wallet-adapter-react';
import { GRAPHQL_ENDPOINTS, useGum } from '@gumhq/react-sdk';
import { useConnection } from '@solana/wallet-adapter-react';
import { useMemo } from 'react';
import { GraphQLClient } from "graphql-request";

export const useGumSDK = () => {
  const { connection } = useConnection();
  const anchorWallet = useAnchorWallet() as AnchorWallet;

  // GraphQL endpoint is chosen based on the network
  const graphqlEndpoint = GRAPHQL_ENDPOINTS['devnet'];

  const gqlClient = useMemo(() => new GraphQLClient(graphqlEndpoint), [graphqlEndpoint]);

  const sdk = useGum(anchorWallet, connection, {preflightCommitment: 'confirmed'}, "devnet", gqlClient);

  return sdk;
};
