/**
 * @description 项目基本type
 * @author FluffyChi-Xing
 */


/**
 * @description classConstructor type
 */
export type ClassConstructor<T = any> = {
  new(...args: any[]): T;
}
