<template>
  <Navbar></Navbar>
  <!-- Hero Section - Full Screen -->
  <div class="hero min-h-screen bg-base-200">
    <div class="hero-content flex-col lg:flex-row gap-8 pt-20">
      <!-- Left: Video -->
      <div class="flex-1">
        <video
          class="w-full rounded-2xl shadow-lg"
          autoplay
          loop
          muted
          playsinline
        >
          <source
            src="https://keee5215-1407310157.cos.ap-beijing.myqcloud.com/video/son%20of%20sun.mp41"
            type="video/mp4"
          />
        </video>
      </div>

      <!-- Right: Content -->
      <div class="flex-1 text-center lg:text-left">
        <h1 class="text-6xl md:text-7xl font-bold leading-tight">
          music-wallpaper<br />音乐壁纸
        </h1>
        <p class="py-6"></p>
        <div class="flex flex-wrap gap-4 justify-center lg:justify-start">
          <button class="btn btn-primary btn-lg">立即体验</button>
          <button class="btn btn-outline btn-lg">了解更多</button>
        </div>
      </div>
    </div>

    <!-- Scroll Indicator at Bottom -->
    <div
      class="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="2"
        stroke="currentColor"
        class="w-8 h-8 text-base-content opacity-70"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M19.5 8.25l-7.5 7.5-7.5-7.5"
        />
      </svg>
    </div>
  </div>

  <!-- Show More Section -->
  <div class="container mx-auto py-8">
    <h2 class="text-3xl font-bold mb-8">精彩模板</h2>
    <CardList :imgs="imgs"></CardList>
  </div>
</template>

<script setup>
import Card from "./Card.vue";
import CardList from "./CardList.vue";
import { ref } from "vue";
import Navbar from "./Navbar.vue";

const imgs = ref([
  "https://keee5215-1407310157.cos.ap-beijing.myqcloud.com/img/blue-girl.png",
  "https://keee5215-1407310157.cos.ap-beijing.myqcloud.com/img/paiting.jpg",
  "https://keee5215-1407310157.cos.ap-beijing.myqcloud.com/img/two-girl-2.webp",
  "https://keee5215-1407310157.cos.ap-beijing.myqcloud.com/img/two-girl.png",
  "https://keee5215-1407310157.cos.ap-beijing.myqcloud.com/img/warm-girl.webp",
]);
</script>

<style scoped></style>
