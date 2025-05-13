/**
 * @description 事件属性工具模块
 * @author FluffyChi-Xing
 */

/**
 * @description 事件名称和值映射表
 */
export const eventNameValueMap: Map<string, string> = new Map<string, string>([
  ['onClick', '点击'],
  ['onMouseEnter', '鼠标移入'],
  ['onMouseLeave', '鼠标移出'],
  ['onMouseDown', '鼠标按下'],
  ['onMouseUp', '鼠标抬起'],
  ['onMouseMove', '鼠标移动'],
  ['onMouseOver', '鼠标移入'],
  ['onMouseOut', '鼠标移出'],
  ['onMouseWheel', '鼠标滚轮'],
  ['onDblClick', '鼠标双击'],
  ['onContextMenu', '鼠标右键'],
  ['onKeyDown', '键盘按下'],
  ['onKeyUp', '键盘抬起'],
  ['onKeyPress', '键盘按下'],
  ['onFocus', '获得焦点'],
  ['onBlur', '失去焦点'],
  ['alert', '通知事件'],
  ['message', '消息事件'],
  ['notification', '通知事件'],
  ['onChange', '变化事件'],
]);



export const mouseEvent: RenrenInterface.IEvent[] = [
  {
    callback: undefined,
    description: '当鼠标移出组件边界的时候触发',
    id: '1',
    name: "鼠标移除事件",
    type: 'onMouseLeave'
  },
  {
    callback: undefined,
    description: '当鼠标移入组件边界的时候触发',
    id: '2',
    name: "鼠标移入事件",
    type: 'onMouseEnter'
  },
  {
    callback: undefined,
    description: '当鼠标按下的时候触发',
    id: '3',
    name: "鼠标按下事件",
    type: 'onMouseDown'
  },
  {
    callback: undefined,
    description: '当鼠标抬起的时候触发',
    id: '4',
    name: "鼠标抬起事件",
    type: 'onMouseUp'
  },
  {
    callback: undefined,
    description: '当鼠标移动的时候触发',
    id: '5',
    name: "鼠标移动事件",
    type: 'onMouseMove'
  },
  {
    callback: undefined,
    description: '当鼠标滚轮的时候触发',
    id: '6',
    name: "鼠标滚轮事件",
    type: 'onMousewheel'
  },
  {
    callback: undefined,
    description: '当鼠标双击的时候触发',
    id: '7',
    name: "鼠标双击事件",
    type: 'onDblclick'
  }
];


export const clickEvent: RenrenInterface.IEvent[] = [
  {
    id: '1',
    type: 'onClick',
    name: '点击事件',
    description: '当点击组件的时候触发',
    callback: undefined
  }
];


export const messageEvent: RenrenInterface.IEvent[] = [
  {
    id: '1',
    name: 'message事件',
    type: 'message',
    description: 'element的message事件',
    callback: undefined
  },
  {
    id: '2',
    name: 'notification事件',
    type: 'notification',
    description: 'element的notification事件',
    callback: undefined
  },
  {
    id: '3',
    name: 'alert事件',
    type: 'alert',
    description: '原生alert事件',
    callback: undefined
  }
];


/**
 * @description 事件类型列表
 */
export const eventTypeList: RenrenInterface.keyValueType<RenrenInterface.IEvent[]>[] = [
  {
    key: '鼠标事件',
    value: mouseEvent
  },
  {
    key: '点击事件',
    value: clickEvent
  },
  {
    key: '消息事件',
    value: messageEvent
  }
];


/**
 * @description 事件类型映射表
 */
export const eventTypeMap: Map<string, RenrenInterface.IEvent[]> = new Map<string, RenrenInterface.IEvent[]>([
  ['鼠标事件', mouseEvent],
  ['点击事件', clickEvent],
  ['消息事件', messageEvent],
]);
