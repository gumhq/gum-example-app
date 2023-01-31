import { AnchorWallet, useAnchorWallet } from "@solana/wallet-adapter-react";
import { SDK } from "@gumhq/sdk";
import { Cluster, ConfirmOptions, Connection } from "@solana/web3.js";

export const useGumSDK = (connection: Connection, opts: ConfirmOptions, cluster: Cluster) => {
  const anchorWallet = useAnchorWallet() as AnchorWallet;

  const sdk = new SDK(
        anchorWallet,
        connection,
        opts,
        cluster
      );
  return sdk;
};
