/**
 * @description 基础按钮物料
 * @author FluffyChi-Xing
 */
import type {MaterialInterface} from "@/componsables/interface/MaterialInterface";
import {generateUUID} from "@/componsables/utils/GenerateIDUtil";


const materialId = generateUUID();
const propsId = generateUUID();

export const buttonSchema: MaterialInterface.IMaterial = {
  isNode: true,
  title: '按钮',
  isLocked: false,
  condition: '',
  conditionGroup: '',
  hidden: false,
  id: '1',
  children: null,
  parent: null,
  zLevel: 0,
  props: {
    id: propsId,
    items: [
      {
        items: null,
        maps: undefined,
        code: '',
        key: 'type',
        value: 'primary',
        type: 'type',
        owner: '1',
        parent: propsId
      },
      {
        items: null,
        maps: undefined,
        code: '',
        key: 'text',
        value: '按钮',
        type: 'text',
        owner: '1',
        parent: propsId
      },
      {
        items: null,
        maps: undefined,
        code: '',
        key: 'plain',
        value: 'true',
        type: 'plain',
        owner: '1',
        parent: propsId
      }
    ],
    owner: '1',
    maps: undefined,
    type: 'el-button',
    size: 20,
  },
  icon: 'Pointer'
}
