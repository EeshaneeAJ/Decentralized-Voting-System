module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",     // Localhost (Ganache)
      port: 7545,            // Port Ganache is listening on
      network_id: "*",       // Match any network id
      type: '0x0',
      gas: 6721975,          // Gas limit (you can adjust if needed)
      gasPrice: 20000000000, // Gas price (in wei)
    },
    sepolia: {
      provider: () => new HDWalletProvider({
        mnemonic,
        providerOrUrl: 'https://eth-sepolia.g.alchemy.com/v2/your-alchemy-key',
        chainId: 11155111,
      }),
      network_id: 11155111,
      gas: 6721975,
      gasPrice: 20000000000,
      confirmations: 2,
      timeoutBlocks: 50,
    },
  },
  compilers: {
  solc: {
    version: "0.5.16", // Your contract's Solidity version
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
}

};