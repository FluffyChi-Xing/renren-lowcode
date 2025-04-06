/**
 * @description 人人实体类 模块
 * @author FluffyChi-Xing
 */
import {RenrenModel} from "@/componsables/models/RenrenModel";
import {ENTITY_ID} from "@/componsables/constants/RenrenConstant";


/**
 * @description 人人实体类
 * @extends RenrenModel
 */
export class RenrenEntity extends RenrenModel{


  id!: number;


  constructor(id?: number) {
    super();
    if (id) {
      this.id = id;
    }
  }



  copyWithId(): this {
    return this.copyModel().exposeId(ENTITY_ID);
  }


  exposeId(id?: string): this {
    return this.expose(id || ENTITY_ID);
  }
}
