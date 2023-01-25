import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { ChainId, ThirdwebProvider } from "@thirdweb-dev/react";
import "./styles/globals.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';


// This is the chainId your dApp will work on.
const activeChainId = ChainId.BinanceSmartChainMainnet;

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <ThirdwebProvider
      desiredChainId={activeChainId}
      sdkOptions={{
        gasless: {
          openzeppelin: {
            relayerUrl: `https://api.defender.openzeppelin.com/autotasks/` || "",
          },
        },
      }}
    >
      <App />
    </ThirdwebProvider>
  </React.StrictMode>
);
