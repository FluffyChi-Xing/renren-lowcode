/**
 * @description 工具函数模块
 * @author FluffyChi-Xing
 */


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
