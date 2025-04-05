/**
 * @description 工作空间常量模块
 * @author FluffyChi-Xing
 */
import type {RenrenInterface} from "@/componsables/interface/RenrenInterface";


export const DEVICE_TYPES: RenrenInterface.keyValueType<string>[] = [
  {
    key: 'phone',
    value: '手机'
  },
  {
    key: 'pad',
    value: '平板'
  },
  {
    key: 'desktop',
    value: '桌面'
  }
];
