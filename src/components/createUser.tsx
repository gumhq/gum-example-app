import React from 'react';
import styles from '@/styles/Home.module.css'
import { PublicKey } from '@solana/web3.js';
import { SDK } from '@gumhq/sdk';
import { useWallet } from '@solana/wallet-adapter-react';

interface Props {
  sdk: SDK;
}

export const handleCreateUser = async (
  user: PublicKey,
  sdk: SDK
) => {
  const program = await sdk.user.create(user);
  await program.instructionMethodBuilder.rpc();
};

const CreateUser = ({sdk}: Props) => {
  const wallet = useWallet();

  return (
    <div>
      <h1 className={`${styles.title}`}>Create New User</h1>
      <button
        className={`${styles.button}`}
        onClick={(event) => {
          event.preventDefault();
          handleCreateUser(wallet.publicKey as PublicKey, sdk);
        }}
      >
        Create User
      </button>
    </div>
  );
};

export default CreateUser;
