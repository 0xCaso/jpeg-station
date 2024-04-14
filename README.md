# JPEG Station

This concept enables cross-chain swaps between Ethereum NFTs and Bitcoin Ordinals leveraging NEAR Chain Abstraction.

![alpha badge](https://img.shields.io/badge/status-alpha-red)
[![PRs welcome](https://img.shields.io/badge/PRs-welcome-green)](https://github.com/near-examples/near-multichain/pulls)
[![Chain Signatures Docs](https://img.shields.io/badge/Chain_Signatures_Docs-blue)](https://docs.near.org/concepts/abstraction/chain-signatures)
[![Dev Support](https://img.shields.io/badge/DEV_SUPPORT-red)](https://t.me/neardev)

Examples for signing and executing transactions across multiple blockchain protocols from one NEAR account. 

---

## Requirements

- `npm` or `yarn`
- NEAR `testnet` account using [MyNEARWallet](https://mynearwallet.com/)

## Installation

```bash
npm install # or yarn
npm run dev # or yarn dev
```

> [!CAUTION]
> Chain Signatures are currently in `alpha` and should only be used in a `testnet` environment.


## LINKS
da fe
- OK | derive eth/btc accounts from near accounts (and contract)
- fare transfer nft e ordinal con nearSdk
- call contract createOrder, acceptOrder, finalizaNft, finalizeOrdinal
  - OK | createOrder
  - acceptOrder

at the end:
- OK | deploy NFT su testnets
  - nft on sepolia eth testnet https://sepolia.etherscan.io/address/0xaef7a38b35277b3060321a1a1044cce53585b59a#code
  - ordinal on btc testnet
    - https://testnet.unisat.io/inscription/0f7ea6b3f6b82c8fe8d1d4e7c570292c4a77e0e43e157f0d6fa6bbc813bd2aeai0
    - https://testnet.unisat.io/inscription/cb1c55e76d0ae3cf782947e5463c3db5607252ae4ce5ee14ae11806b2c5b8364i0
