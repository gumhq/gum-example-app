import { PublicKey } from "@solana/web3.js";
import { GPLCORE_PROGRAMS } from "@gumhq/react-sdk";

export const updateSessionWallet = async (sessionPublicKey: PublicKey | null , sessionToken: string | null, createSession: any) => {
  let currentSessionPublicKey = sessionPublicKey;
  let currentSessionToken = sessionToken;
  const cluster = (process.env.NEXT_PUBLIC_SOLANA_NETWORK as "devnet" | "mainnet-beta") || 'devnet';

  if (!currentSessionPublicKey || !currentSessionToken || !createSession) {
    const targetProgramId = GPLCORE_PROGRAMS[cluster];
    const sessionDuration = 5 * 60;
    const session = await createSession(targetProgramId, true, sessionDuration);
    if (!session) {
      return;
    }
    currentSessionPublicKey = new PublicKey(session.publicKey);
    currentSessionToken = session.sessionToken;
  }

  return {
    sessionPublicKey: currentSessionPublicKey,
    sessionToken: currentSessionToken,
  };
};