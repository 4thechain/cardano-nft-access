import "./init";

import './style.css';

import {BrowserWallet} from '@meshsdk/core';

window.onload = () => {
  const connectButton = document.getElementById('connectWallet');
  const checkButton = document.getElementById('checkButton');
  const result = document.getElementById('result');
  const authResult = document.getElementById('authResult');
  const imageContainer = document.createElement('div');
  authResult?.after(imageContainer);
  let wallet;

  connectButton.onclick = async () => {
    try {
      wallet = await BrowserWallet.enable('eternl'); // or 'nami', 'flint'
      const address = await wallet.getUsedAddress();
      const addressHex = address.toBech32();
      document.getElementById('walletAddress').textContent = addressHex;
      const res = await fetch('http://localhost:3001/asset/', {
        method: 'GET',
        headers: {'Content-Type': 'application/json', 'address': addressHex}
      });
      const asset = await res.json();
      if (asset.onchain_metadata?.image && asset.onchain_metadata?.mediaType?.startsWith('image/')) {
        const img = document.createElement('img');
        img.src = asset.onchain_metadata.image.replace('ipfs://', 'https://ipfs.io/ipfs/');
        img.alt = 'NFT Image';
        img.style.maxWidth = '200px';
        imageContainer.appendChild(img);
        if (asset.onchain_metadata?.name) {
          const name = document.createElement('p');
          name.textContent = `${asset.onchain_metadata.name}`;
          imageContainer.appendChild(name);
        }
        //}
      }
      result.textContent = '🔗 Wallet connected';
      connectButton.style.display = "none";
    } catch (error) {
      console.error(error);
      result.textContent = '❌ Failed to connect wallet';
    }
  };

  checkButton.onclick = async () => {
    const address = await wallet.getUsedAddress();
    const addressHex = address.toBech32();
    const res = await fetch('http://localhost:3001/check-access', {
      method: 'POST',
      headers: {'Content-Type': 'application/json', 'address': addressHex},
    });
    const data = await res.json();
    authResult.textContent = data.access ? '✅ Access GRANTED' : '❌ Access DENIED';
  };
};

