<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const template = ref(null);

// 模拟从后端获取模板数据
const templates = [
  {
    id: 1,
    name: '简约现代',
    description: '简洁大方的设计风格，适合现代音乐展示',
    image: 'https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp',
    category: '现代',
    preview: '这是模板预览内容...',
    features: ['响应式设计', '现代化布局', '优雅的动画']
  },
  {
    id: 2,
    name: '复古怀旧',
    description: '经典复古元素，唤起美好回忆',
    image: 'https://img.daisyui.com/images/stock/photo-1542259681-d4cd71f4c153.webp',
    category: '复古',
    preview: '这是模板预览内容...',
    features: ['复古色调', '经典排版', '怀旧元素']
  },
  {
    id: 3,
    name: '赛博朋克',
    description: '未来科技感，霓虹灯效果',
    image: 'https://img.daisyui.com/images/stock/photo-1620641788421-7a1c342ea42e.webp',
    category: '科幻',
    preview: '这是模板预览内容...',
    features: ['霓虹配色', '科技感', '动态效果']
  },
  {
    id: 4,
    name: '自然清新',
    description: '大自然元素，清新舒适的视觉体验',
    image: 'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp',
    category: '自然',
    preview: '这是模板预览内容...',
    features: ['自然色彩', '舒适布局', '清新风格']
  },
  {
    id: 5,
    name: '抽象艺术',
    description: '艺术感十足的抽象设计',
    image: 'https://img.daisyui.com/images/stock/photo-1534528742105-864ac7a685be.webp',
    category: '艺术',
    preview: '这是模板预览内容...',
    features: ['艺术设计', '抽象元素', '独特风格']
  },
  {
    id: 6,
    name: '极简主义',
    description: '少即是多，极致简约的美学',
    image: 'https://img.daisyui.com/images/stock/photo-1506744038136-46273834b3fb.webp',
    category: '极简',
    preview: '这是模板预览内容...',
    features: ['极简设计', '留白艺术', '纯粹美学']
  }
];

onMounted(() => {
  const templateId = parseInt(route.params.id);
  // 根据 ID 查找对应的模板数据
  template.value = templates.find(t => t.id === templateId);
  
  if (!template.value) {
    // 如果找不到对应模板，返回列表页
    router.push('/templates');
  }
});

const goBack = () => {
  router.back();
};

const useTemplate = () => {
  console.log('使用此模板:', template.value);
  // 这里可以跳转到编辑器或其他业务逻辑
  alert(`您选择了 "${template.value?.name}" 模板！接下来将进入编辑界面...`);
};
</script>

<template>
  <div class="min-h-screen bg-base-200 py-12 px-4">
    <div class="max-w-5xl mx-auto" v-if="template">
      <!-- 返回按钮 -->
      <button 
        class="btn btn-ghost mb-6"
        @click="goBack"
      >
        ← 返回模板列表
      </button>

      <!-- 模板详情卡片 -->
      <div class="card lg:card-side bg-base-100 shadow-xl">
        <figure class="lg:w-1/2">
          <img
            :src="template.image"
            :alt="template.name"
            class="w-full h-full object-cover"
          />
        </figure>
        <div class="card-body lg:w-1/2">
          <div class="flex items-center gap-3 mb-2">
            <h2 class="card-title text-3xl">{{ template.name }}</h2>
            <div class="badge badge-primary">{{ template.category }}</div>
          </div>
          <p class="text-lg text-base-content/70 mb-4">{{ template.description }}</p>
          
          <!-- 特性列表 -->
          <div class="mb-6">
            <h3 class="text-lg font-semibold mb-3">模板特性:</h3>
            <ul class="space-y-2">
              <li 
                v-for="(feature, index) in template.features" 
                :key="index"
                class="flex items-center gap-2"
              >
                <span class="text-success">✓</span>
                <span>{{ feature }}</span>
              </li>
            </ul>
          </div>

          <!-- 操作按钮 -->
          <div class="card-actions justify-end gap-3 mt-6">
            <button class="btn btn-outline" @click="goBack">
              再看看
            </button>
            <button class="btn btn-primary btn-wide" @click="useTemplate">
              使用此模板
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-else class="min-h-screen flex items-center justify-center">
      <div class="loading loading-spinner loading-lg"></div>
    </div>
  </div>
</template>

<style scoped>
</style>
