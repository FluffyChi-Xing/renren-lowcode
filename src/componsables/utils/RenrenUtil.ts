/**
 * @description 工具函数模块
 * @author FluffyChi-Xing
 */
import html2canvas from 'html2canvas';
import {RenrenMaterialModel} from "@/componsables/models/MaterialModel";
import {MaterialDocumentModel} from "@/componsables/models/MaterialModel";
import dayjs from "dayjs";


/**
 * @description 禁用默认的 drop 事件
 * @param event
 */
export function forbidPreventDrop<T extends MouseEvent>(event: T): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    try {
      if (event) {
        event.preventDefault();
      } else {
        reject('事件对象不存在');
      }
    } catch (e) {
      console.log('禁用默认drop事件失败', e);
      reject('禁用默认drop事件失败');
    }
  });
}


/**
 * @description 获取元素上的伪元素样式
 * @param event
 */
export function getPseudoElement<T extends HTMLElement | undefined, R extends CSSStyleDeclaration>(event: T): Promise<R> {
  return new Promise<R>((resolve, reject) => {
    try {
      if (event) {
        const pseudoStyle = window.getComputedStyle(event, '::before') as R;
        resolve(pseudoStyle);
      } else {
        reject('事件对象不存在');
      }
    } catch (e) {
      console.log('获取伪元素失败', e);
      reject('获取伪元素失败');
    }
  });
}


/**
 * @description 打开外部链接工具函数
 * @param link
 * @param method
 */
export function openExternalLink(link: string, method?: '_self' | '_blank' | '_parent' | '_top'): Promise<string> {
  return new Promise<string>((resolve, reject) =>{
    try {
      if (link) {
        // TODO: 判断是否是外部链接
        window.open(link, method || '_blank');
      } else {
        reject('链接不存在');
      }
    } catch (e) {
      console.error('打开外部链接失败', e);
      reject('打开外部链接失败');
    }
  });
}


/**
 * @description 容器截图工具函数
 * @param containerElement
 */
export function takeScreenPhoto(containerElement: HTMLElement): Promise<string> {
  return new Promise<string>((resolve, reject) =>{
    try {
      if (containerElement) {
        html2canvas(containerElement).then((canvasElement) => {
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          canvas.width = containerElement.offsetWidth;
          canvas.height = containerElement.offsetHeight;
          // 现在可以安全地使用 drawImage 方法
          context?.drawImage(canvasElement, 0, 0, canvas.width, canvas.height);
          // 转换为数据 URL
          const dataUrl = canvas.toDataURL('image/png');
          resolve(dataUrl);
        }).catch((error) => {
          console.error('截图失败', error);
          reject('截图失败');
        });
      } else {
        reject('容器元素不存在');
      }
    } catch (e) {
      console.error('截图失败', e);
      reject('截图失败');
    }
  });
}


/**
 * @description 判断元素是否为物料类型
 * @param element
 */
export function isElementAMaterialModelType(element: RenrenMaterialModel | MaterialDocumentModel | undefined): boolean {
  if (element !== void 0) {
    return element?.type === 'material';
  } else {
    return false;
  }
}


/**
 * @description 判断一个对象是否为空
 * @param item
 */
export function isEmpty<T extends Object>(item: T | undefined): boolean {
  if (item !== void 0) {
    return Object.keys(item).length === 0 && item?.constructor === Object;
  } else {
    return true;
  }
}


/**
 * @description 深克隆一个对象
 * @param item
 */
export function deepClone<T extends Object>(item: T): T {
  try {
    return JSON.parse(JSON.stringify(item)) as T;
  } catch (e) {
    throw new Error('failed to clone item -- ' + e);
  }
}


/**
 * @description 页面刷新
 */
export function refreshPage(): void {
  location.reload();
}


/**
 * @description 判断物料的属性节点的属性是否为空
 * @param item
 */
export function isMaterialPropItemsEmpty(item: RenrenMaterialModel | undefined): boolean {
  if (item !== void 0) {
    return Array.isArray(item?.props?.items) && item?.props?.items.length === 0;
  } else {
    return true;
  }
}



export function isMaterial(item: RenrenMaterialModel | MaterialDocumentModel | undefined): boolean;


export function isMaterial(item: RenrenMaterialModel | MaterialDocumentModel | undefined, callback?: Function): Promise<string>;


/**
 * @description 检查一个元素是否是一个物料节点
 * @param item
 * @param callback
 */
export function isMaterial(item: RenrenMaterialModel | MaterialDocumentModel | undefined, callback?: Function): boolean | Promise<string> {
  if (item !== void 0) {
    if (callback) {
      return new Promise<string>((resolve, reject) => {
        if (item.type === 'material') {
          callback();
          resolve('success');
        } else {
          reject('不是物料类型');
        }
      });
    } else {
      return item.type === 'material';
    }
  } else {
    return false;
  }
}

/**
 * @description 检查一个元素是否为一个文档节点
 * @param item
 */
// 重载签名1：同步返回 boolean
export function isDocument(item: RenrenMaterialModel | MaterialDocumentModel | undefined): boolean;

// 重载签名2：带回调，返回 Promise<string>
export function isDocument(item: RenrenMaterialModel | MaterialDocumentModel | undefined, callback: () => void): Promise<string>;

// 实现签名（必须兼容所有重载）
export function isDocument(item: RenrenMaterialModel | MaterialDocumentModel | undefined, callback?: () => void): boolean | Promise<string> {
  if (item !== void 0) {
    if (callback) {
      return new Promise<string>((resolve, reject) => {
        if (item.type === 'document') {
          callback(); // 可选执行回调
          resolve('success');
        } else {
          reject('不是文档节点类型');
        }
      });
    } else {
      return item.type === 'document';
    }
  } else {
    return false;
  }
}



/**
 * @description json 类型转换
 * @param item
 */
export function jsonTypeTransfer<T>(item: unknown): T {
  return item as T;
}


/**
 * @description 日期转换包装函数
 * @param date
 * @param format
 */
export function dateTransform(date: string | undefined, format: string): string {
  try {
    return dayjs(date).format(format);
  } catch (e) {
    console.error('dateTransform error', e);
    return '日期转换错误';
  }
}
