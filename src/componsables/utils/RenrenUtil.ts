/**
 * @description 工具函数模块
 * @author FluffyChi-Xing
 */
import html2canvas from 'html2canvas';


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
