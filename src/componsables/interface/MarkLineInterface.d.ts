export namespace MarkLineInterface {
  export interface linePositionType {
    isNearly: boolean; // 是否接近
    lineNode: HTMLElement | undefined; // 线节点
    line: string;
    dragShift: number; // 拖动偏移量
    lineShift: number; // 线偏移量
  }
}
