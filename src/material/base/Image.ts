/**
 * @description 图片物料组件
 * @author FluffyChi-Xing
 */
import {generateUUID} from "@/componsables/utils/GenerateIDUtil";
import type {MaterialInterface} from "@/componsables/interface/MaterialInterface";


const propsId: string = generateUUID();



export const imageSchema: MaterialInterface.IMaterial = {
  animation: [],
  title: '图片',
  children: null,
  condition: "",
  conditionGroup: "",
  events: [],
  hidden: false,
  icon: 'Picture',
  id: '4',
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
        key: 'fit',
        value: 'contain',
        type: 'fit',
        owner: '4',
        parent: propsId
      },
      {
        items: null,
        maps: undefined,
        code: '',
        key: 'src',
        value: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
        type: 'src',
        owner: '4',
        parent: propsId
      },
      {
        items: null,
        maps: undefined,
        code: '',
        key: 'loading',
        value: 'lazy',
        type: 'loading',
        owner: '4',
        parent: propsId
      },
      {
        items: null,
        maps: undefined,
        code: '',
        key: 'style',
        value: '200',
        type: 'width',
        owner: '4',
        parent: propsId
      },
      {
        items: null,
        maps: undefined,
        code: '',
        key: 'style',
        value: '150',
        type: 'height',
        owner: '4',
        parent: propsId
      },
      {
        items: null,
        maps: undefined,
        code: '',
        key: 'style',
        value: '1',
        type: 'z-index',
        owner: '4',
        parent: propsId
      },
    ],
    owner: '4',
    maps: undefined,
    type: 'el-image',
    size: 20,
  },
  zLevel: 0
};
