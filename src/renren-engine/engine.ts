/**
 * @description renren-engine aggregation modules
 * @author FluffyChi-Xing
 */
import * as arrangement from '@/renren-engine/modules/arrangement/arrangement';
import * as renderer from '@/renren-engine/modules/renderer/renderer';
import * as engineImport from '@/renren-engine/modules/import/engine-import';
import * as codeGenerator from '@/renren-engine/modules/code-generator/code-generator';
import * as exportCode from '@/renren-engine/modules/export/engine-export';


/**
 * @description 编排引擎聚合模块
 */
export const $engine = {
  arrangement,
  renderer,
  engineImport,
  codeGenerator,
  exportCode,
}
