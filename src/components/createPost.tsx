import React, { useState } from 'react';
import styles from '@/styles/Home.module.css';
import { PublicKey } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';
import { useCreatePost, SDK, useSessionWallet, useGumContext } from '@gumhq/react-sdk';
import { updateSessionWallet } from '@/utils/sessionManager';
import { useProfileAccounts } from '@/hooks/useProfileAccounts';

// Use this function if you want to create a post without using the react-sdk
export const handleCreatePost = async (metadataUri: string, profilePDA: PublicKey, userPDA: PublicKey, user: PublicKey, sdk: SDK) => {
  const post = await sdk.post.create(metadataUri, profilePDA, userPDA, user);
  await post.instructionMethodBuilder.rpc();
};

const CreatePost = ({ onPostCreated }: any) => {
  const wallet = useWallet();
  const { sdk } = useGumContext();
  const { publicKey: sessionPublicKey, sessionToken, createSession, sendTransaction } = useSessionWallet();
  const [metadataUri, setMetadataUri] = useState('');
  const [selectedProfileOption, setSelectedProfileOption] = useState<any>(null);
  const userProfileAccounts = useProfileAccounts(sdk);
  const { create, postPDA, isCreatingPost, createPostError } = useCreatePost(sdk);

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
          const txId = await create(metadataUri, selectedProfileOption?.profilePDA, selectedProfileOption?.userPDA, session.sessionPublicKey, new PublicKey(session.sessionToken), sendTransaction);
          console.log('txId', txId);

          // Call the onPostCreated prop function
          if (onPostCreated && txId) {
            onPostCreated();
          }
        }}
      >
        Create Post
      </button>
    </div>
  );
};

export default CreatePost;
