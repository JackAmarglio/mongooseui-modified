import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import { NotificationContainer, NotificationManager } from "react-notifications";
import "react-notifications/lib/notifications.css";
import './App.scss';
import Header from './component/header/header.component';
import DashboardPage from './pages/dashboard/dashboard.page';
import { metaMaskProvider } from './utils/wallet';
import { setInterval } from 'timers';
import VideoPlayer from "react-background-video-player";
import CreateTreeModal from './component/modal/create-tree.modal';
import BuySellModal from './component/modal/buysell.modal';
import Web3 from 'web3';
import home_background from "./assets/home-background.svg";

function App() {
  const [myTreeCount, setMyTreeCount] = useState(0);
  const [claimableRewards, setClaimableRewards] = useState(0);
  const [treeName, setTreeName] = useState("");
  const [isCreating, setIsCreateing] = useState(false);
  const [isTrading, setIsTrading] = useState(false);
  const [isBuy, setIsBuy] = useState(false);
  const [trees, setTrees] = useState();

  const toggleCreatingModal = () => {
    setIsCreateing(prev => !prev);
  }

  const toggleTradingModal = () => {
    setIsTrading(prev => !prev);
  }

  const onCreateTree = async () => {
    try {
      const success = await metaMaskProvider.createTree(treeName);
      if (success === true) {
        showSuccessMessage(`Created ${treeName} successfully`);
      } else {
        showErrorMessage("Creating TREE failed");
      }
    } catch(e) {
      console.log(e);
    }
  }

  const showErrorMessage = (message: any) => {
    NotificationManager.error(message, '', 5000);
  };

  const showSuccessMessage = (message: any) => {
    NotificationManager.success(message, '', 3000);
  };

  const showMessage = (success: boolean) => {
    if (success === true) {
      showSuccessMessage("Get SuperCowBoy NFT successfully!");
    } else {
      showErrorMessage("Get SuperCowBoy NFT failed!");
    }
  }

  const connectWallet = async () => {
    try {
      await metaMaskProvider.connect();
    } catch(e) {
      console.log(e);
    }
  }

  const metamaskDetect = () => {
    try {
      if (typeof window.ethereum !== 'undefined') {
        return true;
      }
    } catch(e) {
      console.log(e);
    }
    return false;
  }

  const fetchDisplayData = async () => {
    try {
      const mmInstalled = await metaMaskProvider.checkIfDetected();
      if (mmInstalled === false) {
        return;
      }

      const connectionStatus = await metaMaskProvider.checkConnectionStatus();
      if (connectionStatus === false) {
        return;
      }

      const trees = await metaMaskProvider.getTreesByUser();
      setTrees(trees);

      if (trees !== undefined) {
        let rewards:number = 0;
        for (let i = 0; i < trees.length; i ++) {
          const pendingReward = +trees[i].pendingReward;
          rewards += pendingReward;
        }
        const totalReward = +(rewards / 10**18).toFixed(6);
        setClaimableRewards(totalReward);
        const treeCount = trees.length;
        setMyTreeCount(treeCount);
      } else {
        setClaimableRewards(0);
        setMyTreeCount(0);
      }
    } catch(e) {
      console.log(e);
    }
  }

  useEffect(() => {
    const metamaskInstalled = metamaskDetect();
    if (metamaskInstalled === true) {
      connectWallet();
    } else {
      showErrorMessage("Please install metamask");
    }

    fetchDisplayData();
    setInterval(fetchDisplayData, 1000);
    
  }, []);


  return (
    <div className="App-wrap" style={{backgroundImage: `url(${home_background})`}}>
      <div className="App">
        <Header
          showErrorMessage={showErrorMessage}
          showSuccessMessage={showSuccessMessage}
        />
        <DashboardPage
          myTreeCount = {myTreeCount}
          claimableRewards = {claimableRewards}
          toggleCreatingModal = {toggleCreatingModal}
          trees = {trees}
          showErrorMessage = {showErrorMessage}
          showSuccessMessage = {showSuccessMessage}
          setIsBuy = { setIsBuy }
          toggleTradingModal = {toggleTradingModal}
        />
        <CreateTreeModal
          setTreeName = {setTreeName}
          isCreating = {isCreating}
          toggleCreatingModal = {toggleCreatingModal}
          onCreateTree = {onCreateTree}
          showErrorMessage = {showErrorMessage}
          showSuccessMessage = {showSuccessMessage}
          myTreeCount = {myTreeCount}
        />
        <BuySellModal 
          isTrading = {isTrading}
          toggleTradingModal = {toggleTradingModal}
          isBuy = {isBuy}
          showErrorMessage = {showErrorMessage}
          showSuccessMessage = {showSuccessMessage}
        />
        <NotificationContainer />
      </div>
    </div>
  );
}

export default App;
