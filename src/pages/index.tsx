import Head from 'next/head';
import styles from '@/styles/Home.module.css';
import dynamic from 'next/dynamic';
import CreatePost from '@/components/createPost';
import CreateProfile from '@/components/createProfile';
import CreateUser from '@/components/createUser';
import ListCard from '@/components/ListCard';
import { useData } from '@/hooks/useData';

const WalletMultiButtonDynamic = dynamic(
  async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { ssr: false },
);

function Home() {
    const { usersList, profilesList, profileMetadataList, postsList, refreshData } = useData();


    const renderUserCard = (user: any, index: any) => (
        <div key={index} className={styles.userCard}>
        <div className={styles.userNumber}>{index + 1}</div>
        <div className={styles.userInfo}>
            <p className={styles.userEmail}>User Account: {user.publicKey.toBase58()}</p>
            <p className={styles.userAuthority}>Authority: {user.account.authority.toBase58()}</p>
        </div>
        </div>
    );

    const renderProfileCard = (profile: any, index: any) => (
        <div key={index} className={styles.userCard}>
            <div className={styles.userNumber}>{index + 1}</div>
            <div className={styles.userInfo}>
                <p className={styles.userEmail}>Profile Account: {profile.publicKey.toBase58()}</p>
                <p className={styles.userAuthority}>User Account: {profile.account.user.toBase58()}</p>
            </div>
        </div>
    );

    const renderProfileMetadataCard = (profileMetadata: any, index: any) => (
        <div key={index} className={styles.userCard}>
            <div className={styles.userNumber}>{index + 1}</div>
            <div className={styles.userInfo}>
                <p className={styles.userEmail}>Profile Metadata Account: {profileMetadata[0].publicKey.toBase58()}</p>
                <p className={styles.userAuthority}>Profile Account: {profileMetadata[0].account.profile.toBase58()}</p>
                <p className={styles.userAuthority}>MetadataUri: {JSON.stringify(profileMetadata[0].account.metadataUri)}</p>
            </div>
        </div>
    );

    const renderPostCard = (post: any, index: any) => (
        <div key={index} className={styles.userCard}>
            <div className={styles.userNumber}>{index + 1}</div>
            <div className={styles.userInfo}>
                <p className={styles.userEmail}>Post Account: {post.publicKey.toBase58()}</p>
                <p className={styles.userAuthority}>Profile Account: {post.account.profile.toBase58()}</p>
                <p className={styles.userAuthority}>MetadataUri: {JSON.stringify(post.account.metadataUri)}</p>
            </div>
        </div>
    );
    

    return (
        <>
        <Head>
            <title>Gum App</title>
            <meta name="description" content="Generated by create next app" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className={styles.main}>
            <div className={styles.leftContainer}>
            <div className={styles.walletButtons}>
                <WalletMultiButtonDynamic />
            </div>
            <div className={styles.componentContainer}>
                <CreateUser />
            </div>
            <div className={styles.componentContainer}>
                <CreateProfile />
            </div>
            <div className={styles.componentContainer}>
                <CreatePost onPostCreated={refreshData} />
            </div>
            </div>
            <div className={styles.rightContainer}>
                <ListCard title="Your User Accounts" list={usersList} renderItem={renderUserCard} />
                <ListCard title="Your Profile Accounts" list={profilesList} renderItem={renderProfileCard} />
                <ListCard title="Your Profile Metadata Accounts" list={profileMetadataList} renderItem={renderProfileMetadataCard} />
                <ListCard title="Your Post Accounts" list={postsList} renderItem={renderPostCard} />
            </div>
        </main>
        </>
    );
}

export default Home;