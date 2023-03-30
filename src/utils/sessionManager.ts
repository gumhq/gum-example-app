import { PublicKey } from "@solana/web3.js";

  
  export const updateSessionWallet = async (sessionPublicKey: PublicKey | null , sessionToken: string | null, createSession: (targetProgram: PublicKey, topUp: boolean, validUntil?: number | undefined) => Promise<{
    sessionToken: string;
    publicKey: string;
} | undefined>) => {
    let currentSessionPublicKey = sessionPublicKey;
    let currentSessionToken = sessionToken;

    if (!currentSessionPublicKey || !currentSessionToken || !createSession) {
      const targetProgramId = new PublicKey("CDDMdCAWB5AXgvEy7XJRggAu37QPG1b9aJXndZoPUkkm");
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