<script setup lang="ts">
import {onMounted, reactive, ref, shallowRef, toRaw} from 'vue';
import ManageLayout from "@/pages/manage/_component/ManageLayout.vue";
import {$enum} from "@/componsables/enum";
import {$api} from "@/componsables/api";
import {$message} from "@/componsables/element-plus";
import HighLightLang from "@/components/HighLightLang.vue";
import type {MaterialInterface} from "@/componsables/interface/MaterialInterface";
import BaseDialog from "@/components/BaseDialog.vue";
import {MATERIAL_TYPE_OPTIONS} from "@/componsables/constants/ManagementConstant";
import materialTemplateSchema from './material-template-schema.json';
import type {createMaterialReqDto} from "@/componsables/apis/material/_apis/MaterialInfoApis";
import tableHeaderConfig from '@/components/table-header-config.json';





// 编辑物料弹窗标识
const editFlag = ref<boolean>(false);
// 新建物料弹窗标识
const createFlag = ref<boolean>(false);
const currentRow = ref<MaterialRespDto.MaterialInfoRespDto>();
const materialInfo = reactive<MaterialReqDto.UpdateMaterialReqDto>({
  data: initDefaultMaterialCode(),
  id: 0,
  name: "",
  status: '0', // 需要改为 enum
  type: '0' // 需要改为 enum
});
const MONACO_EDITOR_OPTIONS = {
  automaticLayout: true,
  formatOnType: true,
  formatOnPaste: true
};
const editor = shallowRef();
function mountHandler(val: any[]) {
  editor.value = val;
}


/**
 * @description 初始化默认物料代码
 */
function initDefaultMaterialCode(): string {
  return JSON.stringify(materialTemplateSchema, null, 2);
}
/** ========== 初始化表格-start ==========**/
const tableData = ref<MaterialRespDto.MaterialInfoRespDto[]>([]);
const isLoading = ref<boolean>(false);


/**
 * @description 查询所有物料信息列表
 */
async function queryMaterialList<T extends MaterialRespDto.MaterialInfoRespDto>() {
  tableData.value = [];
  await $api.material.queryAllMaterial()
    .then(res => {
      tableData.value = res as T[];
    })
    .catch(() => {
      $message({
        type: "warning",
        message: '获取物料信息失败'
      });
    });
}


/**
 * @description 高亮代码转换器
 * @param item
 */
function highLightCodeGenerator(item: MaterialInterface.IMaterial): string {
  return JSON.stringify(toRaw(item), null, 2);
}
/** ======= 初始化表格-end ==========**/



/** ========== 编辑物料弹窗-start ==========**/


/**
 * @description 编辑物料弹窗 handler
 * @param row
 */
function editMaterialHandler(row: MaterialRespDto.MaterialInfoRespDto) {
  // 默认物料禁止编辑
  if (row.isDefault === $enum.MaterialDefaultEnum.NOT_DEFAULT) {
    currentRow.value = row;
    editFlag.value = true;
  }
}


/**
 * @description 表单数据刷新
 */
async function refreshTableData() {
  tableData.value = [];
  isLoading.value = true;
  await queryMaterialList();
  isLoading.value = false;
}

/** ========= 编辑物料弹窗-end ==========**/


/** ========== 新建物料抽屉-start ==========**/




function resetMaterialInfo() {
  materialInfo.data = initDefaultMaterialCode();
  materialInfo.name = "";
  materialInfo.type = "";
}



/**
 * @description 取消新家物料
 */
function cancelCreateMaterial() {
  createFlag.value = false;
  resetMaterialInfo();
}


/**
 * @description 创建物料 handler
 */
async function createMaterialHandler() {
  if (materialInfo.name && materialInfo.type) {
    const { data, name, type } = materialInfo;
    const params: createMaterialReqDto = {
      name: name,
      type: type,
      data: JSON.stringify(data.toString())
    };
    // TODO: 需要创建 data 类型检查函数 api
    await $api.material.createSelfMaterial(params)
      .catch(_ => {
        $message({
          type: 'warning',
          message: `创建 [${materialInfo.name}] 失败`
        });
      });
    createFlag.value = false;
    // reload data
    isLoading.value = true;
    await queryMaterialList();
    isLoading.value = false;
  } else {
    $message({
      type: 'warning',
      message: '物料名或类型异常'
    });
  }
}


/**
 * @description 删除物料 handler
 * @param id
 * @param index
 * @param name
 */
async function deleteSelfMaterialHandler(id: number, index: number, name: string = '未知物料名') {
  if (index === $enum.MaterialDefaultEnum.DEFAULT) {
    $message({
      type: 'warning',
      message: '默认物料不可删除'
    });
    throw new Error('默认物料不可删除');
  }
  await $api.material.deleteMaterialInfo(id)
    .then(async () => {
      isLoading.value = true;
      await queryMaterialList();
      isLoading.value = false;
    })
    .catch(_ => {
      $message({
        type: 'warning',
        message: `删除 [${name}] 失败`
      });
    });
}
/** ========== 新建物料抽屉-end ==========**/

onMounted(async () => {
  isLoading.value = true;
  await queryMaterialList();
  isLoading.value = false;
});
</script>

<template>
  <ManageLayout header="物料管理" :footer="false">
    <template #default>
      <div class="w-full h-full flex flex-col pt-4">
        <div class="w-full h-auto flex items-center justify-between">
          <el-button @click="() => createFlag = true" type="primary" plain>新建自定义物料</el-button>
          <el-button @click="refreshTableData" icon="Refresh" type="info" size="small" plain circle />
        </div>
        <el-table
          v-loading="isLoading"
          :data="tableData"
          stripe
          border
          fit
          :header-cell-style="tableHeaderConfig"
          class="h-full mt-10"
          style="width: 100%;"
        >
          <el-table-column
            type="expand"
            label="物料源码"
            width="200"
          >
            <template #default="{ row }">
              <div class="w-full h-auto flex p-4">
                <HighLightLang
                  :code="highLightCodeGenerator(JSON.parse(row.data))"
                  lang="json"
                />
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="id"
            prop="id"
          />
          <el-table-column
            label="物料名换"
            prop="name"
          />
          <el-table-column
            label="物料类型"
            prop="type"
          >
            <template #default="{ row }">
              {{ $enum.MaterialTypeEnum[row.type] }}
            </template>
          </el-table-column>
          <el-table-column
            label="用户id"
            prop="userId"
          >
            <template #default="{ row }">
              {{ row.userId === 0 ? '默认' : row.userId }}
            </template>
          </el-table-column>
          <el-table-column
            label="物料状态"
            prop="status"
            width="150"
          >
            <template #default="{ row }">
              <el-switch
                v-model="row.status"
                :active-value="0"
                active-text="启用"
                inactive-text="禁用"
                :inactive-value="1"
                :disabled="row.isDefault === $enum.MaterialDefaultEnum.DEFAULT"
              />
            </template>
          </el-table-column>
          <el-table-column
            label="是否删除"
            prop="isDelete"
          >
            <template #default="{ row }">
              <el-switch
                v-model="row.isDelete"
                :active-value="0"
                active-text="否"
                inactive-text="是"
                :inactive-value="1"
                :disabled="row.isDefault === $enum.MaterialDefaultEnum.DEFAULT"
                @change="deleteSelfMaterialHandler(row.id, row.isDefault, row.name)"
              />
            </template>
          </el-table-column>
          <el-table-column
            :fixed="'right'"
            width="200"
            label="操作"
          >
            <template #default="{ row }">
              <div class="w-full h-auto flex items-center justify-center">
                <el-button
                  @click="editMaterialHandler(row)"
                  type="primary"
                  size="small"
                  plain
                  :disabled="row.isDefault === $enum.MaterialDefaultEnum.DEFAULT"
                >
                  编辑
                </el-button>
              </div>
            </template>
          </el-table-column>
          <template #empty>
            <el-empty
              description="暂无物料信息"
            />
          </template>
        </el-table>
      </div>
    </template>
  </ManageLayout>
  <!-- 编辑物料弹窗 -->
  <BaseDialog
    v-model:show="editFlag"
    :title="`编辑物料 (${currentRow?.name})`"
    width="500"
    :footer="true"
    :close-on-click-modal="false"
    :show-close="false"
  >
    <template #default>
      <!-- TODO 更新物料表单 -->
    </template>
    <template #footer>
      <div class="w-full h-full flex items-center justify-end">
        <el-button type="primary">确认</el-button>
        <el-button @click="() => editFlag = false" type="info">取消</el-button>
      </div>
    </template>
  </BaseDialog>
  <!-- 新建物料抽屉 -->
  <el-drawer
    v-model="createFlag"
    direction="rtl"
    size="350"
    :close-on-click-modal="false"
    :show-close="false"
  >
    <template #header>
      <div class="w-full h-auto items-center grid grid-cols-2 gap-4">
        <div class="w-full h-full flex">
          <span class="font-bold text-black">新建物料(自定义)</span>
        </div>
        <div class="w-full h-full flex justify-end">
          <el-button @click="cancelCreateMaterial" type="text" icon="Close">关闭</el-button>
        </div>
      </div>
    </template>
    <template #default>
      <div class="w-full h-full flex flex-col">
        <el-form>
          <el-form-item label="物料名称" required>
            <el-input
              v-model="materialInfo.name"
              clearable
              placeholder="请输入物料名"
              style="width: 240px;"
            />
          </el-form-item>
          <el-form-item label="物料类型" required>
            <el-select
              v-model="materialInfo.status"
              style="width: 240px;"
              clearable
              placeholder="请选择物料类型"
            >
              <el-option
                v-for="(item, index) in MATERIAL_TYPE_OPTIONS"
                :key="index"
                :label="item.key"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="物料源码(json)" required />
          <div class="w-full h-auto">
            <el-scrollbar height="500">
              <vue-monaco-editor
                v-model:value="materialInfo.data"
                :default-value="initDefaultMaterialCode"
                theme="vs"
                language="JavaScript"
                @mount="mountHandler"
                :options="MONACO_EDITOR_OPTIONS"
                style="width: 100%;height: 100%;"
              />
            </el-scrollbar>
          </div>
          <div class="w-full h-auto flex items-center mt-4 justify-end">
            <el-button @click="createMaterialHandler" type="primary">确认</el-button>
          </div>
        </el-form>
      </div>
    </template>
  </el-drawer>
</template>

<style scoped>
:deep(.el-scrollbar__view) {
  width: 100%;
  height: 100%;
}
</style>
