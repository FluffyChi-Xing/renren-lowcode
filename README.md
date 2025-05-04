# 人人低码

人人低码是一个低代码平台，致力于帮助用户快速构建商品互动页和表单页面，并支持json和源代码的导出功能。
## 编辑器
![image](https://github.com/user-attachments/assets/44db425c-448a-4f4c-aae8-288b1927285d)
## 项目目录
```
project
├─assets
├─components
│  └─material
├─componsables
│  ├─apis
│  │  ├─document
│  │  ├─error
│  │  ├─material
│  │  │  └─_apis
│  │  ├─project
│  │  └─user
│  │      └─_apis
│  ├─constants
│  ├─decorators
│  ├─entities
│  ├─enums
│  ├─ErrorHandler
│  │  └─logger
│  ├─hooks
│  ├─interface
│  │  └─dto
│  │      ├─req
│  │      └─resp
│  ├─models
│  ├─service
│  ├─type
│  └─utils
├─material
│  ├─base
│  ├─chart
│  ├─form
│  ├─layout
│  └─navigator
├─pages
│  ├─document
│  ├─home
│  │  ├─_components
│  │  └─_pages
│  ├─manage
│  │  ├─_component
│  │  └─_pages
│  │      ├─dashboard
│  │      │  └─_component
│  │      ├─material
│  │      ├─project
│  │      └─userInfo
│  └─workerspace
│      └─_components
│          ├─Attributes
│          │  └─_components
│          ├─EditorConfig
│          ├─header
│          ├─MaterialAside
│          └─NodeTree
├─renren-engine
│  ├─componsables
│  │  ├─constants
│  │  ├─enums
│  │  └─types
│  ├─modules
│  │  ├─arrangement
│  │  ├─export
│  │  ├─import
│  │  └─renderer
│  └─sandbox
│      └─__tests__
├─router
└─stores
```


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
