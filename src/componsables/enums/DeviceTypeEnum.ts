/**
 * @description 设备类型枚举类
 * @author FluffyChi-Xing
 */


/**
 * @description 设备类型枚举类
 */
export enum DeviceTypeEnum {
  PHONE = 'phone',
  PAD = 'pad',
  DESKTOP = 'desktop',
}


/**
 * @description 设备 icon 枚举类
 */
export enum DeviceIconEnum {
  Iphone = 'phone',
  Cellphone = 'pad',
  Monitor = 'desktop',
}


/**
 * @description 设备尺寸枚举类
 */
export enum DeviceSizeEnum {
  'desktop' = 1080,
  'pad' = 768,
  'phone' = 414,
}


/**
 * @description 获取设备icon
 * @param index
 */
export function getIconByValue(index: string): any {
  if (index) {
    const list = Object.keys(DeviceIconEnum);
    const foundKey = list.find(item => DeviceIconEnum[item as keyof typeof DeviceIconEnum] === index);
    return foundKey ? foundKey : undefined;
  }
  return undefined;
}
