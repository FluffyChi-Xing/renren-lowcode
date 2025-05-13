import './assets/main.css'
import './style.css'
import '@/renren-engine/__init__'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import hljsVuePlugin from "@highlightjs/vue-plugin";
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { install as VueMonacoEditorPlugin } from '@guolao/vue-monaco-editor'
import '@/componsables/ErrorHandler/errorHandler';
import {createPlugin} from "@/componsables/models/PluginModel";
import UndoRedo from "@/plugin/plugin-undo-redo/UndoRedo.vue";

const app = createApp(App)

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
app.use(router);
app.use(pinia);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
// 创建插件实例
const plugin = createPlugin();
plugin.register({
  name: 'UndoRedo',
  component: UndoRedo
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
