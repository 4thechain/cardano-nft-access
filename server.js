// --- Node.js Backend (Express) ---
// Run: npm install express axios cors
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 3001;

// alternatively you can run blockfrost on you own infra https://github.com/blockfrost/blockfrost-backend-ryo
const BLOCKFROST_API_KEY = process.env.BLOCKFROST_API_KEY || 'YOUR_BLOCKFROST_API_KEY';
const POLICY_ID = 'b97859c71e4e73af3ae83c30a3172c434c43041f6ff19c297fb76094'; // Replace with your NFT collection policy ID


console.info("Using Blockfrost API Key: ", BLOCKFROST_API_KEY);

app.use(cors());
app.use(express.json());

async function getStakeAddress(walletAddress) {
  const addressDetailsResponse = await axios.get(
    `https://cardano-mainnet.blockfrost.io/api/v0/addresses/${walletAddress}`,
    {headers: {project_id: BLOCKFROST_API_KEY}}
  );
  return addressDetailsResponse.data.stake_address;
}

async function getAccountAssets(stakeAddress) {
  const utxosResponse = await axios.get(
    `https://cardano-mainnet.blockfrost.io/api/v0/accounts/${stakeAddress}/utxos`,
    {headers: {project_id: BLOCKFROST_API_KEY}}
  );
  const utxos = utxosResponse.data;
  return utxos.flatMap((utxo) => utxo.amount);
}

async function checkPolicyOwnershipMiddleware(req, res, next) {
  const walletAddress = req.headers['address'];

  if (!walletAddress) {
    return res.status(400).json({error: 'Wallet address is required.'});
  }

  try {
    const stakeAddress = await getStakeAddress(walletAddress);
    const ownedAssets = await getAccountAssets(stakeAddress);
    const ownsFromPolicy = ownedAssets.some((a) => a.unit.startsWith(POLICY_ID));

    if (!ownsFromPolicy) {
      return res.status(403).json({error: 'Access denied. Wallet does not own any asset from the required policy.'});
    }

    req.stakeAddress = stakeAddress;
    req.ownedAssets = ownedAssets;
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({error: 'Error validating policy ownership.'});
  }
}

// Check if wallet has any NFTs under the specified policy
app.post('/check-access', checkPolicyOwnershipMiddleware, async (req, res) => {
  res.json({access: true});
});

// Get metadata of the first NFT under the specified policy owned by the wallet
app.get('/asset', checkPolicyOwnershipMiddleware, async (req, res) => {
  try {
    const asset = req.ownedAssets.find((a) => a.unit.startsWith(POLICY_ID));
    if (!asset) return res.status(404).json({error: 'No asset from the policy found.'});

    const metadataResponse = await axios.get(
      `https://cardano-mainnet.blockfrost.io/api/v0/assets/${asset.unit}`,
      {headers: {project_id: BLOCKFROST_API_KEY}}
    );

    res.json(metadataResponse.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({error: 'Error fetching asset metadata.'});
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
