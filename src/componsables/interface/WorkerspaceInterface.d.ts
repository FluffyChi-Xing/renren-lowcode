/**
 * @description 工作区接口聚合模块
 * @author FluffyChi-Xing
 */



declare namespace WorkerSpaceInterface {


  type fileTreeItem = {
    icon: string;
    path: string;
    name: string;
    data: string;
  };

  /**
   * @description 文件目录树类型
   */
  interface IFileTree {
    children: IFileTree[];
    id: string;
    label: fileTreeItem;
  }


  type IRouteMeta = {
    title: string;
  }


  /**
   * @description 基础路由类型
   */
  type IRoute = {
    path: string;
    name: string;
    meta?: IRouteMeta;
  }
}
