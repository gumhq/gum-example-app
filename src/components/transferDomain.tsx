import { useState } from 'react';
import styles from '@/styles/Home.module.css';
import { GumNameService, useDomains, useGumContext } from '@gumhq/react-sdk';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';

const TransferDomain = () => {
  const { publicKey } = useWallet();
  const { sdk } = useGumContext();
  const { userDomainAccounts } = useDomains(sdk, publicKey as PublicKey);
  const [selectedUserDomainOption, setSelectedUserDomainOption] = useState("");
  const [newAuthority, setNewAuthority] = useState('');

  return (
    <div>
      <h1 className={styles.title}>Transfer your .gum domain</h1>

      <div className={`${styles.field}`}>
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
        <label className={`${styles.label}`}>Enter new authority publickey:</label>
        <input
          type="text"
          value={newAuthority}
          onChange={(event) => setNewAuthority(event.target.value)}
          className={`${styles.input}`}
        />
      </div>

      {publicKey && (
        <button
          className={styles.button}
          onClick={async (event) => {
            event.preventDefault();
            const nameservice = new GumNameService(sdk);

            const ixBuilder = await nameservice.transferDomain(new PublicKey(selectedUserDomainOption), publicKey, new PublicKey(newAuthority));
            const res = await ixBuilder.rpc();
            console.log('screenName', res);
          }}
        >
          Transfer Domain
        </button>
      )}
    </div>
  );
};

export default TransferDomain;
