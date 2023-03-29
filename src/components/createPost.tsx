import React, { useEffect, useState } from 'react';
import styles from '@/styles/Home.module.css';
import { PublicKey } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';
import { useCreatePost, SDK, useSessionWallet } from '@gumhq/react-sdk';
import { updateSessionWallet } from '@/utils/sessionManager';

interface Props {
  sdk: SDK;
}

// Use this function if you want to create a post without using the react-sdk
export const handleCreatePost = async (metadataUri: string, profilePDA: PublicKey, userPDA: PublicKey, user: PublicKey, sdk: SDK) => {
  const post = await sdk.post.create(metadataUri, profilePDA, userPDA, user);
  await post.instructionMethodBuilder.rpc();
};

const CreatePost = ({ sdk }: Props) => {
  const wallet = useWallet();
  const { publicKey: sessionPublicKey, sessionToken, createSession, signAndSendTransaction } = useSessionWallet();
  const [metadataUri, setMetadataUri] = useState('');
  const [userProfileAccounts, setUserProfileAccounts] = useState<any>([]);
  const [selectedProfileOption, setSelectedProfileOption] = useState<any>(null);
  const { create, postPDA, isCreatingPost, createPostError } = useCreatePost(sdk);

  useEffect(() => {
    if (!wallet.connected) return;
    sdk.profile.getProfileAccountsByUser(wallet.publicKey as PublicKey)
      .then((accounts: any[]) => {
        if (!accounts) return;
        const profileOptions = accounts.map((account) => {
          return {
            profilePDA: account.publicKey.toBase58(),
            userPDA: account.account.user.toBase58(),
          }
        });
        setUserProfileAccounts(profileOptions);
        if (profileOptions.length === 1) {
          setSelectedProfileOption(profileOptions[0]);
        }
      });

  }, [wallet.connected]);

  return (
    <div>
      <h1 className={`${styles.title}`}>Create New Post</h1>
      <div className={`${styles.field}`}>
        <label className={`${styles.label}`}>Select Profile:</label>
        <select
          className={`${styles.select}`}
          value={selectedProfileOption?.profilePDA || ''}
          onChange={(event) => {
            const selectedOption = userProfileAccounts.find((option: any) => option.profilePDA === event.target.value);
            setSelectedProfileOption(selectedOption || null);
          }}
        >
          <option value="">Select Profile</option>
          {userProfileAccounts.map((option: any) => (
            <option key={option.profilePDA} value={option.profilePDA}>
              {option.profilePDA}
            </option>
          ))}
        </select>
      </div>
      <label className={`${styles.label}`}>Enter MetadataUri:</label>
      <input
        type="text"
        value={metadataUri}
        onChange={(event) => setMetadataUri(event.target.value)}
        className={`${styles.input}`}
      />
      <button
        className={`${styles.button}`}
        disabled={!selectedProfileOption}
        onClick={async (event) => {
          event.preventDefault();

          const session = await updateSessionWallet(sessionPublicKey, sessionToken, createSession);
          if (!session || !session.sessionPublicKey || !session.sessionToken ) return;
          const txId = await create(metadataUri, selectedProfileOption?.profilePDA, selectedProfileOption?.userPDA, session.sessionPublicKey, new PublicKey(session.sessionToken), signAndSendTransaction);
          console.log('txId', txId);
        }}
      >
        Create Post
      </button>
    </div>
  );
};

export default CreatePost;
