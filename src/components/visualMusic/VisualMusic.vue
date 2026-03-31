<template>
  <div class="visual-music-container">
    <canvas ref="canvasRef" class="visual-canvas"></canvas>
    <!-- 添加 controls 属性让音频播放器可见，或者保持隐藏用 JS 控制 -->
    <audio ref="audioRef" :src="audioUrl" class="visual-audio"></audio>
    <button @click="togglePlay" class="btn btn-primary">
      {{ isPlaying ? "暂停" : "播放" }}
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const audioUrl = ref("/api/audio/audio/%E7%88%B1%E7%90%B4%E6%B5%B7.MP3");
const canvasRef = ref(null);
const audioRef = ref(null);
const isPlaying = ref(false); // 添加播放状态
let isInit = ref(false);
let ctx = null;
let analyser = null;
let dataArray = null;

// 切换播放/暂停
function togglePlay() {
  if (!audioRef.value) return;
  
  if (isPlaying.value) {
    audioRef.value.pause();
  } else {
    audioRef.value.play();
  }
}

onMounted(() => {
  initCtx();

  audioRef.value.addEventListener("play", () => {
    if (isInit.value) return;
    // 初始化
    const audioCtx = new AudioContext(); //创建音频上下文
    const source = audioCtx.createMediaElementSource(audioRef.value); //创建音频源节点
    console.log(123, source);
    analyser = audioCtx.createAnalyser(); //创建音频分析节点
    analyser.fftSize = 512;
    //创建数组，用于接收分析器节点的分析数据
    dataArray = new Uint8Array(analyser.frequencyBinCount);
    source.connect(analyser);
    analyser.connect(audioCtx.destination);
    isInit.value = true;
  });

  // 监听播放状态变化
  audioRef.value.addEventListener("play", () => {
    isPlaying.value = true;
  });

  audioRef.value.addEventListener("pause", () => {
    isPlaying.value = false;
  });

  function draw() {
    requestAnimationFrame(draw);
    //清空画布
    if (!ctx) return;
    ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height);
    if (!isInit.value || !analyser || !dataArray) return;
    //获取分析数据，传入数组
    analyser.getByteFrequencyData(dataArray);
    // console.log(dataArray);
    //绘制
    const barWidth = canvasRef.value.width / dataArray.length;
    const len = dataArray.length;
    ctx.fillStyle = "#6366f1";
    for (let i = 0; i < len; i++) {
      const data = dataArray[i]; //<256
      const barHeight = (data / 255) * canvasRef.value.height;
      const barX = i * barWidth;
      const barY = canvasRef.value.height - barHeight + 200;
      ctx.fillRect(barX + 300, barY, barWidth - 2, barHeight);
    }
  }
  draw();
});

// 初始化 canvas
function initCtx() {
  const canvas = canvasRef.value;
  if (!canvas) return;
  ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth * devicePixelRatio;
  canvas.height = (window.innerHeight / 2) * devicePixelRatio;
}
</script>

<style scoped>
.visual-music-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.visual-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: none;
  border-radius: 0;
  background-color: transparent;
  pointer-events: none; /* 让点击事件可以穿透到下层 */
}

.visual-audio {
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 600px;
}
</style>
