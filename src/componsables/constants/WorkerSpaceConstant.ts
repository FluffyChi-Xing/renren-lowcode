/**
 * @description 工作空间常量模块
 * @author FluffyChi-Xing
 */
import type {RenrenInterface} from "@/componsables/interface/RenrenInterface";
import {$message} from "@/componsables/element-plus";
import {RenrenMaterialModel} from "@/componsables/models/MaterialModel";


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




export const CONTEXT_MENU_LIST: RenrenInterface.KeyValueIndexType<Function, string>[] = [
  {
    key: '复制',
    value: () => {},
    index: 'copy'
  },
  {
    key: '粘贴',
    value: () => {},
    index: 'paste'
  },
  {
    key: '剪切',
    value: () => {},
    index: 'cut'
  },
  {
    key: '删除',
    value: () => {},
    index: 'delete'
  },
  {
    key: '锁定',
    value: () => {},
    index: 'lock'
  },
  {
    key: '上移',
    value: () => {},
    index: 'up'
  },
  {
    key: '下移',
    value: () => {},
    index: 'down'
  }
];



export const DEFAULT_CONTEXT_MENU_LIST: RenrenInterface.KeyValueIndexType<Function, string>[] = [
  {
    key: '粘贴',
    value: () => {
      $message({
        type: 'warning',
        message: '请先选择要粘贴的组件'
      });
    },
    index: 'paste'
  }
];
