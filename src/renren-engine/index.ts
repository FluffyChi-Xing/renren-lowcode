/**
 * @description 引擎入口文件
 * @author FluffyChi-Xing
 */
import Arrangement, {type IArrangement} from "@/renren-engine/modules/arrangement";
import type {MaterialInterface} from "@/componsables/interface/MaterialInterface";
import {type App, type Component} from "vue";
import Renderer, {type IRenderer} from "@/renren-engine/modules/renderer";
import ImportModule, {type IImport} from "@/renren-engine/modules/import";
import {type IHotkeys} from "@/renren-engine/modules/hotkeys";
import Hotkey from "@/renren-engine/modules/hotkeys";



// TODO  待定义
type IConfig = {
  name: string;
}



interface IEngine {

  // 编排模块
  arrangement: IArrangement<MaterialInterface.IMaterial>;

  // 渲染模块
  renderer: IRenderer<Component>;

  // 入料模块
  importModule: IImport;

  // 热键模块
  hotkey: IHotkeys;

  // 通过 createApp().use() 安装 engine,并且在 app 上挂载快捷方法
  install(app: App): void;
}


/**
 * @description 引擎核心
 */
class CoreEngine implements IEngine {

  // 配置列表
  private config: IConfig = {
    name: 'todo something'
  };

  // 编排模块
  arrangement: IArrangement<MaterialInterface.IMaterial> = new Arrangement();

  // 渲染模块
  renderer: IRenderer<Component> = new Renderer();

  // 入料模块
  importModule: IImport = new ImportModule();

  // 热键模块
  hotkey: IHotkeys = new Hotkey();

  install(app: App) {
    app.provide('$arrange', this.arrangement);
  }

  constructor() {
  }
}

export default CoreEngine;
