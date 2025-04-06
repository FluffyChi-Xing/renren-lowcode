/**
 * @description 基础按钮物料
 * @author FluffyChi-Xing
 */
import type {MaterialInterface} from "@/componsables/interface/MaterialInterface";
import {generateUUID} from "@/componsables/utils/GenerateIDUtil";


export const buttonSchema: MaterialInterface.IMaterial = {
  isNode: false,
  title: '按钮',
  isLocked: false,
  condition: '',
  conditionGroup: '',
  hidden: false,
  id: generateUUID(),
  children: null,
  parent: null,
  zLevel: 0,
  props: {
    id: generateUUID(),
    items: [
      {
        items: null,
        maps: undefined,
        code: '',
        key: 'width',
        value: 80,
        type: 'number',
        owner: null,
        parent: undefined
      },
      {
        items: null,
        maps: undefined,
        code: '',
        key: 'height',
        value: 32,
        type: 'number',
        owner: null,
        parent: undefined
      }
    ],
    owner: null,
    maps: undefined,
    type: '#button',
    size: 20,
  },
  icon: 'Pointer'
}
