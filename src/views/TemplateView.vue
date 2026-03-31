<script setup>
import TemplateSelector from "@/components/visualMusic/TemplateSelector.vue";
import { useRouter } from 'vue-router';

const router = useRouter();

const handleSelectTemplate = (template) => {
  console.log('用户选择了模板:', template);
  // 跳转到动态路由 /template/:id
  router.push(`/template/${template.id}`);
};
</script>

<template>
  <TemplateSelector @select="handleSelectTemplate" />
</template>
