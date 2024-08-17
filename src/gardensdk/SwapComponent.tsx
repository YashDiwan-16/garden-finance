import { useEffect, useState } from "react";
import { useMetaMaskStore, useGarden, useSignStore } from "./store";
import { Assets } from "@gardenfi/orderbook";
import React from "react";

type AmountState = {
  btcAmount: string | null;
  wbtcAmount: string | null;
};

const SwapComponent: React.FC = () => {
  const [amount, setAmount] = useState<AmountState>({
    btcAmount: null,
    wbtcAmount: null,
  });

  const changeAmount = (of: "WBTC" | "BTC", value: string) => {
    if (of === "WBTC") {
      handleWBTCChange(value);
    }
  };

  const handleWBTCChange = (value: string) => {
    const newAmount: AmountState = { wbtcAmount: value, btcAmount: null };
    if (Number(value) > 0) {
      const btcAmount = (1 - 0.3 / 100) * Number(value);
      newAmount.btcAmount = btcAmount.toFixed(8).toString();
    }
    setAmount(newAmount);
  };

  return (
    <div className="p-6 bg-purple-900 text-white rounded-lg shadow-2xl w-[400px] mx-auto">
      <WalletConnect />
      <div className="divider"></div>
      <SwapAmount amount={amount} changeAmount={changeAmount} />
      <div className="divider"></div>
      <Swap amount={amount} changeAmount={changeAmount} />
    </div>
  );
};

const WalletConnect: React.FC = () => {
  const { connectMetaMask, metaMaskIsConnected } = useMetaMaskStore();

  return (
    <div className="flex justify-between items-center">
      <span className="text-xl font-bold">Swap</span>
      <MetaMaskButton
        isConnected={metaMaskIsConnected}
        onClick={connectMetaMask}
      />
    </div>
  );
};

type MetaMaskButtonProps = {
  isConnected: boolean;
  onClick: () => void;
};

const MetaMaskButton: React.FC<MetaMaskButtonProps> = ({
  isConnected,
  onClick,
}) => {
  const buttonClass = `btn ${
    isConnected ? "btn-success" : "btn-primary"
  } ml-2 mr-2`;

  const buttonText = isConnected
    ? "Connected"
    : "Connect to Garden Finance Setup";

  return (
    <button className={buttonClass} onClick={onClick}>
      {buttonText}
    </button>
  );
};

type TransactionAmountComponentProps = {
  amount: AmountState;
  changeAmount: (of: "WBTC" | "BTC", value: string) => void;
};

const SwapAmount: React.FC<TransactionAmountComponentProps> = ({
  amount,
  changeAmount,
}) => {
  const { wbtcAmount, btcAmount } = amount;

  return (
    <div className="grid grid-cols-1 gap-4">
      <InputField
        id="wbtc"
        label="Send WBTC"
        value={wbtcAmount}
        onChange={(value) => changeAmount("WBTC", value)}
      />
      <InputField id="btc" label="Receive BTC" value={btcAmount} readOnly />
    </div>
  );
};

type InputFieldProps = {
  id: string;
  label: string;
  value: string | null;
  readOnly?: boolean;
  onChange?: (value: string) => void;
};

const InputField: React.FC<InputFieldProps> = ({
  id,
  label,
  value,
  readOnly,
  onChange,
}) => (
  <div>
    <label htmlFor={id} className="label">
      <span className="label-text">{label}</span>
    </label>
    <div className="input-group">
      <input
        id={id}
        placeholder="0"
        value={value ? value : ""}
        type="number"
        readOnly={readOnly}
        onChange={(e) => onChange && onChange(e.target.value)}
        className="input input-bordered w-full"
      />
      <span className="input-group-text">{id.toUpperCase()}</span>
    </div>
  </div>
);

type SwapAndAddressComponentProps = {
  amount: AmountState;
  changeAmount: (of: "WBTC" | "BTC", value: string) => void;
};

const Swap: React.FC<SwapAndAddressComponentProps> = ({
  amount,
  changeAmount,
}) => {
  const { garden, bitcoin, ethereum } = useGarden();
  const [btcAddress, setBtcAddress] = useState<string>();
  const [ethAddress, setEthAddress] = useState<string>();
  const { metaMaskIsConnected } = useMetaMaskStore();
  const { wbtcAmount, btcAmount } = amount;

  const { isSigned } = useSignStore();

  useEffect(() => {
    if (!bitcoin) return;
    const getAddress = async () => {
      if (isSigned) {
        const address = await bitcoin.getAddress();
        setBtcAddress(address);
      }
    };
    getAddress();
  }, [bitcoin, isSigned]);

  useEffect(() => {
    if (!ethereum) return;
    const getAddress = async () => {
      if (isSigned) {
        const address = await ethereum.getAddress();
        setEthAddress(address);
      }
    };
    getAddress();
  }, [ethereum, isSigned]);

  const handleSwap = async () => {
    if (
      !garden ||
      typeof Number(wbtcAmount) !== "number" ||
      typeof Number(btcAmount) !== "number"
    )
      return;

    const sendAmount = Number(wbtcAmount) * 1e8;
    const receiveAmount = Number(btcAmount) * 1e8;

    changeAmount("WBTC", "");

    await garden.swap(
      Assets.ethereum_sepolia.WBTC,
      Assets.bitcoin_testnet.BTC,
      sendAmount,
      receiveAmount
    );
  };

  return (
    <div className="grid grid-cols-1 gap-4">
      <div>
        <label htmlFor="eth-address" className="label">
          <span className="label-text">Sender ETH Address</span>
        </label>
        <input
          id="eth-address"
          placeholder="Enter ETH Address"
          value={ethAddress ? ethAddress : ""}
          onChange={(e) => setEthAddress(e.target.value)}
          className="input input-bordered w-full"
        />
      </div>

      <div>
        <label htmlFor="btc-address" className="label">
          <span className="label-text">Recipient BTC Address</span>
        </label>
        <input
          id="btc-address"
          placeholder="Enter BTC Address"
          value={btcAddress ? btcAddress : ""}
          onChange={(e) => setBtcAddress(e.target.value)}
          className="input input-bordered w-full"
        />
      </div>

      <button
        className={`btn btn-block ${
          metaMaskIsConnected ? "btn-primary" : "btn-disabled"
        }`}
        onClick={handleSwap}
        disabled={!metaMaskIsConnected}
      >
        Swap
      </button>
    </div>
  );
};

export default SwapComponent;
