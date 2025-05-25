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

interface IHotkeyCallbacks {
  [key: string]: IHotkeyCallbackConfig[];
}


interface HotkeyDirectMap {
  [key: string]: callbackType;
}


interface IHotkeys {

  activate(flag: boolean): void;

  mount(window: Window): () => void;

  mount(comp: HTMLElement): () => void;

  bind(combos: string[] | string, callback: callbackType, action?: string): IHotkeys;

  unbind(combos: string[] | string, callback: callbackType, action?: string): void;

  resetSeq(level?: sequenceType): void;

  keyEventHandler(event: KeyboardEvent): void;

  bindMultiple(combinations: string[], callback: callbackType, action?: string): void;
}




class Hotkey implements IHotkeys {

  private sequenceLevels: sequenceType = {};

  private resetTimer: number = 0;

  private isActive: boolean = false;

  private callbacks: IHotkeyCallbacks = {};

  private directMap: HotkeyDirectMap = {};

  constructor(readonly viewName: string = 'global') {
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
      document.addEventListener('keypress', handleKeyEvent, false);
      document.addEventListener('keyup', handleKeyEvent, false);
      document.addEventListener('keydown', handleKeyEvent, false);
      return () => {
        document.removeEventListener('keypress', handleKeyEvent, false);
        document.removeEventListener('keyup', handleKeyEvent, false);
        document.removeEventListener('keydown', handleKeyEvent, false);
      };
    } else {
      const handleKeyEvent = this.keyEventHandler.bind(this);
      config.addEventListener('keypress', handleKeyEvent, false);
      config.addEventListener('keyup', handleKeyEvent, false);
      config.addEventListener('keydown', handleKeyEvent, false);
      return () => {
        config.removeEventListener('keypress', handleKeyEvent, false);
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
  }

  bindMultiple(combinations: string[], callback: callbackType, action?: string): void {
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
