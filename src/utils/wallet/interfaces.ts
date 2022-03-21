export interface IMetaMaskProvider {
  checkIfDetected(): Promise<boolean>;
  checkIfLocked(): Promise<boolean>;
  connect(): Promise<void>;
  checkConnectionStatus(): Promise<boolean>;
  createTree(treeName: string): Promise<boolean>;
  getMyTreeCount(): Promise<number>;
  importToken(): Promise<void>;
  getTreesByUser(): Promise<any>;
  claimRewards(treeName: string): Promise<boolean>;
}