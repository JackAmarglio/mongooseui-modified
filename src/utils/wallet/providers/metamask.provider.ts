import Web3 from 'web3';
import { AbiItem, toWei } from 'web3-utils';
import { OptionalTuple } from '../../types';
import { IMetaMaskProvider } from '../interfaces';
import BullContract from "../../../contract/BullToken.json";

export class MetaMaskProvider implements IMetaMaskProvider {
  private readonly wallet: Web3;
  private readonly eth = window.ethereum;
  private readonly tokenAddress = "0x119c6bE3817Ab8C05862319D66660Da509855628";
  private readonly tokenContract;
  private readonly claimFee = 5;  // $5
  private readonly maintenanceFee = 30; // $30
  private readonly tokenPrice = 10; // $10

  constructor() {
    this.wallet = new Web3(this.eth);
    this.tokenContract = new this.wallet.eth.Contract(BullContract.abi as AbiItem[],this.tokenAddress);
  }

  async connect(): Promise<void> {
    try {
      if (this.eth) {
          await this.eth.request({ method: 'eth_requestAccounts' });
      }
    } catch(e) {
      console.log('error in "connect" method of MetaMask:', e);
    }
  }

  checkIfDetected(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (this.eth !== undefined) {
        return resolve(true);
      }

      if (this.eth === undefined) {
        return resolve(false);
      }

      return reject();
    });
  }

  async getBalance(address: string): Promise<OptionalTuple<string, Error>> {
    try {
      const balance = await this.wallet.eth.getBalance(address);

      return [balance, null];
    } catch (err) {
      const error = err as Error;

      return [null, error];
    }
  }

  async getAccounts(): Promise<OptionalTuple<string[], Error>> {
    try {
      const accounts = await this.wallet.eth.getAccounts();

      return [accounts, null];
    } catch (err) {
      const error = err as Error;

      return [null, error];
    }
  }

  async checkIfLocked(): Promise<boolean> {
    const [accounts, error] = await this.getAccounts();

    if (error !== null) {
      return true;
    }

    if (accounts!.length === 0) {
      return true;
    }

    return false;
  }

  async currentUser(): Promise<string> {
    const [accounts, error] = await this.getAccounts();

    if (accounts !== null) {
      return accounts[0];
    }

    return "Connect";
  }

  async checkConnectionStatus(): Promise<boolean> {
    if (this.eth) {
      const walletAddress = await this.currentUser();
       if (walletAddress === undefined) {
         return false;
       }
      return true;
    }
    return false;
  }

  async createTree(treeName: string): Promise<boolean> {
    try {
      const currentWallet = await this.currentUser();
      await this.tokenContract.methods.createTree(treeName).send({
        from: currentWallet,
        gas: 3000000,
        gaslimit: 3000000
      });
      console.log("action succeed.");
      return true;
    } catch(e) {
      console.log(e);
    }

    return false;
  }

  async getTreesByUser(): Promise<any> {
    try {
      const currentWallet = await this.currentUser();
      const trees = await this.tokenContract.methods.getUserTrees(currentWallet).call();
      return trees;
    } catch(e) {
      console.log(e);
    }

    return undefined;
  }

  async isNameExist(name: string): Promise<boolean> {
    try {
      const currentWallet = await this.currentUser();
      const isExist = await this.tokenContract.methods.isNameExist(currentWallet, name).call();
      return isExist;
    } catch(e) {
      console.log(e);
    }
    return false;
  }

  async burnToken(burnAmount: any): Promise<boolean> {
    try {
      const currentWallet = await this.currentUser();
      await this.tokenContract.methods.burn(toWei(burnAmount.toString())).send({
        from: currentWallet,
        gas: 3000000,
        gaslimit: 3000000
      });
      return true;
    } catch(e) {
      console.log(e);
    }
    return false;
  }

  async addBlackList(blackAddress: string): Promise<boolean> {
    try {
      const currentWallet = await this.currentUser();
      await this.tokenContract.methods.addBlackList(blackAddress).send({
        from: currentWallet,
        gas: 3000000,
        gaslimit: 3000000
      });
      return true;
    } catch(e) {
      console.log(e);
    }
    return false;
  }

  async getETHPrice(): Promise<any> {
    try {
      const amount = await this.tokenContract.methods.getLatestPrice().call();
      const price = amount / 10**8;
      return price;
    } catch(e) {
      console.log(e);
    }
    return 0;
  }

  async getMyTreeCount(): Promise<number> {
    try {
      const currentWallet = await this.currentUser();
      const treeCount = await this.tokenContract.methods.getTreeCount(currentWallet).call();
      return treeCount;
    } catch(e) {
      console.log(e);
    }

    return 0;
  }

  async getBullTokenBalance(): Promise<number> {
    try {
      const currentWallet = await this.currentUser();
      let balance = await this.tokenContract.methods.balanceOf(currentWallet).call();
      balance = Web3.utils.fromWei(balance);
      return balance;
    } catch(e) {
      console.log(e);
    }
    return 0;
  }

  async getClaimFee(): Promise<number> {
    try {
      let maticRate: any = await this.getETHPrice();
      let claimMaic = this.claimFee / maticRate;
      claimMaic = +claimMaic.toFixed(18);
      claimMaic += 1/10**18;
      return claimMaic;
    } catch(e) {
      console.log(e);
    }
    return 0;
  }

  async getMaintenanceFee(): Promise<number> {
    try {
      let maticRate: any = await this.getETHPrice();
      let maintenanceMatic = this.maintenanceFee / maticRate;
      maintenanceMatic = +maintenanceMatic.toFixed(18);
      maintenanceMatic += 1/10**18;
      return maintenanceMatic;
    } catch(e) {
      console.log(e);
    }
    return 0;
  }

  async claimRewards(treeName: string): Promise<boolean> {
    try {
      console.log(`claiming ${treeName}`);
      const currentWallet = await this.currentUser();
      const desiredMatic = await this.getClaimFee();
      if (desiredMatic === 0) {
        return false;
      }
      console.log(desiredMatic);
      await this.tokenContract.methods.claimReward(treeName).send({
        from: currentWallet,
        value: toWei(desiredMatic.toString(), "ether"),
        gas: 3000000,
      });
      console.log("action succeed!");
      return true;
    } catch(e) {
      console.log(e);
    }

    return false;
  }

  async payMaintenance(treeName: string): Promise<boolean> {
    try {
      const currentWallet = await this.currentUser();
      const desiredMatic = await this.getMaintenanceFee();
      console.log(desiredMatic);
      if (desiredMatic === 0) {
        return false;
      }
      await this.tokenContract.methods.payMaintenance(treeName).send({
        from: currentWallet,
        value: toWei(desiredMatic.toString(), "ether"),
        gas: 3000000,
      });
      console.log("action succeed!");
      return true;
    } catch(e) {
      console.log(e);
    }
    return false;
  }

  async payAllMaintenance(): Promise<boolean> {
    try {
      const currentWallet = await this.currentUser();
      const treeCount = await this.getMyTreeCount();
      const desiredMatic = await this.getMaintenanceFee() * treeCount;
      await this.tokenContract.methods.payMaintenanceAll().send({
        from: currentWallet,
        value: toWei(desiredMatic.toString(), "ether")
      });
      return true;
    } catch(e) {
      console.log(e);
    }
    return false;
  }

  async buyToken(tokenAmount: number): Promise<boolean> {
    try {
      const maticRate = await this.getETHPrice();
      const desiredMatic = tokenAmount * this.tokenPrice / maticRate;

      const currentWallet = await this.currentUser();
      await this.tokenContract.methods.buy(
        Web3.utils.toWei(tokenAmount.toString())
      ).send({
        from: currentWallet,
        value: toWei(desiredMatic.toString(), "ether"),
        gas: 3000000,
        gasLimit: 3000000
      });

      return true;
    } catch(e) {
      console.log(e);
    }
    return false;
  }

  async sellToken(tokenAmount: number): Promise<boolean> {
    try {
      const currentWallet = await this.currentUser();
      await this.tokenContract.methods.sell(Web3.utils.toWei(tokenAmount.toString())).send({
        from: currentWallet,
      });
      console.log("action succeed!");
      return true;
    } catch(e) {
      console.log(e);
    }
    return false;
  }

  async importToken(): Promise<void> {
    try {
      const tokenSymbol = 'BULL';
      const tokenDecimals = 18;

      await this.eth.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address: this.tokenAddress, // The address that the token is at.
            symbol: tokenSymbol, // A ticker symbol or shorthand, up to 5 chars.
            decimals: tokenDecimals, // The number of decimals in the token
          },
        },
      });
    } catch(e) {
      console.log(e);
    }
  }

  async setCowBoyStatus(treeNames: string[], cowBoyReward: number): Promise<boolean> {
    try {
      const currentWallet = await this.currentUser();
      await this.tokenContract.methods.setCowBoyStatus(
        treeNames,
        toWei(cowBoyReward.toString())
      ).send({
        from: currentWallet,
        gas: 3000000,
        gasLimit: 3000000
      });
      return true;
    } catch(e) {
      console.log(e);
    }
    return false;
  }

  async getTotalSupply(): Promise<number> {
    try {
      const supply = await this.tokenContract.methods.totalSupply().call();
      return supply / 10**18;
    } catch(e) {
      console.log(e);
    }
    return 0;
  }

  async addLiquidity(): Promise<boolean> {
    try {
      const currentWallet = await this.currentUser();
      await this.tokenContract.methods.makeLiquidity(BigInt(1000 * 10**18)).send({
        from: currentWallet,
        value: toWei("0.01", "ether"),
        gas: 3000000,
      });
      return true;
    } catch(e) {
      console.log(e);
    }
    return false;
  }

}