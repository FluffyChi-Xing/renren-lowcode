<script setup lang="ts">
import { ref, shallowRef } from "vue";
import {eventNameValueMap, eventTypeList} from "@/componsables/utils/EventAttrUtil";
import $event from "@/componsables/utils/EventBusUtil";
import {useSchemaStore} from "@/stores/schema";
import type {RenrenMaterialModel} from "@/componsables/models/MaterialModel";
import {$engine} from "@/renren-engine/engine";
import type {RenrenInterface} from "@/componsables/interface/RenrenInterface";
import {$message} from "@/componsables/element-plus";
import {generateUUID} from "@/componsables/utils/GenerateIDUtil";



const MONACO_EDITOR_OPTIONS = {
  automaticLayout: true,
  formatOnType: true,
  formatOnPaste: true
};
const codes = ref<Record<string, string>>({});
const editor = shallowRef();
const schemaStore = useSchemaStore();
function mountHandler(val: any[]) {
  editor.value = val;
}
const defaultCode: string = 'callback = () => {\n' +
  '  // some-code\n' +
  '}';


// function formatCode() {
//   editor.value?.getAction('editor.action.formatDocument').run();
// }


/**
 * @description 保存物料事件到 schemaStore 中
 * @param event
 */
function insertEvent2Store(event: RenrenInterface.IEvent): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    try {
      if (schemaStore.currentElement !== void 0 && schemaStore.currentElement?.type === 'material') {
        const material = schemaStore.currentElement as RenrenMaterialModel;
        if (material && material.events) {
          if (material.events.filter(item => item.name === event.name).length === 0) {
            material.events.push(event);
            schemaStore.currentElement = material;
            resolve('保存事件成功');
          }
        }
      }
    } catch (e) {
      console.error('绑定事件到 schemaStore 失败', e);
      reject('绑定事件到 schemaStore 失败');
    }
  });
}


/**
 * @description 处理事件绑定
 * @param item
 */
function eventBindingHandler(item: RenrenInterface.IEvent) {
  if (schemaStore.currentElement !== void 0 && schemaStore.currentElement?.type === 'material') {
    const material = schemaStore.currentElement as RenrenMaterialModel;
    // 获取需要绑定的事件
    const code: string = codes.value[item.name] as string;
    if (code) {
      // 组装 RenrenInterface.IEvent
      const uuid: string = generateUUID();
      const callback = new Function(`return ${code}`)();
      const event: RenrenInterface.IEvent = {
        callback: callback,
        description: '',
        id: uuid,
        name: eventNameValueMap.get(item.type) as string,
        type: item.type,
      };
      // 保存到 schema
      // 保存到 store
      Promise.all([
        $engine.renderer.insertEvent2Material(material.id, event),
        insertEvent2Store(event),
      ]).then(() => {
        // 发布时间绑定处理事件
        $event.emit('bindEvent');
        // 清空事件绑定
        codes.value = {};
      }).catch(() => {
        $message({
          type: 'warning',
          message: '保存事件失败'
        });
      });
    }
  }
}
</script>

<template>
  <div class="w-full h-full flex flex-col">
    <el-tabs>
      <el-tab-pane
        v-for="(item, index) in eventTypeList"
        :key="index"
        :label="item.key"
      >
        <el-collapse accordion>
          <el-collapse-item
            v-for="(itm, idx) in item.value"
            :key="idx"
            :title="itm.name"
          >
            <template #default>
              <div class="w-full h-auto flex flex-col">
                <el-form-item label="回调函数">
                  <div class="w-full h-auto flex flex-col">
                    <vue-monaco-editor
                      v-model:value="codes[itm.name]"
                      theme="vs-dark"
                      :options="MONACO_EDITOR_OPTIONS"
                      :default-value="defaultCode"
                      @mount="mountHandler"
                      language="JavaScript"
                      style="height: 100px;"
                    />
                    <div class="w-full mt-4 h-auto flex items-center justify-end">
                      <el-button @click="eventBindingHandler(itm)" type="primary" size="small">确认</el-button>
                    </div>
                  </div>
                </el-form-item>
              </div>
            </template>
          </el-collapse-item>
        </el-collapse>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style scoped>

</style>
