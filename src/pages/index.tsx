import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import dynamic from 'next/dynamic'
import { useWallet } from '@solana/wallet-adapter-react'
import { PublicKey, Connection } from "@solana/web3.js";
import { use, useCallback, useEffect, useMemo, useState } from 'react';
import { useGumSDK } from '@/hooks/gumSDK';

const WalletMultiButtonDynamic = dynamic(
    async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
    { ssr: false }
);

export default function Home() {
  const wallet = useWallet();
  const pubKey = wallet.publicKey as PublicKey;
  const [userPDA, setUserPDA] = useState<PublicKey | undefined>(undefined);
  const [profilePDA, setProfilePDA] = useState<PublicKey | undefined>(undefined);
  const [postPDA, setPostPDA] = useState<PublicKey | undefined>(undefined);

  const [usersList, setUsersList] = useState<any[]>([]);
  const [profilesList, setProfilesList] = useState<any[]>([]);
  
  const connection = useMemo(() => new Connection("https://api.devnet.solana.com", "confirmed"), []);
  const sdk = useGumSDK(connection, { preflightCommitment: "confirmed" }, "devnet");

  const handleCreateUser = useCallback(async () => {
    const program = await sdk.user.create(pubKey);
    const tx = await program.program.transaction();
    setUserPDA(program.userPDA);
    console.log(`userPDA: ${program.userPDA.toBase58()}`);
    tx.recentBlockhash = (await sdk.rpcConnection.getLatestBlockhash()).blockhash;
    tx.feePayer = pubKey;
    await wallet.sendTransaction(tx, sdk.rpcConnection);
  }, [sdk, pubKey, wallet]);

  const handleCreateProfile = useCallback(async () => {
    if (!userPDA) return;
    const program = await sdk.profile.create(userPDA, "Personal", pubKey);
    const tx = await program.program.transaction();
    setProfilePDA(program.profilePDA);
    console.log(`profilePDA: ${program.profilePDA.toBase58()}`);
    tx.recentBlockhash = (await sdk.rpcConnection.getLatestBlockhash()).blockhash;
    tx.feePayer = pubKey;
    await wallet.sendTransaction(tx, sdk.rpcConnection);
  }, [sdk, userPDA, pubKey, wallet]);

  const handleCreatePost = useCallback(async () => {
    if (!userPDA || !profilePDA) return;
    const metadataUri = "https://da3z62f3lqfkdsdfhl5cssin2hrfcnec6qlhkyxg4aiwp23c3xea.arweave.net/GDefaLtcCqHIZTr6KUkN0eJRNIL0FnVi5uARZ-ti3cg";
    const post = await sdk.post.create(metadataUri, profilePDA, userPDA, pubKey);
    const tx = await post.program.transaction();
    const postPDA = post.postPDA;
    setPostPDA(postPDA);
    console.log(`postPDA: ${postPDA.toBase58()}`);
    tx.recentBlockhash = (await sdk.rpcConnection.getLatestBlockhash()).blockhash;
    tx.feePayer = pubKey;
    await wallet.sendTransaction(tx, sdk.rpcConnection);
    }, [sdk, userPDA, profilePDA, pubKey, wallet]);

  const getCurrentUserAccounts = useCallback(async () => {
      try {
          const users = await sdk.program.account.user.all([
                { memcmp: { offset: 8, bytes: pubKey.toBase58() } },
          ]);
          setUsersList(users);
      } catch(err) {
          console.log(err);
      }
  }, [sdk, pubKey]);
  
  const getProfileAccounts = useCallback(async () => {
      try {
          const users = await sdk.program.account.user.all([
                { memcmp: { offset: 8, bytes: pubKey.toBase58() } },
          ]);
          const userPDAs = users.map(user => user.publicKey);
          let profiles = [] as any[];
          for (let i = 0; i < userPDAs.length; i++) {
              const profile = await sdk.program.account.profile.all([
                  { memcmp: { offset: 8, bytes: userPDAs[i].toBase58() } },
              ]);
              profiles = [...profiles, ...profile]
          }
          setProfilesList(profiles);
      } catch(err) {
          console.log(err);
      }
  }, [sdk, pubKey]);

  useEffect(() => {
      if (wallet.connected) {
          getCurrentUserAccounts();
          getProfileAccounts();
      }
  }, [wallet.connected]);

  return (
    <>
      <Head>
        <title>Gum App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className={styles.walletButtons}>
            <WalletMultiButtonDynamic />
        </div>
        <div className={styles.buttonContainer}>
            <button className={`${styles.button}`} onClick={handleCreateUser}>Create User</button>
            <button className={`${styles.button}`} onClick={handleCreateProfile}>Create Profile</button>
            <button className={`${styles.button}`} onClick={handleCreatePost}>Create Post</button>
        </div>
        <div className={styles.usersContainer}>
          <h2 className={styles.title}>List of Users</h2>
            {usersList.map((user, index) => (
                <div key={index} className={styles.userCard} onClick={
                    () => {
                        setUserPDA(user.publicKey);
                    }
                }>
                    <div className={styles.userNumber}>
                        {index + 1}
                    </div>
                    <div className={styles.userInfo}>
                        <p className={styles.userEmail}>User Account: {user.publicKey.toBase58()}</p>
                        <p className={styles.userAuthority}>Authority: {user.account.authority.toBase58()}</p>
                    </div>
                </div>
            ))}
        </div>
        <div className={styles.usersContainer}>
          <h2 className={styles.title}>List of Profiles</h2>
            {profilesList.map((user, index) => (
                <div key={index} className={styles.userCard} onClick={
                    () => {
                        setProfilePDA(user.publicKey);
                        setUserPDA(user.account.user);
                    }
                } >
                    <div className={styles.userNumber}>
                        {index + 1}
                    </div>
                    <div className={styles.userInfo}>
                        <p className={styles.userEmail}>Profile Account: {user.publicKey.toBase58()}</p>
                        <p className={styles.userAuthority}>User Account: {user.account.user.toBase58()}</p>
                        <p className={styles.userAuthority}>Namespace: {JSON.stringify(user.account.namespace)}</p>
                    </div>
                </div>
            ))}
        </div>
      </main>
    </>
  )
}
