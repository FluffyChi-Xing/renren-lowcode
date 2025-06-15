/**
 * @description 重构渲染引擎
 * @author FluffyChi-Xing
 */
import type {MaterialInterface} from "@/componsables/interface/MaterialInterface";
import {type Component, defineComponent, h, shallowReactive} from "vue";
import {ElButton, ElEmpty, ElImage, ElLink, ElTag, ElText} from "element-plus";
import type {IArrangement} from "@/renren-engine/modules/arrangement";
import {$util} from "@/componsables/utils";
import {throttle} from "lodash-es";
import {RenrenMaterialModel} from "@/componsables/models/MaterialModel";
import {container} from "@/renren-engine/__init__";


export interface IRenderer<T> {

  getCSSAttributes(prop: string, css: MaterialInterface.IProp): string;

  createComponent(type:string, props: Record<string, any>, children?: any): T;

  createMaterialEl(el: RenrenMaterialModel | undefined): Promise<T>;

  insertCSSAttr(attr: MaterialInterface.IProp[], type: string): Promise<T>;

  createCSSAttr(item: RenrenMaterialModel, attr: RenrenInterface.KeyValueIndexType<string, string>[]): RenrenMaterialModel;

  updateCompCSSAttr<K extends MaterialInterface.IMaterial, P extends RenrenInterface.KeyValueIndexType<string, string>>(index: string, attr: P | P[]): Promise<K>;

  updateDocumentCSSAttr(prop: RenrenInterface.KeyValueIndexType<string, string>, index?: string): Promise<string>;

  queryCompCSSList(itemId: string): MaterialInterface.IProp[];

  componentEventBind<E extends RenrenInterface.IEvent>(index: string, event: E): Promise<string>;

  previewPage<T extends Component>(key?: string): Promise<T[]>;

  getDocumentProps<T extends CanvasInterface.canvasConfig>(key?: string): Promise<T>;

  getComponentCSSAttr<T extends MaterialInterface.IProp>(index: string): Promise<T[]>;

  updateDocumentProps(props: MaterialInterface.IProp[], key?: string): Promise<string>;

  insertAnimation(index: string, animation: RenrenInterface.keyValueType<string>, key?: string): Promise<string>;

  updateCompCSS<P extends RenrenInterface.keyValueType<string>>(index: string, attr: P[]): Promise<string>;
}


type SupportedComponentType = 'el-button';

/**
 * @description 渲染引擎模块
 */
class Renderer <T extends Component> implements IRenderer<T>{

  private arrangement: IArrangement<MaterialInterface.IMaterial> = container.resolve<IArrangement<MaterialInterface.IMaterial>>('arrangement');

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


  /**
   * @description 将CSS属性绑定在物料上
   * @param item
   * @param attr
   */
  createCSSAttr(item: RenrenMaterialModel, attr: RenrenInterface.KeyValueIndexType<string, string>[]): RenrenMaterialModel {
    if (Array.isArray(attr) && attr.length > 0) {
      attr.forEach(a => {
        let pro: MaterialInterface.IProp = {
          code: "",
          items: null,
          key: a.key,
          maps: undefined,
          owner: null,
          parent: undefined,
          type: a.index,
          value: a.value,
        };
        if (item.props?.items) {
          if (item.props.items?.length > 0) {
            item.props.items.push(pro);
          }
        }
      });
      return item;
    } else {
      return item;
    }
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


  /**
   * @description 根据物料模型创建物料实例
   * @param el
   */
  createMaterialEl(el: RenrenMaterialModel | undefined): Promise<T> {
    return new Promise<T>(async (resolve, reject) => {
      try {
        if (el !== void 0 && el?.isNode) {
          if (Array.isArray(el.props?.items) && el.props.items.length > 0) {
            const component = await this.insertCSSAttr(el.props.items, el.props?.type) as T;
            resolve(component);
          }
        }
      } catch (e) {
        console.error('创建物料实例失败', e);
        reject('创建物料实例失败');
      }
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
            // 创建属性
            let newProp: MaterialInterface.IProp = {
              code: "",
              items: null,
              key: prop.key,
              maps: undefined,
              owner: null,
              parent: undefined,
              type: prop.index,
              value: prop.value
            };
            if (Array.isArray(document?.prop?.items) && document?.prop.items.length > 0) {
              // 如果页面上存在 style 属性，并且存在同样的 style 属性，直接覆盖其值进行更新
              document.prop.items.find(item => {
                if (item?.key === 'style') {
                  if (item.type === prop.index) {
                    item.value = prop.value;
                  }
                }
              });
            } else {
              if (Array.isArray(document.prop?.items)) {
                document.prop.items.push(newProp);
              }
            }
            // 更新页面
            this.arrangement.updateDocument(document);
            resolve('success');
          }
        }
      } catch (e) {
        console.error('更新页面css属性失败', e);
        reject('更新页面css属性失败');
      }
    });
  }


  /**
   * @description 预览页面
   * @param key 页面主键
   */
  previewPage<T extends Component>(key?: string): Promise<T[]> {
    return new Promise<T[]>((resolve, reject) => {
      try {
        // 获取当前页面的全部节点
        let materials: MaterialInterface.IMaterial[] = this.arrangement.getAllElementNodes(key);
        let components: T[] = [];
        if (Array.isArray(materials) && materials.length > 0) {
          materials.forEach(item => {
            if (Array.isArray(item.props?.items) && item.props.items.length > 0) {
              let compProps: Record<string, any> = {};
              let textSlot: string = '';
              let style: string = '';
              item.props.items.forEach(itm => {
                if (itm.key !== 'style' && itm.key !== 'text') {
                  compProps[itm.key] = itm.value;
                } else {
                  // 拼接样式
                  style = style.concat(`${itm.type}: ${itm.value}${$util.arr.propAttributesSuffixOptions.get(itm.type)};`)
                }
              });
              textSlot = item.props.items.find(itm => itm.key === 'text')?.value;
              compProps['style'] = style;
              console.log('component props', compProps);
              const newElement: Component = this.createComponent(item.props?.type, compProps, textSlot);
              components.push(newElement as T);
            }
          });
        }
        resolve(components);
      } catch (e) {
        console.error('预览页面失败', e);
        reject('预览页面失败');
      }
    });
  }


  /**
   * @description 获取页面自身的 props 属性
   * @param key
   */
  getDocumentProps<T extends CanvasInterface.canvasConfig>(key?: string): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      try {
        // 获取 current page
        let currentPage: MaterialInterface.IDocument | undefined = this.arrangement.getDocument(key);
        console.log('current page', currentPage);
        let props: T = {
          config: {}
        } as T;
        if (currentPage !== void 0) {
          if ($util.renren.isEmpty(currentPage)) {
            reject('当前页面不存在');
          }
          if (Array.isArray(currentPage.prop?.items) && currentPage.prop.items.length > 0) {
            currentPage.prop.items.forEach((item: MaterialInterface.IProp) => {
              props.config[item.type] = item.value;
            });
          }
          resolve(props);
        } else {
          reject('当前页面不存在');
        }
      } catch (e) {
        console.error('获取页面 props 属性失败', e);
        reject('获取页面 props 属性失败');
      }
    });
  }


  /**
   * @description 根据Id获取组件的 css 属性
   * @param index
   */
  getComponentCSSAttr<T extends MaterialInterface.IProp>(index: string): Promise<T[]> {
    return new Promise<T[]>((resolve, reject) => {
      try {
        // 获取id对应的组件
        let component: MaterialInterface.IMaterial | undefined = this.arrangement.getComponent(index);
        let result: T[] = [];
        if (component !== void 0) {
          if (Array.isArray(component.props?.items) && component.props.items.length > 0) {
            component.props.items.forEach((item: MaterialInterface.IProp) => {
              if (item.key === 'style') {
                result.push(item as T);
              }
            });
          }
          resolve(result);
        }
      } catch (e) {
        console.error('根据Id获取组件的 css 样式失败', e);
        reject('根据Id获取组件的 css 样式失败');
      }
    });
  }


  /**
   * @description 更新页面的 css 属性
   * @param props
   * @param key
   */
  updateDocumentProps<T extends MaterialInterface.IDocument>(props: MaterialInterface.IProp[], key?: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      try {
        // get current document node
        let document: T | undefined;
        document = this.arrangement.getDocument(key) as T;
        if (document !== void 0) {
          if (Array.isArray(document.prop?.items) && document.prop.items.length > 0) {
            document.prop.items.forEach((node: MaterialInterface.IProp, index) => {
              if (node.key === props[index].key) {
                node.value = props[index].value;
              } else {
                return node;
              }
            });
            this.arrangement.updateDocument(document, key);
            resolve('success');
          }
        }
      } catch (e) {
        console.error('更新页面css属性失败', e);
        reject('更新页面css属性失败');
      }
    });
  }


  /**
   * @description 向 component 节点插入 animation 属性
   * @param index
   * @param animation
   * @param key optional
   */
  insertAnimation(index: string, animation: RenrenInterface.keyValueType<string>, key?:string): Promise<string> {
    return new Promise<string>(async (resolve, reject) => {
      try {
        let component: MaterialInterface.IMaterial | undefined;
        component = this.arrangement.getComponent(index, key);
        if (component !== void 0) {
          if (Array.isArray(component?.animation)) {
            if (component.animation.length >= 1) {
              reject('每个物料仅支持一个动画效果');
            } else {
              component.animation.push(animation);
              await this.arrangement.updateComponent(component, key);
              resolve('添加动画成功');
            }
          }
        }
      } catch (e) {
        console.error('向 component 节点插入 animation 属性失败', e);
        reject('添加动画失败');
      }
    });
  }


  /**
   * @description 更新指定组件的 css 属性
   * @param index
   * @param attr
   */
  updateCompCSS<P extends RenrenInterface.keyValueType<string>>(index: string, attr: P[]): Promise<string> {
    return new Promise<string>(async (resolve, reject) => {
      try {
        // 获取组件
        let component: MaterialInterface.IMaterial | undefined;
        component = this.arrangement.getComponent(index);
        let styleMap: Map<string, MaterialInterface.IProp> = new Map<string, MaterialInterface.IProp>();
        if (component !== void 0) {
          if (Array.isArray(attr) && attr.length > 0) {
            // 更新/插入对应属性
            attr.forEach(item => {
              if (Array.isArray(component.props?.items) && component.props.items.length > 0) {
                let style: MaterialInterface.IProp | undefined;
                style = component.props.items.find(prop => prop.type === item.key);
                if (style !== void 0) {
                  styleMap.set(item.key, style);
                } else {
                  // 如果找不到该属性，则插入该属性
                  let newAttr: MaterialInterface.IProp = {
                    code: "",
                    items: null,
                    key: "style",
                    maps: undefined,
                    owner: null,
                    parent: undefined,
                    type: item.key,
                    value: item.value
                  };
                  // 向 component 节点中插入该属性
                  component.props.items.push(newAttr);
                }
              }
            });
            // 更新 component
            if (Array.isArray(component.props?.items) && component.props.items.length > 0) {
              component.props.items.forEach(item => {
                // 检查要更新的 css attr 是否存在
                if (styleMap.has(item.type)) {
                  item.value = styleMap.get(item.type)?.value;
                }
              });
            }
            // 保存 component
            await this.arrangement.updateComponent(component).then(_ => {
              resolve('更新组件 css 属性成功');
            }).catch(err => {
              console.error('更新 component 失败', err);
              reject(err);
            });
          }
        }
      } catch (e) {
        console.error('更新组件 css 属性失败', e);
        reject('更新组件 css 属性失败');
      }
    });
  }
}



export default Renderer;



