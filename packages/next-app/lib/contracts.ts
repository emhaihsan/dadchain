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

export const usdcContract = {
  address: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7a98',
  abi: erc20Abi,
} as const;
