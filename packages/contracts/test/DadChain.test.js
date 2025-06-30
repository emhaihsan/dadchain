const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

describe("DadChain Platform", function () {
  // We define a fixture to reuse the same setup in every test. We use
  // loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployContractsFixture() {
    // Get signers
    const [owner, user1, user2] = await ethers.getSigners();

    // Deploy MockUSDC
    const MockERC20 = await ethers.getContractFactory("MockERC20");
    const usdc = await MockERC20.deploy("Mock USDC", "mUSDC", 6);
    await usdc.waitForDeployment();

    // Deploy DadJokesNFT
    const DadJokesNFT = await ethers.getContractFactory("DadJokesNFT");
    const nft = await DadJokesNFT.deploy(owner.address, "ipfs://base-uri/");
    await nft.waitForDeployment();

    // Deploy DadChainCore
    const DadChainCore = await ethers.getContractFactory("DadChainCore");
    const core = await DadChainCore.deploy(await usdc.getAddress());
    await core.waitForDeployment();

    // Post-deployment setup
    await core.connect(owner).setNftContractAddress(await nft.getAddress());
    await nft.connect(owner).setMinter(await core.getAddress());

    // Distribute some mock USDC to users
    await usdc.mint(user1.address, ethers.parseUnits("1000", 6));
    await usdc.mint(user2.address, ethers.parseUnits("1000", 6));

    return { core, nft, usdc, owner, user1, user2 };
  }

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      const { core, nft, owner } = await loadFixture(deployContractsFixture);
      expect(await core.owner()).to.equal(owner.address);
      expect(await nft.owner()).to.equal(owner.address);
    });

    it("Should set the correct USDC and NFT contract addresses", async function () {
      const { core, nft, usdc } = await loadFixture(deployContractsFixture);
      expect(await core.usdcToken()).to.equal(await usdc.getAddress());
      expect(await core.nftContractAddress()).to.equal(await nft.getAddress());
    });

    it("Should set the DadChainCore contract as the minter for the NFT", async function () {
      const { core, nft } = await loadFixture(deployContractsFixture);
      expect(await nft.minter()).to.equal(await core.getAddress());
    });

    it("Should allow owner to set a new base URI for NFTs", async function () {
      const { nft, owner, user1 } = await loadFixture(deployContractsFixture);
      const newURI = "ipfs://new-cool-uri/";

      await nft.connect(owner).setBaseURI(newURI);

      // Mint a token to test the tokenURI
      await nft.connect(owner).setMinter(owner.address); // Temporarily set owner as minter for test
      await nft.connect(owner).mint(user1.address, 1);

      expect(await nft.tokenURI(1)).to.equal(`${newURI}1`);
    });

    it("Should prevent non-owner from setting a new base URI", async function () {
      const { nft, user1 } = await loadFixture(deployContractsFixture);
      const newURI = "ipfs://hacker-uri/";
      await expect(nft.connect(user1).setBaseURI(newURI))
        .to.be.revertedWithCustomError(nft, "OwnableUnauthorizedAccount")
        .withArgs(user1.address);
    });
  });

  describe("Core Functionality", function () {
    it("Should allow a user to submit a joke", async function () {
      const { core, user1 } = await loadFixture(deployContractsFixture);
      const jokeContent =
        "Why did the scarecrow win an award? Because he was outstanding in his field!";
      const imageURI = "ipfs://test-image-uri";

      await expect(core.connect(user1).submitJoke(jokeContent, imageURI))
        .to.emit(core, "JokeSubmitted")
        .withArgs(1, user1.address, jokeContent, imageURI);

      const joke = await core.jokes(1);
      expect(joke.creator).to.equal(user1.address);
      expect(joke.content).to.equal(jokeContent);
      expect(joke.imageURI).to.equal(imageURI);
      expect(await core.totalJokes()).to.equal(1);

      const userProfile = await core.getUserProfile(user1.address);
      expect(userProfile[0]).to.equal(1); // jokeCount
    });

    it("Should track unique users correctly", async function () {
      const { core, user1, user2 } = await loadFixture(deployContractsFixture);
      expect(await core.totalUsers()).to.equal(0);

      // First interaction for user1
      await core
        .connect(user1)
        .submitJoke("First joke", "ipfs://first-joke-uri");
      expect(await core.totalUsers()).to.equal(1);

      // Second interaction for user1, should not increment totalUsers
      await core
        .connect(user1)
        .submitJoke("Second joke", "ipfs://second-joke-uri");
      expect(await core.totalUsers()).to.equal(1);

      // First interaction for user2
      await core
        .connect(user2)
        .submitJoke("User 2's joke", "ipfs://user2-joke-uri");
      expect(await core.totalUsers()).to.equal(2);
    });

    it("Should allow a user to like a joke", async function () {
      const { core, user1, user2 } = await loadFixture(deployContractsFixture);
      await core
        .connect(user1)
        .submitJoke("A joke to be liked", "ipfs://like-joke-uri");

      await expect(core.connect(user2).likeJoke(1))
        .to.emit(core, "JokeLiked")
        .withArgs(1, user2.address);

      const joke = await core.jokes(1);
      expect(joke.likeCount).to.equal(1);

      const creatorProfile = await core.getUserProfile(user1.address);
      expect(creatorProfile[1]).to.equal(1); // totalLikesReceived
    });

    it("Should prevent a user from liking their own joke", async function () {
      const { core, user1 } = await loadFixture(deployContractsFixture);
      await core.connect(user1).submitJoke("A joke", "ipfs://own-joke-uri");
      await expect(core.connect(user1).likeJoke(1)).to.be.revertedWith(
        "Cannot like your own joke"
      );
    });

    it("Should prevent a user from liking a joke twice", async function () {
      const { core, user1, user2 } = await loadFixture(deployContractsFixture);
      await core.connect(user1).submitJoke("A joke", "ipfs://like-joke-uri");
      await core.connect(user2).likeJoke(1);
      await expect(core.connect(user2).likeJoke(1)).to.be.revertedWith(
        "Already liked"
      );
    });

    it("Should allow a user to tip a joke", async function () {
      const { core, usdc, user1, user2 } = await loadFixture(
        deployContractsFixture
      );
      await core
        .connect(user1)
        .submitJoke("A tip-worthy joke", "ipfs://tip-joke-uri");

      const tipAmount = ethers.parseUnits("10", 6);
      await usdc.connect(user2).approve(await core.getAddress(), tipAmount);

      const user1BalanceBefore = await usdc.balanceOf(user1.address);
      const user2BalanceBefore = await usdc.balanceOf(user2.address);

      await expect(core.connect(user2).tipJoke(1, tipAmount))
        .to.emit(core, "JokeTipped")
        .withArgs(1, user2.address, user1.address, tipAmount);

      const joke = await core.jokes(1);
      expect(joke.tipAmount).to.equal(tipAmount);

      const creatorProfile = await core.getUserProfile(user1.address);
      expect(creatorProfile[2]).to.equal(tipAmount); // totalTipsReceived

      expect(await core.totalTips()).to.equal(tipAmount);

      // Check balances
      expect(await usdc.balanceOf(user1.address)).to.equal(
        user1BalanceBefore + tipAmount
      );
      expect(await usdc.balanceOf(user2.address)).to.equal(
        user2BalanceBefore - tipAmount
      );
    });

    it("Should prevent tipping a non-existent joke", async function () {
      const { core, user2 } = await loadFixture(deployContractsFixture);
      const tipAmount = ethers.parseUnits("10", 6);
      await expect(
        core.connect(user2).tipJoke(99, tipAmount)
      ).to.be.revertedWith("Joke does not exist");
    });

    it("Should return paginated jokes correctly", async function () {
      const { core, user1 } = await loadFixture(deployContractsFixture);
      for (let i = 0; i < 15; i++) {
        await core
          .connect(user1)
          .submitJoke(`Joke ${i}`, `ipfs://joke-uri-${i}`);
      }

      // Get first page
      let jokes = await core.getJokesPaginated(0, 5);
      expect(jokes.length).to.equal(5);
      expect(jokes[0].id).to.equal(15);
      expect(jokes[4].id).to.equal(11);

      // Get second page using cursor from the first page
      let cursor = jokes[4].id;
      jokes = await core.getJokesPaginated(cursor, 5);
      expect(jokes.length).to.equal(5);
      expect(jokes[0].id).to.equal(10);
      expect(jokes[4].id).to.equal(6);
    });

    it("Should handle pagination when pageSize is larger than available jokes", async function () {
      const { core, user1 } = await loadFixture(deployContractsFixture);
      for (let i = 0; i < 3; i++) {
        await core
          .connect(user1)
          .submitJoke(`Joke ${i}`, `ipfs://small-batch-${i}`);
      }

      // Request 10 jokes, but only 3 exist
      let jokes = await core.getJokesPaginated(0, 10);
      expect(jokes.length).to.equal(3);
      expect(jokes[0].id).to.equal(3);
      expect(jokes[2].id).to.equal(1);
    });
  });

  describe("Badge Claiming", function () {
    it("Should allow an eligible user to claim a badge", async function () {
      const { core, nft, user1 } = await loadFixture(deployContractsFixture);
      // User submits 1 joke to be eligible for badge 1
      await core
        .connect(user1)
        .submitJoke("First joke", "ipfs://first-joke-uri");

      await expect(core.connect(user1).claimBadge(1))
        .to.emit(core, "BadgeClaimed")
        .withArgs(user1.address, 1);

      expect(await nft.ownerOf(1)).to.equal(user1.address);
    });

    it("Should prevent a user from claiming a badge they are not eligible for", async function () {
      const { core, user1 } = await loadFixture(deployContractsFixture);
      // User has 0 jokes, not eligible for badge 1
      await expect(core.connect(user1).claimBadge(1)).to.be.revertedWith(
        "Not eligible for this badge"
      );
    });

    it("Should prevent a user from claiming a badge twice", async function () {
      const { core, user1 } = await loadFixture(deployContractsFixture);
      await core.connect(user1).submitJoke("A joke", "ipfs://a-joke-uri");
      await core.connect(user1).claimBadge(1);
      await expect(core.connect(user1).claimBadge(1)).to.be.revertedWith(
        "Badge already claimed"
      );
    });

    it("Should mint the correct badge based on criteria", async function () {
      const { core, nft, user1 } = await loadFixture(deployContractsFixture);
      for (let i = 0; i < 10; i++) {
        await core
          .connect(user1)
          .submitJoke(`Joke #${i + 1}`, `ipfs://badge-joke-${i}`);
      }
      // User now has 10 jokes
      await core.connect(user1).claimBadge(1); // Bronze
      await core.connect(user1).claimBadge(2); // Silver
      await core.connect(user1).claimBadge(3); // Gold

      expect(await nft.ownerOf(1)).to.equal(user1.address);
      expect(await nft.ownerOf(2)).to.equal(user1.address);
      expect(await nft.ownerOf(3)).to.equal(user1.address);
    });

    it("Should correctly report if a user has claimed a badge", async function () {
      const { core, user1 } = await loadFixture(deployContractsFixture);

      // Initially, user has not claimed badge 1
      expect(await core.hasUserClaimedBadge(user1.address, 1)).to.be.false;

      // User submits a joke and claims the badge
      await core
        .connect(user1)
        .submitJoke("A joke to claim a badge", "ipfs://badge-claim-test");
      await core.connect(user1).claimBadge(1);

      // Now, user should have claimed badge 1
      expect(await core.hasUserClaimedBadge(user1.address, 1)).to.be.true;

      // User has not claimed badge 2
      expect(await core.hasUserClaimedBadge(user1.address, 2)).to.be.false;
    });
  });

  describe("View Functions", function () {
    it("Should return paginated jokes correctly", async function () {
      const { core, user1 } = await loadFixture(deployContractsFixture);
      for (let i = 0; i < 15; i++) {
        await core
          .connect(user1)
          .submitJoke(`Joke ${i}`, `ipfs://joke-uri-${i}`);
      }

      // Get first page
      let jokes = await core.getJokesPaginated(0, 5);
      expect(jokes.length).to.equal(5);
      expect(jokes[0].id).to.equal(15);
      expect(jokes[4].id).to.equal(11);

      // Get second page using cursor from the first page
      let cursor = jokes[4].id;
      jokes = await core.getJokesPaginated(cursor, 5);
      expect(jokes.length).to.equal(5);
      expect(jokes[0].id).to.equal(10);
      expect(jokes[4].id).to.equal(6);
    });
  });
});
