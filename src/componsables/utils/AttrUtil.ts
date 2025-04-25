import type {RenrenInterface} from "@/componsables/interface/RenrenInterface";

export const propsAttributes: RenrenInterface.keyValueType<string>[] = [
  {
    key: 'left',
    value: 'x 坐标'
  },
  {
    key: 'top',
    value: 'y 坐标'
  },
  {
    key: 'rotate',
    value: '旋转角度'
  },
  {
    key: 'width',
    value: '宽度'
  },
  {
    key: 'height',
    value: '高度'
  },
  {
    key: 'color',
    value: '颜色'
  },
  {
    key: 'backgroundColor',
    value: '背景颜色'
  },
  {
    key: 'borderWidth',
    value: '边框宽度'
  },
  {
    key: 'borderStyle',
    value: '边框样式'
  },
  {
    key: 'borderColor',
    value: '边框颜色'
  },
  {
    key: 'borderRadius',
    value: '边框半径'
  },
  {
    key: 'fontSize',
    value: '字体大小'
  },
  {
    key: 'fontWeight',
    value: '字体粗细'
  },
  {
    key: 'lineHeight',
    value: '字体行高'
  },
  {
    key: 'letterSpacing',
    value: '字母间距'
  },
  {
    key: 'textAlign',
    value: '水平对齐方式'
  },
  {
    key: 'verticalAlign',
    value: '垂直对齐方式'
  },
  {
    key: 'opacity',
    value: '透明度'
  }
];


/**
 * @description 映射属性和属性值
 */
export const propAttributesMap = new Map<string, string>([
  ['left', 'x 坐标'],
  ['top', 'y 坐标'],
  ['rotate', '旋转角度'],
  ['width', '宽度'],
  ['height', '高度'],
  ['color', '颜色'],
  ['background-color', '背景颜色'],
  ['border-width', '边框宽度'],
  ['border-style', '边框样式'],
  ['border-color', '边框颜色'],
  ['border-radius', '边框半径'],
  ['font-size', '字体大小'],
  ['font-weight', '字体粗细'],
  ['line-height', '字体行高'],
  ['letter-spacing', '字母间距'],
  ['text-align', '水平对齐方式'],
  ['vertical-align', '垂直对齐方式'],
  ['opacity', '透明度'],
  ['size', 'element 尺寸'],
  ['type', 'element 类型'],
  ['position', '定位'],
  ['plain', '线框'],
  ['text', '填充文本'],
  ['z-index', '优先级'],
  ['src', '链接'],
  ['loading', '加载方式'],
  ['fit', '填充方式'],
]);


/**
 * @description 属性值取值方式映射表
 */
export const propAttributesTypeMap: Map<string, string> = new Map<string, string>([
  ['left', 'input'],
  ['top', 'input'],
  ['rotate', 'input'],
  ['width', 'input'],
  ['height', 'input'],
  ['color', 'input'],
  ['background-color', 'picker'],
  ['border-width', 'input'],
  ['border-style', 'select'],
  ['border-color', 'picker'],
  ['border-radius', 'input'],
  ['font-size', 'input'],
  ['font-weight', 'input'],
  ['line-height', 'input'],
  ['letter-spacing', 'input'],
  ['text-align', 'select'],
  ['vertical-align', 'select'],
  ['opacity', 'input'],
  ['size', 'select'],
  ['type', 'select'],
  ['text', 'input'],
  ['position', 'select'],
  ['plain','switch'],
  ['z-index', 'input'],
  ['loading', 'select'],
  ['src', 'input'],
  ['fit', 'select'],
]);


/**
 * @description css 属性后缀映射表
 */
export const propAttributesSuffixOptions: Map<string, string> = new Map<string, string>([
  ['left', 'px'],
  ['top', 'px'],
  ['rotate', 'deg'],
  ['width', 'px'],
  ['height', 'px'],
  ['border-width', 'px'],
  ['border-radius', 'px'],
  ['font-size', 'px'],
  ['font-weight', 'px'],
  ['line-height', 'px'],
  ['letter-spacing', 'px'],
  ['opacity', ''],
  ['position', ''],
  ['z-index', ''],
  ['loading', ''],
  ['fit', ''],
  ['background-color', ''],
]);




export const textAlignOptions: RenrenInterface.keyValueType<string>[] = [
  {
    key: '左对齐',
    value: 'left'
  },
  {
    key: '居中对齐',
    value: 'center'
  },
  {
    key: '右对齐',
    value: 'right'
  }
];



export const borderStyleOptions: RenrenInterface.keyValueType<string>[] = [
  {
    key: '实线',
    value: 'solid'
  },
  {
    key: '虚线',
    value: 'dashed'
  }
];


export const verticalAlignOptions: RenrenInterface.keyValueType<string>[] = [
  {
    key: '上对齐',
    value: 'top'
  },
  {
    key: '居中对齐',
    value: 'middle'
  },
  {
    key: '下对齐',
    value: 'bottom'
  }
];



export const elementSizeOptions: RenrenInterface.keyValueType<string>[] = [
  {
    key: '标准',
    value: 'default'
  },
  {
    key: '小',
    value: 'small'
  },
  {
    key: '大',
    value: 'large'
  }
];


export const elementTypeOptions: RenrenInterface.keyValueType<string>[] = [
  {
    key: '成功',
    value: 'success'
  },
  {
    key: '警告',
    value: 'warning'
  },
  {
    key: '信息',
    value: 'info'
  },
  {
    key: '危险',
    value: 'danger'
  },
  {
    key: '主要',
    value: 'primary'
  }
];


export const positionOptions: RenrenInterface.keyValueType<string>[] = [
  {
    key: '绝对定位',
    value: 'absolute'
  },
  {
    key: '相对定位',
    value: 'relative'
  },
  {
    key: '固定定位',
    value: 'fixed'
  },
];




export const plainOptions: RenrenInterface.keyValueType<boolean>[] = [
  {
    key: '线框按钮',
    value: true
  },
  {
    key: '实心按钮',
    value: false
  }
];


export const loadingOptions: RenrenInterface.keyValueType<string>[] = [
  {
    key: '懒加载',
    value: 'lazy'
  },
  {
    value: 'eager',
    key: '立即加载'
  }
];


export const fitOptions: RenrenInterface.keyValueType<string>[] = [
  {
    key: '默认',
    value: ''
  },
  {
    key: 'fill',
    value: 'fill'
  },
  {
    key: 'contain',
    value: 'contain'
  },
  {
    key: 'cover',
    value: 'cover'
  },
  {
    key: 'none',
    value: 'none'
  },
  {
    key: 'scale-down',
    value: 'scale-down'
  }
];


/**
 * @description 属性值对应的选项映射表
 */
export const propAttributesOptionsMap: Map<string, RenrenInterface.keyValueType<string>[]> = new Map<string, RenrenInterface.keyValueType<any>[]>([
  ['border-style', borderStyleOptions],
  ['text-align', textAlignOptions],
  ['vertical-align', verticalAlignOptions],
  ['size', elementSizeOptions],
  ['type', elementTypeOptions],
  ['plain', plainOptions],
  ['position', positionOptions],
  ['loading', loadingOptions],
  ['fit', fitOptions],
]);
