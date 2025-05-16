# 🛡️ NFT Access Checker (Cardano)

A simple Node.js and Vite app that uses Blockfrost to check if a Cardano wallet (eternl) owns any NFT under a specific
policy ID.

## 📦 Features

- ✅ Verifies NFT ownership using wallet address (via stake address)
- ✅ Restricts API access to NFT holders of a specific policy ID
- ✅ Returns metadata for the first matching NFT
- ✅ Uses middleware to enforce access control
- 🔐 Inspired by Web3 token-gated access patterns

---

## 🚀 Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/4thechain/nft-access-checker.git
cd nft-access-checker
npm install
cd frontend
npm install
```

### 2. Configure

Edit `server.js` and set:

```js
const BLOCKFROST_API_KEY = 'your-blockfrost-project-id';
const POLICY_ID = 'your-nft-policy-id'; // from your NFT collection
```

> 📝 You can get a Blockfrost API key at [blockfrost.io](https://blockfrost.io/).

You can also set BLOCKFROST_API_KEY as an environment variable

This code is indented to work with a World Mobile ENNFT. Other nfts might not have a image or name.

### 3. Run

```bash
// run backend
node server.js

// run fronend in other window
npm run dev
```

---

## 🧪 Endpoints

### `GET /check-access`

**Headers:**

- `address`: the bech32 wallet address to check

**Returns:**

```json
{
    "access": true
}
```

...or 403 if the wallet doesn't hold an NFT from the policy.

---

### `GET /asset`

**Headers:**

- `address`: the wallet address

**Returns:**

```json
{
    "asset": "policyid.tokenname",
    "onchain_metadata": {
        "name": "...",
        "image": "ipfs://...",
        ...
    },
    ...
}
```

Returns metadata for the **first NFT under the configured policy** found in the wallet.

---

## 🛡️ Security

- Ownership checks are enforced **server-side** via middleware.
- Requests are gated by wallet address; future versions could replace this with JWTs.

---

## 📚 Dependencies

- [Express](https://expressjs.com/)
- [Axios](https://axios-http.com/)
- [Blockfrost API](https://blockfrost.io/)
- [MeshSDK - Browser Wallet](https://meshjs.dev/apis/wallets/browserwallet)
- [Vite](https://vite.dev/)

---

## 🧭 Roadmap

- [ ] JWT or signature-based verification
- [ ] Return all NFTs under the policy
- [ ] Better error handling
- [ ] Add support for other wallets

---

## 🧠 Author

Built by Kris @ 4thechain — feel free to fork, extend, or use in your DApp!

---

## 📄 License

MIT
