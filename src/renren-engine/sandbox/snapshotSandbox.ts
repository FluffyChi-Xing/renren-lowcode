/**
 * @description 基于 diff 的 sandbox,用于解决不支持 proxy 的低版本浏览器
 * @author FluffyChi-Xing
 */

import type { EngineTypes } from "@/renren-engine/componsables/types/EngineTypes";


/**
 * @description 遍历对象
 * @param obj
 * @param callback
 */
function iter(obj: typeof window | Record<any, any>, callback: (prop: any) => void): void {
  for (let objKey in obj) {
    if (obj.hasOwnProperty(objKey) || objKey === 'clearInterval') {
      callback(objKey);
    }
  }
}


/**
 * @description 基于 diff 的沙箱，用于处理浏览器对 proxy api 的兼容性问题
 */
export default class SnapshotSandbox implements EngineTypes.ISandbox {
  isRunning: boolean = true;
  latestSetProp: PropertyKey | null = null;
  name: string;
  proxy: EngineTypes.WindowProxy;
  type: string;
  private windowSnapshot!: Window;
  private modifyPropsMap: Record<any, any> = {};
  private deletePropsMap: Set<any> = new Set<any>();
  private document: Document = document;


  constructor(name: string) {
    this.name = name;
    this.proxy = window;
    this.type = 'snapshot';
  }


  active(): void {
    // 保存当前的快照
    this.windowSnapshot = {} as Window;
    iter(window, (prop: any) => {
      this.windowSnapshot[prop] = window[prop];
    });
    // 恢复之前的变更
    Object.keys(this.modifyPropsMap).forEach((prop: any) => {
      window[prop] = this.modifyPropsMap[prop];
    });
    // 删除之前删除的属性
    this.deletePropsMap.forEach((prop: any) => {
      delete window[prop];
    });
    this.isRunning = true;
  }


  inactive(type: string = 'test'): void {
    this.modifyPropsMap = {};
    this.deletePropsMap.clear();
    // 记录变更,恢复环境
    iter(window, (prop: any) => {
      if (window[prop] !== this.windowSnapshot[prop]) {
        this.modifyPropsMap[prop] = window[prop];
        window[prop] = this.windowSnapshot[prop];
      }
    });
    // 记录被删除的属性，恢复环境
    iter(this.windowSnapshot, (prop: any) => {
      if (!window.hasOwnProperty(prop)) {
        this.deletePropsMap.add(prop);
        window[prop] = this.windowSnapshot[prop];
      }
    });


    if (type === 'development') {
      console.info(
        `[renren:engine] ${this.name} origin window restore ...`,
        Object.keys(this.modifyPropsMap),
        this.deletePropsMap.keys(),
      );
    }

    this.isRunning = false;
  }

  patchDocument(doc: Document): void {
    this.document = doc;
  }
}
