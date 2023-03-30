import styles from '@/styles/Home.module.css';
import { useCreateUser, useGumContext } from '@gumhq/react-sdk';
import { useWallet } from '@solana/wallet-adapter-react';

const CreateUser = () => {
  const { publicKey } = useWallet();
  const { sdk } = useGumContext();
  const { getOrCreate, isCreatingUser, createUserError } = useCreateUser(sdk);

  return (
    <div>
      <h1 className={styles.title}>Create New User</h1>
      {
        publicKey && (
          <button
            className={styles.button}
            onClick={async (event) => {
              event.preventDefault();
              const userPDA = await getOrCreate(publicKey);
              console.log('userPDA', userPDA);
            }}
          >
            Create User
        </button>
        )
      }
    </div>
  );
};

export default CreateUser;
