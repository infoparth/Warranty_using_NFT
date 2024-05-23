import { ConnectButton } from "thirdweb/react";
import { createWallet, inAppWallet } from "thirdweb/wallets";
import { client } from "../../constants/Constant";
import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const wallets = [
    inAppWallet(),
    createWallet("io.metamask"),
    createWallet("com.coinbase.wallet"),
    createWallet("me.rainbow"),
  ];

  const connectedWallet = () => {
    navigate("/landing");
    console.log("The Value is not defined");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-[#c9def4] to-[#b8a4c9]">
      <h1 className="text-3xl font-bold mb-4">Welcome to D-Warranty</h1>
      <p className="text-lg mb-4">Please Connect your Wallet to proceed</p>
      <ConnectButton
        onConnect={connectedWallet}
        client={client}
        wallets={wallets}
      />
    </div>
  );
};

export default Home;
