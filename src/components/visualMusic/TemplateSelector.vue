<template>
  <div class="min-h-screen bg-base-200 py-12 px-4">
    <div class="max-w-7xl mx-auto">
      <!-- 标题区域 -->
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-base-content mb-4">
          选择一个您喜欢的模板
        </h1>
        <p class="text-lg text-base-content/70">
          浏览我们的精选模板，找到最适合您的设计
        </p>
      </div>

      <!-- 模板列表 Grid 布局 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="(template, index) in templates"
          :key="index"
          class="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer group"
          @click="selectTemplate(template)"
        >
          <figure class="relative overflow-hidden">
            <img
              :src="template.image"
              :alt="template.name"
              class="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
            />
            <!-- 悬停时的覆盖层 -->
            <div
              class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
            >
              <button class="btn btn-primary btn-wide">选择此模板</button>
            </div>
          </figure>
          <div class="card-body">
            <h2 class="card-title text-base-content">{{ template.name }}</h2>
            <p class="text-sm text-base-content/70">{{ template.description }}</p>
            <div class="card-actions justify-end mt-4">
              <div class="badge badge-outline badge-primary">
                {{ template.category }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态提示 -->
      <div
        v-if="templates.length === 0"
        class="text-center py-20"
      >
        <div class="text-6xl mb-4">🎨</div>
        <p class="text-xl text-base-content/70">暂无可用模板</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const emit = defineEmits(['select']);

// 模板数据
const templates = ref([
  {
    id: 1,
    name: '简约现代',
    description: '简洁大方的设计风格，适合现代音乐展示',
    image: 'https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp',
    category: '现代'
  },
  {
    id: 2,
    name: '复古怀旧',
    description: '经典复古元素，唤起美好回忆',
    image: 'https://img.daisyui.com/images/stock/photo-1542259681-d4cd71f4c153.webp',
    category: '复古'
  },
  {
    id: 3,
    name: '赛博朋克',
    description: '未来科技感，霓虹灯效果',
    image: 'https://img.daisyui.com/images/stock/photo-1620641788421-7a1c342ea42e.webp',
    category: '科幻'
  },
  {
    id: 4,
    name: '自然清新',
    description: '大自然元素，清新舒适的视觉体验',
    image: 'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp',
    category: '自然'
  },
  {
    id: 5,
    name: '抽象艺术',
    description: '艺术感十足的抽象设计',
    image: 'https://img.daisyui.com/images/stock/photo-1534528742105-864ac7a685be.webp',
    category: '艺术'
  },
  {
    id: 6,
    name: '极简主义',
    description: '少即是多，极致简约的美学',
    image: 'https://img.daisyui.com/images/stock/photo-1506744038136-46273834b3fb.webp',
    category: '极简'
  }
]);

// 选择模板
const selectTemplate = (template) => {
  console.log('选中的模板:', template);
  emit('select', template);
  // 这里可以添加路由跳转或其他逻辑
};
</script>

<style scoped>
/* 响应式断点由 Tailwind 的 grid 类处理 */
</style>
