/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { type NextPage } from "next";
import dynamic from "next/dynamic";
import { Web3UserV1 } from "@nexeraid/web3-user-sdk";

import { ethers } from "ethers";

export type UserInfo = {
  email: string;
  verifierId: string;
  verifier: string;
  typeOfLogin: string;
  idToken: string;
  state: UserInfoState;
  client_id: string;
  nonce: string;
  verifierIdField: string;
}

type UserInfoState = {
  instanceId: string;
  verifier: string;
  typeOfLogin: string;
  redirectToOpener: boolean;
}

const metatx = {
  domain: {
    name: "MinimalForwarder",
    version: "0.0.1",
    chainId: 43113,
    verifyingContract: "0xd37f15e6f2E5F4A624bbb9864f56bbd2e9b201b5",
  },
  types: {
    SponsoredCallERC2771: [],
    ForwardRequest: [
      { name: "from", type: "address" },
      { name: "to", type: "address" },
      { name: "value", type: "uint256" },
      { name: "gas", type: "uint256" },
      { name: "nonce", type: "uint256" },
      { name: "data", type: "bytes" },
    ],
  },
  message: {
    chainId: "43113",
    from: "0xCa9b9507094309C172d4969eecE3454254F0AFa1",
    to: "0x8C59623a621Ded114ee80c40504C79e041c67B00",
    value: 0,
    gas: 1000000,
    nonce: 22,
    data: "0xacacf004000000000000000000000000d00ae08403b9bbb9124bb305c09058e32c39a48c000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000e00000000000000000000000000000000000000000000000000000000000000044a9059cbb00000000000000000000000062c751f207517c7f0f4f86720be4e4368f519d67000000000000000000000000000000000000000000000000000009184e72a000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
  },
};

const Demo: NextPage = () => {
  const [initialized, setInitialized] = useState(false);
  const [web3User, setWeb3User] = useState<Web3UserV1>();
  const [mnemonic, setMnemonic] = useState<string>("");

  useEffect(() => {
    const init = async () => {
      if (initialized) {
        return;
      }

      console.log(
        "value",
        process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID,
        process.env.NEXT_PUBLIC_WEB3AUTH_VERIFIER,
      );

      if (
        !process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID ||
        !process.env.NEXT_PUBLIC_WEB3AUTH_VERIFIER
      ) {
        alert("No CLIENT_ID or VERIFIER found");
        return;
      }

      try {
        console.log("Initializing Web3UserV1")

        const web3User = new Web3UserV1({
          chainId: 80001,
          clientId: process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID,
          verifier: process.env.NEXT_PUBLIC_WEB3AUTH_VERIFIER,
          rpc: "https://rpc-mumbai.maticvigil.com",
          baseUrl: window.location.origin,
          redirectPathName: "demo",
        });

        console.log(window.location.origin)
        console.log('web3User', web3User)

        await web3User.getInstance();

        console.log('------------------ web3User post', web3User)

        setInitialized(true);
        setWeb3User(web3User);
        //setTKeyUser(tKeyUser);
      } catch (error) {
        console.error("error", error);
      }

      
    };

    void init();
  }, [initialized]);

  // Init Service Provider inside the useEffect Method
  useEffect(() => {
    const init = async () => {
      if (!initialized) {
        return;
      }
      // Initialization of Service Provider
      try {
        const userInfo = (await web3User?.postConnect()) as UserInfo;
        if (userInfo) {
          uiConsole("Successfully logged in, retrieving private key...");
          uiConsole(userInfo);
        }
      } catch (error) {
        uiConsole(`${error}`);
        console.error(error);
      }
    };
    void init();
  }, [initialized]);

  const triggerLogin = async () => {
    const queryParams = new URLSearchParams(window.location.search);
    const jwt = queryParams.get("jwt");

    console.log("jwt", jwt);

    if (!jwt) {
      alert("You need to pass jwt as query param");
      return;
    }

    console.log("web3User", web3User)

    await web3User?.getInstance();

    try {
      uiConsole("Calling connect...");
      await web3User?.connect(jwt, "email", "https://torus-test.auth0.com");
    } catch (error: any) {
      console.log("Unable to call connect from web3User", error.message);
      uiConsole(`${error}`);
    }
  };

  const keyDetails = () => {
    if (!web3User) {
      uiConsole("tKey not initialized yet");
      return;
    }
    const keyDetails = web3User.instance?.getKeyDetails();
    uiConsole(keyDetails);
  };

  const generateMnemonic = async () => {
    try {
      uiConsole("Generating mnemonic...");
      const mnemonic = await web3User?.generateMnemonic();
      uiConsole(`${mnemonic}`);
    } catch (error) {
      uiConsole(`${error}`);
    }
  };

  const backupShareRecover = async () => {
    if (!mnemonic) {
      uiConsole("mnemonic not provided");
      return;
    }
    try {
      uiConsole("Recovering mnemonic Share...");
      const success = await web3User?.recoverMnemonicShare(mnemonic);
      if (success) {
        keyDetails();
      }
    } catch (error) {
      uiConsole(`${error}`);
    }
  };

  const getUserInfo = (): void => {
    uiConsole(JSON.stringify(web3User?.userInfo as UserInfo));
  };

  const getUserAddress = async () => {
    try {
      uiConsole(`${await web3User?.getAddress()}`);
    } catch (error) {
      uiConsole(`${error}`);
    }
  };

  const getPrivateKey = async () => {
    try {
      uiConsole("Retrieving private key...");
      const privKey = await web3User?.retrievePrivateKey();
      uiConsole(`${privKey}`);
    } catch (error) {
      uiConsole(`${error}`);
    }
  };

  const signMessage = async () => {
    try {
      const signedMessage = await web3User?.sign(metatx);
      uiConsole(
        `${{
          signedMessage,
          metatx: JSON.stringify(metatx),
        }}`,
      );
    } catch (error) {
      uiConsole(`${error}`);
    }
  };

  const sendTransaction = async () => {
    try {
      const contractABI = ['function transfer(address to, uint256 value) returns (bool)'];
      const contractAddress = '0x88F6B2bC66f4c31a3669b9b1359524aBf79CfC4A';

      const contract = new ethers.Contract(contractAddress, contractABI);

      const recipient = '0x62c751F207517c7f0f4f86720Be4e4368f519d67';

      const data = contract.interface.encodeFunctionData('transfer', [recipient, '10000000000000']);

      console.log(contractAddress, data, recipient);
      uiConsole("Sending transaction...");

      const txHash = await web3User?.sendTransaction(contractAddress, data, ethers.utils.parseUnits('50000', 'wei'));
      uiConsole(`${txHash}`);
    } catch (error) {
      console.log(error);
      uiConsole(`${error}`);
    }
  };

  const restoreDeviceShare = async () => {
    try {
      uiConsole("Restoring device Share...");
      uiConsole(`${await web3User?.restoreDeviceShare()}`);
    } catch (error) {
      uiConsole(`${error}`);
    }
  };

  const getLocalStorage = () => {
    uiConsole(`${localStorage}`);
  };

  const clearLocalStorage = () => {
    localStorage.clear();
    uiConsole("Cleared local storage");
  };

  function uiConsole(...args: any[]): void {
    const el = document.querySelector("#console>p");
    if (el) {
      el.innerHTML = JSON.stringify(args || {}, null, 2);
    }
  }

  return (
    <div className="container" style={{ width: "800px" }}>
      <h1 className="title">Nexera tKey Demo</h1>

      <div id="console" style={{ whiteSpace: "pre-line" }}>
        <p style={{ whiteSpace: "pre-line" }}></p>
      </div>

      <div>
        <button onClick={() => void triggerLogin()} className="card">
          Login
        </button>

        <button onClick={() => void signMessage()} className="card">
          Sign Message
        </button>

        <button onClick={() => void sendTransaction()} className="card">
          Send Transaction
        </button>

        <button onClick={getUserInfo} className="card">
          Get User Info
        </button>

        <button onClick={() => void getUserAddress()} className="card">
          Get User Address
        </button>

        <button onClick={keyDetails} className="card">
          tKey Details
        </button>

        <button onClick={() => void generateMnemonic()} className="card">
          Generate Mnemonic
        </button>

        <input
          placeholder="Mnemonic"
          type="text"
          className="input-field"
          onChange={(e) => setMnemonic(e.target.value)}
        ></input>
        <button onClick={() => void backupShareRecover()} className="card">
          Recover Share with Mnemonic
        </button>

        <button onClick={() => void getPrivateKey()} className="card">
          Retrive Private Key
        </button>

        <button onClick={() => void restoreDeviceShare()} className="card">
          Restore Device Share
        </button>

        <button onClick={getLocalStorage} className="card">
          Get Local Storage
        </button>

        <button onClick={clearLocalStorage} className="card">
          Clear Local Storage
        </button>
      </div>
    </div>
  );
};

export default Demo
