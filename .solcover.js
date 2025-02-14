module.exports = {
  skipFiles: [],
  compileCommand: "pnpm build",
  providerOptions: {
    default_balance_ether: 10000000000000000000000,
    allowUnlimitedContractSize: true,
    chain: 1337,
    networkId: 1337,
  },
  mocha: {
    color: false,
    noColors: true,
  },
  norpc: true,
  testCommand: "pnpm coverage:contracts",
};
