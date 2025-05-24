/**
 * @description 引擎入口文件
 * @author FluffyChi-Xing
 */
import Arrangement, {type IArrangement} from "@/renren-engine/modules/arrangement";
import type {MaterialInterface} from "@/componsables/interface/MaterialInterface";
import type {App} from "vue";


interface IEngine {
  arrangement: IArrangement<MaterialInterface.IMaterial>;

  // 通过 createApp().use() 安装 engine,并且在 app 上挂载快捷方法
  install(app: App): void;
}


/**
 * @description 引擎核心
 */
class CoreEngine implements IEngine{

  // 编排模块
  arrangement: IArrangement<MaterialInterface.IMaterial> = new Arrangement();

  install(app: App) {
  }

  constructor() {
  }
}


export default CoreEngine;
