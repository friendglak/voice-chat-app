<template>
  <div class="p-4 border-t border-gray-100 bg-gray-50/50">
    <div class="flex items-center space-x-4">
      <button
        @mousedown="handleStartRecording"
        @mouseup="handleStopRecording"
        @mouseleave="handleStopRecording"
        @touchstart="handleStartRecording"
        @touchend="handleStopRecording"
        :class="[
          'flex-1 py-4 rounded-xl font-medium transition-all relative overflow-hidden',
          isRecording
            ? 'bg-red-500 text-white recording-pulse'
            : 'gradient-primary text-white hover:shadow-xl',
        ]"
      >
        <!-- Recording indicator -->
        <div
          v-if="isRecording"
          class="absolute inset-0 bg-red-600 animate-pulse"
        ></div>
        
        <div class="relative z-10 flex items-center justify-center">
          <i
            :class="[
              isRecording ? 'fas fa-stop' : 'fas fa-microphone',
              'mr-2 text-lg'
            ]"
          ></i>
          <span class="font-medium">
            {{ isRecording ? `Recording... ${recordingTime}s` : "Hold to Record" }}
          </span>
        </div>
      </button>

      <button
        v-if="hasMessages"
        @click="$emit('clear')"
        class="p-4 bg-white rounded-xl text-gray-500 hover:text-red-500 hover:bg-red-50 transition"
      >
        <i class="fas fa-trash"></i>
      </button>
    </div>

    <!-- Recording Status -->
    <div
      v-if="isRecording"
      class="mt-3 flex items-center justify-center space-x-2"
    >
      <div class="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
      <span class="text-sm text-gray-600">Recording in progress...</span>
      <span class="text-sm font-medium text-gray-900">Max: 30s</span>
    </div>

    <!-- Permission Error -->
    <div
      v-if="permissionError"
      class="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg"
    >
      <p class="text-sm text-red-600">
        <i class="fas fa-exclamation-circle mr-1"></i>
        {{ permissionError }}
      </p>
    </div>

    <!-- Recording Instructions -->
    <div v-if="!isRecording && !permissionError" class="mt-3 text-center">
      <p class="text-xs text-gray-500">
        <i class="fas fa-info-circle mr-1"></i>
        Press and hold the button to record your message
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  isRecording: boolean;
  recordingTime: number;
  permissionError: string;
  hasMessages: boolean;
}>();

const emit = defineEmits<{
  startRecording: [];
  stopRecording: [];
  clear: [];
}>();

const handleStartRecording = () => {
  console.log("🎤 RecordButton: Start recording triggered");
  emit("startRecording");
};

const handleStopRecording = () => {
  console.log("🛑 RecordButton: Stop recording triggered");
  emit("stopRecording");
};
</script>

<style scoped>
.recording-pulse {
  animation: recording-pulse 2s infinite;
}

@keyframes recording-pulse {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
  }
  50% {
    box-shadow: 0 0 0 10px rgba(239, 68, 68, 0);
  }
}

.gradient-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
</style>
