<script setup lang="ts">
import HomeHeader from "@/pages/home/_components/HomeHeader.vue";
import HomeDescription from "@/pages/home/_components/HomeDescription.vue";
import HomeLogo from "@/pages/home/_components/HomeLogo.vue";
import FeatureCard from "@/components/FeatureCard.vue";
import {reactive, ref} from 'vue';
import {FEATURE_INFO_LIST} from "@/componsables/constants/RenrenConstant";
import type {MaterialInterface} from "@/componsables/interface/MaterialInterface";
import type {RenrenInterface} from "@/componsables/interface/RenrenInterface";
import {$message} from "@/componsables/element-plus";
import {$engine} from "@/renren-engine/engine";
import {useRouter} from "vue-router";


/** ===== 新建项目-start ===== **/
const isShow = ref<boolean>(false);
const createProject = reactive<MaterialInterface.createProjectParamsType>({
  host: "",
  name: "",
  path: ""
});
const router = useRouter();
// 项目列表
const projectList = ref<RenrenInterface.keyValueType<string>[]>([]);
// 文档节点列表
const documentList = ref<RenrenInterface.keyValueType<string>[]>([]);

const documentSelectedList = ref<string[]>([]);


async function createNewProject() {
  isShow.value = true;
  resetData();
  // 获取缓存的项目和文档节点列表
  await $engine.queryProjectList().then((res: string[]) => {
    // console.log('res', res);
    if (res.length > 0) {
      res.forEach(async (item: string) => {
        projectList.value.push({
          key: item,
          value: item,
        });
      })
    }
  }).catch(err => {
    $message({
      type: 'warning',
      message: err as string
    });
  });
  // 获取缓存的 文档节点列表
  await $engine.queryDocumentStorageIdList().then((res: string[]) => {
    if (res.length > 0) {
      res.forEach((item: string) => {
        documentList.value.push({
          key: item,
          value: item
        });
      });
    }
  }).catch(err => {
    $message({
      type: 'warning',
      message: err as string
    });
  })
  // console.log(projectList.value, documentList.value);
}


/**
 * @description 重置数据
 */
function resetData() {
  createProject.name = "";
  createProject.host = "";
  createProject.path = "";
  documentList.value = [];
  projectList.value = [];
}


function cancelCreateProject() {
  isShow.value = false;
  resetData();
}


/**
 * @description 创建新项目
 */
async function createProjectHandler() {
  if (createProject.name && createProject.host && createProject.path) {
    await $engine.initProject({...createProject}).then(res => {
      $message({
        type: 'success',
        message: res as string
      });
      // 关闭 drawer
      isShow.value = false;
      // 页面跳转
      router.push('/workerspace');
    }).catch(err => {
      $message({
        type: 'warning',
        message: err as string
      });
    });
  } else {
    $message({
      type: 'warning',
      message: '请输入完整信息',
    });
  }
}
/** ======= 新建项目-end ===== **/
</script>

<template>
  <el-container>
    <el-header>
      <HomeHeader />
    </el-header>
    <el-main>
      <!-- 项目创建页面 -->
      <div class="w-full h-full flex flex-col p-10 bg-main-background">
        <!-- description-container -->
        <div class="w-full h-1/2 grid grid-cols-2 gap-4">
          <!-- description -->
          <div class="w-full h-full flex">
            <HomeDescription @start="createNewProject" />
          </div>
          <!-- logo -->
          <div class="w-full h-full flex">
            <HomeLogo />
          </div>
        </div>
        <!-- functional-banner -->
        <div class="w-full h-full grid grid-cols-3 gap-4">
          <div
            v-for="(item, index) in FEATURE_INFO_LIST"
            :key="index"
            class="w-full h-full flex items-center justify-center"
          >
            <FeatureCard
              :icon="item.icon"
              :title="item.title"
              :description="item.description"
              :hover="item.hover"
            />
          </div>
        </div>
      </div>
    </el-main>
  </el-container>
  <!-- drawer -->
  <el-drawer
    v-model="isShow"
    title="新建项目"
    :show-close="false"
    :close-on-click-modal="false"
    direction="rtl"
    size="350"
  >
    <template #header>
     <div class="w-full h-auto grid grid-cols-2 gap-4">
       <div class="w-full h-auto flex items-center text-black font-bold">新建项目</div>
       <div class="w-full h-auto flex items-center justify-end">
         <el-button type="text" icon="Close" @click="() => isShow = false">关闭</el-button>
       </div>
     </div>
    </template>
    <template #default>
      <el-scrollbar height="600">
        <div class="w-full h-full flex flex-col">
          <el-form class="w-full h-auto" label-width="auto">
            <el-form-item
              label="项目名称"
              required
            >
              <el-input
                v-model="createProject.name"
                placeholder="请输入项目名称"
                clearable
                style="width: 240px"
              />
            </el-form-item>
            <el-form-item
              label="项目地址"
              required
            >
              <el-input
                v-model="createProject.host"
                clearable
                placeholder="请输入项目地址"
                style="width: 240px"
              />
            </el-form-item>
            <el-form-item
              label="项目路由"
              required
            >
              <el-input
                v-model="createProject.path"
                clearable
                placeholder="请输入项目路由"
                style="width: 240px"
              />
            </el-form-item>
            <el-form-item
              label="页面绑定"
            >
              <el-select
                v-model="documentSelectedList"
                multiple
                placeholder="请选择要绑定的页面"
                clearable
                style="width: 240px"
              >
                <el-option
                  v-for="(item, index) in documentList"
                  :key="index"
                  :label="item.key"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-form>
          <!-- btns -->
          <div class="w-full h-auto mt-auto flex justify-end">
            <el-button @click="createProjectHandler" type="primary">创建项目</el-button>
            <el-button @click="cancelCreateProject" type="info" plain>取消</el-button>
          </div>
        </div>
      </el-scrollbar>
    </template>
  </el-drawer>
</template>

<style scoped>
:deep(.el-header) {
  padding: 0;
}

:deep(.el-main) {
  padding: 0;
}

:deep(.el-scrollbar__view) {
  height: 100%;
}
</style>
