import { ENGINE_VERSION } from "@/renren-engine/componsables/constants/EngineConstants";


(function __init__() {
  console.log(
    `%c RenrenLowCodeEngine %c v${ENGINE_VERSION} `,
    'padding: 2px 1px; border-radius: 3px 0 0 3px; color: #fff; background: #606060; font-weight: bold;',
    'padding: 2px 1px; border-radius: 0 3px 3px 0; color: #fff; background: #42c02e; font-weight: bold;',
  )
})()
