import React, { useState, useEffect } from ‘react’;
import { Menu, X, Wallet, Rocket, Droplet, TrendingUp, LifeBuoy, LayoutDashboard, Plus, Settings, ArrowRight, Upload, Check, AlertCircle, ExternalLink, Minus } from ‘lucide-react’;

const TREASURY_ADDRESS = ‘DB9YZwXgNeQByab3bgJnJKrnYP7CtZGktrdnDRCLrKA3’;

export default function IceiyLaunch() {
const [sidebarOpen, setSidebarOpen] = useState(false);
const [walletConnected, setWalletConnected] = useState(false);
const [walletAddress, setWalletAddress] = useState(’’);
const [currentPage, setCurrentPage] = useState(‘create’);
const [createStep, setCreateStep] = useState(1);
const [tokenData, setTokenData] = useState({
name: ‘’,
ticker: ‘’,
image: null,
decimals: 9,
supply: ‘’,
description: ‘’,
website: ‘’,
twitter: ‘’,
telegram: ‘’,
discord: ‘’,
revokeFreeze: false,
revokeMint: false,
revokeUpdate: false,
modifyCreator: false
});
const [userTokens, setUserTokens] = useState([]);
const [selectedToken, setSelectedToken] = useState(null);
const [liquidityAmount, setLiquidityAmount] = useState(’’);
const [userPools, setUserPools] = useState([]);

const connectWallet = async () => {
if (typeof window.solana !== ‘undefined’) {
try {
const resp = await window.solana.connect();
setWalletAddress(resp.publicKey.toString());
setWalletConnected(true);
} catch (err) {
alert(‘Failed to connect wallet. Please try again.’);
}
} else {
alert(‘Please install a Solana wallet (Phantom, Solflare, etc.)’);
}
};

const disconnectWallet = () => {
setWalletConnected(false);
setWalletAddress(’’);
};

const calculateTotalCost = () => {
let cost = 0.1; // Base creation cost
if (tokenData.revokeFreeze) cost += 0.1;
if (tokenData.revokeMint) cost += 0.1;
if (tokenData.revokeUpdate) cost += 0.1;
if (tokenData.modifyCreator) cost += 0.1;
return cost;
};

const createTransaction = async (amount) => {
if (!walletConnected) {
alert(‘Please connect your wallet first’);
return false;
}

```
try {
  const transaction = {
    from: walletAddress,
    to: TREASURY_ADDRESS,
    amount: amount
  };
  
  alert(`Transaction created: ${amount} SOL to ${TREASURY_ADDRESS}\n\nIn a real implementation, this would create an actual Solana transaction for user approval.`);
  return true;
} catch (err) {
  alert('Transaction failed. Please try again.');
  return false;
}
```

};

const handleCreateToken = async () => {
const totalCost = calculateTotalCost();
const success = await createTransaction(totalCost);

```
if (success) {
  const newToken = {
    id: Date.now(),
    ...tokenData,
    address: `${tokenData.ticker}${Math.random().toString(36).substr(2, 9)}`,
    created: new Date().toISOString(),
    hasLiquidity: false
  };
  
  setUserTokens([...userTokens, newToken]);
  alert('Token created successfully!');
  setCurrentPage('portfolio');
  setCreateStep(1);
  setTokenData({
    name: '',
    ticker: '',
    image: null,
    decimals: 9,
    supply: '',
    description: '',
    website: '',
    twitter: '',
    telegram: '',
    discord: '',
    revokeFreeze: false,
    revokeMint: false,
    revokeUpdate: false,
    modifyCreator: false
  });
}
```

};

const handleAddLiquidity = async () => {
if (!selectedToken || !liquidityAmount) {
alert(‘Please select a token and enter liquidity amount’);
return;
}

```
const success = await createTransaction(parseFloat(liquidityAmount));

if (success) {
  const newPool = {
    id: Date.now(),
    tokenId: selectedToken.id,
    tokenName: selectedToken.name,
    tokenTicker: selectedToken.ticker,
    solAmount: parseFloat(liquidityAmount),
    created: new Date().toISOString()
  };
  
  setUserPools([...userPools, newPool]);
  
  const updatedTokens = userTokens.map(token => 
    token.id === selectedToken.id ? { ...token, hasLiquidity: true } : token
  );
  setUserTokens(updatedTokens);
  
  alert('Liquidity added successfully!');
  setSelectedToken(null);
  setLiquidityAmount('');
}
```

};

const handleWithdrawLiquidity = async (poolId) => {
const pool = userPools.find(p => p.id === poolId);
if (!pool) return;

```
if (confirm(`Withdraw ${pool.solAmount} SOL from ${pool.tokenName} pool?`)) {
  setUserPools(userPools.filter(p => p.id !== poolId));
  alert('Liquidity withdrawn successfully!');
}
```

};

const NavItem = ({ icon: Icon, label, page }) => (
<button
onClick={() => {
setCurrentPage(page);
setSidebarOpen(false);
}}
className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${ currentPage === page ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800' }`}
>
<Icon size={20} />
<span>{label}</span>
</button>
);

return (
<div className="min-h-screen bg-gray-950 text-white">
{/* Header */}
<header className="fixed top-0 left-0 right-0 h-16 bg-gray-900 border-b border-gray-800 z-50 flex items-center justify-between px-4">
<div className="flex items-center gap-4">
<button
onClick={() => setSidebarOpen(!sidebarOpen)}
className=“p-2 hover:bg-gray-800 rounded-lg transition-colors”
>
{sidebarOpen ? <X size={24} /> : <Menu size={24} />}
</button>
<h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
IceiyLaunch
</h1>
</div>

```
    <button
      onClick={walletConnected ? disconnectWallet : connectWallet}
      className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
    >
      <Wallet size={18} />
      <span className="hidden sm:inline">
        {walletConnected 
          ? `${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}`
          : 'Connect Wallet'
        }
      </span>
    </button>
  </header>

  {/* Sidebar */}
  <aside
    className={`fixed top-16 left-0 bottom-0 w-64 bg-gray-900 border-r border-gray-800 p-4 transition-transform z-40 ${
      sidebarOpen ? 'translate-x-0' : '-translate-x-full'
    }`}
  >
    <nav className="space-y-2">
      <NavItem icon={Rocket} label="Create Token" page="create" />
      <NavItem icon={Droplet} label="Manage Liquidity" page="liquidity" />
      <NavItem icon={LayoutDashboard} label="Portfolio" page="portfolio" />
      <NavItem icon={TrendingUp} label="Get Trending" page="trending" />
      <NavItem icon={LifeBuoy} label="Support" page="support" />
    </nav>
  </aside>

  {/* Main Content */}
  <main className="pt-16 min-h-screen">
    <div className="max-w-6xl mx-auto p-6">
      {/* Create Token Page */}
      {currentPage === 'create' && (
        <div className="space-y-6">
          <h2 className="text-3xl font-bold">Create Token</h2>
          
          {/* Progress Steps */}
          <div className="flex items-center gap-2 mb-8">
            {[1, 2, 3, 4].map((step) => (
              <React.Fragment key={step}>
                <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  createStep >= step ? 'bg-blue-600' : 'bg-gray-800'
                }`}>
                  {createStep > step ? <Check size={20} /> : step}
                </div>
                {step < 4 && (
                  <div className={`h-1 flex-1 ${
                    createStep > step ? 'bg-blue-600' : 'bg-gray-800'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Step 1: Basic Info */}
          {createStep === 1 && (
            <div className="bg-gray-900 rounded-xl p-6 space-y-4">
              <h3 className="text-xl font-semibold mb-4">Need Help?</h3>
            <p className="text-gray-400 mb-6">
              Our support team is ready to assist you with any questions or issues
            </p>
            <a
              href="https://t.me/IceiyLaunchSupport_Bot"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold"
            >
              Contact Support
              <ExternalLink size={18} />
            </a>
          </div>
        </div>
      )}
    </div>
  </main>
</div>
```

);
}-semibold mb-4”>Basic Information</h3>

```
              <div>
                <label className="block text-sm text-gray-400 mb-2">Token Name</label>
                <input
                  type="text"
                  value={tokenData.name}
                  onChange={(e) => setTokenData({...tokenData, name: e.target.value})}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                  placeholder="My Token"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Ticker Symbol</label>
                <input
                  type="text"
                  value={tokenData.ticker}
                  onChange={(e) => setTokenData({...tokenData, ticker: e.target.value.toUpperCase()})}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                  placeholder="MTK"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Token Image</label>
                <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer">
                  <Upload size={32} className="mx-auto mb-2 text-gray-500" />
                  <p className="text-sm text-gray-400">Click or drag to upload image</p>
                </div>
              </div>

              <button
                onClick={() => setCreateStep(2)}
                disabled={!tokenData.name || !tokenData.ticker}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg px-6 py-3 font-semibold flex items-center justify-center gap-2"
              >
                Next <ArrowRight size={18} />
              </button>
            </div>
          )}

          {/* Step 2: Token Details */}
          {createStep === 2 && (
            <div className="bg-gray-900 rounded-xl p-6 space-y-4">
              <h3 className="text-xl font-semibold mb-4">Token Details</h3>
              
              <div>
                <label className="block text-sm text-gray-400 mb-2">Decimals</label>
                <input
                  type="number"
                  value={tokenData.decimals}
                  onChange={(e) => setTokenData({...tokenData, decimals: parseInt(e.target.value)})}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                  min="0"
                  max="9"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Total Supply</label>
                <input
                  type="text"
                  value={tokenData.supply}
                  onChange={(e) => setTokenData({...tokenData, supply: e.target.value})}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                  placeholder="1000000000"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Description</label>
                <textarea
                  value={tokenData.description}
                  onChange={(e) => setTokenData({...tokenData, description: e.target.value})}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 h-32 resize-none"
                  placeholder="Describe your token..."
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setCreateStep(1)}
                  className="flex-1 bg-gray-800 hover:bg-gray-700 rounded-lg px-6 py-3 font-semibold"
                >
                  Back
                </button>
                <button
                  onClick={() => setCreateStep(3)}
                  disabled={!tokenData.supply}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg px-6 py-3 font-semibold flex items-center justify-center gap-2"
                >
                  Next <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Socials */}
          {createStep === 3 && (
            <div className="bg-gray-900 rounded-xl p-6 space-y-4">
              <h3 className="text-xl font-semibold mb-4">Social Links (Optional)</h3>
              
              <div>
                <label className="block text-sm text-gray-400 mb-2">Website</label>
                <input
                  type="url"
                  value={tokenData.website}
                  onChange={(e) => setTokenData({...tokenData, website: e.target.value})}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                  placeholder="https://mytoken.com"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Twitter</label>
                <input
                  type="text"
                  value={tokenData.twitter}
                  onChange={(e) => setTokenData({...tokenData, twitter: e.target.value})}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                  placeholder="@mytoken"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Telegram</label>
                <input
                  type="text"
                  value={tokenData.telegram}
                  onChange={(e) => setTokenData({...tokenData, telegram: e.target.value})}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                  placeholder="t.me/mytoken"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Discord</label>
                <input
                  type="text"
                  value={tokenData.discord}
                  onChange={(e) => setTokenData({...tokenData, discord: e.target.value})}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                  placeholder="discord.gg/mytoken"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setCreateStep(2)}
                  className="flex-1 bg-gray-800 hover:bg-gray-700 rounded-lg px-6 py-3 font-semibold"
                >
                  Back
                </button>
                <button
                  onClick={() => setCreateStep(4)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 rounded-lg px-6 py-3 font-semibold flex items-center justify-center gap-2"
                >
                  Next <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Authorities & Create */}
          {createStep === 4 && (
            <div className="bg-gray-900 rounded-xl p-6 space-y-4">
              <h3 className="text-xl font-semibold mb-4">Token Authorities</h3>
              
              <div className="space-y-3">
                <label className="flex items-center justify-between p-4 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-750">
                  <div>
                    <div className="font-semibold">Revoke Freeze Authority</div>
                    <div className="text-sm text-gray-400">Cost: 0.1 SOL</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={tokenData.revokeFreeze}
                    onChange={(e) => setTokenData({...tokenData, revokeFreeze: e.target.checked})}
                    className="w-5 h-5"
                  />
                </label>

                <label className="flex items-center justify-between p-4 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-750">
                  <div>
                    <div className="font-semibold">Revoke Mint Authority</div>
                    <div className="text-sm text-gray-400">Cost: 0.1 SOL</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={tokenData.revokeMint}
                    onChange={(e) => setTokenData({...tokenData, revokeMint: e.target.checked})}
                    className="w-5 h-5"
                  />
                </label>

                <label className="flex items-center justify-between p-4 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-750">
                  <div>
                    <div className="font-semibold">Revoke Update Authority</div>
                    <div className="text-sm text-gray-400">Cost: 0.1 SOL</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={tokenData.revokeUpdate}
                    onChange={(e) => setTokenData({...tokenData, revokeUpdate: e.target.checked})}
                    className="w-5 h-5"
                  />
                </label>

                <label className="flex items-center justify-between p-4 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-750">
                  <div>
                    <div className="font-semibold">Modify Creator Information</div>
                    <div className="text-sm text-gray-400">Change creator from LaunchToken | Cost: 0.1 SOL</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={tokenData.modifyCreator}
                    onChange={(e) => setTokenData({...tokenData, modifyCreator: e.target.checked})}
                    className="w-5 h-5"
                  />
                </label>
              </div>

              <div className="bg-blue-950 border border-blue-800 rounded-lg p-4 mt-6">
                <div className="flex items-center gap-2 text-blue-400 mb-2">
                  <AlertCircle size={20} />
                  <span className="font-semibold">Total Cost</span>
                </div>
                <div className="text-2xl font-bold">{calculateTotalCost()} SOL</div>
                <div className="text-sm text-gray-400 mt-1">Base creation: 0.1 SOL</div>
              </div>

              <div className="flex gap-2 mt-6">
                <button
                  onClick={() => setCreateStep(3)}
                  className="flex-1 bg-gray-800 hover:bg-gray-700 rounded-lg px-6 py-3 font-semibold"
                >
                  Back
                </button>
                <button
                  onClick={handleCreateToken}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg px-6 py-3 font-semibold flex items-center justify-center gap-2"
                >
                  <Rocket size={18} />
                  Create Token
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Manage Liquidity Page */}
      {currentPage === 'liquidity' && (
        <div className="space-y-6">
          <h2 className="text-3xl font-bold">Manage Liquidity</h2>

          {userPools.length > 0 && (
            <div className="bg-gray-900 rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-4">Your Liquidity Pools</h3>
              <div className="space-y-3">
                {userPools.map((pool) => (
                  <div key={pool.id} className="bg-gray-800 rounded-lg p-4 flex items-center justify-between">
                    <div>
                      <div className="font-semibold">{pool.tokenName} ({pool.tokenTicker})</div>
                      <div className="text-sm text-gray-400">{pool.solAmount} SOL</div>
                    </div>
                    <button
                      onClick={() => handleWithdrawLiquidity(pool.id)}
                      className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg flex items-center gap-2"
                    >
                      <Minus size={16} />
                      Withdraw
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-gray-900 rounded-xl p-6 space-y-4">
            <h3 className="text-xl font-semibold mb-4">Add Liquidity to Raydium</h3>
            
            <div>
              <label className="block text-sm text-gray-400 mb-2">Select Token</label>
              <select
                value={selectedToken?.id || ''}
                onChange={(e) => {
                  const token = userTokens.find(t => t.id === parseInt(e.target.value));
                  setSelectedToken(token);
                }}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
              >
                <option value="">Choose a token</option>
                {userTokens.map((token) => (
                  <option key={token.id} value={token.id}>
                    {token.name} ({token.ticker})
                  </option>
                ))}
              </select>
            </div>

            {selectedToken && (
              <>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">SOL Amount</label>
                  <input
                    type="number"
                    value={liquidityAmount}
                    onChange={(e) => setLiquidityAmount(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                    placeholder="0.0"
                    step="0.1"
                  />
                </div>

                <button
                  onClick={handleAddLiquidity}
                  disabled={!liquidityAmount || parseFloat(liquidityAmount) <= 0}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg px-6 py-3 font-semibold flex items-center justify-center gap-2"
                >
                  <Plus size={18} />
                  Add Liquidity
                </button>
              </>
            )}

            {userTokens.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                <Droplet size={48} className="mx-auto mb-3 opacity-50" />
                <p>No tokens created yet. Create a token first!</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Portfolio Page */}
      {currentPage === 'portfolio' && (
        <div className="space-y-6">
          <h2 className="text-3xl font-bold">Portfolio</h2>

          {walletConnected && (
            <div className="bg-gradient-to-r from-blue-900 to-purple-900 rounded-xl p-6">
              <div className="text-sm text-gray-300 mb-1">Wallet Address</div>
              <div className="font-mono text-lg mb-4">{walletAddress}</div>
              <div className="text-sm text-gray-300 mb-1">Balance</div>
              <div className="text-3xl font-bold">-- SOL</div>
            </div>
          )}

          <div className="bg-gray-900 rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-4">Your Tokens</h3>
            {userTokens.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {userTokens.map((token) => (
                  <div key={token.id} className="bg-gray-800 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="font-semibold text-lg">{token.name}</div>
                        <div className="text-gray-400">{token.ticker}</div>
                      </div>
                      {token.hasLiquidity && (
                        <span className="bg-green-600 text-xs px-2 py-1 rounded">
                          Liquidity Added
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-400 mb-2">
                      Supply: {parseInt(token.supply).toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500 font-mono truncate">
                      {token.address}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <LayoutDashboard size={48} className="mx-auto mb-3 opacity-50" />
                <p>No tokens in your portfolio yet</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Get Trending Page */}
      {currentPage === 'trending' && (
        <div className="space-y-6">
          <h2 className="text-3xl font-bold">Get Trending</h2>
          <div className="bg-gray-900 rounded-xl p-8 text-center">
            <TrendingUp size={64} className="mx-auto mb-4 text-blue-500" />
            <h3 className="text-xl font-semibold mb-4">Discover Trending Tokens</h3>
            <p className="text-gray-400 mb-6">
              Check out the hottest tokens on Solana right now
            </p>
            <a
              href="https://soltrndingding.zya.me"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold"
            >
              Visit Trending Page
              <ExternalLink size={18} />
            </a>
          </div>
        </div>
      )}

      {/* Support Page */}
      {currentPage === 'support' && (
        <div className="space-y-6">
          <h2 className="text-3xl font-bold">Support</h2>
          <div className="bg-gray-900 rounded-xl p-8 text-center">
            <LifeBuoy size={64} className="mx-auto mb-4 text-blue-500" />
            <h3 className="text-xl font
```
