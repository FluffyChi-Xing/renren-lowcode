/**
 * @description 链接物料
 * @author FluffyChi-Xing
 */
import type {MaterialInterface} from "@/componsables/interface/MaterialInterface";
import {generateUUID} from "@/componsables/utils/GenerateIDUtil";




const propsId: string = generateUUID();
export const linkSchema: MaterialInterface.IMaterial = {
  children: null,
  condition: "",
  conditionGroup: "",
  hidden: false,
  icon: 'Link',
  id: '3',
  isLocked: false,
  isNode: true,
  parent: null,
  animation: [],
  props: {
    id: propsId,
    items: [
      {
        items: null,
        maps: undefined,
        code: '',
        key: 'text',
        value: '链接',
        type: 'text',
        owner: '3',
        parent: propsId
      },
      {
        items: null,
        maps: undefined,
        code: '',
        key: 'type',
        value: 'success',
        type: 'type',
        owner: '3',
        parent: propsId
      },
      {
        items: null,
        maps: undefined,
        code: '',
        key: 'style',
        value: '100',
        type: 'width',
        owner: '3',
        parent: propsId
      },
      {
        items: null,
        maps: undefined,
        code: '',
        key: 'style',
        value: '32',
        type: 'height',
        owner: '3',
        parent: propsId
      },
    ],
    owner: '3',
    maps: undefined,
    type: 'el-link',
    size: 20
  },
  title: "链接",
  zLevel: 0
};
