import React, { useEffect, useState } from 'react';
import styles from '@/styles/Home.module.css'
import { PublicKey } from '@solana/web3.js';
import { SDK } from '@gumhq/sdk';
import { useWallet } from '@solana/wallet-adapter-react';

type Namespace = "Professional" | "Personal" | "Gaming" | "Degen";

interface Props {
  sdk: SDK;
}

export const handleCreateProfile = async (
  userPDA: PublicKey,
  namespace: Namespace,
  user: PublicKey,
  sdk: SDK
) => {
  if (!userPDA) return;
  const program = await sdk.profile.create(userPDA, namespace, user);
  await program.instructionMethodBuilder.rpc();
};

const CreateProfile = ({sdk}: Props) => {
  const wallet = useWallet();
  const userPublicKey = wallet.publicKey as PublicKey;
  const [usersList, setUsersList] = useState([]);
  const [selectedNamespaceOption, setSelectedNamespaceOption] = useState("Personal") as [Namespace, any];
  const [selectedUserOption, setSelectedUserOption] = useState("");

  useEffect(() => {
    if (!wallet.connected) return;
    const init = async () => {
      const users = await sdk.user.getUserAccountsByUser(userPublicKey) as any;
      const usersList = users.map((user: any) => user.publicKey.toBase58());
      setUsersList(usersList);
      if (usersList.length > 0) {
        setSelectedUserOption(usersList[0]);
      }
    };
    init();
  }, [wallet.connected]);

  return (
    <div>
      <h1 className={`${styles.title}`}>Create New Profile</h1>
      <div className={`${styles.field}`}>
        <label className={`${styles.label}`}>Select User:</label>
        <select
          className={`${styles.select}`}
          value={selectedUserOption}
          onChange={(event) => setSelectedUserOption(event.target.value)}
        >
          <option value="">Select User</option>
          {usersList.map((option: string) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}

        </select>
      </div>
     <div className={`${styles.field}`}>
        <label className={`${styles.label}`}>Profile Type:</label>
        <select
          className={`${styles.select}`}
          value={selectedNamespaceOption}
          onChange={(event) => setSelectedNamespaceOption(event.target.value)}
        >
          {["Personal", "Professional", "Gaming", "Degen"].map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
      <button
        className={`${styles.button}`}
        onClick={(event) => {
          event.preventDefault();
          handleCreateProfile(new PublicKey(selectedUserOption), selectedNamespaceOption, wallet.publicKey as PublicKey, sdk);
        }}
      >
        Create Profile
      </button>
    </div>
  );
};

export default CreateProfile;
