/**
 * @description 人人常量类 模块
 * @author FluffyChi-Xing
 */
import type {MaterialInterface} from "@/componsables/interface/MaterialInterface";
import type {RenrenInterface} from "@/componsables/interface/RenrenInterface";


export const ENTITY_ID: string = 'id';

export const SCHEMA_STORAGE_ID: string = 'project-schema:';

/**
 * @description 项目数据存储前缀标识
 */
export const SCHEMA_PROJECT_STORAGE_ID: string = 'project-storage:';

/**
 * @description 项目键对项目名映射关系表存储标识
 */
export const PROJECT_KEY_TO_NAME_MAP_ID: string = 'project-key-to-name-map';

export const PROJECT_LOGO_URL: string = 'https://nest-upload-oss.oss-cn-beijing.aliyuncs.com/images/favicon.png';

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
  prop: {
    id: '1',
    items: [
      {
        items: null,
        maps: undefined,
        code: '',
        key: 'style',
        value: '#ffffff',
        type: 'background-color',
        owner: null,
        parent: undefined,
      },
      {
        items: null,
        maps: undefined,
        code: '',
        key: 'style', // 属性名
        value: '1', // 属性值
        type: 'opacity', // 属性类型
        owner: null,
        parent: undefined,
      },
      {
        items: null,
        maps: undefined,
        code: '',
        key: 'style',
        value: '16',
        type: 'font-size',
        owner: null,
        parent: undefined,
      }
    ],
    owner: '页面01',
    maps: undefined,
    type: '',
    size: 0,
  }
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


/**
 * @description 特性介绍列表
 */
export const FEATURE_INFO_LIST: RenrenInterface.FeatureCardType[] = [
  {
    icon: '🥰',
    hover: false,
    title: '类型友好',
    description: '使用TS编写'
  },
  {
    icon: '🚀',
    hover: false,
    title: '快捷使用',
    description: '帮助用户快速搭建页面'
  },
  {
    icon: '🍾',
    hover: false,
    title: '完全开源',
    description: '人人都可编辑分发代码'
  }
];

/**
 * @description 项目的 github 地址
 */
export const GITHUB_REPOSITORY: string = 'https://github.com/FluffyChi-Xing/renren-lowcode';



export const USER_LOGIN_INFO_FLAG: string = 'renren-lowcode-login';


/**
 * @description 基础物料源码模板
 */
export const MATERIAL_CODE_TEMPLATE: MaterialInterface.IMaterial = {
  isNode: true,
  title: 'material-title',
  isLocked: false,
  condition: '',
  conditionGroup: '',
  hidden: false,
  id: '1',
  children: null,
  parent: null,
  zLevel: 0,
  animation: [],
  events: [],
  props: {
    id: 'propsId',
    items: [
      {
        items: null,
        maps: undefined,
        code: '',
        key: 'key',
        value: 'value',
        type: 'type',
        owner: 'ownerKey',
        parent: 'parentId'
      },
    ],
    owner: 'ownerKey',
    maps: undefined,
    type: 'el-type',
    size: 20,
  },
  icon: 'el-icon-name'
};
