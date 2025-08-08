/**
 * Interface of TreeMemoService
 */
export interface ITreeMemoService {
  initNode(node: any);
  updateNode(node: any);
}

/**
 * Service for saving tree state (collapsed states)
 */
export class TreeMemoService implements ITreeMemoService {
  private nodeDataMap = new Map<string, any>();
  private localStorageName: string;

  public initNode(node: any) {
    if (node && node.key) {
      const key = node.key;
      let nodeData = this.nodeDataMap.get(key);
      if (nodeData) {
        node.isCollapsed = nodeData.isCollapsed;
      } else {
        nodeData = { key, isCollapsed: node.isCollapsed };
        this.nodeDataMap.set(nodeData.key, nodeData);
      }
    }
  }

  public updateNode(node: any) {
    if (node) {
      let nodeData = this.nodeDataMap.get(node.key);
      if (nodeData) {
        nodeData.isCollapsed = node.isCollapsed;
      } else {
        nodeData = { key: node.key, isCollapsed: node.isCollapsed };
        this.nodeDataMap.set(nodeData.key, nodeData);
      }
      this.saveLocalStorage();
    }
  }

  public setLocalStorageName(value: string) {
    this.localStorageName = value;
    this.loadFromLocalStorage();
  }

  private saveLocalStorage() {
    if (this.localStorageName) {
      const data = [...Array.from(this.nodeDataMap)];
      try {
        localStorage.setItem(this.localStorageName, JSON.stringify(data));
      } catch (ex) {
        // Data too big or error serializing
        const e = ex;
      }
    }
  }

  private loadFromLocalStorage() {
    if (this.localStorageName) {
      const lsValue = localStorage.getItem(this.localStorageName);
      if (lsValue) {
        this.nodeDataMap = new Map(JSON.parse(lsValue));
      }
    }
  }
}
