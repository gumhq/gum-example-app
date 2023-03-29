import { AnchorWallet, useAnchorWallet } from "@solana/wallet-adapter-react";
import { useGum } from "@gumhq/react-sdk";
import { Cluster, ConfirmOptions, Connection } from "@solana/web3.js";
import { GraphQLClient } from "graphql-request";
import { useMemo } from "react";

export const useGumSDK = (connection: Connection, opts: ConfirmOptions, cluster: Cluster, gpl_endpoint: string) => {
  const anchorWallet = useAnchorWallet() as AnchorWallet;
  const gqlClient = useMemo(() => new GraphQLClient(gpl_endpoint), [gpl_endpoint]);

  const sdk = useGum(anchorWallet,connection, opts, cluster, gqlClient);

  return sdk;
};
