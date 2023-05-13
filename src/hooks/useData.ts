import { useEffect, useState } from 'react';
import { PublicKey } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';
import { useGumContext } from '@gumhq/react-sdk';

export const useData = () => {
  const wallet = useWallet();
  const { sdk } = useGumContext();
  const userPublicKey = wallet?.publicKey as PublicKey;

  const [usersList, setUsersList] = useState<any[]>([]);
  const [profilesList, setProfilesList] = useState<any[]>([]);
  const [profileMetadataList, setProfileMetadataList] = useState<any[]>([]);
  const [postsList, setPostsList] = useState<any[]>([]);

  // Refresh trigger state
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    if (!wallet.connected) return;
    if (!sdk) return;
    const getData = async () => {
      const profileMetadataList = await sdk.profileMetadata.getProfileMetadataAccountsByUser(userPublicKey);
      setUsersList(await sdk.user.getUserAccountsByUser(userPublicKey));
      setProfilesList(await sdk.profile.getProfileAccountsByUser(userPublicKey));
      setProfileMetadataList(profileMetadataList as any);
      setPostsList(await sdk.post.getPostAccountsByUser(userPublicKey));
    };
    getData();
  }, [wallet.connected, sdk, userPublicKey, refresh]); // Add refresh to the dependency array

  // Expose a function to trigger the refresh from outside
  const refreshData = () => {
    setRefresh(prev => !prev);
  };

  return { usersList, profilesList, profileMetadataList, postsList, refreshData };
};
