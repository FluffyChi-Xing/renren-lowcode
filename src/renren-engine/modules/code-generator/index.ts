/**
 * @description 重构代码生成模块
 * @author FluffyChi-Xing
 */
import type {EngineTypes} from "@/renren-engine/componsables/types/EngineTypes";
import type {IArrangement} from "@/renren-engine/modules/arrangement";
import {container} from "@/renren-engine/__init__";
import {MaterialDocumentModel} from "@/componsables/models/MaterialModel";
import {SCHEMA_STORAGE_ID} from "@/componsables/constants/RenrenConstant";
import {$util} from "@/componsables/utils";
import type {MaterialInterface} from "@/componsables/interface/MaterialInterface";
import prettier from 'prettier/standalone';
import htmlParser from 'prettier/plugins/html';

type templateRespDto = {
  // 全部模板源码
  templates: Map<string, string> | undefined;
  // keys
  keys: string[];
};


export interface ICoder {

  tempStructureGenerator<T extends EngineTypes.tempGenerateStructure>(index?: string): Promise<T>;

  extractPageEl<T extends EngineTypes.BaseElement>(index?: string): Promise<T>;

  extractComponentEl<T extends EngineTypes.BaseElement>(items: MaterialInterface.IMaterial): Promise<T>;

  tempStructureBuilder<T extends EngineTypes.tempGenerateStructure>(item: T): Promise<string>;

  baseEl2VueComp<T extends EngineTypes.BaseElement>(item: T): Promise<string>;

  getCodeTemplate(): Promise<string>;

  getAllCodeTemplates<T extends templateRespDto>(): Promise<T>;

  htmlFormatter(temp: string): Promise<string>;
}



class CodeGenerator implements ICoder {

  // 编排模块实例
  private arrangement: IArrangement<MaterialInterface.IMaterial> = container.resolve<IArrangement<MaterialInterface.IMaterial>>('arrangement');

  // 生成代码模板库
  private templates: Map<string, string> = new Map<string, string>([]);


  /**
   * @description 价格基础物料元素转换为 vue component
   * @warn 等同于原来的 baseElement2VueAst
   * @param item
   */
  baseEl2VueComp<T extends EngineTypes.BaseElement>(item: T): Promise<string> {
    return new Promise<string>(async (resolve, reject) => {
      try {
        // 构造 props
        let style: string = '';
        let classList: string = '';
        let innerText: string = '';
        await $util.renren.isEmpty(item, () => {
          const { nodes, prop, meta, events, animation } = item;
          // 处理子节点
          if (Array.isArray(nodes) && nodes.length > 0) {
            // 递归处理子节点
            return nodes.map(async (node) => {
              return await this.baseEl2VueComp(node);
            });
          }
          // 处理当前节点
          const getPropsString = (): string => {
            let propAttr: string = '';
            if (Array.isArray(prop)) {
              prop.forEach(item => {
                if (item.key !== 'style' && item.key !== 'text') {
                  propAttr += `${item.key}="${item.value}" `;
                } else if (item.key !== 'text') {
                  // 处理 style
                  style += `${item.type}: ${item.value}${$util.arr.propAttributesSuffixOptions.get(item.type)};`;
                } else {
                  // 一个元素只可能有一个 text 属性的 prop
                  innerText = `${item.value}`;
                }
              });
            }
            return propAttr;
          };
          const props: string = getPropsString();
          // 构造 events
          const getEventsString = (): string => {
            let eventsAttr: string = '';
            if (Array.isArray(events)) {
              events.forEach(item => {
                if (item.name.startsWith('on')) {
                  eventsAttr += `${item.name}=${item.callback} `; // 例如 onClick= () => {}
                } else {
                  // TODO: 处理 alert 和 message 事件
                }
              });
            }
            return eventsAttr;
          }
          const eventAttr: string = getEventsString();
          // 构造 animation
          if (Array.isArray(animation)) {
            animation.forEach(item => {
              classList += `${item.value} `;
            });
          }
          let styleProp: string = `style="${style}"`;
          // 构造节点
          let element: string =
            `<${meta?.type}
            ${classList ? `class="${classList}"` : '' }
            ${styleProp}
            ${props}
            ${eventAttr}
          >
            ${innerText}
          </${meta?.type}>`;
          resolve(element);
        });
      } catch (e) {
        console.error('vue component转换失败', e);
        reject ('vue component转换失败');
      }
    });
  }


  /**
   * @description html 格式化
   * @param temp
   */
  htmlFormatter(temp: string): Promise<string> {
    return new Promise<string>(async (resolve, reject) => {
      let result: string | undefined;
      // 提取 <template> 标签中的内容
      const templateRegex = /<template[^>]*>([\s\S]*?)<\/template>/i;
      const match = temp.match(templateRegex);

      if (!match) {
        console.warn('未找到 <template> 标签，跳过格式化');
        return temp;
      }

      const innerHTML = match[1]?.trim() || '';

      if (!innerHTML) {
        console.warn('模板内容为空，跳过格式化');
        return temp;
      }

      try {
        // 格式化 HTML 内容
        const formattedHTML = await prettier.format(innerHTML, {
          parser: 'html',
          plugins: [htmlParser],
          tabWidth: 2,
          printWidth: 100,
          endOfLine: 'auto'
        });

        // 替换回 <template> 标签中
        result = temp.replace(templateRegex, `<template>\n${formattedHTML}\n</template>`);
        resolve(result);
      } catch (e) {
        console.error('html 格式化错误', e);
        reject ('html 格式化错误');
      }
    });
  }


  /**
   * @description 提取物料节点关键属性
   * @warn 等同于原来的 extractMaterialBaseElement
   * @param items
   */
  extractComponentEl<T extends EngineTypes.BaseElement>(items: MaterialInterface.IMaterial): Promise<T> {
    return new Promise<T>(async (resolve, reject) => {
      try {
        if (items) {
          let input: MaterialInterface.IMaterial = $util.renren.deepClone(items);
          let result: EngineTypes.BaseElement = {
            animation: [],
            events: [],
            meta: undefined,
            nodes: [],
            prop: []
          };
          // animation
          result.animation = input.animation || [];
          // events
          result.events = input.events || [];
          // props
          input.props?.items?.forEach(prop => {
            result.prop.push(prop);
          });
          // meta
          result.meta = {
            fileName: input.id,
            type: input.props?.type || '',
            rootNode: false
          };
          // children
          if (input.children) {
            for (let child of input.children) {
              result.nodes.push(
                await this.extractComponentEl(child),
              );
            }
          }
          resolve(result as T);
        } else {
          reject('item 为空');
        }
      } catch (e) {
        console.error('提取物料节点关键属性失败', e);
        reject('提取物料节点关键属性失败');
      }
    });
  }


  /**
   * @description 提取页面中的基本元素 nodes props event animation
   * @warn 等同于原来的 extractPageBaseElement
   * @param index
   */
  extractPageEl<T extends EngineTypes.BaseElement>(index?: string): Promise<T> {
    return new Promise<T>(async (resolve, reject) => {
      try {
        let doc: MaterialInterface.IDocument | undefined;
        if (index) {
          doc = this.arrangement.getDocument(index);
        } else {
          doc = this.arrangement.getDocument();
        }
        const schema: MaterialDocumentModel | undefined = new MaterialDocumentModel(doc);
        let result: EngineTypes.BaseElement = {
          animation: [],
          events: [],
          meta: undefined,
          nodes: [],
          prop: []
        };
        // 如果 schema 非空，那么进行下一步操作
        await $util.renren.isEmpty(schema, () => {
          // extract nodes
          schema.nodes?.forEach(async (item) => {
            result.nodes.push(
              await this.extractComponentEl(item),
            );
          });
          // extract page props items
          schema.prop?.items?.forEach(item => {
            result.prop.push(item);
          });
          // TODO extract sections
          // extract page info
          result.meta = {
            fileName: schema?.fileName || '',
            rootNode: schema?.rootNode,
            type: 'div'
          };
          resolve(result as T);
        }).catch(_ => {
          console.error('schema 为空');
          reject('schema 为空');
        });
      } catch (e) {
        console.error('提取页面关键元素失败', e);
        reject('提取页面关键元素失败');
      }
    });
  }


  /**
   * @description 获取所有代码模板
   */
  getAllCodeTemplates<T extends templateRespDto>(): Promise<T> {
    return new Promise<T>(async (resolve, reject) => {
      try {
        let template: Map<string, string> = new Map<string, string>([]);
        let result: templateRespDto = {
          keys: [],
          templates: undefined
        };
        let keys: string[] = [];
        // 获取本地持久化的全部 document 节点
        let documents: MaterialDocumentModel[] | undefined = await this.arrangement.getAllDocuments();
        if (documents !== void 0 && documents.length > 0) {
          for (const item of documents) {
            // 生成页面节点对应的源代码
            // 如果存在不正确初始化存储主键id的  document node
            let special: unknown | undefined = JSON.parse(localStorage.getItem(SCHEMA_STORAGE_ID + item.fileName as string) as string);
            if (special) {
              let temp: EngineTypes.tempGenerateStructure = await this.tempStructureGenerator(item.fileName as string);
              await this.tempStructureBuilder(temp).then(res => {
                template.set(item.fileName as string, res);
                keys.push(item.fileName as string);
              })
            } else {
              await this.getCodeTemplate().then(res => {
                template.set(item.fileName as string, res);
                keys.push(item.fileName as string);
              });
            }
            result.templates = template;
            result.keys = keys;
            resolve(result as T);
          }
        }
      } catch (e) {
        console.error('获取所有模板失败', e);
        reject ('获取所有模板失败');
      }
    });
  }


  /**
   * @description 获取代码模板
   */
  getCodeTemplate(): Promise<string> {
    return new Promise<string>(async (resolve, reject) => {
      let template: EngineTypes.tempGenerateStructure = await this.tempStructureGenerator();
      await this.tempStructureBuilder(template).then(res => {
        resolve(res);
      }).catch(err => {
        console.error('获取代码转换模板失败', err);
        reject('获取代码转换模板失败');
      });
    });
  }


  /**
   * @description 构建中间产物结构模板 等同于原来的 templateGenerator
   * @param item
   */
  tempStructureBuilder<T extends EngineTypes.tempGenerateStructure>(item: T): Promise<string> {
    return new Promise<string>(async (resolve, reject) => {
      try {
        let material: string = '';
        // 生成 page 的 prop attributes
        let pageProp: string = 'style=';
        let page: string = '';
        let template: string = '';
        if (item.page) {
          if (Array.isArray(item.page?.prop)) {
            // 处理 props
            item.page.prop.forEach(prop => {
              pageProp += `${prop.type}:${prop.value}${$util.arr.propAttributesSuffixOptions.get(prop.type)};`;
            });
          }
        }
        await $util.renren.isEmpty(item, async () => {
          // 递归生成 vue comp
          // 处理页面物料节点
          if (Array.isArray(item.material)) {
            for (const itm of item.material) {
              let comp: string = await this.baseEl2VueComp(itm);
              material = material.concat(comp + '\n');
            }
          }
          page = `<div ${pageProp}>${material}</div>`;
          template = `<template>${page}</template>`;

          const sourceCode: string = await this.htmlFormatter(template);
          resolve(sourceCode);
        });
      } catch (e) {
        console.error('模板构建失败', e);
        reject ('模板构建失败');
      }
    });
  }


  /**
   * @description 生成中间结构
   * @warn 等同于原来的 extractBaseElement
   * @param index
   */
  tempStructureGenerator<T extends EngineTypes.tempGenerateStructure>(index?: string): Promise<T> {
    return new Promise<T>(async (resolve, reject) => {
      try {
        let result: EngineTypes.tempGenerateStructure = {
          material: [],
          page: undefined
        };
        // 获取页面基本属性
        let pageElement = await this.extractPageEl(index);
        result.page = pageElement;
        // 获取物料节点基本属性
        if (pageElement) {
          for (let node of pageElement.nodes) {
            result.material.push(
              node,
            );
          }
        }
        resolve(result as T);
      } catch (e) {
        console.error('中间结构生成失败', e);
        reject ('中间结构生成失败');
      }
    });
  }
}



export default CodeGenerator;
