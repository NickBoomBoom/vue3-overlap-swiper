<script setup lang="ts">
import { ref, watch, nextTick, onMounted, provide } from 'vue';
const props = withDefaults(
  defineProps<{
    modelValue?: number; // 当前选择
    spaceWidth?: number; //每个卡片之间的间隔
    flankCount?: number; // 左右两翼展示数量
    spacingRate?: number; // 每次间距的移动比例
    scaleRate?: number; // 逐级缩小的比例
  }>(),
  {
    spaceWidth: 40,
    modelValue: 0,
    flankCount: 3,
    spacingRate: .9,
    scaleRate: .1
  }
);
const emits = defineEmits(["update:modelValue", "currentChange"]);
const SCALE = 1;
const ITEM_CLASS_NAME = ".q-overlap-carousel-item";
const swiperRef = ref();

const itemClick = (i: number) => {
  const d = Math.abs(i - _current.value)
  if (d < props.flankCount) {
    _current.value = i;
  }
}
provide('itemClick', itemClick)
const _current = ref(props.modelValue);
watch(_current, (val: number, oldVal: number) => {
  nextTick(() => {
    transition(val);
    emits("update:modelValue", val);
    emits("currentChange", val)
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
      _s = SCALE - d * props.scaleRate;
      _x = -d * props.spaceWidth - (width - width * _s) / 2;
      _o = d > props.flankCount ? 0 : 1;
      t.classList.add("mask");
    } else if (i === val) {
      _s = 1;
      _z = items.length;
      _x = 0;
      _o = 1;
      t.classList.remove("mask", "hide");
    } else if (i > val) {
      _z = items.length - i;
      _s = SCALE - (i - val) * props.scaleRate;
      _x = (i - val) * props.spaceWidth + (width - width * _s) / 2;
      _o = d > props.flankCount ? 0 : 1;
      t.classList.add("mask");
    }

    const cursor = _o ? 'pointer' : "auto"
    t.style.cssText = `
      z-index: ${_o ? _z : 0};
      left: calc(50% + ${_x}px);
      transition: all .3s;
      transform: translate(-50%) scale(${_s.toFixed(2)});
      opacity: ${_o};
      cursor:${cursor};
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
  console.log(3333, _current.value)
  if (_current.value >= getItems().length - 1) {
    return;
  }
  _current.value += 1;
}

function init() {
  const items = getItems();
  for (let i = 0; i < items.length; i++) {
    const el = items[i];
    if (i === 0) {
      const { height } = el.getBoundingClientRect()
      swiperRef.value.style.height = height + 'px'
    }

    el.dataset.index = i
    if (i > _current.value) {
      el.classList.add("mask");
    }

    const opacity = i > props.flankCount ? 0 : 1
    const cursor = opacity ? 'pointer' : "auto"
    const scale = SCALE - props.scaleRate * i
    const zIndex = opacity ? items.length - i : 0;
    let left = props.spaceWidth * i
    console.log(i, left,)
    el.style.cssText = `
      left: calc(50% + ${left}px);
      transform: translate(-50%) scale(${scale});
      z-index: ${zIndex};
      opacity: ${opacity};
      cursor: ${cursor}
    `;
  }
}

onMounted(() => {
  nextTick(init);
});
</script>

<template>
  <div ref="swiperRef" class="q-overlap-carousel">
    <div class="q-overlap-carousel__wrap">
      <slot />
    </div>
    <div class="q-overlap-carousel__prev" alt="" @click="prev">
      <slot name="prev">
        <div class="q-overlap-carousel__prev-default">
        </div>
      </slot>
    </div>
    <div class="q-overlap-carousel__next" @click="next">
      <slot name="next">
        <div class="q-overlap-carousel__next-default">
        </div>
      </slot>
    </div>
  </div>
</template>

<style lang="less">
.q-overlap-carousel {
  width: 100%;
  height: 100%;
  position: relative;

  &__prev {
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    z-index: 10;
    cursor: pointer;

    &-default {
      width: 40px;
      height: 40px;
      background-color: red;
    }
  }

  &__next {
    position: absolute;
    top: 50%;
    right: 0;
    transform: translateY(-50%);
    z-index: 10;
    cursor: pointer;

    &-default {
      width: 40px;
      height: 40px;
      background-color: yellowgreen;
    }
  }

  &__wrap {}

  &-item {
    flex-shrink: 0;
    position: absolute;
    left: 50%;
    transform: translate(-50%);
    overflow: hidden;
    cursor: pointer;

    &.show {
      visibility: visible;
    }

    &.hide {
      visibility: hidden;
    }

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
