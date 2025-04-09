/**
 * @description renren-engine aggregation modules
 * @author FluffyChi-Xing
 */
import * as arrangement from './arrangement/arrangement';
import * as renderer from './renderer/renderer';
import * as engineImport from './import/engine-import';


/**
 * @description 编排引擎聚合模块
 */
export const $engine = {
  ...arrangement,
  ...renderer,
  ...engineImport,
}
