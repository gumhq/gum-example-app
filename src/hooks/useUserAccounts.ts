import { useEffect, useState } from 'react';
import { PublicKey } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';
import { SDK } from '@gumhq/react-sdk';

export const useUserAccounts = (sdk: SDK) => {
  const wallet = useWallet();
  const userPublicKey = wallet.publicKey as PublicKey;
  const [usersList, setUsersList] = useState([]);

  useEffect(() => {
    if (!wallet.connected) return;
    const init = async () => {
      const users = await sdk.user.getUserAccountsByUser(userPublicKey) as any;
      const usersList = users.map((user: any) => user.publicKey.toBase58());
      setUsersList(usersList);
    };
    init();
  }, [wallet.connected, userPublicKey]);

  return usersList;
};
