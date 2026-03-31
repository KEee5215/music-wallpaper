<template>
  <div class="relative w-full h-screen overflow-hidden">
    <!-- 背景图片 -->
    <div
      class="absolute inset-0 bg-cover bg-center bg-no-repeat"
      :style="{ backgroundImage: `url(${img})` }"
    ></div>

    <!-- 内容区域 -->
    <div class="relative z-10 w-full h-[calc(100vh-450px)] p-5">
      <!-- 这里可以添加其他内容 -->
    </div>

    <!-- VisualMusic 在 MusicCard 上面 -->
    <div class="absolute bottom-[30px] left-0 w-full h-[300px] z-20">
      <VisualMusic></VisualMusic>
    </div>

    <!-- MusicCard 在最底部 -->
    <div class="absolute bottom-0 left-0 w-full z-30">
      <MusicCard></MusicCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import MusicCard from "@/components/visualMusic/MusicCard.vue";
import VisualMusic from "@/components/visualMusic/VisualMusic.vue";

const img =
  "https://keee5215-1407310157.cos.ap-beijing.myqcloud.com/img/blue-girl.png";
</script>

<style scoped></style>
