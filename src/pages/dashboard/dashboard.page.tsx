import React, { useState } from 'react';
import "./dashboard.page.scss";
import "./dashboard_reponsive.page.scss";
import TreeTable from '../../component/treetable/treetable.component';
import { metaMaskProvider } from '../../utils/wallet';

const DashboardPage = (props: any) => {
  const {
    myTreeCount, 
    claimableRewards,
    toggleCreatingModal,
    trees,
    showErrorMessage,
    showSuccessMessage,
    setIsBuy,
    toggleTradingModal
  } = props;

  const onAddToken = async () => {
    if (await metaMaskProvider.checkConnectionStatus() === false) {
      showErrorMessage("Connect to your wallet first.");
      return;
    }
    await metaMaskProvider.importToken();
  }

  const onClickBuy = () => {
    setIsBuy(true);
    toggleTradingModal();
  }

  const onClickSell = () => {
    setIsBuy(false);
    toggleTradingModal();
  }

  const onPayAllMaintenanceFee = async () => {
    let success = false;
    try {
      if (await metaMaskProvider.checkConnectionStatus() === false) {
        showErrorMessage("Connect to your wallet first.");
        return;
      }
      // success = await metaMaskProvider.payAllMaintenance();

      // TODO test code
      success = await metaMaskProvider.addLiquidity();
    } catch(e) {
      console.log(e);
    }
    if (success === true) {
      showSuccessMessage("Paying all maintenance fee successfully");
    } else {
      showErrorMessage("Paying all maintenance fee failed");
    }
  }

  // TODO test code
  const onClickCowBoyNFT = async () => {
    let success = false;
    try {
      if (await metaMaskProvider.checkConnectionStatus() === false) {
        showErrorMessage("Connect to your wallet first.");
        return;
      }
      if (trees === undefined) {
        return;
      }
      const length = trees.length > 10 ? 10 : trees.length;
      let treeNames: Array<string> = Array<string>();
      for (let i = 0; i < length; i ++) {
        treeNames.push(trees[i].treeName);
      }
      let reward: any = 0.4;
      success = await metaMaskProvider.setCowBoyStatus(treeNames, reward);
    } catch(e) {
      console.log(e);
    }
    if (success === true) {
      showSuccessMessage("Geting cowboy NFT successfully");
    } else {
      showErrorMessage("Geting cowboy NFT failed");
    }
  }

  const onGetTotalSupply = async () => {
    try {
      const totalSupply = await metaMaskProvider.getTotalSupply();
      showSuccessMessage(`totalSupply count is ${totalSupply}`);
    } catch(e) {
      console.log(e);
    }
  }

  // TODO test code
  const onClickSuperCowBoyNFT = async () => {
    let success = false;
    try {
      if (await metaMaskProvider.checkConnectionStatus() === false) {
        showErrorMessage("Connect to your wallet first.");
        return;
      }
      if (trees === undefined) {
        return;
      }
      const length = trees.length > 10 ? 10 : trees.length;
      let treeNames: Array<string> = Array<string>();
      for (let i = 0; i < length; i ++) {
        treeNames.push(trees[i].treeName);
      }
      let reward: any = 0.8;
      success = await metaMaskProvider.setCowBoyStatus(treeNames, reward);
    } catch(e) {
      console.log(e);
    }
    if (success === true) {
      showSuccessMessage("Geting super cowboy NFT successfully");
    } else {
      showErrorMessage("Geting super cowboy NFT failed");
    }
  }

  // TODO test code
  const onBurnToken = async () => {
    let success = false;
    try {
      if (await metaMaskProvider.checkConnectionStatus() === false) {
        showErrorMessage("Connect to your wallet first.");
        return;
      }
      const tokenBalance = await metaMaskProvider.getBullTokenBalance();
      if (tokenBalance < 10) {
        showErrorMessage("Not enough bull token balance.");
        return;
      }
      success = await metaMaskProvider.burnToken(10);
    } catch(e) {
      console.log(e);
    }
    if (success === true) {
      showSuccessMessage("Burning BULL token successfully");
    } else {
      showErrorMessage("Burning BULL token failed");
    }
  }

  // TODO test code
  const onAddBlackList = async () => {
    let success = false;
    try {
      if (await metaMaskProvider.checkConnectionStatus() === false) {
        showErrorMessage("Connect to your wallet first.");
        return;
      }
      success = await metaMaskProvider.addBlackList("0x0828C1D74F576912Ed3d2F3640041fC4f2BFFC2E");
    } catch(e) {
      console.log(e);
    }
    if (success === true) {
      showSuccessMessage("Adding blacklist successfully");
    } else {
      showErrorMessage("Adding blacklist failed");
    }
  }

  return (
    <div className="div-dashboard">
      <div className="div-information">
        <div className="sub-info">
          <h6 className="txt-title">My Trees</h6>
          <h5 className="txt-amount">{myTreeCount}</h5>
        </div>
        
        <div className="sub-info">
          <h6 className="txt-title">Claimable Rewards</h6>
          <h5 className="txt-amount">{claimableRewards}</h5>
        </div>

        {/* <div className="sub-info">
          <div className="div-action" onClick={() => onClickCowBoyNFT()}>GET COWBOY NFT</div>
          <div className="div-action" onClick={() => onClickSuperCowBoyNFT()}>GET SUPER COWBOYNFT</div>
          <div className="div-action" onClick={() => onBurnToken()}>BURN 10 TOKENS</div>
          <div className="div-action" onClick={() => onAddBlackList()}>SET THIS ADDRESS TO BLACKLIST</div>
          <div className="div-action" onClick={() => onGetTotalSupply()}>GET Total Supply</div>
        </div> */}

        <div className="sub-info">
          <div className="div-action" onClick={() => onAddToken()}>ADD TOKEN</div>
          <div className="div-action" onClick={() => toggleCreatingModal()}>CREATE A TREE</div>
          <div className="div-action" onClick={() => onClickBuy()}>BUY BULL</div>
          <div className="div-action" onClick={() => onClickSell()}>SELL BULL</div>
          <div className="div-action" onClick={() => onPayAllMaintenanceFee()}>PAY ALL MAINTENANCE FEE</div>
        </div>
      </div>

      <TreeTable 
        trees = {trees} 
        showSuccessMessage = {showSuccessMessage}
        showErrorMessage = {showErrorMessage}
      />

      
      
    </div>
  );
}

export default DashboardPage;