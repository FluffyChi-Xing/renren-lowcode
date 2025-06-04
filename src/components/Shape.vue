<script setup lang="ts">
import {onMounted, ref, shallowRef} from 'vue';



const shapeRef = shallowRef();
const content = shallowRef();
const dotRefs = ref<Map<string, HTMLElement | null>>(new Map<string, HTMLElement>());
const dots: string[] = ['lt', 'rt', 'lb', 'rb', 'lc', 'rc', 'mt', 'mb'];
const dotStatus = ref<Record<string, boolean>>({
  'lt': false,
  'rt': false,
  'lb': false,
  'rb': false,
  'lc': false,
  'rc': false,
  'mt': false,
  'mb': false,
});

type dotPositionConfig = {
  width: number;
  height: number;
};

function setRef(index: string, item: unknown) {
  if (index && item) {
    dotRefs.value.set(index, item instanceof HTMLElement ? item : null);
  }
}



function hideDots(): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    try {
      for (let index in dotStatus.value) {
        dotStatus.value[index] = false;
      }
      resolve('success');
    } catch (e) {
      console.error('隐藏作用点失败', e);
      reject('隐藏作用点失败');
    }
  });
}


function checkDotPosition(index: string, config: dotPositionConfig) {
  const { width, height } = config;
  if (dotRefs.value.get(index) !== void 0) {
    if (index === 'lt') {
      (dotRefs.value.get(index) as HTMLElement).style.top = '-4px';
      (dotRefs.value.get(index) as HTMLElement).style.left = '-4px';
      dotStatus.value[index] = true;
    }
    console.log(dotStatus.value, index);
  }
}


function showDots() {
  if (shapeRef.value !== void 0) {
    let width: number = 0;
    let height: number = 0;
    width = shapeRef.value?.clientWidth || 0;
    height = shapeRef.value?.clientHeight || 0;
    if (width !== 0 && height !== 0) {
      for (let index in dotStatus.value) {
        checkDotPosition(index, { width, height });
      }
    }
  }
}



onMounted(() => {
  hideDots();
});
</script>

<template>
  <div
    ref="shapeRef"
    class="h-auto flex border relative border-red-500"
    :style="{ width: content ? `${content?.clientWidth}px` : 'auto' }"
    @mouseenter="showDots"
    @mouseleave="hideDots"
  >
    <div ref="content" class="flex">
      <slot />
    </div>
    <div
      v-for="(item, index) in dots"
      v-show="dotStatus[item] || false"
      :ref="(el) => setRef(item, el)"
      :key="index"
      class="dot"
    />
  </div>
</template>

<style scoped>
.dot {
  width: 8px;
  height: 8px;
  display: flex;
  position: absolute;
  background-color: #3b82f6;
  border-radius: 50%;
  z-index: 3999;
}
</style>
