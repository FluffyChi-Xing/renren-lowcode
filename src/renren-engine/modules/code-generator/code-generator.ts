/**
 * @description renren-engine 基于 ast 的 json schema -> cource code generator
 * @description 用于将页面描述的 json schema 转换为可读的 源代码文件
 * @author FluffyChi-Xing
 */
import type {EngineTypes} from "@/renren-engine/componsables/types/EngineTypes";
import {$engine} from "@/renren-engine/engine";
import {MaterialDocumentModel} from "@/componsables/models/MaterialModel";
import {$util} from "@/componsables/utils";
import type {MaterialInterface} from "@/componsables/interface/MaterialInterface";

/**
 * @description 从当前页面节点中提取基本元素 nodes, prop, event, animation
 * @param documentId
 */
function extractPageBaseElement<T extends EngineTypes.BaseElement>(documentId?: string | undefined): Promise<T> {
  return new Promise<T>(async (resolve, reject) => {
    try {
      const schema: MaterialDocumentModel | undefined = await $engine.arrangement.getSchema(documentId);
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
            await extractMaterialBaseElement(item),
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
 * @description 提取物料节点的关键属性
 * @param item
 */
function extractMaterialBaseElement<T extends EngineTypes.BaseElement>(item: MaterialInterface.IMaterial): Promise<T> {
  return new Promise<T>(async (resolve, reject) => {
    try {
      if (item) {
        let input: MaterialInterface.IMaterial = $util.renren.deepClone(item);
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
        input.children?.forEach(async (child) => {
          result.nodes.push(
            await extractMaterialBaseElement(child),
          );
        });
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
 * @description 获取页面的代码转换零时产物
 * @param documentId
 */
export function extractBaseElement<T extends EngineTypes.tempGenerateStructure>(documentId?: string | undefined): Promise<T> {
  return new Promise<T>(async (resolve, reject) => {
    try {
      let result: EngineTypes.tempGenerateStructure = {
        material: [],
        page: undefined
      };
      // 获取页面基本属性
      let pageElement = await extractPageBaseElement(documentId);
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
      console.error('获取代码转换暂时产物失败', e);
      reject('获取代码转换暂时产物失败');
    }
  });
}


/**
 * @description 基于中间产物构造 vue template
 * @param schema
 */
function templateGenerator(schema: EngineTypes.tempGenerateStructure): Promise<string> {
  return new Promise<string>(async (resolve, reject) => {
    try {
      let material: string = '';
      // 生成 page 的 prop attributes
      let pageProp: string = 'style=';
      if (schema.page) {
        if (Array.isArray(schema.page?.prop)) {
          schema.page.prop.forEach(prop => {
            pageProp += `${prop.type}:${prop.value},`;
          });
        }
      }
      let page: string = `<div ${pageProp}>${material}</div>`;
      let template: string = `<template>${page}</template>`;
      await $util.renren.isEmpty(schema, async () => {
        // 使用 baseElement2VueAst 递归生成 vue ast
        // 处理页面物料节点
        if (Array.isArray(schema.material)) {
          for (const item of schema.material) {
            material += await baseElement2VueAst(item);
          }
        }
        resolve(template);
      });
    } catch (e) {
      console.error('基于中间产物构造 vue template 失败', e);
      reject('基于中间产物构造 vue template 失败');
    }
  });
}


// TODO: generator 存在 bug

/**
 * @description 基于中间产物生成对应的 vue ast
 */
function baseElement2VueAst(item: EngineTypes.BaseElement): Promise<string> {
  return new Promise<string>(async (resolve, reject) => {
    try {
      await $util.renren.isEmpty(item, () => {
        const { nodes, prop, meta, events, animation } = item;
        // 处理子节点
        if (Array.isArray(nodes)) {
          // 递归处理子节点
          return nodes.map(node => {
            return baseElement2VueAst(node);
          });
        }
        // 处理当前节点
        // 构造 props
        let style: string = 'style:';
        let classList: string = 'class';
        let innerText: string = '';
        const getPropsString = (): string => {
          let propAttr: string = '';
          if (Array.isArray(prop)) {
            prop.forEach(item => {
              if (item.key !== 'style' && item.key !== 'text') {
                propAttr += `${item.key}=${item.value} `;
              } else if (item.key !== 'text') {
                // 处理 style
                style += `${item.type}: ${item.value};`;
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
        // 构造节点
        let element: string =
          `<${meta?.type}
            ${classList}
            ${style}
            ${props}
            ${eventAttr}
          >
            ${innerText}
          </${meta?.type}>`;
        resolve(element);
      });
    } catch (e) {
      console.error('基于中间产物生成对应的 vue ast 失败', e);
      reject('基于中间产物生成对应的 vue ast 失败');
    }
  });
}


/**
 * @description 获取代码转换模板
 */
export function getCodeTemplate(): Promise<string> {
  return new Promise<string>(async (resolve, reject) => {
    let template: EngineTypes.tempGenerateStructure = await extractBaseElement();
    console.log('template', template);
    await templateGenerator(template).then(res => {
      console.log('res', res);
      resolve(res);
    }).catch(err => {
      console.error('获取代码转换模板失败', err);
      reject('获取代码转换模板失败');
    });
  });
}
