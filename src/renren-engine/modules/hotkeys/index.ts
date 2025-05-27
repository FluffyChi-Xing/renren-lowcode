/**
 * @description renren-engine 热键支持模块
 * @author FluffyChi-Xing
 */



type callbackType = (event: KeyboardEvent, combos?: string[] | string) => any | boolean;


type sequenceType = { [key: string]: number };

interface IHotkeyCallbackConfig {
  callback: callbackType;
  modifiers: string[]; // 快捷键修饰符
  action: string; // 快捷键动作
  seq?: string;
  level?: number;
  combo?: string;
}

type KeyMap = {
  [key: number]: string
}

interface IHotkeyCallbacks {
  [key: string]: IHotkeyCallbackConfig[];
}


interface HotkeyDirectMap {
  [key: string]: callbackType;
}


export interface IHotkeys {

  activate(flag: boolean): void;

  mount(window: Window): () => void;

  mount(comp: HTMLElement): () => void;

  bind(combos: string[] | string, callback: callbackType, action?: string): IHotkeys;

  unbind(combos: string[] | string, callback: callbackType, action?: string): void;

  resetSeq(level?: sequenceType): void;

  keyEventHandler(event: KeyboardEvent): void;

  bindMultiple(combinations: string[], callback: callbackType, action?: string): void;

  characterFromEvent(event: KeyboardEvent): string;
}




class Hotkey implements IHotkeys {

  private sequenceLevels: sequenceType = {};

  private resetTimer: number = 0;

  private isActive: boolean = true;

  private callbacks: IHotkeyCallbacks = {};

  private directMap: HotkeyDirectMap = {};

  private ignoreNextKeyup: boolean | string = false;

  constructor(readonly viewName: string = 'global') {
    // 初始化的时候默认将热键绑定在全局窗口上
    this.mount(window);
  }

  activate(flag: boolean): void {
    this.isActive = flag;
  }

  /**
   * @description 热键绑定
   * @param combos
   * @param callback
   * @param action
   */
  bind(combos: string[] | string, callback: callbackType, action?: string): IHotkeys {
    this.bindMultiple(Array.isArray(combos) ? combos : [combos], callback, action);
    return this;
  }

  mount(window: Window): () => void;
  mount(comp: HTMLElement): () => void;

  /**
   * @description 将热键挂载到指定元素上
   * @param config
   */
  mount(config: Window | HTMLElement) {
    if (config instanceof Window) {
      const { document } = config;
      const handleKeyEvent = this.keyEventHandler.bind(this);
      document.addEventListener('keyup', handleKeyEvent, false);
      document.addEventListener('keydown', handleKeyEvent, false);
      return () => {
        document.removeEventListener('keyup', handleKeyEvent, false);
        document.removeEventListener('keydown', handleKeyEvent, false);
      };
    } else {
      const handleKeyEvent = this.keyEventHandler.bind(this);
      config.addEventListener('keyup', handleKeyEvent, false);
      config.addEventListener('keydown', handleKeyEvent, false);
      return () => {
        config.removeEventListener('keyup', handleKeyEvent, false);
        config.removeEventListener('keydown', handleKeyEvent, false);
      };
    }
  }

  resetSeq(level?: sequenceType): void {
  }

  unbind(combos: string[] | string, callback: callbackType, action?: string): void {
  }

  keyEventHandler(event: KeyboardEvent): void {
    if (!this.isActive) {
      return;
    }
    // 获取事件对应的组合键
    const character = this.characterFromEvent(event);
    if (!character) {
      return;
    }

    // 检查需要忽略的按键
    if (event.type === 'keyup' && this.ignoreNextKeyup === character) {
      this.ignoreNextKeyup = false;
      return;
    }

    // 否则进行下一步的处理
    // this.handleKey(character, eventModifiers(event), event);
  }

  bindMultiple(combinations: string[], callback: callbackType, action?: string): void {
  }


  /**
   * @description 获取事件对应的组合键
   * @param event
   */
  characterFromEvent(event: KeyboardEvent): string {
    const keyCode: string = event.key;

    // keypress 事件已弃用
    // if (event.type === 'keypress') {
    //   let character: string = keyCode;
    //
    //   // 如果不是 shift 键，则将字符转为小写
    //   if (!event.shiftKey) {
    //     character = character.toLowerCase();
    //   }
    //   return character;
    // }
    // 转换成小写
    return keyCode.toLowerCase();
  }


  private bindSingle(
    combination: string,
    callback: callbackType,
    action?: string,
    seq?: string,
    level?: number
  ): void {

  }
}


export default Hotkey;
