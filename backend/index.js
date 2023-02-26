const express = require("express");
const app = express();
const port = 5001;
const Moralis = require("moralis").default;
const cors = require("cors");

require("dotenv").config({ path: ".env" });

app.use(cors());
app.use(express.json());

const MORALIS_API_KEY = process.env.MORALIS_API_KEY;

function getNativeCurrency(chain) {
  switch (chain) {
    case "0x1":
      return "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
    case "0x89":
      return "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270";
    case "0xfa":
      return "0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83";
    case "0x38":
      return "0x242a1ff6ee06f2131b7924cacb74c7f9e3a5edc9";
    default:
      return "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
  }
}

app.get("/gettokens", async (req, res) => {
  try {
    let modifiedResponse = [];
    let totalWalletUsdValue = 0;
    const { query } = req;
    const chains = ["0x1", "0x89", "0xfa", "0x38"];

    const promises = chains.map(async (chain) => {
      const response = await Moralis.EvmApi.token.getWalletTokenBalances({
        address: query.address,
        chain,
      });

      const tokenPrices = {};
      const tokensWithUsdPromise = await Promise.all(
        response.toJSON().map(async (token) => {
          if (!tokenPrices[token.token_address]) {
            try {
              const priceResponse = await Moralis.EvmApi.token.getTokenPrice({
                address: token.token_address,
                chain,
              });
              tokenPrices[token.token_address] = priceResponse.raw.usdPrice;
            } catch (error) {
              console.log("Error getting token price:", error.message);
              tokenPrices[token.token_address] = 0;
            }
          }
          const usdPrice = tokenPrices[token.token_address] || 0;
          const calculatedBalance = (
            token.balance / 10 ** token.decimals
          ).toFixed(2);
          const walletBalance = { ...token, chain };
          return { walletBalance, calculatedBalance, usdPrice };
        })
      );
      return tokensWithUsdPromise;
    });

    const TokenPromise = await Promise.all(promises);
    const tokensWithUsd = TokenPromise.flat();
    modifiedResponse = tokensWithUsd;

    for (let i = 0; i < tokensWithUsd.length; i++) {
      totalWalletUsdValue +=
        tokensWithUsd[i].walletBalance.balance /
        10 ** tokensWithUsd[i].walletBalance.decimals *
        tokensWithUsd[i].usdPrice;
    }

    modifiedResponse.push(totalWalletUsdValue);

    return res.status(200).json(modifiedResponse);
  } catch (e) {
    console.log(`Something went wrong ${e}`);
    return res.status(400).json();
  }
});

const rateLimit = require("express-rate-limit");
const NodeCache = require("node-cache");
const cacheT = new NodeCache({ stdTTL: 300, checkperiod: 60 });


//GET Users NFT's
app.get("/nftBalance", async (req, res) => {
  if (!Moralis.Core.isStarted) {
    await Moralis.start({ apiKey: process.env.MORALIS_API_KEY });
  }

  try {
    const { query } = req;

    const response = await Moralis.EvmApi.nft.getWalletNFTs({
      address: query.address,
      chain: query.chain,
    });

    const userNFTs = response.raw;

    res.send(userNFTs);
  } catch (e) {
    res.send(e.message);
  }
});




const tokenTransfersLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minutes
  max: 30, // limit each IP to 100 requests per windowMs
  message: "Too many requests, please try again later"
});

//GET USERS TOKEN TRANSFERS
const cache = new Map();

app.get("/tokenTransfers", tokenTransfersLimiter, async (req, res) => {
  if (!Moralis.Core.isStarted) {
    await Moralis.start({ apiKey: process.env.MORALIS_API_KEY });
  }

  try {
    const { address } = req.query;
    const chains = ["0x1", "0x89", "0xfa", "0x38"];
    const tokenTransfers = [];

    for (const chain of chains) {
      const response = await Moralis.EvmApi.token.getWalletTokenTransfers({
        address: address,
        chain: chain,
      });

      const userTrans = response.raw.result;
      console.log({ trans: userTrans });

      const cachedTransfers = cache.get(`${address}-${chain}`) || [];
      const newTransfers = [];

      for (const transfer of userTrans) {
        const cachedTransfer = cachedTransfers.find((t) => t.txHash === transfer.txHash);
        if (cachedTransfer) {
          console.log(`Found cached transfer ${transfer.txHash}`);
          newTransfers.push(cachedTransfer);
        } else {
          try {
            const metaResponse = await Moralis.EvmApi.token.getTokenMetadata({
              addresses: [transfer.address],
              chain: chain,
            });
            if (metaResponse.raw) {
              transfer.decimals = metaResponse.raw[0].decimals;
              transfer.symbol = metaResponse.raw[0].symbol;
              newTransfers.push(transfer);
              console.log(`Added new transfer ${transfer.txHash}`);
            } else {
              console.log(`No details for desired coin ${transfer.address}`);
            }
          } catch (e) {
            console.log(e);
          }
        }
      }

      const allTransfers = [...cachedTransfers, ...newTransfers];
      cache.set(`${address}-${chain}`, allTransfers);

      tokenTransfers.push({
        userTransDetails: allTransfers,
        chain
      });
    }

    res.send({ tokenTransfers });
  } catch (e) {
    console.log(e.message);
    res.send(e.message);
  }
});


Moralis.start({
  apiKey: MORALIS_API_KEY,
}).then(() => {
  app.listen(port, () => {
    console.log(`Listening for API Calls`);
  });
});
