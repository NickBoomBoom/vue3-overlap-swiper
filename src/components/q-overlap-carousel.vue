<script setup lang="ts">
import { ref, watch, nextTick, onMounted } from 'vue';

const props = withDefaults(
  defineProps<{
    modelValue: number;
    spaceWidth?: number;
    limit?: number; // 左右显示数量
  }>(),
  {
    spaceWidth: 40,
    modelValue: 0,
    limit: 3,
  }
);
const emits = defineEmits(["update:modelValue"]);
const SCALE = 1;
const SCALE_STEP = 0.15;
const MULTIPLE = 5;
const swiperRef = ref();
let swiperWidth: number;
const ITEM_CLASS_NAME = ".swiper-item";
const _current = ref(props.modelValue);
watch(_current, (val: number, oldVal: number) => {
  nextTick(() => {
    transition(val);
    emits("update:modelValue", val);
  });
});
function getItems() {
  return swiperRef.value.querySelectorAll(ITEM_CLASS_NAME);
}
function transition(val: number) {
  const items = getItems();
  for (let i = 0; i < items.length; i++) {
    const t = items[i];
    const s = getComputedStyle(t);
    /matrix\((.+)\)/.test(s.transform);
    const arr = RegExp.$1.split(",");
    const scale = +arr[0];
    const { width } = t.getBoundingClientRect();
    let _s = scale;
    let _x;
    let _z;
    let _o = 1;
    const d = Math.abs(val - i);
    if (i < val) {
      _z = i;
      _s = SCALE - d * SCALE_STEP;
      _x = -d * props.spaceWidth - (width - width * _s) / 2;
      t.classList.add("mask");
      _o = d > props.limit ? 0 : 1;
    } else if (i === val) {
      _s = 1;
      _z = items.length;
      _x = 0;
      t.classList.remove("mask");
      _o = 1;
    } else if (i > val) {
      _z = items.length - i;
      _s = SCALE - (i - val) * SCALE_STEP;
      _x = (i - val) * props.spaceWidth + (width - width * _s) / 2;
      t.classList.add("mask");
      _o = d > props.limit ? 0 : 1;
    }

    t.style.cssText = `
    z-index: ${_z};
    left: calc(50% + ${_x}px);
    transform: translate(-50%) scale(${_s.toFixed(2)});
    opacity: ${_o};
    `;
  }
}
function prev() {
  if (_current.value <= 0) {
    return;
  }
  _current.value -= 1;
}
function next() {
  if (_current.value >= getItems().length - 1) {
    return;
  }
  _current.value += 1;
}
function choose(i: number) {
  _current.value = i;
}
function init() {
  const { width } = swiperRef.value.getBoundingClientRect();
  swiperWidth = width;
  const items = getItems();

  for (let i = 0; i < items.length; i++) {
    const el = items[i];
    const zIndex = items.length - i;
    // TODO:  后面再改改
    el.addEventListener("click", () => {
      choose(i);
    });
    if (i > _current.value) {
      el.classList.add("mask");
    }
    el.style.cssText = `
      left: calc(50% + ${
        i === 0 ? 0 : props.spaceWidth * i - (i - 1) * MULTIPLE
      }px);
      transform: translate(-50%) scale(${SCALE - SCALE_STEP * i});
      z-index: ${zIndex};
      opacity: ${i > props.limit ? 0 : 1};
    `;
  }
}

onMounted(() => {
  nextTick(init);
});
</script>

<template>
  <div ref="swiperRef" class="w-full overflow-hidden stack-swiper relative">
    <div class="w-10/13 h-full mx-auto relative overflow-hidden">
      <slot />
    </div>
    <img
      class="absolute z-30 w-7 h-7 left-8.5 top-1/2 -translate-y-1/2"
      src="@/assets/image/arrow-circle-left.png"
      alt=""
      @click="prev"
    />
    <img
      class="absolute z-30 right-8.5 w-7 h-7 top-1/2 -translate-y-1/2"
      src="@/assets/image/arrow-circle-right.png"
      alt=""
      @click="next"
    />
  </div>
</template>

<style lang="less">
.stack-swiper {
  .swiper-item {
    flex-shrink: 0;
    transition: all 0.3s;
    position: absolute;
    left: 50%;
    transform: translate(-50%);
    overflow: hidden;
    cursor: pointer;

    &.mask {
      &::after {
        content: "";
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        width: 100%;
        height: 100%;
        background: rgba(255, 255, 255, 0.38);
      }
    }
  }
}
</style>
