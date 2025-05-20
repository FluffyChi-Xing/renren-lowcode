/**
 * @description 工作区接口聚合模块
 * @author FluffyChi-Xing
 */



declare namespace WorkerSpaceInterface {


  type fileTreeItem = {
    icon: string;
    path: string;
    name: string;
  };

  /**
   * @description 文件目录树类型
   */
  interface IFileTree {
    children: IFileTree[];
    id: string;
    label: fileTreeItem;
  }
}
