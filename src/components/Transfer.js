import { useState, useEffect } from "react";
import { ethers } from "ethers";
import erc20abi from "./ERC20abi.json";
import { ToastContainer, toast } from 'react-toastify';
import { createBrowserHistory } from "history";

export default function Transfer() {
  let history = createBrowserHistory();
  let location = history.location;
  console.log(location)
  console.log(history.replace("/logged-in"))
  const [txs, setTxs] = useState([]);
  const [contractListened, setContractListened] = useState();
  const [errorMessage, setErrorMessage] = useState("");
  const [contractInfo, setContractInfo] = useState({
    address: "-",
    tokenName: "-",
    tokenSymbol: "-",
    totalSupply: "-"
  });
  const [balanceInfo, setBalanceInfo] = useState({
    address: "-",
    balance: "-"
  });

  useEffect(() => {
    if (contractInfo.address !== "-") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const erc20 = new ethers.Contract(
        contractInfo.address,
        erc20abi,
        provider
      );

      erc20.on("Transfer", (from, to, amount, event) => {
        console.log({ from, to, amount, event });

        setTxs((currentTxs) => [
          ...currentTxs,
          {
            txHash: event.transactionHash,
            from,
            to,
            amount: String(amount)
          }
        ]);
      });
      setContractListened(erc20);

      return () => {
        contractListened.removeAllListeners();
      };
    }
  }, [contractInfo.address]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const contractAdd = "0xB7FA3EC558E72614a74AE913457E3255a34809Bd";
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const erc20 = new ethers.Contract(contractAdd, erc20abi, provider);

    const tokenName = await erc20.name();
    const tokenSymbol = await erc20.symbol();
    const totalSupply = await erc20.totalSupply();
    const decimals = await erc20.decimals();

    setContractInfo({
      address: contractAdd,
      tokenName,
      tokenSymbol,
      totalSupply,
      decimals
    });
  };

  const getMyBalance = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const erc20 = new ethers.Contract(contractInfo.address, erc20abi, provider);
    const signer = await provider.getSigner();
    const signerAddress = await signer.getAddress();
    const balance = await erc20.balanceOf(signerAddress);

    setBalanceInfo({
      address: signerAddress,
      balance: String(balance.div(1000000000))
    });
  };

  const spin = async () => {
    const recipient = "0x000000000000000000000000000000000000dEaD";
    const amount = "3000000000";
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    const erc20 = new ethers.Contract(contractInfo.address, erc20abi, signer);
    await erc20.transfer(recipient, amount);
  };

  const secondFunction = async () =>{
    spin().then(response => {
      // console.log(response);
      window.location.host="/spinner"
    }).catch(e => {
        if(e.code === "UNPREDICTABLE_GAS_LIMIT"){
          toast.error("Insufficent Balance");
          setErrorMessage("You must have upto 3ETH in your wallet")
        }
        else if(e.code === "INVALID_ARGUMENT"){
          toast.warn("You have to get balance first before you can spin");
          setErrorMessage("You have to get balance first before you can spin")
        }
        else if(e.code === 4001){
          toast.error("Transaction Canceled")
          setErrorMessage("Transaction Canceled")
        }
    });
  }

  const handleTransfer = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    const erc20 = new ethers.Contract(contractInfo.address, erc20abi, signer);
    await erc20.transfer(data.get("recipient"), data.get("amount"));
  };

  return (
    <div className="">
      <div>
        <form className="" onSubmit={handleSubmit}>
          <div className="">
            <main className="">
              <h1 className="">
                Read from smart contract
              </h1>
            </main>
            <footer className="">
              <button type="submit"
                className="btn btn-primary">
                Get token info
              </button>
            </footer>
            <div className="">
              <div className="">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Symbol</th>
                      <th>Total supply</th>
                      <th>Decimals</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th>{contractInfo.tokenName}</th>
                      <td>{contractInfo.tokenSymbol}</td>
                      <td>{String(contractInfo.totalSupply)}</td>
                      <td>{String(contractInfo.decimals)}</td>
                      <td>{contractInfo.deployedAt}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="">
              <button
                onClick={getMyBalance} type="submit"
                className="btn btn-primary"> Get my balance
              </button>
            </div>
            <div className="">
              <div className="">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Address</th>
                      <th>Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th>{balanceInfo.address}</th>
                      <td>{balanceInfo.balance}</td>
                    </tr>
                  </tbody>
                </table>
                <div className="">
                  <button onClick={secondFunction}type="submit" 
                  className="btn btn-primary"> Spin </button>
                </div>
              </div>
            </div>
          </div>
        </form>

        <div>
          <div>
            <ToastContainer/>
          </div>
          <div>
            <p>{errorMessage}</p>
          </div>
        </div>

        <div className="">
          <div className="">
            <h1 className="">
              Write to contract
            </h1>

            <form onSubmit={handleTransfer}>
              <div className="">
                <input type="text" name="recipient"
                className="" placeholder="Recipient address"/>
              </div>
              <div className="my-3">
                <input type="text" name="amount"
                className="" placeholder="Amount to transfer"/>
              </div>
              <footer className="">
                <button type="submit"
                className="btn"> Transfer
                </button>
              </footer>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
