/**
 * @description 人人常量类 模块
 * @author FluffyChi-Xing
 */
import type {MaterialInterface} from "@/componsables/interface/MaterialInterface";
import type {RenrenInterface} from "@/componsables/interface/RenrenInterface";


export const ENTITY_ID: string = 'id';

export const SCHEMA_STORAGE_ID: string = 'project-schema:';

/**
 * @description 页面的最顶层为一个 document 节点，一个项目只能有一个 document node,页面有两种搭建方式
 * 1. 直接搭建，editor 触发 hooks 后将数据直接插入到 nodes 中
 * 2。基于容器组件搭建，容器组件的顶层组件为一个 section ,触发 hooks 后将数据插入到 section 中
 */
export const PAGE_SCHEMA: MaterialInterface.IDocument = {
  activated: false,
  blank: true,
  fileName: '页面01',
  nodes: [],
  opened: true,
  rootNode: true,
  sections: [],
};


export const MATERIAL_SCHEMA_MAP: RenrenInterface.keyValueType<string>[] = [
  {
    key: 'base-material',
    value: '@/material/base/.ts'
  },
  {
    key: 'form-material',
    value: '@/material/form/.ts'
  },
  {
    key: 'layout-material',
    value: '@/material/layout/.ts'
  },
  {
    key: 'chart-material',
    value: '@/material/chart/.ts'
  },
  {
    key: 'navigator-material',
    value: '@/material/navigator/.ts'
  }
];
