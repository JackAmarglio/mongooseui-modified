import React, { useEffect } from 'react';
import "./treetable.component.scss";
import "./treetable_responsive.component.scss";
import { metaMaskProvider } from '../../utils/wallet';

const TreeTable = (props: any) => {

  const { trees, showErrorMessage, showSuccessMessage } = props;

  const onClaimReward = async (name: string) => {
    try {
      console.log(name);
      const success = await metaMaskProvider.claimRewards(name);
      if (success === true) {
        showSuccessMessage("Success");
      } else {
        showErrorMessage("Failed");
      }
    } catch(e) {
      console.log(e);
    }
  }

  const onPayMaintenance = async (name: string) => {
    try {
      const success = await metaMaskProvider.payMaintenance(name);
      if (success === true) {
        showSuccessMessage("Paid maintenance cost successfully");
      } else {
        showErrorMessage("Failed to pay maintenance cost");
      }
    } catch(e) {
      console.log(e);
    }
  }
  
  return (
    <div className="div-treetable">
      <div className="div-information">
        <table className="tbl-tree">
          {
            window.innerWidth > 700 ? 
              <thead className="tbl-header">
                <tr className="row-items">
                  <th className="header-title">Tree Name</th>
                  <th className="header-title">Creation Day</th>
                  <th className="header-title">Rewards</th>
                  <th className="header-title">Deadline</th>
                  <th className="header-title">Status</th>
                </tr>
              </thead>
            :
              <thead className="tbl-header">
                <tr className="row-items">
                  <th className="header-title">Tree Name</th>
                  <th className="header-title">Deadline</th>
                  <th className="header-title">Status</th>
                </tr>
              </thead>
          }
          <tbody className="tbl-body">
            { trees !== undefined && window.innerWidth > 700 &&
              trees.map((tree: any) => (
                <tr className="row-items" key={tree.treeName}>
                  <th className="sub-item">{tree.treeName}</th>
                  <th className="sub-item">{new Date(tree.creationTime * 1000).toLocaleString()}</th>
                  <th className="sub-item">{(tree.pendingReward / 10**18).toFixed(6)}</th>
                  <th className="sub-item">{new Date(tree.maintenanceDeadline * 1000).toLocaleString()}</th>
                  <th className="sub-item">
                    <div className="div-action">
                      <button className="btn-action" onClick={() => onClaimReward(tree.treeName)}>Claim</button>
                    </div>
                    <div className="div-action">
                      <button className="btn-action" onClick={() => onPayMaintenance(tree.treeName)}>Pay Maintenance</button>
                    </div>
                  </th>
                </tr>
              ))
            }

            { trees !== undefined && window.innerWidth <= 700 &&
              trees.map((tree: any) => (
                <tr className="row-items" key={tree.treeName}>
                  <th className="sub-item">{tree.treeName}</th>
                  <th className="sub-item">{new Date(tree.maintenanceDeadline * 1000).toLocaleString()}</th>
                  <th className="sub-item">
                    <div className="div-action">
                      <button className="btn-action" onClick={() => onClaimReward(tree.treeName)}>Claim</button>
                    </div>
                    <div className="div-action">
                      <button className="btn-action" onClick={() => onPayMaintenance(tree.treeName)}>Pay Maintenance</button>
                    </div>
                  </th>
                </tr>
              ))
            }
            
          </tbody>
        </table>
      </div>
      
    </div>
  );
}

export default TreeTable;