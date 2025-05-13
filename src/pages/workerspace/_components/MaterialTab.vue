<script setup lang="ts">
import {onMounted, ref} from 'vue';
import {ElEmpty} from "element-plus";
import {$message} from "@/componsables/element-plus";
import BaseMaterial from "@/components/material/BaseMaterial.vue";
import {RenrenMaterialModel} from "@/componsables/models/MaterialModel";
import {$util} from "@/componsables/utils";
import {LocalforageDB} from "@/componsables/database/LocalforageDB";
import {DEFAULT_MATERIAL_STORAGE_INDEX} from "@/componsables/constants/RenrenConstant";






const props = withDefaults(defineProps<{
  paneComp?: HTMLElement | any
  index?: string;
}>(), {
  paneComp: ElEmpty,
  index: '1'
});




const defaultPaneIndex = ref<string>(props.index || '1');
const searchValue = ref<string>('');
const tabPaneList = ref<RenrenInterface.keyValueType<string>[]>([
  {
    key: '1',
    value: '基础组件'
  },
  {
    key: '2',
    value: '表单组件'
  },
  {
    key: '3',
    value: '图表组件'
  },
  {
    key: '4',
    value: '导航组件'
  },
  {
    key: '5',
    value: '布局组件'
  }
]);
const emits = defineEmits(['change', 'search']);


/**
 * @description 处理 tab 切换事件
 */
function tabChangeHandler(index: string) {
  emits('change', index);
}


/**
 * @description 处理搜索组件事件
 */
function searchCompHandler() {
  if (searchValue.value) {
    emits('search', searchValue.value);
  } else {
    $message({
      type: 'warning',
      message: '请输入组件名称',
    });
  }
}


/**
 * @description 物料类型和对应的物料列表映射表
 */
const materialList = ref<Record<string, RenrenMaterialModel[]>>({
  '1': [],
  '2': [],
  '3': [],
  '4': [],
  '5': []
});


/**
 * @description 物料实体类模型工厂
 * @param list
 */
function materialModelFactory(list: MaterialRespDto.MaterialInfoRespDto[] | undefined): RenrenMaterialModel[] {
  if (list !== void 0) {
    // 处理物料返回值是 json string 的问题
    return list?.map(item => new RenrenMaterialModel(JSON.parse(item.data)));
  } else {
    return [];
  }
}


/**
 * @description 初始化物料列表 从 store 中取出请求获取的物料信息
 */
function initMaterialList<T extends MaterialRespDto.defaultMaterialList>(): Promise<string> {
  return new Promise<string>(async (resolve) => {
    // 从 indexedDB 中获取默认物料列表
    const indexedDB = new LocalforageDB<T>();
    const defaultMaterialList: T | undefined = await indexedDB.query(DEFAULT_MATERIAL_STORAGE_INDEX) as T;
    if (defaultMaterialList !== void 0) {
      if (!$util.renren.isEmpty(defaultMaterialList)) {
        materialList.value = {
          '1': materialModelFactory((defaultMaterialList as T).baseMaterialList),
          '2': materialModelFactory((defaultMaterialList as T).formMaterialList),
          '3': materialModelFactory((defaultMaterialList as T).chartMaterialList),
          '4': materialModelFactory((defaultMaterialList as T).navigatorMaterialList),
          '5': materialModelFactory((defaultMaterialList as T).layoutMaterialList),
        };
        resolve('初始化成功');
      }
    }
  });
}



onMounted(() => {
  initMaterialList().catch(err => {
    console.log(err as string);
  });
});
</script>

<template>
  <el-scrollbar height="400">
    <div class="w-full h-full flex flex-col">
      <!-- title -->
      <p class="text-[1.2rem] text-black font-bold">组件库</p>
      <!-- search -->
      <el-input
        v-model="searchValue"
        clearable
        placeholder="请输入组件名称"
        prefix-icon="Search"
        class="w-full my-4"
        size="small"
        @keydown.enter="searchCompHandler"
      />
      <!-- material components -->
      <el-tabs
        v-model="defaultPaneIndex"
        @tabChange="tabChangeHandler"
        class="w-full h-full select-none"
      >
        <!-- tab-pane -->
        <el-tab-pane
          v-for="(item, index) in tabPaneList"
          :key="index"
          :label="item.value"
          :name="item.key"
        >
          <!-- component -->
          <BaseMaterial
            v-model:material-data="materialList[item.key]"
            :index="item.key"
          />
        </el-tab-pane>
      </el-tabs>
    </div>
  </el-scrollbar>
</template>

<style scoped>
:deep(.el-scrollbar__view) {
  height: 100%;
  width: 100%;
}
</style>
