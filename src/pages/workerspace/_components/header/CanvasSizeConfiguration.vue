<script setup lang="ts">
import {onMounted, ref} from 'vue';
import {$enum} from "@/componsables/enum";
import {DEVICE_TYPES} from "@/componsables/constants/WorkerSpaceConstant";
import {$message} from "@/componsables/element-plus";
import {
  DEFAULT_SIZE_LIST,
  MAX_CANVAS_WIDTH,
  MIN_CANVAS_WIDTH
} from "@/componsables/constants/CanvasConstant";
import {$engine} from "@/renren-engine/engine";
import {myCanvasStore} from "@/stores/canvas";
const props = withDefaults(defineProps<{
  canvasWidth?: number; // 画布宽度
  deviceType?: 'phone' | 'pad' | 'desktop'; // 设备类型
}>(), {
  canvasWidth: 1080, // 默认宽度
  deviceType: 'desktop', // 默认设备类型
});


const defaultWidth = ref<number>(props.canvasWidth || 1080);
const defaultTypes = ref<string>(props.deviceType || 'desktop')
const emits = defineEmits(['update:size']);
const deviceTypes = ref<RenrenInterface.keyValueType<string>[]>(DEVICE_TYPES)
const minWidth = ref<number>(MIN_CANVAS_WIDTH);
const maxWidth = ref<number>(MAX_CANVAS_WIDTH)
const deviceSizeList = ref<number[]>(DEFAULT_SIZE_LIST);


/**
 * @description 处理画布尺寸输入框与设备类型单选框组的数据同步问题
 * @param index
 */
function syncValueWithType(index?: string | undefined): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    try {
      if (index) {
        deviceTypes.value.forEach((item: RenrenInterface.keyValueType<string>) => {
          if (item.key === index) {
            // 同步输入框与设备类型关系
            $enum.DeviceSizeEnum[item.key as keyof typeof $enum.DeviceSizeEnum] ? defaultWidth.value = $enum.DeviceSizeEnum[item.key as keyof typeof $enum.DeviceSizeEnum] : defaultWidth.value = 1080;
          }
        });
        emits('update:size', defaultWidth.value);
        resolve('同步成功');
      } else {
        // 如果输入的值可以精确匹配设备对应的尺寸,否则进行模糊匹配
        if (!deviceSizeList.value.includes(Number(defaultWidth.value))) {
          // phone的尺寸只能为414
          // pad 的尺寸是大于min小于max的任意正值
          if (defaultWidth.value >= minWidth.value && defaultWidth.value <= maxWidth.value) {
            defaultTypes.value = 'pad';
          }
        }
        deviceTypes.value.forEach((item: RenrenInterface.keyValueType<string>) => {
          if ($enum.DeviceSizeEnum[item.key as keyof typeof $enum.DeviceSizeEnum] === Number(defaultWidth.value)) {
            defaultTypes.value = item.key;
          }
        });
        emits('update:size', defaultWidth.value);
        resolve('同步成功');
      }
    } catch (e) {
      console.error('同步失败', e);
      reject('同步失败');
    }
  });
}



/**
 * @description 处理画布大小变化
 */
async function sizeChangeHandler(index?: any) {
  try {
    const value: string = index?.target._value as string;
    const schema = await $engine.arrangement.getSchema();
    // 将宽度数据回写到 schema 中
    await syncValueWithType(value).then(() => {
      myCanvasStore.width = defaultWidth.value; // 将当前画布宽度同步到状态管理中
    }).catch(err => {
      $message({
        type: 'warning',
        message: err
      });
    });
    // 将画布尺寸变化同步到 schema 中
    if (schema !== void 0) {
      const widthProps: RenrenInterface.KeyValueIndexType<string, string> = {
        key: 'style',
        value: `width: ${defaultWidth.value}px;`,
        index: 'input'
      }
      await $engine.renderer.updateDocumentCSSAttribute(schema.prop?.id as string, widthProps).catch(err => {
        $message({
          type: 'warning',
          message: err as string
        });
      });
    }
  } catch (e) {
    console.error('处理画布大小变化失败', e);
    $message({
      type: 'warning',
      message: '功能异常，请稍后再试',
    });
  }
}


onMounted(() => {
  // 在首次挂载的时候初始化状态管理中的 width
  myCanvasStore.width = defaultWidth.value;
});
</script>

<template>
  <div class="w-full h-full flex items-center justify-between">
    <!-- device-type-radios -->
    <div class="w-auto h-full flex items-center">
      <el-radio-group disabled v-model="defaultTypes">
        <el-radio-button
          v-for="(item, index) in deviceTypes"
          :key="index"
          :label="item.value"
          :value="item.key"
          @change="sizeChangeHandler"
        >
          <el-icon size="20">
            <component :is="$enum.getIconByValue(item.key as string)" />
          </el-icon>
        </el-radio-button>
      </el-radio-group>
    </div>
    <!-- canvas-size-input -->
    <div class="w-auto h-full flex items-center">
      <el-input
        v-model="defaultWidth"
        clearable
        :min="minWidth"
        :max="maxWidth"
        @keydown.enter="sizeChangeHandler"
        style="width: 200px;"
      >
        <template #append>
          px
        </template>
      </el-input>
    </div>
  </div>
</template>

<style scoped>

</style>
