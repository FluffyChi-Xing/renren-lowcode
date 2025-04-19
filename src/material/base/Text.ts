/**
 * @description 文本物料 - 基础物料
 * @author FluffyChi-Xing
 */
import type {MaterialInterface} from "@/componsables/interface/MaterialInterface";
import {generateUUID} from "@/componsables/utils/GenerateIDUtil";



const propsId: string = generateUUID();


/**
 * @description 基础物料-文本
 */
export const textSchema: MaterialInterface.IMaterial = {
  children: null,
  condition: "",
  conditionGroup: "",
  hidden: false,
  icon: 'EditPen',
  id: "2",
  isLocked: false,
  isNode: true,
  parent: null,
  props: {
    id: propsId,
    items: [
      {
        items: null,
        maps: undefined,
        code: '',
        key: 'type',
        value: 'success',
        type: 'type',
        owner: '2',
        parent: propsId
      },
      {
        items: null,
        maps: undefined,
        code: '',
        key: 'size',
        value: 'default',
        type: 'size',
        owner: '2',
        parent: propsId
      },
      {
        items: null,
        maps: undefined,
        code: '',
        key: 'text',
        value: '文本',
        type: 'text',
        owner: '2',
        parent: propsId
      },
      {
        items: null,
        maps: undefined,
        code: '',
        key: 'style',
        value: '100',
        type: 'width',
        owner: '2',
        parent: propsId
      },
      {
        items: null,
        maps: undefined,
        code: '',
        key:'style',
        value: '32',
        type: 'height',
        owner: '2',
        parent: propsId
      }
    ],
    owner: '2',
    maps: undefined,
    type: 'el-text',
    size: 20,
  },
  title: "文本",
  zLevel: 0
};
