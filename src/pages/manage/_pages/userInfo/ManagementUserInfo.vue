<script setup lang="ts">
import {ref, reactive, onMounted} from "vue";
import ManageLayout from "@/pages/manage/_component/ManageLayout.vue";
import {DEFAULT_USER_AVATAR} from "@/componsables/constants/RenrenConstant";
import {$api} from "@/componsables/api";


/** ========== 用户信息初始化-start ==========**/
const isLoading = ref<boolean>(false);
// 是否锁定编辑
const isLock = ref<boolean>(true);
const userInfo = reactive<UserInfoRespDto.UserDesensitizationInfoRespDto>({
  email: "",
  password: "",
  userId: "",
  username: "",
  avatar: DEFAULT_USER_AVATAR
});
const secondPass = ref<string>('');


/**
 * @description 初始化用户信息表单
 */
async function queryUserInfo() {
  await $api.info.queryUserById().then(res => {
    userInfo.userId = res.userId;
    userInfo.username = res.username;
    userInfo.avatar = res.avatar ? res.avatar : DEFAULT_USER_AVATAR;
    userInfo.email = res.email;
    userInfo.password = res.password;
  });
}
/** ========= 用户信息初始化-end ==========**/



onMounted(async () => {
  isLoading.value = true;
  await queryUserInfo();
  isLoading.value = false;
});
</script>

<template>
  <ManageLayout
    header="用户信息"
    :footer="false"
  >
    <template #default>
      <div class="w-full h-full flex pt-4">
        <el-skeleton
          animated
          :loading="isLoading"
          :rows="6"
        >
          <el-form label-width="auto">
            <el-form-item label="头像">
              <el-avatar
                :src="userInfo.avatar"
                shape="circle"
                size="large"
                fit="contain"
                alt="用户头像"
              />
            </el-form-item>
            <el-form-item label="用户名" required>
              <el-input
                v-model="userInfo.username"
                placeholder="请输入用户名"
                clearable
                style="width: 240px;"
                :disabled="isLock"
              />
            </el-form-item>
            <el-form-item label="密码" required>
              <el-input
                v-model="userInfo.password"
                clearable
                placeholder="请输入密码"
                style="width: 240px;"
                :disabled="isLock"
                type="password"
                show-password
              />
            </el-form-item>
            <el-form-item label="新密码" required>
              <el-input
                v-model="secondPass"
                clearable
                placeholder="请输入新密码"
                type="password"
                show-password
                show-word-limit
                max="18"
              />
            </el-form-item>
            <el-form-item label="邮箱" required>
              <el-input
                v-model="userInfo.email"
                clearable
                placeholder="请输入邮箱"
                style="width: 240px;"
                :disabled="isLock"
              />
            </el-form-item>
            <el-form-item>
              <div class="w-[300px] h-8 flex items-center justify-end">
                <el-button
                  :type="isLock ? 'primary' : 'info'"
                  :icon="isLock ? 'Unlock' : 'Lock'"
                  @click="() => isLock = !isLock"
                >
                  {{ isLock ? '解锁' : '取消' }}
                </el-button>
                <el-button type="primary" plain :disabled="isLock">确认</el-button>
              </div>
            </el-form-item>
          </el-form>
        </el-skeleton>
      </div>
    </template>
  </ManageLayout>
</template>

<style scoped>

</style>
