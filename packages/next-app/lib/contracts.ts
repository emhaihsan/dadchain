import { erc20Abi } from 'viem';
import DadChainCore from './abi/DadChainCore.json';
import DadJokesNFT from './abi/DadJokesNFT.json';

// --- Contract Addresses ---
// Addresses are sourced from environment variables with fallbacks for local development.
const CORE_CONTRACT_ADDRESS = (process.env.NEXT_PUBLIC_CORE_CONTRACT_ADDRESS || '0x5Ce9Be8630781ff9179D1d972D1341c1E832f5e2') as `0x${string}`;
const NFT_CONTRACT_ADDRESS = (process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS || '0x0871c553fed4E59BA8B53486522888A17f66946d') as `0x${string}`;
const USDC_ADDRESS = (process.env.NEXT_PUBLIC_USDC_ADDRESS || '0x036CbD53842c5426634e7929541eC2318f3dCF7e') as `0x${string}`;

// --- Contract Configurations ---

/**
 * Configuration for the DadChainCore smart contract.
 */
export const dadChainCoreContract = {
  address: CORE_CONTRACT_ADDRESS,
  abi: DadChainCore,
} as const;

/**
 * Configuration for the DadJokesNFT smart contract.
 */
export const dadJokesNftContract = {
  address: NFT_CONTRACT_ADDRESS,
  abi: DadJokesNFT,
} as const;

/**
 * Configuration for the mock USDC smart contract.
 */
export const usdcContract = {
  address: USDC_ADDRESS,
  abi: erc20Abi,
} as const;
