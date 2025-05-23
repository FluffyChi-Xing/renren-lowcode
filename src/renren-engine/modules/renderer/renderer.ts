/**
 * @description renren-engine 渲染API模块
 * @author FluffyChi-Xing
 */
import {MaterialDocumentModel, RenrenMaterialModel} from "@/componsables/models/MaterialModel";
import type {MaterialInterface} from "@/componsables/interface/MaterialInterface";
import type {Component} from "vue";
import { h, defineComponent, shallowReactive } from 'vue';
import {ElButton, ElImage, ElLink, ElText, ElEmpty, ElTag} from "element-plus";
import { throttle } from "lodash-es";
import {$engine} from "@/renren-engine/engine";
import {propAttributesSuffixOptions} from "@/componsables/utils/AttrUtil";
import {$util} from "@/componsables/utils";

// 定义支持的组件类型
type SupportedComponentType = 'el-button';

const componentMap = {
  'el-button': ElButton,
  'el-text': ElText,
  'el-link': ElLink,
  'el-image': ElImage,
  'el-empty': ElEmpty,
  'el-tag': ElTag,
} as const;


/**
 * @description 将 IProp 转换为行内样式字符串
 * @param styleProp
 * @param css
 */
function getCSSAttributesInString(styleProp: string, css: MaterialInterface.IProp): string {
  return styleProp.concat(css.type + ':' + css.value + propAttributesSuffixOptions.get(css.type) + ';');
}

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
      } else {
        reject('创建物料元素失败');
      }
    } catch (e) {
      console.error('创建物料元素失败', e);
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
        let styleProp: string = '';
        attr.forEach(css => {
          // 如果属性是填充的文字，设置 textContent
          if (css.key === 'text') {
            textContent = css.value; // 插槽内容
          } else if (css.key === 'style') {
            styleProp = getCSSAttributesInString(styleProp, css);
          } else {
            props[css.key] = css.value;
          }
        });
        if (styleProp) {
          props['style'] = styleProp;
        }
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
 * 2. attr 为一个/多个 CSS 属性
 * @param index
 * @param attr
 */
export function updateMaterialCSSAttribute<T extends RenrenMaterialModel, P extends RenrenInterface.KeyValueIndexType<string, string>>(index: string, attr: P | P[]): Promise<T> {
  return new Promise<T>(async (resolve, reject) => {
    try {
      const schema = await $engine.arrangement.getSchema();
      if (!$util.renren.isEmpty(schema) && schema.nodes) {
        if (schema.nodes.length > 0) {
          // 根据 index 索引找到 schema nodes 中的对应 node
          let node: MaterialInterface.IMaterial = schema.nodes.filter(node => node.id === index)[0];
          if (node && node.props?.items) {
            if (node.props.items.length > 0) {
              /*
                判断 attr 是否是一个数组，如果是则遍历 props.items 找到与 对应 attr[i] 相匹配的 prop
               */
              if (Array.isArray(attr)) {
                node.props.items.forEach((prop) => {
                  const matchingAttr = attr.find((item) => item.index === prop.type);
                  if (matchingAttr) {
                    // 类型转换，确保 prop.value 是字符串
                    prop.value = String(matchingAttr.value);
                    prop.type = matchingAttr.index;
                  }
                });
              } else {
                // 根据 attr 的 index 索引找到 node.props.items 中的对应 prop
                let prop: MaterialInterface.IProp = node.props.items.filter(prop => prop.type === attr.index)[0];
                if (prop) {
                  // 修改 prop.value
                  prop.value = attr.value;
                  prop.type = attr.index;
                }
              }
              // 更新 schema
              await $engine.arrangement.updateSchema(schema).catch(err => {
                console.error('更新 schema 失败', err);
                reject('更新 schema 失败');
              });
              const newNode: T = new RenrenMaterialModel(node) as T;
              resolve(newNode);
            }
          }
        } else {
          reject('更新 CSS Attributes 失败，节点列表为空');
        }
      }
    } catch (e) {
      console.error('更新 CSS Attributes 失败', e);
      reject('更新 CSS Attributes 失败');
    }
  });
}


/**
 * @description 更新文档属性
 * @param index
 * @param prop
 */
export function updateDocumentCSSAttribute(index: string, prop: RenrenInterface.KeyValueIndexType<string, string>): Promise<string> {
  return new Promise<string>(async (resolve, reject) => {
    try {
      let schema = await $engine.arrangement.getSchema();
      if (!$util.renren.isEmpty(schema)) {
        if (schema.prop && schema.prop.items) {
          if (schema.prop.id === index) {
            if (prop) {
              // 判断是否存在相同的属性，如果存在则更新它的值，否则直接push
              // TODO: 目前还不能准确的匹配已经存在的属性
              const flag: boolean = !!schema.prop.items.find(item => item.key === prop.key && item.value.includes(prop.value));
              if (flag) {
                schema.prop.items.forEach(item => {
                  if (item.value.includes(prop.value)) {
                    item.value = prop.value;
                  }
                });
              } else {
                let pro: MaterialInterface.IProp = {
                  code: "",
                  items: null,
                  key: prop.key,
                  maps: undefined,
                  owner: null,
                  parent: undefined,
                  type: prop.index,
                  value: prop.value
                };
                schema.prop.items.push(pro);
              }
              // 保存更新后的schema
              await $engine.arrangement.updateSchema(schema).then(() => {
                resolve('更新 schema 成功');
              }).catch(err => {
                console.error('更新 schema 失败', err);
                reject('更新 schema 失败');
              });
            } else {
              reject('需要更新的属性为空');
            }
          } else {
            reject('没有找到匹配的prop节点');
          }
        }
      } else {
        reject('schema 不存在');
      }
    } catch (e) {
      console.error('更新文档 CSS 属性失败', e);
      reject('更新文档 CSS 属性失败');
    }
  });
}


/**
 * @description 获取给定物料元素的 style 属性列表
 * @param item
 */
export function queryMaterialCSSAttributesList<T extends MaterialInterface.IProp>(item: RenrenMaterialModel | undefined): Promise<T[]> {
  return new Promise<T[]>((resolve, reject) => {
    try {
      if (item !== void 0) {
        if (!$util.renren.isEmpty(item)) {
         let propItems: MaterialInterface.IProp[] = [];
         if (item.props && item.props.items) {
           if (item.props.items?.length > 0) {
             item.props.items?.forEach(item => {
               if (item.key === 'style') {
                 propItems.push(item);
               }
             });
             resolve(propItems as T[]);
           }
         }
        }
      } else {
        reject('参数类型错误');
      }
    } catch (e) {
      console.error('查询 CSS 属性列表失败', e);
      reject('查询 CSS 属性列表失败');
    }
  });
}


/**
 * @description 向指定的 material 插入事件
 * @param key
 * @param event
 */
export function insertEvent2Material<T extends RenrenInterface.IEvent>(key: string, event: T): Promise<string> {
  return new Promise<string>(async (resolve, reject) => {
    try {
      if (key && event) {
        // 获取 schema 中对应的 material
        const schema: RenrenMaterialModel | MaterialDocumentModel | undefined = await $engine.arrangement.getSchema();
        let material: MaterialInterface.IMaterial | void;
        if (schema !== void 0 && schema.nodes) {
          if (schema.nodes?.length > 0) {
            material = schema.nodes.find(node => node.id === key) || undefined;
            if (material !== void 0) {
              material = await eventBindingHandler(material, event).catch(err => {
                reject(err);
              });
              if (material !== void 0) {
                schema.nodes.find(node => node.id === material?.id)!.events = material.events || undefined;
                // 更新 schema
                await $engine.arrangement.updateSchema(schema).then(() => {
                  resolve('插入事件成功');
                }).catch(err => {
                  reject(err as string);
                });
              }
            } else {
              reject('未找到对应的 material');
            }
          }
        }
      }
    } catch (e) {
      console.error('插入事件失败', e);
      reject('插入事件失败');
    }
  });
}


/**
 * @description 绑定事件到 material
 * @param material
 * @param event
 */
function eventBindingHandler<T extends RenrenInterface.IEvent, K extends MaterialInterface.IMaterial>(material: K, event: T): Promise<K> {
  return new Promise<K>((resolve, reject) => {
    try {
      if (material && event) {
        if (material?.events) {
          if (material?.events.length > 0) {
            material.events = material.events?.filter(item => item.name !== event.name);
            resolve(material as K);
          } else {
            material.events.push(event);
            resolve(material as K);
          }
        }
      }
    } catch (e) {
      console.error('事件绑定处理失败', e);
      reject('事件绑定处理失败');
    }
  });
}


/**
 * @description 以字符串形式获取物料的 css 属性
 * @warn 使用该函数拿到的物料的 z-index 值会大于该物料的 z-index
 * @warn 使用该函数获取到的长宽也会略大于该物料的长宽
 * @warn 该函数仅用于获取物料外层编辑框的样式
 * @param material
 */
export function getMaterialCSSAttributesAsStyle(material: RenrenMaterialModel | undefined): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    try {
      if (material !== void 0) {
        if (!$util.renren.isEmpty(material)) {
          let styleCSS: string = '';
          const propList: MaterialInterface.IProp[] | undefined | null = material?.props?.items;
          if (propList !== void 0 && propList?.length) {
            propList.forEach(item => {
              if (item && item.key === 'style') {
                switch (item.type) {
                  case 'z-index':
                    styleCSS = styleCSS.concat(item.type + ':' + '199' + propAttributesSuffixOptions.get(item.type) + ';');
                    break;
                  default:
                    styleCSS = styleCSS.concat(item.type + ':' + item.value + propAttributesSuffixOptions.get(item.type) + ';');
                    break;
                }
              }
            });
          }
          resolve(styleCSS);
        } else {
          reject('参数错误');
        }
      }
    } catch (e) {
      console.error('获取 CSS 属性失败', e);
      reject('获取 CSS 属性失败');
    }
  });
}



/**
 * @description 创建页面根元素
 * @param item
 */
export function createPageElement<T extends HTMLElement>(item: MaterialDocumentModel): Promise<T> {
  return new Promise<T>(async (resolve, reject) => {
    try {
      await $util.renren.isDocument(item, () => {
        const page: HTMLElement = document.createElement('div');
        // 绑定页面样式
        const prop: MaterialInterface.IProp[] | undefined | null = item.prop?.items;
        let styleProp: string = '';
        if (prop !== void 0 && prop?.length) {
          if (prop.length > 0) {
            prop.forEach(itm => {
              styleProp = getCSSAttributesInString(styleProp, itm);
            });
            page.style.cssText = styleProp;
            resolve(page as T);
          }
        }
      });
    } catch (e) {
      console.error('预览页面渲染失败', e);
      reject('预览页面渲染失败');
    }
  });
}




/**
 * @description 预览页面渲染函数
 */
export function previewRenderingPage<T extends Component>(): Promise<T[]> {
  return new Promise<T[]>(async (resolve, reject) => {
    try {
      // 获取 schema
      const schema: MaterialDocumentModel = await $engine.arrangement.getSchema();
      const nodes: MaterialInterface.IMaterial[] | undefined = schema.nodes;
      if (Array.isArray(nodes)) {
        if (nodes.length > 0) {
          // 循环遍历 schema.nodes 创建对应的物料组件
          let materialList: Component[] = [];
          nodes.forEach((node: MaterialInterface.IMaterial) => {
            createMaterialElement(node as RenrenMaterialModel).then(async _ => {
              // 绑定 css 属性
              if (node.props?.items) {
                const newMaterial: Component = throttleCreateVueComponent(
                  (node.props?.type as SupportedComponentType), // material type
                  // material props
                  {
                    // 合并原有的 props
                    ...node.props?.items.reduce((acc, item) => {
                      if (item.key !== 'style') {
                        acc[item.key] = item.value;
                      }
                      return acc;
                    }, {} as Record<string, any>),
                  },
                  node.props?.items.find(item => item.key === 'text')?.value
                );
                materialList.push(newMaterial);
              }
            });
          });
          resolve(materialList as T[]);
        }
      }
    } catch (e) {
      console.error('预览页面失败', e);
      reject('预览页面失败');
    }
  });
}


/**
 * @description 获取 schema 的 prop configuration
 * @param key
 */
export function getSchemaConfiguration<T extends CanvasInterface.canvasConfig>(key?: string): Promise<T> {
  return new Promise<T>(async (resolve, reject) => {
    try {
      // 获取 schema
      const schema: MaterialDocumentModel | undefined = await $engine.arrangement.getSchema(key);
      let configuration: T = {
        config: {}
      } as T;
      if (schema !== void 0) {
        // 获取 prop 的 items 属性
        const { prop } = schema as MaterialDocumentModel;
        if (prop) {
          const isEmpty: boolean = Object.keys(prop).length === 0 && prop.constructor === Object;
          if (!isEmpty) {
            const { items } = prop as unknown as MaterialInterface.IProp;
            if (items) {
              items.forEach(item => {
                configuration.config[item.type] = item.value;
              });
              resolve(configuration);
            }
          }
        }
      } else {
        resolve(configuration);
      }
    } catch (e) {
      console.error('获取 schema 配置失败', e);
      reject('获取 schema 配置失败');
    }
  });
}
