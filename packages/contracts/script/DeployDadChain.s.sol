// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/DadChainCore.sol";
import "../src/DadJokesNFT.sol";

contract DeployDadChain is Script {
    function run() external returns (DadChainCore, DadJokesNFT) {
        // Alamat resmi USDC di Base Sepolia Testnet
        address usdcSepolia = 0x036CbD53842c5426634e7929541eC2318f3dCF7e;

        string memory baseURI = "ipfs://bafybeieh5yr4wff36kc7avoftmfspzmcr4juicjpnh64n6isb3tnx3qzpy/"; // Ganti dengan CID metadata Anda nanti

        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployerAddress = vm.addr(deployerPrivateKey);

        vm.startBroadcast(deployerPrivateKey);

        console.log("Deploying DadJokesNFT...");
        // Constructor: constructor(address _initialOwner, string memory baseTokenURI_)
        DadJokesNFT nft = new DadJokesNFT(deployerAddress, baseURI);
        console.log("DadJokesNFT deployed to:", address(nft));

        console.log("Deploying DadChainCore...");
        // Constructor: constructor(address _usdcTokenAddress)
        DadChainCore core = new DadChainCore(usdcSepolia);
        console.log("DadChainCore deployed to:", address(core));

        // Langkah Konfigurasi #1: Atur alamat NFT di DadChainCore
        console.log("Setting NFT contract address on DadChainCore...");
        core.setNftContractAddress(address(nft));

        // Langkah Konfigurasi #2: Atur DadChainCore sebagai satu-satunya minter di kontrak NFT
        console.log("Setting minter on DadJokesNFT...");
        nft.setMinter(address(core));
        console.log("Minter set to DadChainCore address.");

        vm.stopBroadcast();

        return (core, nft);
    }
}
