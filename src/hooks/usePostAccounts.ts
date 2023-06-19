import { useEffect, useState } from 'react';
import { PublicKey } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';
import { SDK } from '@gumhq/react-sdk';

export const usePostAccounts = (sdk: SDK) => {
  const wallet = useWallet();
  const [userPostAccounts, setUserPostAccounts] = useState<any>([]);

  useEffect(() => {
    if (!wallet.connected) return;
    sdk.post.getPostsByAuthority(wallet.publicKey as PublicKey)
      .then((accounts: any[]) => {
        if (!accounts) return;
        const profileOptions = accounts.map((account) => {
          return {
            postPDA: account.address,
          }
        });
        setUserPostAccounts(profileOptions);
      });

  }, [wallet.connected]);

  return userPostAccounts;
};
