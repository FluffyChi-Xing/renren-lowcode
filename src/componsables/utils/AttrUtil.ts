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


export const propsAttributesMap = new Map<string, string>([
  ['left', 'x 坐标'],
  ['top', 'y 坐标'],
  ['rotate', '旋转角度'],
  ['width', '宽度'],
  ['height', '高度'],
  ['color', '颜色'],
  ['backgroundColor', '背景颜色'],
  ['borderWidth', '边框宽度'],
  ['borderStyle', '边框样式'],
  ['borderColor', '边框颜色'],
  ['borderRadius', '边框半径'],
  ['fontSize', '字体大小'],
  ['fontWeight', '字体粗细'],
  ['lineHeight', '字体行高'],
  ['letterSpacing', '字母间距'],
  ['textAlign', '水平对齐方式'],
  ['verticalAlign', '垂直对齐方式'],
  ['opacity', '透明度']
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


export const propsOptions = {
  textAlign: textAlignOptions,
  borderStyle: borderStyleOptions,
  verticalAlign: verticalAlignOptions
}
