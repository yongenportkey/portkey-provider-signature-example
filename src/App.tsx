import { useEffect, useState } from "react";
import {
  IPortkeyProvider,
  MethodsBase,
  MethodsWallet,
  GetSignatureParams,
} from "@portkey/provider-types";
import "./App.css";
import detectProvider from "@portkey/detect-provider";
import { getManagerAddress } from "./get-manager-address";
import { utils } from "aelf-sdk";
import { getManagerAddresses } from "./get-manager-addresses";

const { sha256 } = utils;

function App() {
  const [provider, setProvider] = useState<IPortkeyProvider | null>(null);

  const init = async () => {
    try {
      setProvider(await detectProvider());
    } catch (error) {
      console.log(error, "=====error");
    }
  };

  const connect = async () => {
    await provider?.request({
      method: MethodsBase.REQUEST_ACCOUNTS,
    });
  };

  const getSignature = async () => {
    const data = sha256(Buffer.from("some data").toString("hex"));

    const signatureParams: GetSignatureParams = {
      data,
    };

    const signature = await provider?.request({
      method: MethodsWallet.GET_WALLET_SIGNATURE,
      payload: signatureParams,
    });

    const accounts = await provider?.request({
      method: MethodsBase.ACCOUNTS,
    });

    const caAddress = accounts?.AELF?.[0]?.split("_")[1];
    const managerAddresses = await getManagerAddresses(caAddress);

    if (!!signature) {
      const managerAddress = getManagerAddress(data, signature);
      if (managerAddresses?.includes(managerAddress)) {
        console.log("signed by manager of account ", caAddress);
      }
    }
  };

  useEffect(() => {
    if (!provider) init();
  }, [provider]);

  if (!provider) return <>Provider not found.</>;

  return (
    <>
      <button onClick={connect}>Connect</button>
      <button onClick={getSignature}>Get Signature</button>
    </>
  );
}

export default App;
