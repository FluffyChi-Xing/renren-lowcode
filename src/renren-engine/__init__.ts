import { ENGINE_VERSION } from "@/renren-engine/componsables/constants/EngineConstants";
import {asClass, createContainer} from "awilix";
import CoreEngine from "./index";
import Arrangement from "@/renren-engine/modules/arrangement";
import Renderer from "@/renren-engine/modules/renderer";
import CodeGenerator from "@/renren-engine/modules/code-generator";



// 创建 ioc 容器
export const container = createContainer({
  injectionMode: "PROXY",
})

/**
 * @description 初始化引擎
 */
export function init() {

  // 将 低码引擎实例注册到 ioc 容器中
  container.register({
    engine: asClass(CoreEngine).singleton(),
    arrangement: asClass(Arrangement).singleton(),
    renderer: asClass(Renderer).singleton(),
    generator: asClass(CodeGenerator).singleton(),
  });
  console.log(
    `%c RenrenLowCodeEngine %c v${ENGINE_VERSION} `,
    'padding: 2px 1px; border-radius: 3px 0 0 3px; color: #fff; background: #606060; font-weight: bold;',
    'padding: 2px 1px; border-radius: 0 3px 3px 0; color: #fff; background: #42c02e; font-weight: bold;',
  )
}


init();
