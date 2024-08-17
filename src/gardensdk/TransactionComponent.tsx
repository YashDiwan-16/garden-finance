import {
  Actions,
  Order as OrderbookOrder,
  parseStatus,
} from "@gardenfi/orderbook";
import { useEffect, useState } from "react";
import { useGarden, useMetaMaskStore } from "./store";
import { formatUnits } from "ethers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpRightAndDownLeftFromCenter } from "@fortawesome/free-solid-svg-icons";
import React from "react";

function TransactionsComponent() {
  const { garden } = useGarden();
  const { evmProvider } = useMetaMaskStore();
  const [orders, setOrders] = useState(new Map<number, OrderbookOrder>());

  useEffect(() => {
    const fetchOrders = async () => {
      if (!garden || !evmProvider) return;

      const signer = await evmProvider.getSigner();
      const evmAddress = await signer.getAddress();

      if (!evmAddress) return;

      garden.subscribeOrders(evmAddress, (updatedOrders) => {
        setOrders((prevOrders) => {
          const updatedOrdersMap = new Map(prevOrders);
          updatedOrders?.forEach((order) =>
            updatedOrdersMap.set(order.ID, order)
          );
          return updatedOrdersMap;
        });
      });
    };

    fetchOrders();
  }, [garden, evmProvider]);

  const recentOrders = Array.from(orders.values())
    .sort((a, b) => b.ID - a.ID)
    .slice(0, 3);

  if (!recentOrders.length) return null;

  return (
    <div className="space-y-4 mt-6">
      {recentOrders.map((order) => (
        <OrderComponent order={order} key={order.ID} />
      ))}
    </div>
  );
}

type Order = {
  order: OrderbookOrder;
};

const OrderComponent: React.FC<Order> = ({ order }) => {
  const { garden } = useGarden();
  const [modelIsVisible, setModelIsVisible] = useState(false);

  const {
    ID: orderId,
    initiatorAtomicSwap,
    followerAtomicSwap,
    CreatedAt,
    status: orderStatus,
  } = order;
  const parsedStatus = parseStatus(order);
  const wbtcAmount = formatUnits(initiatorAtomicSwap.amount, 8);
  const btcAmount = formatUnits(followerAtomicSwap.amount, 8);

  const isButton = [
    Actions.UserCanInitiate,
    Actions.UserCanRedeem,
    Actions.UserCanRefund,
  ].includes(parsedStatus);
  const userFriendlyStatus = getUserFriendlyStatus(parsedStatus, order.ID);

  const [isButtonEnabled, setIsButtonEnabled] = useState(true);
  const [previousStatus, setPreviousStatus] = useState("");

  const handleClick = async () => {
    if (!garden) return;
    const swapper = garden.getSwap(order);
    const performedAction = await swapper.next();
    console.log(
      `Completed Action ${performedAction.action} with transaction hash: ${performedAction.output}`
    );
    setIsButtonEnabled(false);
  };

  const toggleModelVisible = () => setModelIsVisible((pre) => !pre);

  const orderCreatedAt = new Date(CreatedAt).getTime();
  const timePassedSinceCreation = new Date().getTime() - orderCreatedAt;
  const isOrderExpired =
    (orderStatus === 1 || orderStatus === 6) &&
    Math.floor(timePassedSinceCreation / 1000) / 60 > 3;

  let decoratedStatus = isOrderExpired ? "Order expired" : "";

  console.log("ID", order.ID, "Status", orderStatus);

  if (!decoratedStatus) {
    switch (orderStatus) {
      case 3:
        decoratedStatus = "Success";
        break;
      case 4:
        decoratedStatus = "Refunded";
        break;
      default:
        decoratedStatus = userFriendlyStatus;
    }

    if (
      initiatorAtomicSwap.swapStatus === 4 ||
      initiatorAtomicSwap.swapStatus === 6
    ) {
      decoratedStatus = "Success";
    }
  }

  if (previousStatus !== decoratedStatus) {
    setIsButtonEnabled(true);
    setPreviousStatus(decoratedStatus);
  }

  const txFromBtcToWBTC =
    order.userBtcWalletAddress === order.initiatorAtomicSwap.initiatorAddress;

  const fromLabel = txFromBtcToWBTC ? "BTC" : "WBTC";
  const toLabel = txFromBtcToWBTC ? "WBTC" : "BTC";

  return (
    <div className="bg-purple-900 text-white rounded-lg p-4 shadow-2xl">
      <div className="flex justify-between items-center mb-2">
        <div className="font-medium text-gray-100">
          Order Id <span className="text-white">{orderId}</span>
        </div>
        <span
          className="text-gray-300 cursor-pointer"
          onClick={toggleModelVisible}
        >
          <FontAwesomeIcon icon={faUpRightAndDownLeftFromCenter} />
        </span>
      </div>
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-sm font-medium text-gray-300">{fromLabel}</div>
          <div className="text-lg font-semibold">{wbtcAmount}</div>
        </div>
        <div>
          <div className="text-sm font-medium text-gray-300">{toLabel}</div>
          <div className="text-lg font-semibold">{btcAmount}</div>
        </div>
        <div>
          <div className="text-sm font-medium text-gray-300">Status</div>
          <div>
            {isButton ? (
              <button
                className="bg-blue-500 text-white py-1 px-3 rounded disabled:opacity-50"
                onClick={handleClick}
                disabled={!isButtonEnabled}
              >
                {decoratedStatus}
              </button>
            ) : (
              <span>{decoratedStatus}</span>
            )}
          </div>
        </div>
      </div>
      {modelIsVisible && (
        <OrderPopUp
          order={order}
          toggleModelVisible={toggleModelVisible}
          fromLabel={fromLabel}
          toLabel={toLabel}
        />
      )}
    </div>
  );
};

function getUserFriendlyStatus(status: string, ID: number) {
  switch (status) {
    case Actions.NoAction:
      return "Processing";
    case Actions.UserCanInitiate:
      return "Initiate";
    case Actions.UserCanRedeem:
      return "Redeem";
    case Actions.UserCanRefund:
      return "Refund";
    case Actions.CounterpartyCanInitiate:
      return "Awaiting counterparty deposit";
    default: {
      console.log(
        `Actual Status for ${ID} `,
        status.slice(0, 1).toUpperCase() + status.slice(1)
      );
      return "Processing";
    }
  }
}

function getFormattedDate(CreatedAt: string): string {
  const date = new Date(CreatedAt);

  const formattedDate = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);

  const formattedTime = date
    .toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
    .replace(":", " : ");

  return `${formattedDate} | ${formattedTime}`;
}

type PopUp = {
  order: OrderbookOrder;
  toggleModelVisible: () => void;
  fromLabel: string;
  toLabel: string;
};

const OrderPopUp: React.FC<PopUp> = ({
  order,
  toggleModelVisible,
  fromLabel,
  toLabel,
}) => {
  const {
    ID,
    followerAtomicSwap: { redeemerAddress: to, amount: toAmount },
    CreatedAt,
    initiatorAtomicSwap: {
      initiatorAddress: from,
      amount: fromAmount,
      initiateTxHash,
      redeemTxHash,
      refundTxHash,
    },
  } = order;

  const formattedDate = getFormattedDate(CreatedAt);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={toggleModelVisible}
    >
      <div
        className="bg-white rounded-lg p-6 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center">
          <div className="text-lg font-semibold text-gray-800">
            Order Details
          </div>
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={toggleModelVisible}
          >
            &times;
          </button>
        </div>
        <div className="text-gray-600">
          <div>
            <strong>Order ID:</strong> {ID}
          </div>
          <div>
            <strong>Date:</strong> {formattedDate}
          </div>
          <div>
            <strong>From:</strong> {from} ({fromLabel})
          </div>
          <div>
            <strong>Amount:</strong> {fromAmount}
          </div>
          <div>
            <strong>To:</strong> {to} ({toLabel})
          </div>
          <div>
            <strong>Amount:</strong> {toAmount}
          </div>
          {initiateTxHash && (
            <div>
              <strong>Initiate TX:</strong> {initiateTxHash}
            </div>
          )}
          {redeemTxHash && (
            <div>
              <strong>Redeem TX:</strong> {redeemTxHash}
            </div>
          )}
          {refundTxHash && (
            <div>
              <strong>Refund TX:</strong> {refundTxHash}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionsComponent;
