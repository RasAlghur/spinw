import { useContract, useContractRead } from "@thirdweb-dev/react";
import { useState } from "react";
import Web3 from "web3";
import '../../styles/globals.css'

export default function Explore() {

    // const [priceInUSD,] = useState('0.00')
    const [priceInBNB, setPriceInBNB] = useState('0.00')
    const [tokenPrice, setTokenPrice] = useState('0.00')

    const [flokiSpinBalance, setFlokiSpinBalance] = useState('0.00');
    const [FlokiSpinBalanceInUSD, setFlokiSpinBalanceInUSD] = useState('0.00');
    const [FlokiSpinBalanceInBNB, setFlokiSpinBalanceInBNB] = useState('0.00')

    const [SpinVaultBalance, setSpinVaultBalance] = useState('0.00')
    const [SpinVaultBalanceInUSD, setSpinVaultBalanceInUSD] = useState('0.00')
    const [SpinVaultBalanceInBNB, setSpinVaultBalanceInBNB] = useState('0.00')

    const [DailyVaultBalance, setDailyVaultBalance] = useState('0.00')
    const [DailyVaultBalanceInUSD, setDailyVaultBalanceInUSD] = useState('0.00')
    const [DailyVaultBalanceInBNB, setDailyVaultBalanceInBNB] = useState('0.00')

    const { contract } = useContract("0x2C00B293c7DA6c24f232D7415282bBb88BC62541", 'token');

    //Check token balance of spin wallet
    const spinVault = "0x791F0494f167bA7bba24582EA24Ef5BD22262e32";
    const { data: spinVaultBal, isLoadingSpinVault } = useContractRead(contract, "balanceOf", spinVault);

    //Check token balance of burn wallet
    const burnt = "0x000000000000000000000000000000000000dEaD";
    const { data: burntBal, isLoadingBurnt } = useContractRead(contract, "balanceOf", burnt);

    //Check token balance of daily spin vault wallet
    const dSpinVault = "0x222D35ACA11a0603779A285841F2feFccDaef8Fb";
    const { data: dSpinVaultBal, isLoadingDSpinVault } = useContractRead(contract, "balanceOf", dSpinVault);

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

        if (isLoadingSpinVault || isLoadingBurnt || isLoadingDSpinVault)
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
        setPriceInBNB(`${BNBPrice} USD`)

        // Get token balance of Spin Vault
        const accntSpinBal = await spinVaultBal;
        setSpinVaultBalance(`${String(accntSpinBal) / 1e9} $FKS`);

        let token_SB = String(spinVaultBal) / 1e9;
        const contract2 = "0x2C00B293c7DA6c24f232D7415282bBb88BC62541"
        const priceInSpinBal = await calcSell(token_SB, contract2);
        const SpinInBNB = parseFloat(priceInSpinBal).toFixed(3)
        setSpinVaultBalanceInUSD(`${priceInSpinBal * gethPrice} USD`);
        setSpinVaultBalanceInBNB(`${SpinInBNB} BNB`)

        // Get token balance of Burn Wallet
        const accntBrntBal = await burntBal;
        setFlokiSpinBalance(`${String(accntBrntBal) / 1e9} $FKS`);

        let token_BB = String(burntBal) / 1e9;
        const contract3 = "0x2C00B293c7DA6c24f232D7415282bBb88BC62541"
        const priceInBrntBal = await calcSell(token_BB, contract3);
        const balanceInBNB = parseFloat(priceInBrntBal).toFixed(3)

        setFlokiSpinBalanceInUSD(`${priceInBrntBal * gethPrice} USD`)
        setFlokiSpinBalanceInBNB(`${balanceInBNB} BNB`)

        const accntDSpinBal = await dSpinVaultBal;
        setDailyVaultBalance(`${String(accntDSpinBal) / 1e9} $FKS`)

        let token_DSB = String(dSpinVaultBal) / 1e9;
        const contract4 = "0x2C00B293c7DA6c24f232D7415282bBb88BC62541"
        const priceInDSpinBal = await calcSell(token_DSB, contract4);
        const dailyBalance = parseFloat(priceInDSpinBal).toFixed(3);
        const VaultBalanceIn = priceInDSpinBal * gethPrice;
        const DailyBalanceInUsd = parseFloat(VaultBalanceIn).toFixed(3);
        setDailyVaultBalanceInUSD(`${DailyBalanceInUsd} USD`);
        setDailyVaultBalanceInBNB(`${dailyBalance} BNB`)

    }

    myBalance()

    return (
        <div className='mt-5'>
            <div className='row'>
                <div className='col'>
                    <div className='dash'>
                        <h1>Explore Page</h1>
                        <p>Get real time information on FlokiSpin vault</p>
                    </div>
                </div>
                <div className='col'>
                    <div className='exploreBalance'>
                        <h5>{priceInBNB} | {tokenPrice}</h5>
                        <p>BNB Price | $FKS Price</p>
                    </div>
                </div>
            </div>


            <div className='row row-cols-md-3 row-cols-sm-2 row-cols-1'>
                <div className='col'>
                    <div className='wrapper'>
                        <h6>Total $FKS Burnt</h6>
                        <h5>{flokiSpinBalance}</h5>
                        <p>USD Value: {FlokiSpinBalanceInUSD}</p>
                        <p>BNB Value: {FlokiSpinBalanceInBNB}</p>
                    </div>
                </div>

                <div className='col'>
                    <div className='wrapper'>
                        <h6>Total $FKS in Spin Vault</h6>
                        <h5>{SpinVaultBalance}</h5>
                        <p>USD Value: {SpinVaultBalanceInUSD}</p>
                        <p>BNB Value: {SpinVaultBalanceInBNB}</p>
                    </div>
                </div>

                <div className='col'>
                    <div className='wrapper'>
                        <h6>$FKS in Daily Spin Vault</h6>
                        <h5>{DailyVaultBalance}</h5>
                        <p>USD Value: {DailyVaultBalanceInUSD}</p>
                        <p>BNB Value: {DailyVaultBalanceInBNB}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}