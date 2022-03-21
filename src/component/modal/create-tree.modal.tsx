import { useState } from 'react';
import Modal from 'react-modal';
import { metaMaskProvider } from '../../utils/wallet';
import "./create-tree.modal.scss";

const CreateTreeModal = (props: any) => {

  const { 
    isCreating, 
    setTreeName, 
    toggleCreatingModal, 
    onCreateTree, 
    showErrorMessage, 
    showSuccessMessage, 
    myTreeCount
  } = props;

  const [name, setName] = useState("");

  const onChange = (e: any) => {
    try {
      const treeName = e.target.value;
      setTreeName(treeName);
      setName(treeName);
    } catch (e) {
      console.log(e);
    }
  }

  const onClickCreateTree = async () => {
    try {
      if (await metaMaskProvider.checkConnectionStatus() === false) {
        showErrorMessage("Connect to your wallet first.");
        return;
      }
      const balance = await metaMaskProvider.getBullTokenBalance();
      if (balance < 10) {
        showErrorMessage("Not enough balance. You need 10 BULL tokens.");
        return;
      }
      if (name === "") {
        showErrorMessage("Type TREE name.");
        return;
      }
      const limitCount: any = process.env.TREE_WALLET_LIMIT;
      if (myTreeCount === limitCount) {
        showErrorMessage("Limit MAX TREE count.");
        return;
      }
      const isNameExist = await metaMaskProvider.isNameExist(name);
      if (isNameExist === true) {
        showErrorMessage("Type unique TREE name.");
        return;
      }
      toggleCreatingModal();
      await onCreateTree();
    } catch(e) {
      console.log(e);
    }
  }

  return (
    <Modal
      isOpen={isCreating}
      onRequestClose={toggleCreatingModal}
      contentLabel="Creating dialog"
      className="treemodal"
      overlayClassName="modaloverlay"
      closeTimeoutMS={500}
      ariaHideApp={false}
      shouldCloseOnOverlayClick={false}
    >
      <p className="modal-title">Create your TREE</p>
      <div className="modal-body">
        <p className="txt-requirement">TREE requires 10 Tokens to get a node</p>
        <p className="txt-description">Yield rewards will be subject to change based on runway and Treasury performance.</p>
        <div className="div-input">
          <input className="tree-name" onChange={(e) => onChange(e)} />
        </div>
        <div className="div-buttons">
          <button className="btn action-create" onClick={() => onClickCreateTree()}>Create Tree</button>
          <button className="btn action-cancel" onClick={() => toggleCreatingModal()}>Cancel</button>
        </div>
      </div>
    </Modal>
  );
};

export default CreateTreeModal;
