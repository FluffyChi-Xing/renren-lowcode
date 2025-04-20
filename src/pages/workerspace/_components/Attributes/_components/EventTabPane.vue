<script setup lang="ts">
import { ref, shallowRef } from "vue";
import {eventTypeList} from "@/componsables/utils/EventAttrUtil";



const MONACO_EDITOR_OPTIONS = {
  automaticLayout: true,
  formatOnType: true,
  formatOnPaste: true
};
const codes = ref<Record<string, string>>({});
const editor = shallowRef();
const mountHandler = editorInstance => (editor.value = editorInstance);
const defaultCode: string = 'callback = () => {\n' +
  '  // some-code\n' +
  '}';


function formatCode() {
  editor.value?.getAction('editor.action.formatDocument').run();
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
                  <vue-monaco-editor
                    v-model:value="codes[itm.name]"
                    theme="vs-dark"
                    :options="MONACO_EDITOR_OPTIONS"
                    :default-value="defaultCode"
                    @mount="mountHandler"
                    language="JavaScript1.5"
                    style="height: 100px;"
                  />
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
