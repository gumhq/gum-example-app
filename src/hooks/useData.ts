import { useEffect, useState } from 'react';
import { PublicKey } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';
import { GumNameService, useGumContext } from '@gumhq/react-sdk';

export const useData = () => {
  const wallet = useWallet();
  const { sdk } = useGumContext();
  const userPublicKey = wallet?.publicKey as PublicKey;
  const nameservice = new GumNameService(sdk);

  const [userDomainList, setUserDomainList] = useState<any[]>([]);
  const [profilesList, setProfilesList] = useState<any[]>([]);
  const [postsList, setPostsList] = useState<any[]>([]);
  const [issuerList, setIssuerList] = useState<any[]>([]);

  // Refresh trigger state
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    if (!wallet.connected) return;
    if (!sdk) return;
    const getData = async () => {
      const profileList = await sdk.profile.getProfilesByAuthority(userPublicKey);
      const nameserviceList = await nameservice.getNameservicesByAuthority(wallet.publicKey?.toBase58() as string)
      const issuerList = await sdk.badge.getIssuerByAuthority(userPublicKey);
      const postList  = await sdk.post.getPostsByAuthority(userPublicKey);

      setIssuerList(issuerList);
      setUserDomainList(nameserviceList);
      setProfilesList(profileList);
      setPostsList(postList);
    };
    getData();
  }, [wallet.connected, sdk, userPublicKey, refresh]); // Add refresh to the dependency array

  // Expose a function to trigger the refresh from outside
  const refreshData = () => {
    setRefresh(prev => !prev);
  };

  return { userDomainList, profilesList, postsList, issuerList, refreshData };
};
