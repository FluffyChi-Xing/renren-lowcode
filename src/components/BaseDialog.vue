<script setup lang="ts">
import {ref, watch} from 'vue';
const props = withDefaults(defineProps<{
  show?: boolean;
  width?: number | string;
  modal?: boolean;
  showClose?: boolean;
  title?: string;
  fullScreen?: boolean;
  closeOnClickModal?: boolean;
  draggable?: boolean;
  footer?: boolean;
}>(), {
  show: false,
  width: 500,
  modal: true,
  showClose: true,
  title: '标题',
  fullScreen: false,
  closeOnClickModal: true,
  draggable: false,
  footer: false
});


const isShow = ref<boolean>(props.show || false);


watch(() => props.show, (newVal: boolean) => {
  isShow.value = newVal;
});
</script>

<template>
  <el-dialog
    v-model="isShow"
    :title="title"
    :width="width"
    :modal="modal"
    :show-close="showClose"
    :draggable="draggable"
    :fullscreen="fullScreen"
    :close-on-click-modal="closeOnClickModal"
  >
    <slot />
    <template v-if="footer" #footer>
      <slot name="footer" />
    </template>
  </el-dialog>
</template>
