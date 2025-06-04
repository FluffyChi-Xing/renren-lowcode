/**
 * @description 定位标线类型模块
 * @author FluffyChi-Xing
 */

declare namespace MarkLineInterface {


  /**
   * @description 标线配置类型
   */
  interface ILineConfig {
    isNearly: boolean; // 是否接近
    lineNode: HTMLElement | undefined; // 线节点
    line: string;
    dragShift: number; // 拖动偏移量
    lineShift: number; // 线偏移量
  }


  /**
   * @description  标线条件类型
   */
  interface ILineCondition {
    top: ILineConfig[];
    left: ILineConfig[];
  }
}
