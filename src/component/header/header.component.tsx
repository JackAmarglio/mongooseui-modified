import React, { useEffect, useState } from 'react';
import "./header.component.scss";

import { metaMaskProvider } from '../../utils/wallet';


const Header = (props: any) => {
  const [walletAddress, setWalletAddress] = useState("Connect");
  const {showErrorMessage, showSuccessMessage} = props;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  useEffect(() => {
    const metamaskInstalled = metamaskDetect();
    if (metamaskInstalled === true) {
      connectWallet();
      window.ethereum.on("accountsChanged", (accounts: any) => {
        if (accounts.length > 0) {
          connectWallet();
        } else {
          setWalletAddress("Connect");
        }
      });
    } else {
      showErrorMessage("Please install metamask");
    }
    
  }, []);

  const connectWallet = async () => {
    try {
      await metaMaskProvider.connect();
      const curAddress = await metaMaskProvider.currentUser();
      if (curAddress !== undefined) {
        setWalletAddress(curAddress);
      } else {
        setWalletAddress("Connect");
      }
    } catch(e) {
      console.log(e);
    }
  }
  return (
    <header className={isMenuOpen === false ? "div-header": "div-header open"}>
      {
        window.innerWidth > 570 &&
          <div className={isMenuOpen === false ? "div-nabs" : "div-nabs open"}>
            <nav role="navigation" className="nav-tabs">
              <a href="https://solidity.finance/audits/Mongoose/" className="button w-button" onClick={() => setIsMenuOpen(false)}>AUDIT</a>
              <a href="http://www.twitter.com/mongoosecoindev" className="button w-button" onClick={() => setIsMenuOpen(false)}>dev twitter</a>
              <a href="#" className="button w-button">Twitter</a>
              <a href="https://discord.com/invite/483sEZzwjP" className="button w-button" onClick={() => setIsMenuOpen(false)}>DISCORD</a>
              <a href="https://t.me/mongooseportal" className="button w-button" onClick={() => setIsMenuOpen(false)}>TELEGRAM</a>
            </nav>
          </div>
      }
      <div className="div-connection">
        <button className="btn-connect" onClick={() => connectWallet()}>{walletAddress}</button>
      </div>
      <div 
        className={isMenuOpen === false ? "div-menu" : "div-menu open" } 
        aria-label="menu" 
        role="button" 
        aria-controls="w-nav-overlay-0" 
        aria-haspopup="menu" 
        aria-expanded="false"
        onClick={() => { setIsMenuOpen(prev => !prev); }}
      >
        <div className="menu-line top-line" />
        <div className="menu-line middle-line sdsd" />
        <div className="menu-line last-line" />
      </div>

      {
        window.innerWidth <= 570 &&
          <div className={isMenuOpen === false ? "div-nabs" : "div-nabs open"}>
            <nav role="navigation" className="nav-tabs">
              <a href="https://solidity.finance/audits/Mongoose/" className="button w-button" onClick={() => setIsMenuOpen(false)}>AUDIT</a>
              <a href="http://www.twitter.com/mongoosecoindev" className="button w-button" onClick={() => setIsMenuOpen(false)}>dev twitter</a>
              <a href="#" className="button w-button">Twitter</a>
              <a href="https://discord.com/invite/483sEZzwjP" className="button w-button" onClick={() => setIsMenuOpen(false)}>DISCORD</a>
              <a href="https://t.me/mongooseportal" className="button w-button" onClick={() => setIsMenuOpen(false)}>TELEGRAM</a>
            </nav>
          </div>
      }
    </header>
  );
}

export default Header;