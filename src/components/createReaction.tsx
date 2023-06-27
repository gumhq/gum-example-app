import React, { useState } from 'react';
import styles from '@/styles/Home.module.css';
import { PublicKey } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';
import { SDK, useSessionWallet, useGumContext, useReaction } from '@gumhq/react-sdk';
import { updateSessionWallet } from '@/utils/sessionManager';
import { useProfileAccounts } from '@/hooks/useProfileAccounts';
import { usePostAccounts } from '@/hooks/usePostAccounts';

const defaultReaction = '👍';

const CreateReaction = ({ onPostCreated }: any) => {
  const { publicKey } = useWallet();
  const { sdk } = useGumContext();
  const { publicKey: sessionPublicKey, sessionToken, createSession, sendTransaction } = useSessionWallet();
  const [reaction, setReaction] = useState(defaultReaction);
  const [selectedProfileOption, setSelectedProfileOption] = useState<any>(null);
  const [selectedPostOption, setSelectedPostOption] = useState<any>(null);
  const userProfileAccounts = useProfileAccounts(sdk);
  const userPostAccounts = usePostAccounts(sdk);
  const { createReactionWithSession, isReacting, createReactionError } = useReaction(sdk);
  console.log('error', createReactionError)
  return (
    <div>
      <h1 className={`${styles.title}`}>React on post</h1>
      <div className={`${styles.field}`}>
        <label className={`${styles.label}`}>Select Post:</label>
        <select
          className={`${styles.select}`}
          value={selectedPostOption?.postPDA || ''}
          onChange={(event) => {
            const selectedOption = userPostAccounts.find((option: any) => option.postPDA === event.target.value);
            setSelectedPostOption(selectedOption || null);
          }}
        >
          <option value="">Select Post</option>
          {userPostAccounts.map((option: any) => (
            <option key={option.postPDA} value={option.postPDA}>
              {option.postPDA}
            </option>
          ))}
        </select>
      </div>
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
      <label className={`${styles.label}`}>Enter Reaction:</label>
      <input
        type="text"
        value={reaction}
        onChange={(event) => setReaction(event.target.value)}
        className={`${styles.input}`}
      />
      <button
        className={`${styles.button}`}
        disabled={!selectedProfileOption}
        onClick={async (event) => {
          event.preventDefault();

          const session = await updateSessionWallet(sessionPublicKey, sessionToken, createSession);
          if (!session || !session.sessionPublicKey || !session.sessionToken || !sendTransaction ) return;
          const txId = await createReactionWithSession(reaction, selectedProfileOption?.profilePDA, selectedPostOption.postPDA, session.sessionPublicKey, new PublicKey(session.sessionToken), session.sessionPublicKey, sendTransaction);
          console.log('txId', txId);
        }}
      >
        Create Reaction
      </button>
    </div>
  );
};

export default CreateReaction;
