<script setup lang="ts">
import {onMounted, ref, watch} from "vue";
import type {RenrenInterface} from "@/componsables/interface/RenrenInterface";
import {DEFAULT_CANVAS_HEIGHT, DEFAULT_CANVAS_WIDTH} from "@/componsables/constants/CanvasConstant";
import {$message} from "@/componsables/element-plus";
const props = withDefaults(defineProps<{
  top?: number; // 鼠标距离顶部的距离
  left?: number; // 鼠标指针距离左侧的距离
  show?: boolean; // 是否显示右键菜单
  menuList?: RenrenInterface.KeyValueIndexType<Function, string>[];
}>(), {
  show: false,
  menuList: () => [
    {
      key: '粘贴',
      value: () => {
        $message({
          type: 'warning',
          message: '请先选择要粘贴的组件'
        });
      },
      index: 'paste'
    }
  ]
});


const isShow = ref<boolean>(props.show || false)
const positionX = ref<number>(0); // 菜单距离左侧的距离
const positionY = ref<number>(0); // 菜单距离顶部的距离
type emitsOptionType = 'paste' | 'copy' | 'cut' | 'delete' | 'up' | 'down' | 'lock';
const emits = defineEmits(['paste', 'copy', 'cut', 'delete', 'up', 'down', 'lock']);


/**
 * @description 确定菜单位置
 */
function checkMenuPosition(): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    try {
      let maxHeight: number = DEFAULT_CANVAS_HEIGHT;
      let maxWidth: number = DEFAULT_CANVAS_WIDTH;
      // 如果当前光标的位置加上菜单宽度超过预览框最大宽度，将菜单位置调整到左侧
      if (props.left && props.left + 90 > maxWidth) {
        positionX.value = props.left - 90;
      } else {
        positionX.value = props.left || 0;
      }
      // 如果菜单的总高度加当前光标所在高度超过预览框的最大高度，将菜单位置调整到下侧
      if (props.top && props.top + (32 * props.menuList.length) > maxHeight) {
        positionY.value = props.top - (32 * props.menuList.length);
      } else {
        positionY.value = props.top || 0;
      }
      resolve('初始化菜单位置成功');
    } catch (e) {
      console.log('初始化菜单位置失败', e);
      reject('初始化菜单位置失败');
    }
  });
}


onMounted(() => {
  checkMenuPosition().then(() => {
    isShow.value = props.show;
  }).catch(err => {
    $message({
      type: 'warning',
      message: err
    });
  });
});


watch(() => props.show, (newVal: boolean) => {
  checkMenuPosition().then(() => {
    isShow.value = newVal;
  }).catch(err => {
    $message({
      type: 'warning',
      message: err
    });
  });
});
</script>

<template>
  <div
    v-if="isShow"
    class="w-[90px] h-auto absolute flex flex-col pt-1 rounded-[5px] bg-white shadow-md z-[999]"
    :style="`left: ${positionX}px;top: ${positionY}px;`"
  >
    <div
      v-for="(item, index) in menuList"
      :key="index"
      @click="() => {item.value(); emits(item.index as emitsOptionType)}"
      class="w-full h-[32px] p-4 mb-1 flex items-center cursor-pointer justify-center hover:text-blue-500 hover:bg-gray-100"
    >
      {{ item.key }}
    </div>
  </div>
</template>

<style scoped>

</style>
