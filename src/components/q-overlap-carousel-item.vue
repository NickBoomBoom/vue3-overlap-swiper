 
<template>
  <div ref="itemRef" class="q-overlap-carousel-item" @click="choose">
    <slot />
  </div>
</template> 
<script setup lang="ts">
import { inject, ref } from 'vue';
const itemRef = ref()
const itemClick = inject<(i: number) => void>('itemClick', () => { })
const choose = () => {
  const index = +itemRef.value.dataset.index
  itemClick(index)
}

</script>