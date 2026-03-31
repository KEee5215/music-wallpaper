<template>
  <div class="min-h-screen bg-base-200 py-12 px-4">
    <div class="max-w-6xl mx-auto">
      <!-- 标题 -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-base-content mb-4">🎵 音频可视化</h1>
        <p class="text-lg text-base-content/70">随着音乐节奏震动的声波效果</p>
      </div>

      <!-- 可视化区域 -->
      <div class="card bg-base-100 shadow-xl mb-8">
        <div class="card-body">
          <div class="w-full h-96 mb-4">
            <AudioVisualizer
              ref="visualizerRef"
              :audioUrl="currentAudio"
              :barWidth="settings.barWidth"
              :barGap="settings.barGap"
              :barColor="settings.barColor"
              :barHeightMultiplier="settings.barHeightMultiplier"
              :smoothing="settings.smoothing"
              :fftSize="settings.fftSize"
            />
          </div>

          <!-- 控制按钮 -->
          <div class="flex justify-center gap-4">
            <button class="btn btn-primary" @click="togglePlay">
              {{ isPlaying ? "暂停" : "播放" }}
            </button>
            <button class="btn btn-outline" @click="changeTrack">
              切换歌曲
            </button>
          </div>
        </div>
      </div>

      <!-- 参数设置 -->
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title mb-4">参数设置</h2>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div class="form-control">
              <label class="label">
                <span class="label-text">声波条宽度</span>
              </label>
              <input 
                type="range" 
                min="1" 
                max="8" 
                v-model.number="settings.barWidth"
                class="range range-primary"
              />
              <label class="label">
                <span class="label-text-alt">{{ settings.barWidth }}px</span>
              </label>
            </div>

            <div class="form-control">
              <label class="label">
                <span class="label-text">声波条间距</span>
              </label>
              <input 
                type="range" 
                min="0" 
                max="8" 
                v-model.number="settings.barGap"
                class="range range-primary"
              />
              <label class="label">
                <span class="label-text-alt">{{ settings.barGap }}px</span>
              </label>
            </div>

            <div class="form-control">
              <label class="label">
                <span class="label-text">高度倍数</span>
              </label>
              <input 
                type="range" 
                min="1" 
                max="5" 
                step="0.5"
                v-model.number="settings.barHeightMultiplier"
                class="range range-primary"
              />
              <label class="label">
                <span class="label-text-alt">{{ settings.barHeightMultiplier }}x</span>
              </label>
            </div>

            <div class="form-control">
              <label class="label">
                <span class="label-text">平滑度</span>
              </label>
              <input 
                type="range" 
                min="0.5" 
                max="0.95" 
                step="0.05"
                v-model.number="settings.smoothing"
                class="range range-primary"
              />
              <label class="label">
                <span class="label-text-alt">{{ settings.smoothing }}</span>
              </label>
            </div>

            <div class="form-control">
              <label class="label">
                <span class="label-text">FFT 尺寸</span>
              </label>
              <select v-model.number="settings.fftSize" class="select select-bordered w-full">
                <option :value="512">512 (低精度)</option>
                <option :value="1024">1024 (中精度)</option>
                <option :value="2048">2048 (高精度)</option>
                <option :value="4096">4096 (超高精度)</option>
              </select>
              <label class="label">
                <span class="label-text-alt">值越大越精细</span>
              </label>
            </div>

            <div class="form-control">
              <label class="label">
                <span class="label-text">声波颜色</span>
              </label>
              <input 
                type="color" 
                v-model="settings.barColor"
                class="w-full h-12 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- 使用说明 -->
      <div class="mt-8 p-6 bg-base-100 rounded-lg shadow">
        <h3 class="text-xl font-bold mb-4">💡 高级特性</h3>
        <ul class="list-disc list-inside space-y-2 text-base-content/70">
          <li><strong>高精度 FFT:</strong> 使用 2048 点快速傅里叶变换，提供细腻的频谱分析</li>
          <li><strong>对数频率分布:</strong> 模拟人耳听觉特性，低频细节更丰富</li>
          <li><strong>平滑插值算法:</strong> 帧间平滑过渡，消除抖动，动画更流畅</li>
          <li><strong>动态颜色系统:</strong> 基于 HSL 色彩空间，颜色随频率和振幅变化</li>
          <li><strong>粒子光效:</strong> 声波条顶部带发光粒子效果</li>
          <li><strong>中心脉冲:</strong> 根据音频平均能量产生节奏脉冲</li>
          <li><strong>高分辨率支持:</strong> 自动适配 Retina 等高清屏幕</li>
          <li><strong>渐变背景:</strong> 径向渐变增强视觉层次感</li>
        </ul>
      </div>

      <!-- 使用说明 -->
      <div class="mt-8 p-6 bg-base-100 rounded-lg shadow">
        <h3 class="text-xl font-bold mb-4">💡 使用说明</h3>
        <ul class="list-disc list-inside space-y-2 text-base-content/70">
          <li>点击 "播放" 按钮开始播放音乐并显示可视化效果</li>
          <li>首次播放需要用户交互才能启动音频上下文</li>
          <li>可以通过滑块调整声波的宽度、间距和高度</li>
          <li>可以自定义声波的颜色</li>
          <li>点击 "切换歌曲" 可以更换不同的音频</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import AudioVisualizer from "@/components/visualMusic/AudioVisualizer.vue";

const visualizerRef = ref(null);
const isPlaying = ref(false);
const currentTrackIndex = ref(0);

// 示例音频 URL（使用代理绕过 CORS）
const audioTracks = [
  '/api/audio/audio/%E7%88%B1%E7%90%B4%E6%B5%B7.MP3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'
];

const currentAudio = ref(audioTracks[0]);

const settings = reactive({
  barWidth: 2,
  barGap: 1,
  barHeightMultiplier: 3,
  barColor: '#6366f1',
  smoothing: 0.8,
  fftSize: 2048
});

const togglePlay = () => {
  if (visualizerRef.value) {
    visualizerRef.value.togglePlay();
    isPlaying.value = !isPlaying.value;
  }
};

const changeTrack = () => {
  currentTrackIndex.value = (currentTrackIndex.value + 1) % audioTracks.length;
  currentAudio.value = audioTracks[currentTrackIndex.value];
  isPlaying.value = false;

  // 自动播放新曲目
  setTimeout(() => {
    if (visualizerRef.value) {
      visualizerRef.value.play();
      isPlaying.value = true;
    }
  }, 100);
};
</script>

<style scoped></style>
