import { nanoid } from 'nanoid';


/**
 * @description 基于 diff 算法生成唯一 ID
 */
export function generateUUID() {
  return nanoid();
}
