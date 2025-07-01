import {defineStore} from "pinia";


type CanvasState = {
  height: number;
  width: number;
  isAdd: string;
  canvasColor: string;
  updateFlag: string;
  opacity: number;
  lineHeight: number;
  currentDocName: string;
}

type CanvasInfoTypes = {
  height: number;
  width: number;
  canvasColor: string;
  opacity: number;
  lineHeight: number;
}

type CanvasSizeTypes = {
  width?: number;
  height?: number;
}



/**
 * @description 画布状态管理
 */
const useCanvasStore = defineStore('canvas', {
  state: (): CanvasState => ({
    height: 720,
    width: 1080,
    isAdd: '000',
    canvasColor: '#ffffff',
    currentDocName: '',
    lineHeight: 16,
    opacity: 1,
    updateFlag: ''
  }),


  getters: {
    getHeight(): number {
      return this.height;
    },
    getWidth(): number {
      return this.width;
    },
    getIsAdd(): string {
      return this.isAdd;
    },
    getCanvasColor(): string {
      return this.canvasColor;
    },
    getCurrentDocName(): string {
      return this.currentDocName;
    },
    getLineHeight(): number {
      return this.lineHeight;
    },
    getOpacity(): number {
      return this.opacity;
    },
    getUpdateFlag(): string {
      return this.updateFlag;
    },
    getCanvasInfo(): CanvasInfoTypes {
      return {
        height: this.height,
        width: this.width,
        canvasColor: this.canvasColor,
        opacity: this.opacity,
        lineHeight: this.lineHeight
      }
    }
  },


  actions: {

    /**
     * @description 更新画布基础信息
     * @param params
     */
    updateCanvasInfo(params: CanvasInfoTypes): Promise<string> {
      return new Promise<string>((resolve, reject) => {
        try {
          const { height, width, opacity, lineHeight, canvasColor } = params;
          this.height = height;
          this.width = width;
          this.opacity = opacity;
          this.lineHeight = lineHeight;
          this.canvasColor = canvasColor;
          resolve('更新画布信息成功');
        } catch (e) {
          console.error('更新画布信息失败', e);
          reject('更新画布信息失败');
        }
      });
    },


    updateCurrentDocName(name: string | undefined): void {
      this.currentDocName = name || '';
    },

    updateCanvasSize(params: CanvasSizeTypes): void {
      const { width, height } = params;
      if (width) {
        this.width = width;
      }
      if (height) {
        this.height = height;
      }
    }
  }
});


export default useCanvasStore;

