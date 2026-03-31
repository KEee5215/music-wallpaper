<template>
  <div class="w-full h-full flex items-center justify-center bg-base-300 rounded-xl overflow-hidden relative">
    <canvas ref="canvasRef" class="w-full h-full"></canvas>
    <!-- 加载状态 -->
    <div v-if="isLoading" class="absolute inset-0 flex items-center justify-center bg-black/50">
      <div class="loading loading-spinner loading-lg text-primary"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  audioUrl: {
    type: String,
    default: ''
  },
  barWidth: {
    type: Number,
    default: 2
  },
  barGap: {
    type: Number,
    default: 1
  },
  barColor: {
    type: String,
    default: '#6366f1'
  },
  barHeightMultiplier: {
    type: Number,
    default: 3
  },
  smoothing: {
    type: Number,
    default: 0.8
  },
  fftSize: {
    type: Number,
    default: 2048
  }
});

const canvasRef = ref(null);
const isLoading = ref(false);
let audioContext = null;
let analyser = null;
let source = null;
let animationId = null;
let audio = null;
let previousDataArray = null;

// 初始化音频上下文
const initAudioContext = () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioContext.createAnalyser();
    analyser.fftSize = props.fftSize;
    analyser.smoothingTimeConstant = props.smoothing;
  }
};

// 连接音频源
const connectAudioSource = () => {
  if (!audio || !analyser) return;
  
  try {
    source = audioContext.createMediaElementSource(audio);
    source.connect(analyser);
    analyser.connect(audioContext.destination);
  } catch (error) {
    console.error('连接音频源失败:', error);
  }
};

// 创建隐藏的音频元素
const createAudioElement = () => {
  return new Promise((resolve, reject) => {
    isLoading.value = true;
    audio = new Audio(props.audioUrl);
    audio.crossOrigin = 'anonymous';
    audio.loop = true;
    
    audio.addEventListener('canplay', () => {
      isLoading.value = false;
      resolve();
    });
    
    audio.addEventListener('error', (e) => {
      isLoading.value = false;
      console.error('音频加载错误:', e);
      reject(e);
    });
    
    audio.load();
  });
};

// 颜色处理工具函数
const parseColor = (color) => {
  if (color.startsWith('#')) {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    return { r, g, b };
  }
  return { r: 99, g: 102, b: 241 };
};

const hslToRgb = (h, s, l) => {
  let r, g, b;
  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }
  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
};

// 绘制高质量声波
const drawVisualizer = () => {
  if (!canvasRef.value || !analyser) return;

  const canvas = canvasRef.value;
  const ctx = canvas.getContext('2d');
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);
  previousDataArray = new Uint8Array(bufferLength);

  const resizeCanvas = () => {
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
  };
  
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  const draw = () => {
    animationId = requestAnimationFrame(draw);

    analyser.getByteFrequencyData(dataArray);

    const rect = canvas.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const centerX = width / 2;
    const centerY = height / 2;

    ctx.clearRect(0, 0, width, height);

    // 创建渐变背景
    const bgGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, height);
    bgGradient.addColorStop(0, 'rgba(99, 102, 241, 0.05)');
    bgGradient.addColorStop(1, 'transparent');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    const barWidth = props.barWidth;
    const barGap = props.barGap;
    const totalBarWidth = barWidth + barGap;
    const barsCount = Math.floor(width / 2 / totalBarWidth);

    // 对数频率分布
    const getLogIndex = (i, total) => {
      return Math.floor(Math.pow(i / total, 1.5) * bufferLength);
    };

    for (let i = 0; i < barsCount; i++) {
      const dataIndex = getLogIndex(i, barsCount);
      
      // 平滑插值
      const currentValue = dataArray[dataIndex];
      const previousValue = previousDataArray[dataIndex];
      const smoothedValue = previousValue * 0.3 + currentValue * 0.7;
      previousDataArray[dataIndex] = smoothedValue;

      const barHeight = (smoothedValue / 255) * height * props.barHeightMultiplier * 0.4;

      // 动态颜色
      const baseColor = parseColor(props.barColor);
      const hueShift = (i / barsCount) * 60;
      const lightness = 0.5 + (smoothedValue / 255) * 0.3;
      
      const rgb = hslToRgb(
        ((baseColor.r / 255) + hueShift / 360) % 1,
        0.7,
        lightness
      );

      const colorTop = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
      const colorBottom = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.2)`;

      const gradient = ctx.createLinearGradient(0, centerY, 0, centerY - barHeight);
      gradient.addColorStop(0, colorBottom);
      gradient.addColorStop(1, colorTop);

      ctx.fillStyle = gradient;

      const leftX = centerX - (i + 1) * totalBarWidth - barWidth / 2;
      const rightX = centerX + i * totalBarWidth + barWidth / 2;

      // 阴影效果
      ctx.shadowBlur = 15;
      ctx.shadowColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.5)`;

      drawRoundedRect(
        ctx,
        leftX,
        centerY - barHeight / 2,
        barWidth,
        barHeight,
        barWidth / 2
      );

      drawRoundedRect(
        ctx,
        rightX,
        centerY - barHeight / 2,
        barWidth,
        barHeight,
        barWidth / 2
      );

      // 顶部光点
      ctx.beginPath();
      ctx.arc(leftX + barWidth / 2, centerY - barHeight / 2, barWidth / 2, 0, Math.PI * 2);
      ctx.fillStyle = colorTop;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(rightX + barWidth / 2, centerY - barHeight / 2, barWidth / 2, 0, Math.PI * 2);
      ctx.fillStyle = colorTop;
      ctx.fill();
    }

    ctx.shadowBlur = 0;

    // 中心脉冲效果
    const averageFrequency = dataArray.reduce((a, b) => a + b, 0) / bufferLength;
    const pulseRadius = 20 + (averageFrequency / 255) * 30;
    
    const pulseGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, pulseRadius);
    pulseGradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
    pulseGradient.addColorStop(0.5, 'rgba(99, 102, 241, 0.3)');
    pulseGradient.addColorStop(1, 'transparent');
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, pulseRadius, 0, Math.PI * 2);
    ctx.fillStyle = pulseGradient;
    ctx.fill();
  };

  draw();

  onUnmounted(() => {
    window.removeEventListener('resize', resizeCanvas);
  });
};

// 绘制圆角矩形
const drawRoundedRect = (ctx, x, y, width, height, radius) => {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  ctx.fill();
};

// 播放音频
const play = () => {
  if (audio && audioContext && audioContext.state === 'suspended') {
    audioContext.resume();
  }
  if (audio) {
    audio.play().catch(err => {
      console.error('播放失败:', err);
    });
  }
};

// 暂停音频
const pause = () => {
  if (audio) {
    audio.pause();
  }
};

// 切换播放/暂停
const togglePlay = () => {
  if (audio && audio.paused) {
    play();
  } else {
    pause();
  }
};

defineExpose({
  play,
  pause,
  togglePlay
});

onMounted(async () => {
  try {
    initAudioContext();
    
    if (props.audioUrl) {
      await createAudioElement();
      
      const handleUserInteraction = () => {
        if (audioContext && audioContext.state === 'suspended') {
          audioContext.resume();
        }
        if (!source) {
          connectAudioSource();
          drawVisualizer();
        }
        document.removeEventListener('click', handleUserInteraction);
      };
      
      document.addEventListener('click', handleUserInteraction);
      drawVisualizer();
    }
  } catch (error) {
    console.error('音频可视化初始化失败:', error);
    isLoading.value = false;
  }
});

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId);
  }
  if (audio) {
    audio.pause();
    audio.src = '';
  }
  if (audioContext) {
    audioContext.close();
  }
  if (source) {
    source.disconnect();
  }
});
</script>

<style scoped>
canvas {
  display: block;
}
</style>
