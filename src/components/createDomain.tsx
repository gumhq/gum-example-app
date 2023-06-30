import { useState } from 'react';
import styles from '@/styles/Home.module.css';
import { GUM_TLD_ACCOUNT, GumNameService, useGumContext } from '@gumhq/react-sdk';
import { useWallet } from '@solana/wallet-adapter-react';

const CreateDomain = () => {
  const { publicKey } = useWallet();
  const { sdk } = useGumContext();

  // Create state for domain
  const [domain, setDomain] = useState('');

  return (
    <div>
      <h1 className={styles.title}>Create new .gum domain</h1>
      
      <input
        type="text"
        value={domain}
        onChange={(event) => setDomain(event.target.value)}
        placeholder="Enter domain name"
        className={styles.input} 
      />

      {publicKey && (
        <button
          className={styles.button}
          onClick={async (event) => {
            event.preventDefault();
            const nameservice = new GumNameService(sdk);

            const gumTld = GUM_TLD_ACCOUNT;

            const screenName = await nameservice.getOrCreateDomain(gumTld, domain, publicKey);
            console.log(`screenName: ${screenName}`);
          }}
        >
          Create Domain
        </button>
      )}
    </div>
  );
};

export default CreateDomain;
