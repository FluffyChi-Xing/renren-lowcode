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
        schema.nodes?.forEach(item => {
          result.nodes.push(item);
        });
        // extract page props items
        schema.prop?.items?.forEach(item => {
          result.prop.push(item);
        });
        // TODO extract sections
        // extract page info
        result.meta = {
          fileName: schema?.fileName,
          rootNode: schema?.rootNode,
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
        let result: EngineTypes.BaseElement = {
          animation: [],
          events: [],
          meta: undefined,
          nodes: [],
          prop: []
        };
        // animation
        result.animation = item.animation || [];
        // events
        result.events = item.events || [];
        // props
        item.props?.items?.forEach(prop => {
          result.prop.push(prop);
        });
        // meta
        result.meta = {
          fileName: item.id,
          type: item.props?.type || '',
        };
        // children
        result.nodes = item.children || [];
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
            await extractMaterialBaseElement(node),
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
export function templateGenerator(schema: EngineTypes.tempGenerateStructure): Promise<string> {
  return new Promise<string>(async (resolve, reject) => {
    try {
      let page: string = '';
      let template: string = `<template>${page}</template>`;
      await $util.renren.isEmpty(schema, () => {
        // TODO: schema2VueAst 基于 schema 中的 page 和 material 构造 html 元素
        resolve(template);
      });
    } catch (e) {
      console.error('基于中间产物构造 vue template 失败', e);
      reject('基于中间产物构造 vue template 失败');
    }
  });
}


/**
 * @description 基于中间产物生成对应的 vue ast
 */
function baseElement2VueAst(): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    resolve('un-finished');
  });
}
