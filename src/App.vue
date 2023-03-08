<script setup lang="ts">
import qOverlapCarouselItem from './components/q-overlap-carousel-item.vue';
import qOverlapCarousel from './components/q-overlap-carousel.vue';
</script>

<template>
  <qOverlapCarousel style="border:1px solid red" :flank-count="4">
    <qOverlapCarouselItem v-for="item in 20 " >
      <div style="background-color: skyblue; width: 100px;height: 100px">
        {{ item }}
      </div>

    </qOverlapCarouselItem>
  </qOverlapCarousel>
</template>
 