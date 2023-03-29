import styles from '@/styles/Home.module.css'
import { PublicKey } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';
import { useCreateUser, SDK } from '@gumhq/react-sdk';

interface Props {
  sdk: SDK;
}

const CreateUser = ({sdk}: Props) => {
  const wallet = useWallet();
  const { getOrCreate, isCreatingUser, createUserError} = useCreateUser(sdk);

  // Save the userPDA to your database to get or create the user's profile later
  // console.log('userPDA', userPDA);
  // console.log('error', createUserError);
  // console.log('loading', isCreatingUser);

  return (
    <div>
      <h1 className={`${styles.title}`}>Create New User</h1>
      <button
        className={`${styles.button}`}
        onClick={async (event) => {
          event.preventDefault();
          const userPDA = await getOrCreate(wallet.publicKey as PublicKey);
          console.log('userPDA', userPDA);
        }}
      >
        Create User
      </button>
    </div>
  );
};

export default CreateUser;
