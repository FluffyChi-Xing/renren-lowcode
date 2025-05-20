import './assets/main.css'
import './style.css'
import '@/renren-engine/__init__'
import '@/assets/iconfont/iconfont.js'
import '@/assets/iconfont/iconfont.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import hljsVuePlugin from "@highlightjs/vue-plugin";
import { install as VueMonacoEditorPlugin } from '@guolao/vue-monaco-editor'
import '@/componsables/ErrorHandler/errorHandler';
import {createPlugin} from "@/componsables/models/PluginModel";
import UndoRedo from "@/plugin/plugin-undo-redo/UndoRedo.vue";
import CodeGenerator from "@/plugin/plugin-code-generator/CodeGenerator.vue";
import SaveLocal from "@/plugin/plugin-save-local/SaveLocal.vue";
import SchemaPreview from "@/plugin/plugin-schema-preview/SchemaPreview.vue";

const app = createApp(App)

app.use(router);
app.use(createPinia());
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}


// 创建插件实例
const plugin = createPlugin();
// 注册撤销组件
plugin.register({
  name: 'UndoRedo',
  component: UndoRedo
});
// 注册出码组件
plugin.register({
  name: 'CodeGenerator',
  component: CodeGenerator
});
// 注册本地保存插件
plugin.register({
  name: 'SaveLocal',
  component: SaveLocal
});
// 注册预览组件
plugin.register({
  name: 'SchemaPreview',
  component: SchemaPreview
});

app.use(plugin);



app.use(hljsVuePlugin);
app.use(VueMonacoEditorPlugin, {
  paths: {
    // 在这里更改 CDN 链接加载不同版本
    vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.52.2/min/vs'
  },
});

app.mount('#app')
