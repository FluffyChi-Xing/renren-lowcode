<template>
  <ManageLayout>
    <template #default>
      <div class="w-full h-full flex flex-col pt-4">
        <div class="w-full h-auto flex items-center justify-between">
          <el-button @click="() => createFlag = true" type="primary" plain>创建项目</el-button>
          <div class="items-center flex">
            <el-button @click="refreshData" size="small" plain circle type="info" icon="Refresh" />
            <el-button size="small" plain circle type="warning" icon="Operation" />
          </div>
        </div>
        <el-table
          v-loading="isLoading"
          :data="data"
          stripe
          border
          fit
          :header-cell-style="tableHeaderConfig"
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
                  <el-table-column
                    label="操作"
                    :fixed="'right'"
                  >
                    <template #default="{ row }">
                      <div class="w-full h-auto flex items-center justify-center">
                        <el-button @click="previewDocument(row?.fileName)" type="primary" size="small" plain>预览</el-button>
                      </div>
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
              </div>
            </template>
          </el-table-column>
          <template #empty>
            <el-empty description="暂无项目" />
          </template>
        </el-table>
      </div>
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

<script setup lang="ts">
import {onMounted, reactive, ref} from 'vue';
import ManageLayout from "@/pages/manage/_component/ManageLayout.vue";
import BaseDialog from "@/components/BaseDialog.vue";
import type {ProjectRespDto} from "@/componsables/interface/dto/resp/ProjectRespDto";
import projectTemplate from './project-template.json';
import tableColumn from './table-column.json';
import pageSizeOptions from '@/components/pagination-size-options.json';
import {$util} from "@/componsables/utils";
import {$api} from "@/componsables/api";
import {$message} from "@/componsables/element-plus";
import tableHeaderConfig from '@/components/table-header-config.json';
import {container} from "@/renren-engine/__init__";
import type {IEngine} from "@/renren-engine";
import {myCanvasStore} from "@/stores/canvas";
import {useRouter} from "vue-router";



const router = useRouter();
const engine = container.resolve<IEngine>('engine');
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
const pageNum = ref<number>(1);
const pageSize = ref<number>(10);
const sizeOptions: number[] = $util.renren.jsonTypeTransfer<number[]>(pageSizeOptions);
const total = ref<number>(0);
const isLoading = ref<boolean>(false);
/** ========== 表格初始化-start ==========**/
const data = ref<ProjectRespDto.ProjectQueryRespDto[]>([
  projectTemplate as unknown as ProjectRespDto.ProjectQueryRespDto
]);
const tableColumnList = $util.renren.jsonTypeTransfer<RenrenInterface.keyValueType<string>[]>(tableColumn);


async function initData() {
  // 初始化数据的时候只保留第一个测试数据
  data.value = data.value.slice(0, 1);
  await $api.project.queryProjectPage(pageNum.value, pageSize.value)
    .then(res => {
      res.records.forEach(item => {
        data.value.push(item);
      });
      total.value = res.total;
    })
    .catch(_ => {
      $message({
        type: 'warning',
        message: '分页获取信息失败'
      });
    });
}



async function refreshData() {
  isLoading.value = true;
  await initData();
  isLoading.value = false;
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

// TODO: 实现页面预览逻辑
function previewDocument(index?: string): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    try {
      if (index === void 0) resolve('请选择要预览的页面');
      // 调用 engine initDocument api,如果本地已经存在对应的缓存，则直接跳转编辑器预览，
      // TODO: 否则调用后端获取对应的页面数据进行本地缓存
      // 否则如果是新建的页面，则调用 engine initDocument api
      engine.arrangement.initDocument(index).catch(err => {
        $message({
          type: 'warning',
          message: err as string
        });
      });
      myCanvasStore.currentDocName = index || '';
      router.push('/workerSpace');
      resolve('success');
    } catch (e) {
      console.error('预览页面失败', e);
      reject('预览页面失败');
    }
  });
}







onMounted(async () =>{
  isLoading.value = true;
  await initData();
  isLoading.value = false;
});
</script>
