import { useAddress, useContract, useContractRead, useChainId } from "@thirdweb-dev/react";
import { useState } from "react";
import Web3 from "web3";
import Details from "./details";
import History from "./history";

export default function Home() {

  const [priceInUSD, setPriceInUSD] = useState(null);
  const [tokenPrice, setTokenPrice] = useState(null);
  const [FlokiSpin, setFlokiSpin] = useState(null);
  const [FlokiSpinInUSD, setFlokiSpinInUSD] = useState('0.00')
  const [FlokiSpinInBNB, setFlokiSpinInBNB] = useState('0.00')
  const [BnbBalance] = useState(null)
  const [BnbBalanceInUsd] = useState(null)


  const address = useAddress();
  const chainId = useChainId();
  const { contract } = useContract("0x2C00B293c7DA6c24f232D7415282bBb88BC62541", 'token');

  //Check token balance of connected wallet
  const { data: cnnctBal, isLoading: LoadingCnntBal } = useContractRead(contract, "balanceOf", address);

  const uniswapAbi = [
    { "inputs": [{ "internalType": "uint256", "name": "amountIn", "type": "uint256" }, { "internalType": "address[]", "name": "path", "type": "address[]" }], "name": "getAmountsOut", "outputs": [{ "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }], "stateMutability": "view", "type": "function" },
  ];
  const tokenAbi = [
    { "inputs": [], "name": "decimals", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
  ];

  const uniswapContract = "0x10ED43C718714eb63d5aA57B78B54704E256024E".toLowerCase();

  async function calcSell(tokensToSell, tokenAddress) {
    const web3 = new Web3("https://bsc-dataseed1.binance.org");
    const GETHTokenAddress = "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c" //WBNB

    const tokenRouter = await new web3.eth.Contract(tokenAbi, tokenAddress);
    const tokenDecimals = await tokenRouter.methods.decimals().call();

    tokensToSell = setDecimals(tokensToSell, tokenDecimals);
    let amountOut;
    try {
      const router = await new web3.eth.Contract(uniswapAbi, uniswapContract);
      amountOut = await router.methods.getAmountsOut(tokensToSell, [tokenAddress, GETHTokenAddress]).call();
      amountOut = web3.utils.fromWei(amountOut[1]);
    } catch (error) { }

    if (!amountOut) return 0;
    return amountOut;
  }

  async function calcGETHPrice() {
    const web3 = new Web3("https://bsc-dataseed1.binance.org");
    const GETHTokenAddress = "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c" // WBNB
    const USDTokenAddress = "0x55d398326f99059fF775485246999027B3197955" //BUSD
    const gethToSell = web3.utils.toWei("1", "ether");
    let amountOut;
    try {
      const router = await new web3.eth.Contract(uniswapAbi, uniswapContract);
      amountOut = await router.methods.getAmountsOut(gethToSell, [GETHTokenAddress, USDTokenAddress]).call();
      amountOut = web3.utils.fromWei(amountOut[1]);
    } catch (error) { }
    if (!amountOut) return 0;
    return amountOut;
  }

  function setDecimals(number, decimals) {
    number = number.toString();
    let numberAbs = number.split('.')[0]
    let numberDecimals = number.split('.')[1] ? number.split('.')[1] : '';
    while (numberDecimals.length < decimals) {
      numberDecimals += "0";
    }
    return numberAbs + numberDecimals;
  }

  //Check Balances
  async function myBalance() {
    if (!address)
      return;

    if (chainId !== 56)
      return ("Please change your network to BSC mainnet network");

    if (LoadingCnntBal)
      return <div>Loading....</div>

    const gethPrice = await calcGETHPrice()
    const contractT = "0x2C00B293c7DA6c24f232D7415282bBb88BC62541"
    const tokenprice = 1;
    const tPrice = await calcSell(tokenprice, contractT);
    const priceT = tPrice * gethPrice;
    const tokenPrice = parseFloat(priceT).toFixed(6)
    setTokenPrice(`${tokenPrice} USD`)
    // console.log(`Token Price in BNB: ${tPrice} BNB`);
    // console.log(`Token Price in USD: ${tPrice * gethPrice} USD`);

    const BNBPrice = parseFloat(gethPrice).toFixed(2)
    setPriceInUSD(`$${BNBPrice}`)

    // Get token balance of Connected wallet
    const accntCnnctBal = await cnnctBal;
    // console.log(`FlokiSpin Value of ${address}: ${String(accntCnnctBal) / 1e9} FlokiSpin`);
    const fixedFloki = parseFloat(String(accntCnnctBal) / 1e9).toFixed(2)
    setFlokiSpin(`${fixedFloki} $FKS`);

    let token_CB = String(cnnctBal) / 1e9;
    const contract = "0x2C00B293c7DA6c24f232D7415282bBb88BC62541"
    const priceInCnntBal = await calcSell(token_CB, contract);

    // console.log(`FlokiSpin Value of ${address} IN BNB: ${priceInCnntBal} BNB`);
    const bnbData = parseFloat(priceInCnntBal).toFixed(2)
    setFlokiSpinInBNB(`${bnbData} BNB`)
    const flokiPriceUSD = (priceInCnntBal) * gethPrice
    setFlokiSpinInUSD(parseFloat(flokiPriceUSD).toFixed(2))
  }
  myBalance()

  return (
    <div className="container">
      <main className="main">

        <Details priceInUSD={priceInUSD} FlokiSpinInBNB={FlokiSpinInBNB} FlokiSpin={FlokiSpin} FlokiSpinInUSD={FlokiSpinInUSD} BnbBalance={BnbBalance}
          BnbBalanceInUsd={BnbBalanceInUsd} tokenPrice={tokenPrice} />
        <History />
      </main>
    </div>
  );
}
