import * as HttpCodeEnum from '@/componsables/enums/HttpCodeEnum';
import * as DeviceEnum from '@/componsables/enums/DeviceTypeEnum';


/**
 * @description enumeration aggregation param
 */
export const $enum = {
  ...HttpCodeEnum,
  ...DeviceEnum,
};
