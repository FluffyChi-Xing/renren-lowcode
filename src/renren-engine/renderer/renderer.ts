/**
 * @description renren-engine 渲染API模块
 * @author FluffyChi-Xing
 */
import {RenrenMaterialModel} from "@/componsables/models/MaterialModel";
import type {MaterialInterface} from "@/componsables/interface/MaterialInterface";
import type {Component} from "vue";
import { h, defineComponent, shallowReactive } from 'vue';
import {ElButton, ElText} from "element-plus";
import type {RenrenInterface} from "@/componsables/interface/RenrenInterface";
import { throttle } from "lodash-es";
import {$engine} from "@/renren-engine/engine";

// 定义支持的组件类型
type SupportedComponentType = 'el-button';

const componentMap = {
  'el-button': ElButton,
  'el-text': ElText,
} as const;

/**
 * @description 创建 Vue 组件实体
 * @param type
 * @param props
 * @param children
 */
const throttleCreateVueComponent = throttle(
  function createVueComponent<T extends Component>(type: SupportedComponentType, props: Record<string, any>, children?: any): T {
    const resolvedType = componentMap[type] || type;
    const reactiveProps = shallowReactive(props); // 浅层响应式
    return defineComponent({
      render() {
        return h(resolvedType, reactiveProps, children || reactiveProps.text);
      }
    }) as T;
  },
  16
);


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
          const type = props.type as SupportedComponentType;
          const prop = props.items;
          if (prop) {
            if (prop?.length > 0 && type) {
              const component = await insertCSSAttributes(prop, type);
              resolve(component as T);
            }
          }
        }
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
export function insertCSSAttributes<T extends Component>(attr: MaterialInterface.IProp[], type: SupportedComponentType): Promise<T> {
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
        const el = throttleCreateVueComponent(type, props, textContent);
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


/**
 * @description 创建 CSS 属性
 * @param item
 * @param prop
 * @return Promise<RenrenMaterialModel>
 */
export function createCSSAttributes<T extends RenrenMaterialModel>(item: T, prop: RenrenInterface.KeyValueIndexType<string, string>[]): Promise<T> {
  return new Promise<T>(async (resolve, reject) => {
    try {
      if (item && prop.length > 0) {
        prop.forEach(attr => {
          let pro: MaterialInterface.IProp = {
            code: "",
            items: null,
            key: attr.key,
            maps: undefined,
            owner: null,
            parent: undefined,
            type: attr.index,
            value: attr.value,
          };
          if (item.props?.items) {
            if (item.props.items?.length > 0) {
              item.props.items.push(pro);
            }
          }
        });
        resolve(item);
      } else {
        console.error('插入 CSS 属性失败，参数异常');
        reject('插入 CSS 属性失败，参数异常');
      }
    } catch (e) {
      console.error('插入 CSS 属性失败', e);
      reject('插入 CSS 属性失败');
    }
  });
}


/**
 * @description 更新 material 的 CSS 属性
 * 1. index 为 material 的 id
 * 2. attr 为一个 CSS 属性
 * @param index
 * @param attr
 */
export function updateMaterialCSSAttribute<T extends RenrenMaterialModel>(index: string, attr: RenrenInterface.KeyValueIndexType<string, string>): Promise<T> {
  return new Promise<T>(async (resolve, reject) => {
    try {
      const schema = await $engine.getSchema();
      const isEmpty: boolean = Object.keys(schema).length === 0 && schema.constructor === Object;
      if (!isEmpty) {
        if (schema.nodes) {
          if (schema.nodes.length > 0) {
            // 根据 index 索引找到 schema nodes 中的对应 node
            let node: MaterialInterface.IMaterial = schema.nodes.filter(node => node.id === index)[0];
            if (node && node.props?.items) {
              if (node.props.items.length > 0) {
                // 根据 attr 的 key 索引找到 node.props.items 中的对应 prop
                let prop: MaterialInterface.IProp = node.props.items.filter(prop => prop.key === attr.key)[0];
                if (prop) {
                  // 修改 prop.value
                  prop.value = attr.value;
                  prop.type = attr.index;
                  // 更新 schema
                  await $engine.updateSchema(schema).catch(err => {
                    console.log('更新 schema 失败', err);
                    reject('更新 schema 失败');
                  });
                  const newNode: T = new RenrenMaterialModel(node) as T;
                  resolve(newNode);
                }
              }
            }
          } else {
            reject('更新 CSS Attributes 失败，节点列表为空');
          }
        }
      }
    } catch (e) {
      console.log('更新 CSS Attributes 失败', e);
      reject('更新 CSS Attributes 失败');
    }
  });
}
