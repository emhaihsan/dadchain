# DadChain 👨‍👧‍👦

Welcome to **DadChain**, the world's first fully decentralized dad joke platform, built for the MetaMask Card Hackathon.

DadChain is a social dApp where users can submit their best (or worst) dad jokes, receive likes from the community, and build an on-chain reputation as the ultimate dad joke master. The platform leverages smart contracts to ensure transparency and decentralization for all interactions.

---

## 🚀 Tech Stack

This project is a monorepo containing two main packages:

- **Frontend (`packages/next-app`):**

  - **Framework:** [Next.js](https://nextjs.org/) 15
  - **Language:** [TypeScript](https://www.typescriptlang.org/)
  - **Web3:** [Wagmi](https://wagmi.sh/) & [Viem](https://viem.sh/) for wallet connection and smart contract interaction.
  - **Styling:** [Tailwind CSS](https://tailwindcss.com/) with [Radix UI](https://www.radix-ui.com/) for accessible components.

- **Smart Contracts (`packages/contracts`):**
  - **Language:** [Solidity](https://soliditylang.org/) (^0.8.20)
  - **Framework:** [Foundry](https://getfoundry.sh/) for compiling, testing, and deploying contracts.

---

## 📂 Project Structure

The repository is structured as a monorepo to keep the frontend and smart contracts separate but managed under a single project.

```
dadchain-web3-dapp/
├── .gitignore
├── packages/
│   ├── contracts/      # Foundry smart contract project
│   └── next-app/       # Next.js frontend application
└── README.md
```

---

## 🛠️ Getting Started

Follow these steps to set up and run the project locally.

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v18 or later)
- [Foundry](https://getfoundry.sh/) (for smart contract development)

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/emhaihsan/dadchain.git
    cd dadchain-web3-dapp
    ```

2.  **Install frontend dependencies:**

    ```bash
    cd packages/next-app
    npm install
    cd ../..
    ```

3.  **Build the smart contracts:**
    This will also install the required `forge-std` library.
    ```bash
    cd packages/contracts
    forge build
    cd ../..
    ```

### Running the Application

1.  **Start a local blockchain (Anvil):**
    Open a new terminal window and run:

    ```bash
    anvil
    ```

    This will start a local Ethereum node. Keep this terminal running.

2.  **Deploy the smart contracts (optional, for local testing):**
    In another terminal, run the deploy script (we will create this later).

3.  **Start the Next.js development server:**
    In your main terminal:

    ```bash
    cd packages/next-app
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

---

## 🧪 Running Tests

To run the smart contract tests, navigate to the contracts directory and use Foundry's test command:

```bash
cd packages/contracts
forge test
```
