/**
 * @description 人人常量类 模块
 * @author FluffyChi-Xing
 */


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


export const DEFAULT_USER_AVATAR: string = 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png';


export const DEFAULT_MATERIAL_STORAGE_INDEX: string = 'default-material';
