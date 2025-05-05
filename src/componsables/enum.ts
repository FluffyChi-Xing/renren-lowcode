import * as HttpCodeEnum from '@/componsables/enums/HttpCodeEnum';
import * as DeviceEnum from '@/componsables/enums/DeviceTypeEnum';
import * as HttpRequestMethod from '@/componsables/enums/HttpRequestMethodEnum';
import * as MaterialType from '@/componsables/enums/MaterialTypeEnum';


/**
 * @description enumeration aggregation param
 */
export const $enum = {
  ...HttpCodeEnum,
  ...DeviceEnum,
  ...HttpRequestMethod,
  ...MaterialType,
};
