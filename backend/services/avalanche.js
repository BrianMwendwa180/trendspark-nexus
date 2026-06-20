import { createWalletClient, http, parseEther } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { avalancheFuji } from 'viem/chains';
import dotenv from 'dotenv';

dotenv.config();

// Ensure we have a valid key, otherwise mock or throw.
// For safety, we fall back to a dummy key if running in dev without a real key
const privateKeyHex = process.env.AVAX_REWARD_PRIVATE_KEY || '0x0000000000000000000000000000000000000000000000000000000000000001';

const account = privateKeyToAccount(privateKeyHex.startsWith('0x') ? privateKeyHex : `0x${privateKeyHex}`);

const client = createWalletClient({
  account,
  chain: avalancheFuji,
  transport: http(),
});

/**
 * Send a micro-reward to the trend scout
 * @param {string} scoutAddress - The 0x... EVM address
 * @param {string} amountInAvax - Amount in AVAX (e.g. '0.01')
 * @returns {Promise<string>} txHash
 */
export async function rewardTrendScout(scoutAddress, amountInAvax = '0.01') {
  if (!process.env.AVAX_REWARD_PRIVATE_KEY) {
    console.warn('⚠️ No AVAX_REWARD_PRIVATE_KEY found. Mocking transaction.');
    // Mock for local testing without real funds
    return `0xmocktxhash_${Date.now()}`;
  }

  try {
    const hash = await client.sendTransaction({
      to: scoutAddress,
      value: parseEther(amountInAvax),
    });
    console.log(`✅ Reward of ${amountInAvax} AVAX sent to ${scoutAddress}. Tx: ${hash}`);
    return hash;
  } catch (error) {
    console.error('Avalanche transaction failed:', error);
    throw new Error('Failed to send reward');
  }
}
