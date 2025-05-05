<script setup lang="ts">
import {onMounted, reactive, ref} from 'vue';
import ManageLayout from "@/pages/manage/_component/ManageLayout.vue";
import type {RenrenInterface} from "@/componsables/interface/RenrenInterface";
import {$const} from "@/componsables/const";
import type {MaterialInterface} from "@/componsables/interface/MaterialInterface";
import type {ProjectRespDto} from "@/componsables/interface/dto/resp/ProjectRespDto";
import BaseDialog from "@/components/BaseDialog.vue";
import type {ProjectReqDto} from "@/componsables/interface/dto/req/ProjectReqDto";




// 项目编辑弹窗标识
const editFlag = ref<boolean>(false);
// 项目删除弹窗标识
const deleteFlag = ref<boolean>(false);
// 新建项目标识
const createFlag = ref<boolean>(false);
// 当前行数据
const currentRow = ref<ProjectRespDto.ProjectQueryRespDto>();
const projectInfo = reactive<ProjectReqDto.UpdateProjectReqDto>({
  data: "",
  id: 0,
  name: "",
  path: "",
  simulatorHost: ""
});
/** ========== 表格初始化-start ==========**/
const data = ref<ProjectRespDto.ProjectQueryRespDto[]>([]);
const tableColumnList = ref<RenrenInterface.keyValueType<string>[]>([
  {
    key: 'id',
    value: 'id'
  },
  {
    key: '项目名称',
    value: 'name'
  },
  {
    key: '项目路径',
    value: 'path'
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
          documents: project.documents as MaterialInterface.IDocument[],
          id: project.projectId,
          name: project.projectName,
          path: project.projectPath,
          simulatorHost: project.simulatorHost,
          createTime: "",
          data: null,
          isDelete: 0,
          updateTime: ""
        });
      }
    });
  }
}
/** =========== 表格初始化-end ==========**/



/** ========== 编辑项目-start ==========**/


/**
 * @description 初始化 projectInfo
 */
function initProjectInfoData() {
  if (currentRow.value) {
    projectInfo.id = Number(currentRow.value.id);
    projectInfo.name = currentRow.value.name;
    projectInfo.data = JSON.stringify(currentRow.value.data);
    projectInfo.path = currentRow.value.path;
    projectInfo.simulatorHost = currentRow.value.simulatorHost;
  }
}


/**
 * @description 重置 projectInfo
 */
function resetProjectInfoData() {
  projectInfo.id = -1;
  projectInfo.name = '';
  projectInfo.path = '';
  projectInfo.simulatorHost = '';
  projectInfo.data = '';
}


/**
 * @description 编辑项目 handler
 * @param row
 */
function editProjectHandler<T extends ProjectRespDto.ProjectQueryRespDto>(row: T) {
  currentRow.value = row as T;
  editFlag.value = true;
  initProjectInfoData();
}


/**
 * @description 取消编辑项目 handler
 */
function cancelEditHandler() {
  editFlag.value = false;
  resetProjectInfoData();
}

/** ========== 编辑项目-end ==========**/




/** ========== 删除项目-start ==========**/


/**
 * @description 删除项目 handler
 * @param row
 */
function deleteProjectHandler<T extends ProjectRespDto.ProjectQueryRespDto>(row: T) {
  currentRow.value = row as T;
  deleteFlag.value = true;
}


/**
 * @description 取消删除项目 handler
 */
function cancelDeleteHandler() {
  deleteFlag.value = false;
}
/** ========== 删除项目-end ========**/



/** ========== 新建项目-start ==========**/


/**
 * @description 取消新建项目 handler
 */
function cancelCreateHandler() {
  createFlag.value = false;
  resetProjectInfoData();
}


/** ========== 新疆项目-end ==========**/

onMounted(() => {
  initTableAtStandAlone();
});
</script>

<template>
  <ManageLayout>
    <template #header>
      <el-button @click="() => createFlag = true" type="primary" size="small">创建项目</el-button>
    </template>
    <template #default>
      <el-table
        :data="data"
        stripe
        border
        fit
        :header-cell-style="{ backgroundColor: '#33FF33', alignItems: 'center', color: '#000' }"
        class="h-full mt-10"
        style="width: 100%;"
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
              <el-button @click="editProjectHandler(row)" type="primary" size="small" plain>编辑</el-button>
              <el-button @click="deleteProjectHandler(row)" type="danger" size="small" plain>删除</el-button>
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
  <!-- 编辑项目弹窗 -->
  <BaseDialog
    v-model:show="editFlag"
    title="编辑项目"
    :footer="true"
    width="500"
    :show-close="false"
    :close-on-click-modal="false"
  >
    <template #default>
      <el-form
        class="w-full"
        label-width="auto"
      >
        <el-form-item
          label="项目id"
          required
        >
          <el-input
            v-model="projectInfo.id"
            disabled
            style="width: 240px;"
          />
        </el-form-item>
        <el-form-item
          label="项目名称"
          required
        >
          <el-input
            v-model="projectInfo.name"
            clearable
            placeholder="请输入项目名称"
            style="width: 240px;"
          />
        </el-form-item>
        <el-form-item
          label="项目路径"
        >
          <el-input
            v-model="projectInfo.path"
            clearable
            placeholder="请输入项目路径"
            style="width: 240px;"
          />
        </el-form-item>
        <el-form-item
          label="模拟器路径"
        >
          <el-input
            v-model="projectInfo.simulatorHost"
            clearable
            placeholder="请输入模拟器路径"
            style="width: 240px;"
          />
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <div class="w-full h-auto flex items-center justify-end">
        <el-button type="primary">确认</el-button>
        <el-button @click="cancelEditHandler" type="info">取消</el-button>
      </div>
    </template>
  </BaseDialog>
  <!-- 删除项目弹窗 -->
  <BaseDialog
    v-model:show="deleteFlag"
    title="删除项目"
    width="500"
    :footer="true"
    :show-close="false"
    :close-on-click-modal="false"
  >
    <template #default>
      <div class="w-full h-auto flex items-center font-bold">
        你确定要删除项目: <span class="mx-2 text-red-500">{{ currentRow?.name }}</span> 吗?
      </div>
    </template>
    <template #footer>
      <div class="w-full h-auto flex items-center justify-end">
        <el-button type="primary">确认</el-button>
        <el-button @click="cancelDeleteHandler" type="info">取消</el-button>
      </div>
    </template>
  </BaseDialog>
  <!-- 新建项目弹窗 -->
  <BaseDialog
    v-model:show="createFlag"
    title="创建新项目"
    width="500"
    :show-close="false"
    :footer="true"
    :close-on-click-modal="false"
  >
    <template #default>
      <el-form
        class="w-full"
        label-width="auto"
      >
        <el-form-item
          label="项目名称"
          required
        >
          <el-input
            v-model="projectInfo.name"
            clearable
            placeholder="请输入项目名称"
            style="width: 240px;"
          />
        </el-form-item>
        <el-form-item
          label="项目路径"
        >
          <el-input
            v-model="projectInfo.path"
            clearable
            placeholder="请输入项目路径"
            style="width: 240px;"
          />
        </el-form-item>
        <el-form-item
          label="模拟器路径"
        >
          <el-input
            v-model="projectInfo.simulatorHost"
            clearable
            placeholder="请输入模拟器路径"
            style="width: 240px;"
          />
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <div class="w-full h-auto flex items-center justify-end">
        <el-button type="primary">确认</el-button>
        <el-button @click="cancelCreateHandler" type="info">取消</el-button>
      </div>
    </template>
  </BaseDialog>
</template>

<style scoped>

</style>
