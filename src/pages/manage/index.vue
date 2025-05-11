<script setup lang="ts">
import {onMounted, ref, watch} from 'vue';
import ManageHeader from "@/pages/manage/_component/ManageHeader.vue";
import type {RenrenInterface} from "@/componsables/interface/RenrenInterface";
import {useRoute} from "vue-router";
import {$api} from "@/componsables/api";
import type {MaterialRespDto} from "@/componsables/interface/dto/resp/MaterialRespDto";
import {setUserLoginInfoToSession} from "@/componsables/request";
import {LocalforageDB} from "@/componsables/database/LocalforageDB";
import {DEFAULT_MATERIAL_STORAGE_INDEX} from "@/componsables/constants/RenrenConstant";




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
  },
  {
    key: '回收站',
    value: '/manage/recycle',
    index: 'Delete'
  },
  {
    key: '操作日志',
    value: '/manage/operation',
    index: 'Document'
  },
  {
    key: '登录日志',
    value: '/manage/login',
    index: 'Compass'
  },
  {
    key: '异常日志',
    value: '/manage/error',
    index: 'CloseBold'
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
        case '/manage/recycle':
          defaultActive.value = '回收站';
          resolve('回收站');
          break;
        case '/manage/operation':
          defaultActive.value = '操作日志'
          break;
        case '/manage/login':
          defaultActive.value = '登录日志';
          resolve('登录日志');
          break;
        case '/manage/error':
          defaultActive.value = '异常日志';
          resolve('异常日志');
          break;
        default:
          defaultActive.value = '仪表盘';
          resolve('仪表盘');
          break;
      }
    } catch (e) {
      console.error('菜单高亮定位失败', e);
      reject('菜单高亮定位失败');
    }
  });
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
  await checkCurrentActiveItemHandler().catch(err => {
    console.error(err);
  });
  await getMaterialSchema();
});



watch(() => route.path, () => {
  checkCurrentActiveItemHandler().catch(err => {
    console.error(err);
  });
});



/**
 * @description 测试请求模块的正确性
 */
onMounted(() => {
  setUserLoginInfoToSession({
    key: "vqwn-beonij-obevuwivbq",
    token: "ejh.xxxx.xxxx",
    userId: "1",
    username: "adminTest"
  })
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
