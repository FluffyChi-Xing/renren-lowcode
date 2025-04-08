/**
 * @description 画布工具模块
 * @author FluffyChi-Xing
 */
import type {RenrenInterface} from "@/componsables/interface/RenrenInterface";
import { debounce } from "lodash-es";
import {RenrenMaterialModel} from "@/componsables/models/MaterialModel";


/**
 * @description 获取光标坐标
 * 1. 当 wait 存在时，会在 wait 时间内防抖
 * 2. 当 wait 不存在时，会立即返回光标坐标
 * 3. 当 event 不存在时，会返回空对象
 * 4. 当 event 存在时，会返回光标坐标
 * @param event
 * @param wait
 * @param container
 */
export function getCursorPosition<T extends RenrenInterface.XAndYType<number, number>>(event: MouseEvent | DragEvent | undefined,container?: HTMLElement, wait?: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    try {
      if (event) {
        let result: T = {} as T;
        // 判断是否获取光标的相对位置
        if (container) {
          result = checkCursorPosition<T>(event, container);
          resolve(result);
        }
        // 判断是否防抖处理
        if (wait) {
          debounce(() => {
            result = checkCursorPosition<T>(event);
            resolve(result);
          }, wait);
        }
        result = checkCursorPosition<T>(event);
        resolve(result);
      } else {
        reject('获取光标位置失败');
      }
    } catch (e) {
      console.log('获取光标位置失败', e);
      reject('获取光标位置失败');
    }
  });
}


/**
 * @description 检查光标的所在坐标
 * @param event
 * @param container
 */
function checkCursorPosition<T extends RenrenInterface.XAndYType<number, number>>(event: MouseEvent | DragEvent, container?: HTMLElement): T {
  let result: T = {} as T;
  if (!container) {
    if (event) {
      result = {
        x: event.clientX,
        y: event.clientY
      } as T;
      return result;
    }
  } else {
    if (event) {
      const react = container.getBoundingClientRect();
      const containerX = react.x;
      const containerY = react.y;
      result = {
        x: Math.max(0, Math.abs(event.clientX - containerX)),
        y: Math.max(0, Math.abs(event.clientY - containerY))
      } as T;
      return result;
    } else {
      return result;
    }
  }
  return result;
}


/**
 * @description 获取 drag event 传递的物料信息
 * @param event
 */
export function getDataTransformMaterial<T extends RenrenMaterialModel>(event: DragEvent): T {
  return JSON.parse(event.dataTransfer?.getData('material') || '{}') as T;
}
