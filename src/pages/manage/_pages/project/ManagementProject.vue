<script setup lang="ts">
import {onMounted, ref} from 'vue';
import ManageLayout from "@/pages/manage/_component/ManageLayout.vue";
import type {RenrenInterface} from "@/componsables/interface/RenrenInterface";
import {$const} from "@/componsables/const";
import type {MaterialInterface} from "@/componsables/interface/MaterialInterface";



/** ========== 表格初始化-start ==========**/
interface dataType {
  projectId: string;
  projectName: string;
  projectPath: string;
  simulatorHost: string;
  documents: MaterialInterface.IDocument[] | undefined;
}


const data = ref<dataType[]>([]);
const tableColumnList = ref<RenrenInterface.keyValueType<string>[]>([
  {
    key: 'id',
    value: 'projectId'
  },
  {
    key: '项目名称',
    value: 'projectName'
  },
  {
    key: '项目路径',
    value: 'projectPath'
  },
  {
    key: '模拟器路径',
    value: 'simulatorHost'
  },
]);


/**
 * @description 获取本地存储的全部项目key
 * @warn 本函数只用于在 stand-alone 状态下初始化列表
 */
function getProjectKeys(): Promise<string[]> {
  return new Promise<string[]>((resolve) => {
    let result: string[];
    result = Object.keys(localStorage).filter(item => item.startsWith($const.ren.SCHEMA_PROJECT_STORAGE_ID));
    resolve(result);
  });
}


/**
 * @description 在离线情况下初始化表格数据
 */
async function initTableAtStandAlone() {
  const projectKeys: string[] = await getProjectKeys();
  if (projectKeys && projectKeys.length > 0) {
    projectKeys.forEach(item => {
      let project: MaterialInterface.IProject = JSON.parse(localStorage.getItem(item) || '{}');
      let isEmpty: boolean = Object.keys(project).length === 0 && project.constructor !== Object;
      if (!isEmpty) {
        data.value.push({
          documents: project.documents,
          projectId: project.projectId,
          projectName: project.projectName,
          projectPath: project.projectPath,
          simulatorHost: project.simulatorHost
        });
      }
    });
  }
}
/** =========== 表格初始化-end ==========**/



onMounted(() => {
  initTableAtStandAlone();
});
</script>

<template>
  <ManageLayout>
    <template #header>
      <el-button type="primary" size="small">创建项目</el-button>
    </template>
    <template #default>
      <el-table
        :data="data"
        stripe
        border
        fit
        :header-cell-style="{ backgroundColor: '#33FF33', alignItems: 'center', color: '#000' }"
        class="w-full h-full mt-10"
      >
        <el-table-column
          type="expand"
          label="项目页面节点"
          width="200"
        >
          <template #default="{ row }">
            <div class="w-full h-auto flex flex-col p-4">
              <el-table
                :data="row.documents"
                stripe
                border
                fit
                :header-cell-style="{ backgroundColor: '#959595', alignItems: 'center', color: '#000' }"
              >
                <el-table-column
                  label="节点名称"
                  prop="fileName"
                />
                <el-table-column
                  label="节点是否为空"
                >
                  <template #default="{ row }">
                    <el-switch
                      v-model="row.blank"
                      disabled
                      size="small"
                    />
                  </template>
                </el-table-column>
                <el-table-column
                  label="节点是否启用"
                >
                  <template #default="{ row }">
                    <el-switch
                      v-model="row.activated"
                      disabled
                      size="small"
                    />
                  </template>
                </el-table-column>
                <el-table-column
                  label="页面是否打开(默认页面)"
                >
                  <template #default="{ row }">
                    <el-switch
                      v-model="row.opened"
                      disabled
                      size="small"
                    />
                  </template>
                </el-table-column>
                <el-table-column
                  label="节点是否为根节点"
                >
                  <template #default="{ row }">
                    <el-switch
                      v-model="row.rootNode"
                      disabled
                      size="small"
                    />
                  </template>
                </el-table-column>
                <template #empty>
                  <el-empty description="暂无页面节点详情" />
                </template>
              </el-table>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          v-for="(item, index) in tableColumnList"
          :column-key="index"
          :label="item.key"
          :prop="item.value"
          :show-overflow-tooltip="item.key === 'id'"
          width="200"
        />
        <el-table-column
          label="操作"
          :fixed="'right'"
          width="200"
        >
          <template #default="{ row }">
            <div class="w-full h-auto flex items-center justify-center">
              <el-button type="primary" size="small" plain>编辑</el-button>
              <el-button type="danger" size="small" plain>删除</el-button>
              <el-button type="info" size="small" plain>开始</el-button>
            </div>
          </template>
        </el-table-column>
        <template #empty>
          <el-empty description="暂无项目" />
        </template>
      </el-table>
    </template>
  </ManageLayout>
</template>

<style scoped>

</style>
