<template>
  <div class="w-full">
    <!-- 卡片列表容器 -->
    <div
      class="w-full overflow-x-auto scrollbar-hide"
      ref="cardListRef"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
      @wheel="handleWheel"
    >
      <div
        class="flex gap-6 transition-transform duration-300"
        :style="{ transform: `translateX(-${scrollPosition}px)` }"
      >
        <Card
          v-for="(img, index) in imgs"
          :key="index"
          :img="img"
          class="flex-shrink-0"
        ></Card>
      </div>
    </div>
  </div>
  <!-- 进度指示器 -->
  <div class="relative mb-4">
    <div class="h-1 bg-gray-200 rounded-full overflow-hidden">
      <div
        class="h-full bg-primary transition-all duration-300 ease-out"
        :style="{ width: `${scrollProgress}%` }"
      ></div>
    </div>
    <div class="flex justify-between text-xs text-gray-500 mt-1">
      <span>{{ currentIndex + 1 }}</span>
      <span>{{ imgs.length }}</span>
    </div>
  </div>
</template>

<script setup>
import Card from "./Card.vue";
import { ref, onMounted, computed } from "vue";

const props = defineProps(["imgs"]);

const cardListRef = ref(null);
const scrollPosition = ref(0);
const isHovering = ref(false);
const maxScroll = ref(0);
const cardWidth = ref(0);

onMounted(() => {
  // 计算最大可滚动距离和卡片宽度
  if (cardListRef.value) {
    const contentDiv = cardListRef.value.querySelector(".flex");
    const contentWidth = contentDiv.scrollWidth;
    const containerWidth = cardListRef.value.offsetWidth;
    maxScroll.value = Math.max(0, contentWidth - containerWidth);

    // 计算单张卡片的宽度（包括间距）
    const firstCard = contentDiv.children[0];
    cardWidth.value = firstCard.offsetWidth;
  }
});

const handleMouseEnter = () => {
  isHovering.value = true;
};

const handleMouseLeave = () => {
  isHovering.value = false;
};

const handleWheel = (e) => {
  // 移除 isHovering 检查，让滚动始终生效
  if (!cardListRef.value) return;

  // 阻止页面默认滚动
  e.preventDefault();
  e.stopPropagation();

  // 更新滚动位置
  scrollPosition.value += e.deltaY;

  // 限制滚动范围，不能超出边界
  scrollPosition.value = Math.max(
    0,
    Math.min(scrollPosition.value, maxScroll.value)
  );
};

// 计算当前滚动进度百分比
const scrollProgress = computed(() => {
  if (maxScroll.value === 0) return 0;
  return (scrollPosition.value / maxScroll.value) * 100;
});

// 计算当前显示的是第几张卡片
const currentIndex = computed(() => {
  if (cardWidth.value === 0) return 0;
  return Math.floor(scrollPosition.value / cardWidth.value);
});
</script>

<style scoped>
/* 隐藏默认滚动条 */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
