/**
 * @description 拖拽钩子
 * @author FluffyChi-Xing
 */


export function dragStart<E extends Event>(e: E, func?: Function): Promise<any> {
  return new Promise<any>((resolve, reject) => {
    try {
      if (e) {

      } else {
        reject('拖拽开始失败');
      }
    } catch (e) {
      console.log('拖拽开始失败', e);
    }
  });
}
