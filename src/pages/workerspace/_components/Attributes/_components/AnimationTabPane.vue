<script setup lang="ts">
import {animationList, animationNameValueMap} from "@/componsables/utils/AnimationUtil";
import {ref} from 'vue';
import type { ComponentPublicInstance } from 'vue';
import '@/assets/animation.css';
import {$message} from "@/componsables/element-plus";
import $event from "@/componsables/utils/EventBusUtil";





const animateRef = ref<Record<string, HTMLElement | null>>({});
const emits = defineEmits(['addAnimate']);
/**
 * @description 设置 element ref
 * @param el
 * @param item
 */
const setRef = (el: Element | ComponentPublicInstance | null, item: string) => {
  animateRef.value[item] = el instanceof HTMLElement ? el : null;
};
/** ===== 动画预览-start =====**/


/**
 * @description 运行动画效果
 * @param key
 */
function runAnimation(key: string): Promise<string> {
  return new Promise<string>((resolve, reject) =>{
    try {
      animateRef.value[key]?.classList.add(animationNameValueMap.get(key) as string, 'animated', 'no-infinite');
      const removeAnimation = () => {
        animateRef.value[key]?.classList.remove(animationNameValueMap.get(key) as string, 'animated', 'no-infinite');
        resolve('运行动画效果成功');
      }
      animateRef.value[key]?.addEventListener('animationend', removeAnimation);
      animateRef.value[key]?.addEventListener('animationcancel', removeAnimation);
    } catch (e) {
      console.error('运行动画效果失败', e);
      reject('运行动画效果失败');
    }
  });
}


/**
 * @description 预览动画效果
 * @param key
 * @param e
 */
function previewAnimation(key: string, e?: MouseEvent): Promise<string> {
  return new Promise<string>(async (resolve, reject) => {
    try {
      e?.preventDefault();
      await runAnimation(key).then(() => {
        resolve('预览动画效果成功');
      }).catch(err => {
        $message({
          type: 'warning',
          message: err as string
        });
      });
    } catch (e) {
      console.error('预览动画效果失败', e);
      reject('预览动画效果失败');
    }
  });
}


/**
 * @description 处理动画添加事件
 * @param item
 */
function addAnimationHandler(item: RenrenInterface.keyValueType<string>) {
  emits('addAnimate', item);
  $event.emit('animationAdded');
  $message({
    type: 'info',
    message: item.key
  });
}
/** ===== 动画预览-end =====**/
</script>

<template>
  <el-tabs
    class="w-full h-full"
  >
    <el-tab-pane
      v-for="(item, index) in animationList"
      :key="index"
      :label="item.label"
    >
      <div
        class="w-full h-auto grid grid-cols-3 gap-4"
        :class="`grid-rows-[${item.children.length % 3 === 0 ? item.children.length / 3 : Math.floor(item.children.length / 3) + 1}]`"
      >
        <div
          v-for="(itm, idx) in item.children"
          :key="idx"
          :ref="(el) => setRef(el, itm.key)"
          @mouseenter="previewAnimation(itm.key, $event)"
          @click="addAnimationHandler(itm)"
          class="w-full h-full select-none cursor-pointer flex items-center justify-center p-4 bg-main-background text-black"
        >
          {{ itm.key }}
        </div>
      </div>
    </el-tab-pane>
  </el-tabs>
</template>

<style scoped>

</style>
