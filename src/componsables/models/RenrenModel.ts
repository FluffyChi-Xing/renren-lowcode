/**
 * @description renren-models super class
 */
import type {ClassConstructor} from "@/componsables/type/RenrenType";
import type {IJson} from "@/componsables/type/IJson";
import type {RenrenInterface} from "@/componsables/interface/RenrenInterface";

export class RenrenModel {
  type: string = '';


  /**
   * @description 生成一个新的模型实例
   * @param recoverBy
   */
  static newInstance<T extends RenrenModel>(this: ClassConstructor<T>, recoverBy?: IJson): T {
    const instance: T = (Object.assign(new this(), null)) as T;
    // TODO: finish recover function
    // if (recoverBy) {
    //   return instance.recover(recoverBy);
    // }
    return instance;
  }


  /**
   * @description 复制模型函数
   */
  copyModel(): this {
    const newModel = Object.create(Object.getPrototypeOf(this));
    return Object.assign(newModel, this);
  }


  /**
   * @description 暴露模型中的某些字段函数
   * @param fields
   */
  expose(...fields: string[]): this {
    const fieldList: string[] = Object.keys(this);
    for (let field of fieldList) {
      if (!fields.includes(field)) {
        (this as IJson)[field] = undefined;
      }
    }
    return this;
  }
}



export class Stack<T> extends RenrenModel implements RenrenInterface.IStack<T>{
  data: T[] | undefined = [];
  size: number = 0;


  constructor() {
    super();
  }

  /**
   * @description 入栈
   * @param item
   */
  push(item: T | undefined): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      try {
        if (item !== void 0) {
          this.data?.push(item);
          this.size += 1;
          resolve('入栈成功');
        } else {
          reject('参数错误');
        }
      } catch (e) {
        console.error('入栈失败', e);
        reject('入栈失败');
      }
    });
  }

  /**
   * @description 弹出栈顶元素
   */
  pop(): T | undefined {
    this.size --;
    return this.data?.pop();
  }

  /**
   * @description 获取栈顶元素
   */
  peek(): T | undefined {
    return this.data?.[this.size - 1] as T;
  }


  /**
   * @description 判断是否栈空
   */
  isEmpty(): boolean {
    return this.size === 0;
  }

  /**
   * @description 获取栈容量
   */
  getSize(): number {
    return this.size;
  }

  /**
   * @description 清空栈
   */
  clear(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      try {
        this.size = 0;
        this.data = [];
        resolve('清空栈成功');
      } catch (e) {
        console.error('清空栈失败', e);
        reject('清空栈失败');
      }
    });
  }
}
