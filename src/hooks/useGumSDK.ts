import { AnchorWallet, useAnchorWallet } from '@solana/wallet-adapter-react';
import { GRAPHQL_ENDPOINTS, useGum } from '@gumhq/react-sdk';
import { useConnection } from '@solana/wallet-adapter-react';
import { useMemo } from 'react';
import { GraphQLClient } from "graphql-request";

export const useGumSDK = () => {
  const { connection } = useConnection();
  const anchorWallet = useAnchorWallet() as AnchorWallet;

  // GraphQL endpoint is chosen based on the network
  const graphqlEndpoint = "https://gum-indexer-smartprofile-devnet-lafkve5tyq-uc.a.run.app/v1/graphql";

  const gqlClient = useMemo(() => new GraphQLClient(graphqlEndpoint), [graphqlEndpoint]);

  const sdk = useGum(anchorWallet, connection, {preflightCommitment: 'confirmed'}, "devnet", gqlClient);

  return sdk;
};
