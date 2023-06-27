import React, { useState } from 'react';
import styles from '@/styles/Home.module.css';
import { PublicKey } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';
import { useCreatePost, SDK, useSessionWallet, useGumContext } from '@gumhq/react-sdk';
import { updateSessionWallet } from '@/utils/sessionManager';
import { useProfileAccounts } from '@/hooks/useProfileAccounts';

const defaultPostMetadataUri = 'https://arweave.net/7Hfw-ue9GJ4kZrRM-Qjp2BTSF54Dr8DaE7szAsoDMd0';

// Use this function if you want to create a post without using the react-sdk
export const handleCreatePost = async (metadataUri: string, profilePDA: PublicKey, userPDA: PublicKey, user: PublicKey, sdk: SDK) => {
  const post = await sdk.post.create(metadataUri, profilePDA, userPDA, user);
  await post.instructionMethodBuilder.rpc();
};

const CreatePost = ({ onPostCreated }: any) => {
  const { sdk } = useGumContext();
  const { publicKey: sessionPublicKey, sessionToken, createSession, sendTransaction } = useSessionWallet();
  const [metadataUri, setMetadataUri] = useState(defaultPostMetadataUri);
  const [selectedProfileOption, setSelectedProfileOption] = useState<any>(null);
  const userProfileAccounts = useProfileAccounts(sdk);
  const { createWithSession, postPDA, isCreatingPost, createPostError } = useCreatePost(sdk);
  console.log('error', createPostError)
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
          if (!session || !session.sessionPublicKey || !session.sessionToken || !sendTransaction ) return;
          const txId = await createWithSession(metadataUri, selectedProfileOption?.profilePDA, session.sessionPublicKey, new PublicKey(session.sessionToken), sendTransaction, session.sessionPublicKey);
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
