<script setup lang="ts">
import {onMounted, ref, watch} from 'vue';
import ManageHeader from "@/pages/manage/_component/ManageHeader.vue";
import {useRoute} from "vue-router";
import {$api} from "@/componsables/api";
import {setUserLoginInfoToSession} from "@/componsables/request";
import {LocalforageDB} from "@/componsables/database/LocalforageDB";
import {DEFAULT_MATERIAL_STORAGE_INDEX} from "@/componsables/constants/RenrenConstant";
import menuItems from './menu-items.json';
import {$util} from "@/componsables/utils";




const route = useRoute();
/** ========== 菜单初始化-start ==========**/
const menuList: RenrenInterface.KeyValueIndexType<string, string>[] = $util.renren.jsonTypeTransfer<RenrenInterface.KeyValueIndexType<string, string>[]>(menuItems);
const defaultActive = ref<string>(menuList[0].value);

/**
 * @description 确定当前激活的菜单项
 */
function checkCurrentActiveItemHandler(): void {
  defaultActive.value = route.path;
}
/** ========== 菜单初始化-end ==========**/



/** ========== 获取物料信息列表-start ==========**/


/**
 * @description 获取物料信息列表
 */
async function getMaterialSchema<T extends MaterialRespDto.defaultMaterialList>() {
  await $api.material.queryMaterialInfo().then(res => {
    // 存入 indexedDB
    const indexedDB = new LocalforageDB<T>();
    indexedDB.insert(DEFAULT_MATERIAL_STORAGE_INDEX, res.defaultMaterialList as T)
  }).catch(err => {
    console.error(err);
  })
}


// TODO: 获取全部物料信息列表

/** ========== 获取物料信息列表-end ==========**/




onMounted(async () => {
  checkCurrentActiveItemHandler();
  await getMaterialSchema();
});



watch(() => route.path, () => {
  checkCurrentActiveItemHandler();
});



/**
 * @description 测试请求模块的正确性
 */
onMounted(async () => {
  await setUserLoginInfoToSession({
    key: "vqwn-beonij-obevuwivbq",
    token: "ejh.xxxx.xxxx",
    userId: "1",
    username: "adminTest"
  });
});
</script>

<template>
  <el-container class="overflow-hidden">
    <!-- header -->
    <el-header>
      <ManageHeader />
    </el-header>
    <el-container class="bg-manage-bg">
      <!-- aside -->
      <el-aside width="240px">
        <div class="w-full h-full flex flex-col">
          <el-menu
            background-color="#031f2f"
            :default-active="defaultActive"
            text-color="#fff"
            router
            mode="vertical"
            style="width: 100%;height: 100%;"
          >
            <el-menu-item
              v-for="(item, index) in menuList"
              :key="index"
              :route="item.value"
              :index="item.value"
            >
              <el-icon><component :is="item.index" /></el-icon>
              <span>{{ item.key }}</span>
            </el-menu-item>
          </el-menu>
        </div>
      </el-aside>
      <!-- container -->
      <el-main>
        <el-scrollbar height="600">
          <RouterView />
        </el-scrollbar>
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped>
:deep(.el-header) {
  padding: 0;
}

:deep(.el-scrollbar__view) {
  height: 100%;
}

:deep(.el-menu-item) {
  &.is-active {
    background-color: #0256FF;
    color: white;
  }
  &:hover {
    background-color: #0256FF;
    color: white;
  }
}
</style>
