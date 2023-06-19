import { useEffect, useState } from 'react';
import { PublicKey } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';
import { SDK } from '@gumhq/react-sdk';

export const useProfileAccounts = (sdk: SDK) => {
  const wallet = useWallet();
  const [userProfileAccounts, setUserProfileAccounts] = useState<any>([]);

  useEffect(() => {
    if (!wallet.connected) return;
    sdk.profile.getProfilesByAuthority(wallet.publicKey as PublicKey)
      .then((accounts: any[]) => {
        if (!accounts) return;
        const profileOptions = accounts.map((account) => {
          return {
            profilePDA: account.address,
          }
        });
        setUserProfileAccounts(profileOptions);
      });

  }, [wallet.connected]);

  return userProfileAccounts;
};
