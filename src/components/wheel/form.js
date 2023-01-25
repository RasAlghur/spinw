import { useAddress, useContract, useContractWrite, useChainId } from "@thirdweb-dev/react";
import { useState, useRef } from "react";
import Web3 from "web3";
import { Spinner } from "../helper/util";
import { collection, doc, onSnapshot, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore';
import { colRefRefer, database } from '../Config'
import { ToastContainer, toast } from 'react-toastify';


export default function SpinnerForm({ handle, reward }) {

    const address = useAddress();
    const chainId = useChainId();

    const played = useRef(undefined);
    const rewarded = useRef(undefined);
    const userAddress = useRef(undefined);

    const [output, setOutput] = useState(null)
    const [loading, setLoading] = useState(false)
    const [profit, setProfit] = useState('')
    const [error, setError] = useState('')
    const [outputInBNB, setOutputInBNB] = useState('')


    const { contract } = useContract("0x2C00B293c7DA6c24f232D7415282bBb88BC62541", 'token');

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

    // For the Spin
    const { mutateAsync: transfer, isLoading: LoadingSpinner } = useContractWrite(contract, "transfer")

    // text
    const change = async () => {
        const play = played.current.value;
        const gethPrice = await calcGETHPrice()

        const contract = "0x2C00B293c7DA6c24f232D7415282bBb88BC62541"
        const priceInGeth = await calcSell(play, contract);

        const inBNB = parseFloat(priceInGeth).toFixed(5)
        setOutputInBNB(`VALUE IN BNB: ${inBNB} BNB`)

        const inUSD = parseFloat(priceInGeth * gethPrice).toFixed(5)
        setOutput(`VALUE IN USD: ${inUSD} USD`);
    }


    const spinNow = async () => {

        setLoading(true);

        if (!address) {
            return setTimeout(() => {
                setLoading(false);
                toast.error('Please Connect Your Wallet')
            }, 100);

        }


        if (chainId !== 56) {
            return setTimeout(() => {
                setLoading(false);
                toast.error("Please change your network to BSC Mainnet")
            }, 100)
        }

        if (LoadingSpinner) {
            return setTimeout(() => {
                setLoading(false);
                <div>is Loading.....</div>
            }, 100);
        }


        const play = played.current.value;

        var numbers = /^[0-9]+$/;
        if (!play.match(numbers)) {
            toast.error('Input value should be number only')
            setError('Input value should be number only')
            return setTimeout(() => {
                setLoading(false);
            }, 100);
        }

        if (play <= 999) {
            toast.error('The stake field should not be empty or less than 1000 $FKS token')
            setError('The stake field should not be empty or less than 1000 FKS token')
            return setTimeout(() => {
                setLoading(false);
            }, 100);
        }

        if (play >= 1000001) {
            toast.error('The stake field value should not be more than 1,000,000 $FKS token')
            return setTimeout(() => {
                setLoading(false);
            }, 100);
        }

        await calcGETHPrice()
        const contract = "0x2C00B293c7DA6c24f232D7415282bBb88BC62541"
        await calcSell(play, contract);

        try {
            console.log("play1", play)
            const tokenDcml = 1e9;
            await transfer(["0x222D35ACA11a0603779A285841F2feFccDaef8Fb", String(play) * tokenDcml])
            console.log("play2", play)

            setTimeout(() => {
                setLoading(false)
                handle()
            })

            // save user data to database
            setTimeout(() => {
                setLoading(true)
                const post = {
                    play: played.current.value,
                    rewards: rewarded.current.value,
                    useAddress: userAddress.current.value,
                    status: 'Not Paid',
                    createdTime: serverTimestamp(),

                }

                const uuid = () => {
                    const values = '345678908976512345234568097634567089762334565608976453209876453q425314567897863456690';
                    let token = '';
                    for (var i = 0; i < 6; i++) {
                        token += values[Math.floor(Math.random() * values.length)]
                    };
                    return token;
                }

                try {
                    const colRef = collection(database, 'games')
                    setDoc(doc(colRef, uuid()), post).then(() => {
                        setLoading(false)
                        setProfit(`You have won ${rewarded.current.value}`)
                        // return;
                    }).catch(error => {
                        setLoading(false)
                        console.log(error.data)
                    })
                } catch (error) {
                    setLoading(false)
                    console.log(error.data)
                }
            }, 2000)

            // Check if referee is status is pending
            setTimeout(() => {
                const output = query(colRefRefer, where('referee', '==', address))
                onSnapshot(output, (snapshot) => {
                    if (!snapshot.empty) {
                        let blog = [];
                        snapshot.docs.forEach((docData) => {
                            blog.push({ ...docData.data(), id: docData.id })
                            console.log(blog)
                            const { status, id } = blog[0];
                            if (status !== 'Active') {
                                const post = {
                                    status: 'Active',
                                    play: played.current.value,
                                    // reward: rewarded.current.value
                                }

                                const docRef = doc(database, 'refers', id)
                                updateDoc(docRef, post).then(() => {
                                    return console.log('user updated')
                                })
                            }
                            return;
                        })
                    }
                    return;
                })
            }, 4000)

        } catch (err) {
            // console.log("contract call failure", err);
            setError('An error occur when processing your transaction')
            setLoading(false)
        }
    }

    return (
        <>
            <div>
                <ToastContainer />
            </div>
            {loading && Spinner()}
            {error ? <p className='text-danger text-center'>{error}</p> : (<p className='text-success text-center'>{profit}</p>)}
            <p className='text-center'>{output} <br />  {outputInBNB}</p>
            <div className='form_container'>
                <div className='form_container_1'>
                    <input type="text" name="play" className='form_input' ref={played} onChange={change} placeholder="Amount to play" />
                    <input type="text" name="userAddress" className='form_input' hidden ref={userAddress} value={address} placeholder="Enter your address" />
                    <input type="text" name="gift" className='form_input' hidden value={reward} ref={rewarded} placeholder="Reward" />
                    <button className='form_btn' onClick={spinNow}> Spin </button>
                </div>
            </div>
        </>
    )
}