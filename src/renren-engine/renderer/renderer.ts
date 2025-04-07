/**
 * @description renren-engine 渲染API模块
 * @author FluffyChi-Xing
 */
import {RenrenMaterialModel} from "@/componsables/models/MaterialModel";
import type {MaterialInterface} from "@/componsables/interface/MaterialInterface";
import type {Component} from "vue";
import { h, defineComponent } from 'vue';
import {ElButton} from "element-plus";

// 定义支持的组件类型
type SupportedComponentType = 'el-button';

const componentMap = {
  'el-button': ElButton,
} as const;

/**
 * @description 创建 Vue 组件实体
 * @param type
 * @param props
 * @param children
 */
export function createVueComponent<T extends Component>(type: SupportedComponentType, props: Record<string, any>, children?: any): T {
  const resolvedType = componentMap[type] || type; // 映射到真实的组件
  return defineComponent({
    render() {
      return h(resolvedType, props, children || props.text);
    }
  }) as T;
}


/**
 * @description 根据物料创建组件实体
 * @param element
 */
export function createMaterialElement<T extends Component>(element: RenrenMaterialModel): Promise<T> {
  return new Promise<T>(async (resolve, reject) => {
    try {
      if (element && element.isNode) {
        const props = element?.props;
        if (props) {
          const type = props.type as string;
          const prop = props.items;
          if (prop) {
            if (prop?.length > 0 && type) {
              const component = await insertCSSAttributes(prop, type);
              resolve(component as T);
            } else {
              reject('创建物料元素失败，组件属性为空');
            }
          } else {
            reject('创建物料元素失败，组件属性为空');
          }
        } else {
          reject('创建物料元素失败，组件类型为空');
        }
      } else {
        reject('创建物料元素失败，元素为空');
      }
    } catch (e) {
      console.log('创建物料元素失败', e);
      reject('创建物料元素失败');
    }
  });
}


/**
 * @description 插入 CSS 属性
 * @param attr
 * @param type
 */
export function insertCSSAttributes<T extends Component>(attr: MaterialInterface.IProp[], type: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    try {
      if (attr.length > 0 && type) {
        const props: Record<string, any> = {};
        let textContent = '';
        attr.forEach(css => {
          if (css.key === 'text') {
            textContent = css.value; // 插槽内容
          } else {
            props[css.key] = css.value; // 其他属性
          }
        });
        const el = createVueComponent(type, props, textContent);
        resolve(el as T);
      } else {
        reject('插入 CSS 属性失败，属性为空');
      }
    } catch (e) {
      console.log('插入 CSS 属性失败', e);
      reject('插入 CSS 属性失败');
    }
  });
}
