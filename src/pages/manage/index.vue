<script setup lang="ts">
import {onMounted, ref, watch} from 'vue';
import ManageHeader from "@/pages/manage/_component/ManageHeader.vue";
import type {RenrenInterface} from "@/componsables/interface/RenrenInterface";
import {useRoute} from "vue-router";




const route = useRoute();
/** ========== 菜单初始化-start ==========**/
const defaultActive = ref<string>('仪表盘');
const menuList = ref<RenrenInterface.KeyValueIndexType<string, string>[]>([
  {
    key: '仪表盘',
    value: '/manage',
    index: 'Odometer'
  },
  {
    key: '项目管理',
    value: '/manage/project',
    index: 'Box'
  },
  {
    key: '物料管理',
    value: '/manage/material',
    index: 'Document'
  },
  {
    key: '用户中心',
    value: '/manage/userInfo',
    index: 'User'
  }
]);


/**
 * @description 确定当前激活的菜单项
 */
function checkCurrentActiveItemHandler(): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    try {
      switch (route.fullPath) {
        case '/manage':
          defaultActive.value = '仪表盘';
          resolve('仪表盘');
          break;
        case '/manage/project':
          defaultActive.value = '项目管理';
          resolve('项目管理');
          break;
        case '/manage/material':
          defaultActive.value = '物料管理';
          resolve('物料管理');
          break;
        case '/manage/userInfo':
          defaultActive.value = '用户中心';
          resolve('用户中心');
          break;
      }
    } catch (e) {
      console.error('菜单高亮定位失败', e);
      reject('菜单高亮定位失败');
    }
  });
}



onMounted(() => {
  checkCurrentActiveItemHandler().catch(err => {
    console.error(err);
  });
});



watch(() => route.path, () => {
  checkCurrentActiveItemHandler().catch(err => {
    console.error(err);
  });
});
/** ========== 菜单初始化-end ==========**/
</script>

<template>
  <el-container>
    <!-- header -->
    <el-header>
      <ManageHeader />
    </el-header>
    <el-container class="bg-main-background">
      <!-- aside -->
      <el-aside width="240px">
        <div class="w-full h-full flex flex-col">
          <el-menu
            active-text-color="#ffd04b"
            background-color="#545c64"
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
              :index="item.key"
            >
              <el-icon><component :is="item.index" /></el-icon>
              <span>{{ item.key }}</span>
            </el-menu-item>
          </el-menu>
        </div>
      </el-aside>
      <!-- container -->
      <el-main>
        <el-scrollbar height="625">
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
</style>
