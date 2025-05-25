/**
 * @description 重构渲染引擎
 * @author FluffyChi-Xing
 */
import type {MaterialInterface} from "@/componsables/interface/MaterialInterface";
import {type Component, defineComponent, h, shallowReactive} from "vue";
import {ElButton, ElEmpty, ElImage, ElLink, ElTag, ElText} from "element-plus";
import Arrangement, {type IArrangement} from "@/renren-engine/modules/arrangement";
import {$util} from "@/componsables/utils";
import { throttle, debounce } from "lodash-es";


export interface IRenderer<T> {

  getCSSAttributes(prop: string, css: MaterialInterface.IProp): string;

  createComponent(type:string, props: Record<string, any>, children?: any): T;

  createMaterialEl(el: MaterialInterface.IMaterial): Promise<T>;

  insertCSSAttr(attr: MaterialInterface.IProp[], type: string): Promise<T>;

  createCSSAttr(props: RenrenInterface.KeyValueIndexType<string, string>[]): MaterialInterface.IProp[];

  updateCompCSSAttr<K extends MaterialInterface.IMaterial, P extends RenrenInterface.KeyValueIndexType<string, string>>(index: string, attr: P | P[]): Promise<K>;

  updateDocumentCSSAttr(prop: RenrenInterface.KeyValueIndexType<string, string>, index?: string): Promise<string>;

  queryCompCSSList(itemId: string): MaterialInterface.IProp[];

  componentEventBind<E extends RenrenInterface.IEvent>(index: string, event: E): Promise<string>;
}


type SupportedComponentType = 'el-button';

/**
 * @description 渲染引擎模块
 */
class Renderer <T extends Component> implements IRenderer<T>{

  private arrangement: IArrangement<MaterialInterface.IMaterial> = new Arrangement().getInstance;

  private componentMap: Map<string, Component> = new Map<string, Component>([
    ['el-button', ElButton],
    ['el-text', ElText],
    ['el-tag', ElTag],
    ['el-image', ElImage],
    ['el-link', ElLink],
    ['el-empty', ElEmpty],
  ]);

  constructor() {
  }


  /**
   * @description 处理组件爱你事件绑定
   * @param index
   * @param event
   */
  componentEventBind<E extends RenrenInterface.IEvent>(index: string, event: E): Promise<string> {
    return Promise.resolve("");
  }

  createCSSAttr(props: RenrenInterface.KeyValueIndexType<string, string>[]): MaterialInterface.IProp[] {
    return [];
  }


  /**
   * @description 创建组件实例
   * @param type
   * @param props
   * @param children
   */
  createComponent(type: string, props: Record<string, any>, children?: any): T {
    let componentMap = this.componentMap;
    const throttleCreateInstance = throttle(
      function createInstance<T extends Component>(): T {
        const resolvedType = componentMap.get(type) || type;
        const reactiveProps = shallowReactive(props);

        // 确保插槽内容是函数
        const slotContent = children || reactiveProps.text;
        const defaultSlot = typeof slotContent === 'function' ? slotContent : () => slotContent;

        return defineComponent({
          render() {
            return h(resolvedType, reactiveProps, {
              default: defaultSlot, // 传递默认插槽作为函数
            });
          },
        }) as T;
      },
      16
    );
    return throttleCreateInstance() as T;
  }

  createMaterialEl(el: MaterialInterface.IMaterial): Promise<T> {
    return new Promise<T>((resolve, reject) => {

    });
  }

  /**
   * @description 获取css属性 对应 getCSSAttributesInString api
   * @param prop
   * @param css
   */
  getCSSAttributes(prop: string, css: MaterialInterface.IProp): string {
    return prop.concat(css.type + ':' + css.value + $util.arr.propAttributesSuffixOptions.get(css.type) + ';');
  }


  /**
   * @description 插入 css 属性
   * @param attr
   * @param type
   */
  insertCSSAttr(attr: MaterialInterface.IProp[], type: string): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      try {
        if (attr.length > 0 && type) {
          const props: Record<string, any> = {};
          let textContent = '';
          let styleProp: string = '';
          attr.forEach(css => {
            // 如果属性是填充的文字，设置 textContent
            if (css.key === 'text') {
              textContent = css.value; // 插槽内容
            } else if (css.key === 'style') {
              styleProp = this.getCSSAttributes(styleProp, css);
            } else {
              props[css.key] = css.value;
            }
          });
          if (styleProp) {
            props['style'] = styleProp;
          }
          const el = this.createComponent(type, props, textContent);
          resolve(el as T);
        } else {
          reject('插入 CSS 属性失败，属性为空');
        }
      } catch (e) {
        console.error('插入css属性失败', e);
        reject('插入css属性失败');
      }
    });
  }


  /**
   * @description 查询物料的 css 属性列表
   * @param itemId
   */
  queryCompCSSList(itemId: string): MaterialInterface.IProp[] {
    // 获取目标物料
    let material: MaterialInterface.IMaterial | undefined = this.arrangement.getComponent(itemId);
    let result: MaterialInterface.IProp[] = [];
    if (material !== void 0) {
      if (Array.isArray(material.props?.items) && material.props.items.length > 0) {
        material.props.items.forEach(item => {
          if (item.key === 'style') {
            result.push(item);
          }
        });
      }
    }
    return result;
  }


  /**
   * @description 更新物料的 css 属性
   * @param index
   * @param attr
   */
  updateCompCSSAttr<
    K extends MaterialInterface.IMaterial,
    P extends RenrenInterface.KeyValueIndexType<string, string>
  >(index: string, attr: P | P[]): Promise<K> {
    return new Promise<K>(async (resolve, reject) => {
      try {
        // 获取目标物料节点
        let material: K | undefined = this.arrangement.getComponent(index) as K;
        if (material !== void 0) {
          if (Array.isArray(material.props?.items) && material.props.items.length > 0) {
            if (Array.isArray(attr)) {
              material.props?.items.forEach(prop => {
                const matchingAttr = attr.find((item) => item.index === prop.type);
                if (matchingAttr) {
                  // 类型转换，确保 prop.value 是字符串
                  prop.value = String(matchingAttr.value);
                  prop.type = matchingAttr.index;
                }
              });
            } else {
              // 根据 attr 的 index 索引找到 node.props.items 中的对应 prop
              let prop: MaterialInterface.IProp = material.props.items.filter(prop => prop.type === attr.index)[0];
              if (prop) {
                // 修改 prop.value
                prop.value = attr.value;
                prop.type = attr.index;
              }
            }
            // 更新 schema
            await this.arrangement.updateComponent(material).catch(err => {
              reject(err);
            });
            resolve(material);
          }
        }
      } catch (e) {
        console.error('更新css属性失败', e);
        reject('更新css属性失败');
      }
    });
  }


  /**
   * @description 更新页面的 css 属性
   * @param index
   * @param prop
   */
  updateDocumentCSSAttr(prop: RenrenInterface.KeyValueIndexType<string, string>, index?: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      try {
        // 获取页面节点
        let document: MaterialInterface.IDocument | undefined = this.arrangement.getDocument(index);
        if (document !== void 0) {
          if (prop !== void 0) {
            if (Array.isArray(document?.prop?.items) && document?.prop.items.length > 0) {
              document.prop.items.forEach(item => {
                if (item?.key === 'style') {

                } else {
                  // 如果 document 的 prop.items 属性中不存在 style 属性，则直接插入 prop
                }
              });
            }
            resolve('success');
          }
        }
      } catch (e) {
        console.error('更新页面css属性失败', e);
        reject('更新页面css属性失败');
      }
    });
  }
}



export default Renderer;



