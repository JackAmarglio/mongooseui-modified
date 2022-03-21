import { useState } from 'react';
import Modal from 'react-modal';
import { metaMaskProvider } from '../../utils/wallet';
import "./buysell.modal.scss";

const BuySellModal = (props: any) => {

  const { isTrading, toggleTradingModal, isBuy, showErrorMessage, showSuccessMessage } = props;
  const [tokenAmount, setTokenAmount] = useState(0);

  const onChange = async (e: any) => {
    try {
      setTokenAmount(e.target.value);
    } catch(e) {
      console.log(e);
    }
  }

  const onTradeing = async () => {
    try {
      if (await metaMaskProvider.checkConnectionStatus() === false) {
        showErrorMessage("Connect to your wallet first.");
        return;
      }
      let success = false;
      if (tokenAmount === 0) {
        showErrorMessage("Input correct token amount.");
        return;
      }

      toggleTradingModal();

      if (isBuy === true) {
        success = await metaMaskProvider.buyToken(tokenAmount);
      } else {
        const balance = await metaMaskProvider.getBullTokenBalance();
        console.log(`balance is ${balance}`);
        console.log(`sell amount is ${tokenAmount}`);
        if (balance < tokenAmount) {
          showErrorMessage("Not enough balance");
          return;
        }
        success = await metaMaskProvider.sellToken(tokenAmount);
      }
      
      if (success === false) {
        showErrorMessage("Failed");
      } else {
        showSuccessMessage("Succeed");
      }
    } catch(e) {
      console.log(e);
    }
  }

  return (
    <Modal
      isOpen={isTrading}
      onRequestClose={toggleTradingModal}
      contentLabel="Trading dialog"
      className="trademodal"
      overlayClassName="modaloverlay"
      closeTimeoutMS={500}
      ariaHideApp={false}
      shouldCloseOnOverlayClick={false}
    >
      <p className="modal-title">Input the token amount for trading</p>
      <div className="modal-body">
        <div className="div-input">
          <input className="token-amount" onChange={(e) => onChange(e)} />
        </div>
        <div className="div-buttons">
          <button className="btn action-trade" onClick={() => onTradeing()}>{isBuy === true ? 'Buy' : 'Sell'}</button>
          <button className="btn action-cancel" onClick={() => toggleTradingModal()}>Cancel</button>
        </div>
      </div>
    </Modal>
  );
};

export default BuySellModal;
