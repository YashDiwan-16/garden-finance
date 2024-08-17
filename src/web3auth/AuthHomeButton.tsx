import { ConnectKitButton } from "connectkit";
import { useAccount } from "wagmi";
const HomePage = () => {
  const { isConnected } = useAccount();

  return (
    <div
      style={{ overflowX: "hidden" }}
      className="flex flex-col items-center justify-center"
    >
      <h1 className="mt-2 mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
        Real Estate Asset Tokenization Platform
      </h1>
      <p className="w-screen text-center mb-8 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 lg:px-48 dark:text-gray-400">
        Invest in fractional real estate ownership across multiple blockchains
        (Core DAO Testnet & Bitcoin). Our platform seamlessly connects investors
        with diverse property opportunities, offering transparency, security,
        and liquidity through auction-based tokenization.
      </p>
      <p className="w-screen text-center mb-8 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 lg:px-48 dark:text-gray-400">
        For Bitcoin Investors, fear not! We use the{" "}
        <a
          href="https://docs.garden.finance/home/basics/"
          className="font-semibold"
        >
          Garden Finance SDK
        </a>{" "}
        to swap your BTC to wBTC and vice-versa, allowing you to invest in our
        cross-chain Real Estate Tokens!
      </p>
      <ConnectKitButton />
      {isConnected && (
        <div className="pt-8 flex flex-col items-center justify-center">
          <a
            href="/gardensdk"
            className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Get to Garden Finance!
          </a>
        </div>
      )}
    </div>
  );
};

export default HomePage;
