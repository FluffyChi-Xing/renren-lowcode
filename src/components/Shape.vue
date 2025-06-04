<template>
  <div
    ref="shapeRef"
    class="h-auto flex absolute"
    @mouseleave="hideDots"
    @mouseenter="showDots"
    :class="isShow ? 'area' : ''"
  >
    <slot />
    <div
      v-for="(item, index) in dots"
      v-show="dotStatus[item] || false"
      :ref="(el) => setRef(item, el)"
      :key="index"
      class="dot"
      :class="item"
      @drag="eventDataBinding(item, $event)"
    />
  </div>
</template>

<style scoped>
.dot {
  width: 8px;
  height: 8px;
  position: absolute;
  background-color: #3b82f6;
  border-radius: 50%;
  z-index: 3999;
}

.area {
  border: 1px solid  #3b82f6;
}

.lt,
.rb {
  cursor: nwse-resize;
}

.rt,
.lb {
  cursor: nesw-resize;
}

.lc,
.rc {
  cursor: ew-resize;
}

.mt,
.mb {
  cursor: ns-resize;
}
</style>



<script setup lang="ts">
import {nextTick, onMounted, ref, shallowRef, watch} from 'vue';
import {$util} from "@/componsables/utils";
import {mySchemaStore} from "@/stores/schema";



const props = withDefaults(defineProps<{
  index?: string; // 唯一 key 值
  style?: Record<string, string>;
}>(), {
  index: '',
});


const shapeRef = shallowRef();
const isShow = ref<boolean>(false);
const currentIndex = ref<string>(props.index);
const dotRefs = ref<Map<string, HTMLElement | null>>(new Map<string, HTMLElement>());
const dots =ref<string[]>(['lt', 'rt', 'lb', 'rb', 'lc', 'rc', 'mt', 'mb']);
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


/**
 * @description 隐藏控制点
 */
function hideDots(): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    try {
      isShow.value = false;
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


/**
 * @description 控制点事件绑定
 * @param index
 * @param event
 */
async function eventDataBinding(index: string, event?: DragEvent) {
  let result: RenrenInterface.XAndYType<number, number> = {
    x: 0,
    y: 0
  };
  let width : number = 0;
  let height: number = 0;
  if (shapeRef.value) {
    width = shapeRef.value?.clientWidth || 0;
    height = shapeRef.value?.clientHeight || 0;
  }
  if (event) {
    const { x, y } = await $util.canvas.getCursorPosition(event);
    if (x >= width && height >= height) {
      result.x = x;
      result.y = y;
      console.log(`dot drag event binding: ${index}`, result)
    }
  }
}


/**
 * @description 确定控制点对应的位置
 * @param index
 * @param config
 */
function checkDotPosition(index: string, config: dotPositionConfig) {
  const { width, height } = config;
  if (dotRefs.value.get(index) !== void 0) {
    switch (index) {
      case 'lt':
        (dotRefs.value.get(index) as HTMLElement).style.top = '-4px';
        (dotRefs.value.get(index) as HTMLElement).style.left = '-4px';
        dotStatus.value[index] = true;
        break;
      case 'rt':
        (dotRefs.value.get(index) as HTMLElement).style.top = '-4px';
        (dotRefs.value.get(index) as HTMLElement).style.right = '-4px';
        dotStatus.value[index] = true;
        break;
      case 'lb':
        (dotRefs.value.get(index) as HTMLElement).style.bottom = '-4px';
        (dotRefs.value.get(index) as HTMLElement).style.left = '-4px';
        dotStatus.value[index] = true;
        break;
      case 'rb':
        (dotRefs.value.get(index) as HTMLElement).style.bottom = '-4px';
        (dotRefs.value.get(index) as HTMLElement).style.right = '-4px';
        dotStatus.value[index] = true;
        break;
      case 'mt':
        (dotRefs.value.get(index) as HTMLElement).style.left = `${width / 2}px`;
        (dotRefs.value.get(index) as HTMLElement).style.top = '-4px';
        dotStatus.value[index] = true;
        break;
      case 'mb':
        (dotRefs.value.get(index) as HTMLElement).style.bottom = '-4px';
        (dotRefs.value.get(index) as HTMLElement).style.left = `${width / 2}px`;
        dotStatus.value[index] = true;
        break;
      case 'lc':
        (dotRefs.value.get(index) as HTMLElement).style.top = `${height / 2}px`;
        (dotRefs.value.get(index) as HTMLElement).style.left = '-4px';
        dotStatus.value[index] = true;
        break;
      case 'rc':
        (dotRefs.value.get(index) as HTMLElement).style.top = `${height / 2}px`;
        (dotRefs.value.get(index) as HTMLElement).style.right = '-4px';
        dotStatus.value[index] = true;
        break;
    }
  }
}


/**
 * @description 展示控制点
 */
async function showDots() {
  await hideDots();
  isShow.value = true;
  if (shapeRef.value !== void 0) {
    let width: number = 0;
    let height: number = 0;
    width = shapeRef.value?.clientWidth || 0;
    height = shapeRef.value?.clientHeight || 0;
    // if (currentIndex.value === mySchemaStore.currentElementId) {
    //   await nextTick(() => {
    //     for (let index in dotStatus.value) {
    //       checkDotPosition(index, { width, height });
    //     }
    //   });
    // }
    for (let index in dotStatus.value) {
      checkDotPosition(index, { width, height });
    }
  }
}



onMounted(() => {
  showDots();
});


watch(() => props.index, () => {
  currentIndex.value = props.index;
  showDots();
});
</script>
