import React, { useState } from 'react';
import styles from '@/styles/Home.module.css';
import { PublicKey } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';
import { useCreateProfile, useDomains, useGumContext } from '@gumhq/react-sdk';

const defaultProfileMetadataUri = 'https://raw.githubusercontent.com/gumhq/sdk/master/packages/gpl-core/tests/utils/profile.json';

const CreateProfile = () => {
  const wallet = useWallet();
  const { sdk } = useGumContext();
  const userPublicKey = wallet.publicKey as PublicKey;
  const [metadataUri, setMetadataUri] = useState(defaultProfileMetadataUri);
  const [selectedUserDomainOption, setSelectedUserDomainOption] = useState("");
  const { userDomainAccounts } = useDomains(sdk, userPublicKey);
  const { create, isCreatingProfile, createProfileError } = useCreateProfile(sdk);
  
  return (
    <div>
      <h1 className={`${styles.title}`}>Create New Profile</h1>
      <div className={`${styles.field}`}>
        <label className={`${styles.label}`}>Enter MetadataUri:</label>
        <input
          type="text"
          value={metadataUri}
          onChange={(event) => setMetadataUri(event.target.value)}
          className={`${styles.input}`}
        />
        <label className={`${styles.label}`}>Select Domain:</label>
        <select
          className={`${styles.select}`}
          value={selectedUserDomainOption}
          onChange={(event) => setSelectedUserDomainOption(event.target.value)}
        >
          <option value="">Select Domain</option>
          {userDomainAccounts.map((option: any, index: any) => (
            <option key={index} value={option.domainPDA}>
              {option.domainName}
            </option>
          ))}
        </select>
      </div>
      <button
        className={`${styles.button}`}
        onClick={async (event) => {
          event.preventDefault();
          const profilePDA = await create(metadataUri, new PublicKey(selectedUserDomainOption), userPublicKey, userPublicKey);
          console.log('profilePDA', profilePDA);
        }}
      >
        Create Profile
      </button>
    </div>
  );
};

export default CreateProfile;
