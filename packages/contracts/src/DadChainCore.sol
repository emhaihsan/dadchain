// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface INFTContract {
    function mint(address recipient, uint256 tokenId) external;
}

contract DadChainCore is Ownable {
    // === STRUCTS ===

    struct Joke {
        uint256 id;
        address creator;
        string content;
        string imageURI; // URI untuk gambar lelucon (misalnya, IPFS)
        uint256 timestamp;
        uint256 likeCount;
        uint256 tipAmount; // Total USDC tipped
    }

    struct UserProfile {
        uint256 jokeCount;
        uint256 totalLikesReceived;
        uint256 totalTipsReceived; // Total USDC received
        mapping(uint256 => bool) claimedBadges;
    }

    // === STATE VARIABLES ===

    IERC20 public usdcToken;
    address public nftContractAddress;

    mapping(uint256 => Joke) public jokes;
    mapping(address => UserProfile) public userProfiles;
    mapping(uint256 => mapping(address => bool)) public hasLiked;
    mapping(address => bool) private hasInteracted;

    uint256 public totalJokes;
    uint256 public totalTips; // Total tips across the platform
    uint256 public totalUsers; // Total unique users who have interacted

    // === EVENTS ===

    event JokeSubmitted(uint256 indexed jokeId, address indexed creator, string content, string imageURI);
    event JokeLiked(uint256 indexed jokeId, address indexed liker);
    event JokeTipped(uint256 indexed jokeId, address indexed tipper, address indexed creator, uint256 amount);
    event BadgeClaimed(address indexed user, uint256 indexed badgeId);

    // === CONSTRUCTOR ===

    constructor(address _usdcTokenAddress) Ownable(msg.sender) {
        usdcToken = IERC20(_usdcTokenAddress);
    }

    // === MUTATIVE FUNCTIONS ===

    function submitJoke(string memory _content, string memory _imageURI) external {
        _handleFirstInteraction(msg.sender);

        totalJokes++;
        uint256 newJokeId = totalJokes;

        jokes[newJokeId] = Joke({
            id: newJokeId,
            creator: msg.sender,
            content: _content,
            imageURI: _imageURI,
            timestamp: block.timestamp,
            likeCount: 0,
            tipAmount: 0
        });

        userProfiles[msg.sender].jokeCount++;

        emit JokeSubmitted(newJokeId, msg.sender, _content, _imageURI);
    }

    function likeJoke(uint256 _jokeId) external {
        require(jokes[_jokeId].id != 0, "Joke does not exist");
        require(jokes[_jokeId].creator != msg.sender, "Cannot like your own joke");
        require(!hasLiked[_jokeId][msg.sender], "Already liked");

        _handleFirstInteraction(msg.sender);

        jokes[_jokeId].likeCount++;
        userProfiles[jokes[_jokeId].creator].totalLikesReceived++;
        hasLiked[_jokeId][msg.sender] = true;

        emit JokeLiked(_jokeId, msg.sender);
    }

    function tipJoke(uint256 _jokeId, uint256 _amount) external {
        require(jokes[_jokeId].id != 0, "Joke does not exist");
        require(_amount > 0, "Tip amount must be greater than zero");
        require(jokes[_jokeId].creator != msg.sender, "Cannot tip your own joke");

        _handleFirstInteraction(msg.sender);

        address creator = jokes[_jokeId].creator;

        // Transfer USDC from tipper to creator
        bool success = usdcToken.transferFrom(msg.sender, creator, _amount);
        require(success, "USDC transfer failed");

        // Update state
        jokes[_jokeId].tipAmount += _amount;
        userProfiles[creator].totalTipsReceived += _amount;
        totalTips += _amount;

        emit JokeTipped(_jokeId, msg.sender, creator, _amount);
    }

    function claimBadge(uint256 _badgeId) external {
        require(nftContractAddress != address(0), "NFT contract not set");
        UserProfile storage user = userProfiles[msg.sender];
        require(!user.claimedBadges[_badgeId], "Badge already claimed");

        bool eligible = false;
        if (_badgeId == 1) {
            // Bronze Badge: 1 Joke
            if (user.jokeCount >= 1) eligible = true;
        } else if (_badgeId == 2) {
            // Silver Badge: 5 Jokes
            if (user.jokeCount >= 5) eligible = true;
        } else if (_badgeId == 3) {
            // Gold Badge: 10 Jokes
            if (user.jokeCount >= 10) eligible = true;
        }

        require(eligible, "Not eligible for this badge");

        user.claimedBadges[_badgeId] = true;
        INFTContract(nftContractAddress).mint(msg.sender, _badgeId);

        emit BadgeClaimed(msg.sender, _badgeId);
    }

    // === VIEW FUNCTIONS ===

    /**
     * @notice Fetches a paginated list of jokes, for the infinite scroll feed.
     * @param _cursor The ID of the last joke fetched. For the first page, this should be 0.
     * @param _pageSize The number of jokes to fetch.
     * @return An array of Joke structs.
     */
    function getJokesPaginated(uint256 _cursor, uint256 _pageSize) external view returns (Joke[] memory) {
        uint256 jokesToFetch = _pageSize;
        uint256 end = (_cursor == 0 || _cursor > totalJokes) ? totalJokes : _cursor - 1;

        if (jokesToFetch > end) {
            jokesToFetch = end;
        }

        Joke[] memory result = new Joke[](jokesToFetch);
        for (uint256 i = 0; i < jokesToFetch; i++) {
            result[i] = jokes[end - i];
        }

        return result;
    }

    /**
     * @notice Gets the profile statistics for a given user.
     * @param _user The address of the user.
     * @return jokeCount, totalLikesReceived, totalTipsReceived.
     */
    function getUserProfile(address _user) external view returns (uint256, uint256, uint256) {
        UserProfile storage profile = userProfiles[_user];
        return (profile.jokeCount, profile.totalLikesReceived, profile.totalTipsReceived);
    }

    // === PRIVATE HELPER FUNCTIONS ===

    function _handleFirstInteraction(address _user) private {
        if (!hasInteracted[_user]) {
            hasInteracted[_user] = true;
            totalUsers++;
        }
    }

    function hasUserClaimedBadge(address _user, uint256 _badgeId) external view returns (bool) {
        return userProfiles[_user].claimedBadges[_badgeId];
    }

    // === RESTRICTED FUNCTIONS ===

    function setNftContractAddress(address _nftContractAddress) external onlyOwner {
        nftContractAddress = _nftContractAddress;
    }
}
