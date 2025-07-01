import DadChainCoreABI from '@/lib/abi/DadChainCore.json';
import DadJokesNFTABI from '@/lib/abi/DadJokesNFT.json';

// Minimal ERC20 ABI for the 'approve' function
const erc20Abi = [
  {
    "constant": false,
    "inputs": [
      { "name": "spender", "type": "address" },
      { "name": "value", "type": "uint256" }
    ],
    "name": "approve",
    "outputs": [
      { "name": "", "type": "bool" }
    ],
    "type": "function"
  }
] as const;

/**
 * Configuration for the DadChainCore smart contract.
 * Includes the contract address and ABI.
 * The `as const` assertion ensures type safety with wagmi hooks.
 */
export const dadChainCoreContract = {
  address: '0x5Ce9Be8630781ff9179D1d972D1341c1E832f5e2',
  abi: DadChainCoreABI,
} as const;

/**
 * Configuration for the DadJokesNFT smart contract.
 * Includes the contract address and ABI.
 * The `as const` assertion ensures type safety with wagmi hooks.
 */
export const dadJokesNFTContract = {
  address: '0x0871c553fed4E59BA8B53486522888A17f66946d',
  abi: DadJokesNFTABI,
} as const;

export const usdcContract = {
  address: '0x036CbD53842c5426634e7929541eC2318f3dCF7e',
  abi: erc20Abi,
} as const;
