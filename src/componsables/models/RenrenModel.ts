/**
 * @description renren-models super class
 */
import type {ClassConstructor} from "@/componsables/type/RenrenType";
import type {IJson} from "@/componsables/type/IJson";
import {RenrenEntity} from "@/componsables/entities/RenrenEntity";

export class RenrenModel {


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
