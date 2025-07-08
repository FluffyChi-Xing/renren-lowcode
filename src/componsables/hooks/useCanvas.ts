/**
 * @description canvas modules relative hooks
 * @author FluffyChi-Xing
 */
import useSchemaStore from "@/stores/schema";
import { ref } from 'vue';
import type {RenrenMaterialModel} from "@/componsables/models/MaterialModel";
import {$util} from "@/componsables/utils";
import {$message} from "@/componsables/element-plus";
import {container} from "@/renren-engine/__init__";
import type {IEngine} from "@/renren-engine";
import useCanvasStore from "@/stores/canvas";
import $event from "@/componsables/utils/EventBusUtil";
import {LocalforageDB} from "@/componsables/database/LocalforageDB";
import {NEW_ELEMENT} from "@/componsables/constants/WorkerSpaceConstant";


export default function useCanvas() {
  const schemaStore = useSchemaStore();
  const isShow = ref<boolean>(false);
  const materialContainer = ref<RenrenMaterialModel[]>([]);
  const engine = container.resolve<IEngine>('engine');
  const canvasStore = useCanvasStore();
  const indexedDB = new LocalforageDB();


  function copyMaterial() {
    const currentElement: any = schemaStore.getCurrentElement;
    if (schemaStore.isCurrentElementMaterialType()) {
      schemaStore.setCopyMaterial(currentElement);
    }
    isShow.value = false;
  }


  function insertComponent(item: RenrenMaterialModel | undefined) {
    if (!item) return;
    materialContainer.value.push(item);
  }



  async function saveComponent(item: RenrenMaterialModel | undefined) {
    if (!item) return;
    await engine.arrangement.addComponent(item, canvasStore.getCurrentDocName).then(() => {
      indexedDB.insert(NEW_ELEMENT, item);
      $event.emit('insert');
      $event.emit(`pasteMaterial:${item.id}`);
    }).catch(err => {
      $message({
        type: 'warning',
        message: err as string
      });
    });
  }




  async function pasteMaterial() {
    if (schemaStore.isCurrentElementMaterialType()) {
      const copyMaterial: any = schemaStore.getCopyMaterial;
      if (copyMaterial !== void 0) {
       let newMaterial: RenrenMaterialModel = $util.renren.deepClone(copyMaterial) as RenrenMaterialModel;
       newMaterial.id = $util.nano.generateUUID();
       insertComponent(newMaterial);
       // 保存 material to local
        await saveComponent(newMaterial);
      } else {
        $message({
          type: 'warning',
          message: '请先选择要粘贴的元素'
        });
      }
    }
  }



  function lockMaterial() {
    $event.emit('lock');
  }


  function unLockMaterial() {
    $event.emit('unlock');
  }



  return {
    isShow,
    materialContainer,
    indexedDB,
    engine,
    copyMaterial,
    pasteMaterial,
    insertComponent,
    lockMaterial,
    unLockMaterial,
  };
}
