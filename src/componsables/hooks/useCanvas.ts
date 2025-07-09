/**
 * @description canvas modules relative hooks
 * @author FluffyChi-Xing
 */
import useSchemaStore from "@/stores/schema";
import {reactive, ref} from 'vue';
import type {RenrenMaterialModel} from "@/componsables/models/MaterialModel";
import {$util} from "@/componsables/utils";
import {$message} from "@/componsables/element-plus";
import {container} from "@/renren-engine/__init__";
import type {IEngine} from "@/renren-engine";
import useCanvasStore from "@/stores/canvas";
import $event from "@/componsables/utils/EventBusUtil";
import {LocalforageDB} from "@/componsables/database/LocalforageDB";
import {NEW_ELEMENT} from "@/componsables/constants/WorkerSpaceConstant";
import type {MaterialInterface} from "@/componsables/interface/MaterialInterface";


export default function useCanvas() {
  const schemaStore = useSchemaStore();
  const isShow = ref<boolean>(false);
  const materialContainer = reactive<{
    value: RenrenMaterialModel[];
    _remove: (id: string) => void;
    _insert: (item: RenrenMaterialModel) => void;
    _set: (item: RenrenMaterialModel[]) => void;
    _init: () => void;
  }>({
    value: [],
    _remove(id: string) {
      this.value = this.value.filter(item => item.id !== id);
    },
    _insert(item: RenrenMaterialModel) {
      this.value.push(item);
    },
    _set(item: RenrenMaterialModel[]) {
      this.value = item;
    },
    _init() {
      this.value = [];
    }
  });
  const engine = container.resolve<IEngine>('engine');
  const canvasStore = useCanvasStore();
  const indexedDB = new LocalforageDB();
  const materialZIndex = reactive<RenrenInterface.KeyValueIndexType<string, string>>({
    index: "z-index",
    key: "style",
    value: ""
  });



  function copyMaterial() {
    const currentElement: any = schemaStore.getCurrentElement;
    if (schemaStore.isCurrentElementMaterialType()) {
      schemaStore.setCopyMaterial(currentElement);
    }
    isShow.value = false;
  }


  function insertComponent(item: RenrenMaterialModel | undefined) {
    if (!item) return;
    materialContainer._insert(item);
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



  function getMaterialZIndexProp(items: MaterialInterface.IProp[] | null): number {
    let zIndex: number = 0;
    if (!items) return zIndex;
    if (Array.isArray(items) && items.length > 0) {
      zIndex = Number(items?.find(item => item.type === 'z-index')?.value) || 0;
    }
    return zIndex;
  }




  function changeCompZIndex(material: RenrenMaterialModel, zIndex: number, type: 'up' | 'down'): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      try {
        let index: string | number = zIndex;
        if (type === 'up') {
          ++ index >= 99 ? reject('到顶了') : '';
        } else {
          -- index <= 0 ? reject('到底了') : '';
        }
        let items: any = material?.props?.items;
        if (!items) reject('请选择组件');
        index = index.toString();
        if (Array.isArray(items) && items.length > 0) {
          items.find(item => item.type === 'z-index').value = index;
          schemaStore.setCurrentElement(material, 'material');
          materialZIndex.value = index;
          engine.renderer.updateCompCSSAttr(material.id, materialZIndex).catch(err => {
            console.error('更新组件层级失败', err);
            reject('更新组件层级失败');
          });
          resolve('更新组件层级成功');
        }
      } catch (e) {
        let errorMsg = type === 'up' ? '提升组件层级失败' : '降低组件层级失败';
        console.error(errorMsg, e);
        reject(errorMsg);
      }
    });
  }



  function setIndexUp(): Promise<string> {
    return new Promise<string>(async (resolve, reject) => {
      try {
        if (schemaStore.isCurrentElementMaterialType()) {
          const material = schemaStore.getCurrentElement as RenrenMaterialModel;
          let zIndex: number = 0;
          if ($util.renren.isEmpty(material)) {
            let items;
            items = material?.props?.items;
            if (items) {
              zIndex = getMaterialZIndexProp(items);
              await changeCompZIndex(material, zIndex, 'up').then(() => {
                resolve('提升元素层级成功');
              }).catch(() => {
                reject('提升元素层级失败');
              });
            }
          }
        }
      } catch (e) {
        console.error('提升元素层级失败', e);
        reject('提升元素层级失败');
      }
    });
  }




  function setIndexDown(): Promise<string> {
    return new Promise<string>(async (resolve, reject) => {
      try {
        if (schemaStore.isCurrentElementMaterialType()) {
          const material = schemaStore.getCurrentElement as RenrenMaterialModel;
          let zIndex: number = 0;
          if ($util.renren.isEmpty(material)) {
            let items;
            items = material?.props?.items;
            if (items) {
              zIndex = getMaterialZIndexProp(items);
              await changeCompZIndex(material, zIndex, 'down').then(() => {
                resolve('提升元素层级成功');
              }).catch(() => {
                reject('提升元素层级失败');
              });
            }
          }
        }
      } catch (e) {
        console.error('降低元素层级失败', e);
        reject('降低元素层级失败');
      }
    });
  }



  function deleteComp(): void {
    try {
      if (schemaStore.isCurrentElementMaterialType()) {
        const material = schemaStore.getCurrentElement as RenrenMaterialModel;
        schemaStore.setCurrentElement(undefined);
        engine.arrangement.removeComponent(material.id, canvasStore.getCurrentDocName).catch(err => {
          console.error('删除物料失败', err);
        });
        materialContainer._remove(material.id);
        $event.emit('deleteNode');
      }
    } catch (e) {
      console.error('删除物料失败', e);
    }
    isShow.value = false;
  }



  return {
    isShow,
    materialContainer,
    indexedDB,
    engine,
    materialZIndex,
    copyMaterial,
    pasteMaterial,
    insertComponent,
    lockMaterial,
    unLockMaterial,
    setIndexUp,
    setIndexDown,
    deleteComp,
  };
}
