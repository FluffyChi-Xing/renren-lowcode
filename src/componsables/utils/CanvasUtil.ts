/**
 * @description 画布工具模块
 * @author FluffyChi-Xing
 */
import { debounce } from "lodash-es";
import {MaterialDocumentModel, RenrenMaterialModel} from "@/componsables/models/MaterialModel";
import {$util} from "@/componsables/utils";
import type {MaterialInterface} from "@/componsables/interface/MaterialInterface";
import {RenrenModel} from "@/componsables/models/RenrenModel";



type elementSize = {
  width: number;
  height: number;
}





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
      console.error('获取光标位置失败', e);
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
        x: Math.round(event.clientX - containerX),
        y: Math.round(event.clientY - containerY)
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


/**
 * @description 获取元素的样式信息
 * @param item
 */
export function getElementStyleRecord<T extends RenrenModel>(item: T | undefined): Record<string, string> {
  let style: Record<string, string> = {};
  if (item !== void 0) {
    // 判断 item 的类型
    if (item?.isMaterial()) {
      let component: RenrenMaterialModel = $util.renren.deepClone<RenrenMaterialModel>(item as unknown as RenrenMaterialModel);
      if (Array.isArray(component.props?.items) && component.props.items.length > 0) {
        component.props.items.forEach((prop: MaterialInterface.IProp) => {
          if (prop?.key === 'style') {
            style[prop.type] = prop.value;
          }
        });
      }
    } else {
      let document: MaterialDocumentModel = $util.renren.deepClone<MaterialDocumentModel>(item as unknown as MaterialDocumentModel);
      if (Array.isArray(document.prop?.items) && document.prop.items.length > 0) {
        document.prop.items.forEach((prop: MaterialInterface.IProp) => {
          if (prop?.key === 'style') {
            style[prop.type] = prop.value;
          }
        });
      }
    }
    return style;
  } else {
    return style;
  }
}


/**
 * @description 获取元素的尺寸信息
 * @param el
 */
export function getElementSize<T extends HTMLElement>(el: T): elementSize {
  let props: elementSize = {width: 0, height: 0};
  if (el !== void 0) {
    props.width = el?.clientWidth;
    props.height = el?.clientHeight;
  }
  return props;
}


/**
 * @description 获取指定 键 的 prop 属性
 * @param items
 * @param index
 */
export function getTargetProp<T extends MaterialInterface.IProp>(items: T[] | void, index: string): T {
  let result: T = {} as T;
  if (Array.isArray(items) && items.length > 0) {
    result = items?.find(prop => prop?.type === index) as unknown as T;
  }
  return result;
}
