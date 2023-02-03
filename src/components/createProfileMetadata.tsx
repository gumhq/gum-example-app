import React, { useEffect, useState } from 'react';
import styles from '@/styles/Home.module.css'
import { PublicKey } from '@solana/web3.js';
import { SDK } from '@gumhq/sdk';
import { useWallet } from '@solana/wallet-adapter-react';

interface Props {
  sdk: SDK;
}

export const handleCreateProfileMetadata = async (metadataUri: String, profilePDA: PublicKey, userPDA: PublicKey, user: PublicKey, sdk: SDK) => {
  const post = await sdk.profileMetadata.create(metadataUri, profilePDA, userPDA, user);
  await post.instructionMethodBuilder.rpc();
};

const CreateProfileMetadata = ({sdk}: Props) => {
  const wallet = useWallet();
  const [metadataUri, setMetadataUri] = useState('');
  const [userProfileAccounts, setUserProfileAccounts] = useState<any>([]);
  const [selectedProfileOption, setSelectedProfileOption] = useState<any>({});

  useEffect(() => {
    if (!wallet.connected) return;
    sdk.profile.getProfileAccountsByUser(wallet.publicKey as PublicKey)
      .then((accounts) => {
        if (!accounts) return;
        const profilePDAs = accounts.map((account) => {
          return {
            profilePDA: account.publicKey.toBase58(),
            userPDA: account.account.user.toBase58(),
          };
        });
        setUserProfileAccounts(profilePDAs);
        if (profilePDAs.length === 1) {
          setSelectedProfileOption(profilePDAs[0]);
        }
      });

  }, [wallet.connected]);

  return (
    <div>
      <h1 className={`${styles.title}`}>Create New Profile Metadata</h1>
      <div className={`${styles.field}`}>
        <label className={`${styles.label}`}>Select Profile:</label>
        <select
          className={`${styles.select}`}
          value={selectedProfileOption.profilePDA || ''}
          onChange={(event) => {
            const selectedOption = userProfileAccounts.find((option:any) => option.profilePDA === event.target.value);
            setSelectedProfileOption(selectedOption || {});
          }}
        >
          <option value="">Select Profile</option>
          {userProfileAccounts.map((option: any, index: any) => (
            <option key={index} value={option.profilePDA}>
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
        onClick={(event) => {
          event.preventDefault();
          handleCreateProfileMetadata(metadataUri, selectedProfileOption.profilePDA, selectedProfileOption.userPDA, wallet.publicKey as PublicKey, sdk);
        }}
      >
        Create ProfileMetadata
      </button>
    </div>
  );
};


export default CreateProfileMetadata;
