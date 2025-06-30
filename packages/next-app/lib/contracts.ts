import DadChainCoreABI from '@/lib/abi/DadChainCore.json';
import DadJokesNFTABI from '@/lib/abi/DadJokesNFT.json';

/**
 * Configuration for the DadChainCore smart contract.
 * Includes the contract address and ABI.
 * The `as const` assertion ensures type safety with wagmi hooks.
 */
export const dadChainCoreContract = {
  address: '0xbe1dc08699eb5a690538023aaabe7ef6079f3092',
  abi: DadChainCoreABI,
} as const;

/**
 * Configuration for the DadJokesNFT smart contract.
 * Includes the contract address and ABI.
 * The `as const` assertion ensures type safety with wagmi hooks.
 */
export const dadJokesNFTContract = {
  address: '0x3be38ecfdb3283a6de4e2af335e2bd054393647a',
  abi: DadJokesNFTABI,
} as const;
