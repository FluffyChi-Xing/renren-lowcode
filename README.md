# 人人低码

人人低码是一个低代码平台，致力于帮助用户快速构建商品互动页和表单页面，并支持json和源代码的导出功能。
## 编辑器
![image](https://github.com/user-attachments/assets/44db425c-448a-4f4c-aae8-288b1927285d)
## 项目目录
project
├─assets // 静态资源 \n
├─components // 通用组件 \n
│  └─material
├─componsables 
│  ├─apis // api
│  ├─constants // 常量值
│  ├─decorators // 装饰器
│  ├─entities // 实体类
│  ├─enums // 枚举类
│  ├─hooks // 钩子
│  ├─interface // 接口
│  ├─models // 模型类
│  ├─service // 服务类
│  ├─type // type类型
│  └─utils // 工具类模块
├─material // 物料模块
│  ├─base // 基础物料
│  ├─chart // 统计图物料
│  ├─form // 表单物料
│  ├─layout // 布局物料
│  └─navigator // 导航物料
├─pages // 页面模块
│  ├─document
│  ├─home // 首页
│  │  ├─_components
│  │  └─_pages
│  └─workerspace // 工作台
│      └─_components
│          ├─Attributes
│          ├─EditorConfig
│          ├─header
│          ├─MaterialAside
│          └─NodeTree
├─renren-engine // 引擎模块
│  ├─arrangement // 编排模块
│  ├─export // 导出模块
│  ├─import // 导入模块
│  └─renderer // 渲染模块
├─router // 路由
└─stores // 状态管理



## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
