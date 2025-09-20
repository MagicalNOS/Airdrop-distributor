# ERC20 Airdrop Application

A modern, user-friendly React application for distributing ERC20 tokens to multiple recipients in a single transaction. Built with TypeScript, Wagmi, and Tailwind CSS.

## 🚀 Features

- **Batch Token Distribution**: Send ERC20 tokens to multiple recipients in one transaction
- **Auto Token Detection**: Automatically fetches token name, symbol, and decimals
- **Gas Estimation**: Real-time gas estimation for transactions
- **Form Persistence**: Automatically saves form data to localStorage
- **Transaction Management**: Handles token approval and airdrop transactions seamlessly
- **Responsive UI**: Clean, modern interface with hover effects and animations
- **Multi-chain Support**: Configurable for different blockchain networks

## 🛠️ Technology Stack

- **React 18** with TypeScript
- **Wagmi** for Ethereum interactions
- **Viem** for blockchain utilities
- **Tailwind CSS** for styling
- **React Spinners** for loading indicators

## 📦 Installation

```bash
# Clone the repository
git clone <repository-url>

# Install dependencies
npm install

# Start the development server
npm run dev
```

## 🔧 Configuration

### Required Dependencies

Make sure you have these dependencies installed:

```json
{
  "react": "^18.0.0",
  "wagmi": "^2.0.0",
  "viem": "^2.0.0",
  "react-spinners": "^0.13.0"
}
```

### Constants Configuration

You'll need to create a `constants.ts` file with:

```typescript
// Chain configurations
export const chainsToTSender = {
  1: { // Ethereum Mainnet
    tsender: "0x..." // Your TSender contract address
  },
  // Add other supported chains
};

// TSender contract ABI
export const tsenderAbi = [
  // Your TSender contract ABI
];

// Standard ERC20 ABI
export const erc20Abi = [
  // Standard ERC20 functions: name, symbol, decimals, allowance, approve
];
```

## 🎯 Usage

### Basic Workflow

1. **Connect Wallet**: Ensure your wallet is connected to the application
2. **Enter Token Address**: Input the ERC20 token contract address
3. **Add Recipients**: Enter recipient addresses (comma or newline separated)
4. **Specify Amounts**: Enter amounts in token units (not wei)
5. **Review Details**: Check the airdrop summary including gas estimates
6. **Submit**: The app will handle approval (if needed) and execute the airdrop

### Input Formats

**Recipients:**
```
0x1234567890123456789012345678901234567890,
0xabcdefabcdefabcdefabcdefabcdefabcdefabcd,
0x9876543210987654321098765432109876543210
```

**Amounts:**
```
100.5,
250.75,
1000
```

### Features in Detail

#### Auto Token Detection
The app automatically fetches:
- Token name (e.g., "Chainlink Token")
- Token symbol (e.g., "LINK")
- Token decimals (e.g., 18)

#### Form Persistence
All form data is automatically saved to localStorage:
- `airdropForm_tokenAddress`
- `airdropForm_recipients`  
- `airdropForm_amounts`

#### Gas Estimation
Real-time gas estimation helps users understand transaction costs before execution.

#### Smart Transaction Handling
1. Checks current token allowance
2. Requests approval if insufficient allowance
3. Waits for approval confirmation
4. Executes airdrop transaction
5. Waits for final confirmation

## 🔐 Security Considerations

- Always verify token addresses before use
- Review recipient lists carefully
- Test with small amounts first
- Ensure sufficient token balance and ETH for gas
- Double-check amounts - they're irreversible once sent

## 🧪 Error Handling

The application handles various error scenarios:

- **Invalid Token Address**: Shows "Unknown Token" for invalid addresses
- **Insufficient Allowance**: Automatically requests approval
- **Network Issues**: Clear error messages for connectivity problems
- **Transaction Failures**: Detailed error reporting
- **Invalid Input Formats**: Validation and error messages

## 🎨 UI Components

### Main Form
- Clean, card-based layout
- Responsive design
- Smooth animations and transitions
- Loading states with spinners

### Airdrop Details Box
- Token information display
- Total amount calculations
- Gas estimation
- Styled with blue theme for important information

## 🔧 Customization

### Styling
The app uses Tailwind CSS with a modern design:
- Gradient buttons
- Shadow effects
- Hover animations
- Responsive layouts

### Network Support
Add new networks by updating the `chainsToTSender` configuration:

```typescript
export const chainsToTSender = {
  1: { tsender: "0x..." },      // Ethereum
  137: { tsender: "0x..." },    // Polygon
  56: { tsender: "0x..." },     // BSC
  // Add more networks
};
```

## 📋 Requirements

- **Node.js** 16+ 
- **Modern Browser** with wallet extension
- **Wallet Connection** (MetaMask, WalletConnect, etc.)
- **TSender Contract** deployed on target networks

## 🚨 Important Notes

- **Test First**: Always test with small amounts on testnets
- **Gas Fees**: Ensure sufficient ETH for transaction costs
- **Token Balance**: Verify sufficient token balance before airdrop
- **Network Match**: Ensure wallet is on the correct network
- **Recipient Validation**: Double-check all recipient addresses

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 🆘 Support

For issues and questions:
1. Check the browser console for detailed errors
2. Verify network connection and wallet status
3. Ensure correct contract addresses and ABIs
4. Review token balance and allowances

---

**⚠️ Disclaimer**: This application handles cryptocurrency transactions. Users are responsible for verifying all information and understanding the risks involved. Always test with small amounts first.