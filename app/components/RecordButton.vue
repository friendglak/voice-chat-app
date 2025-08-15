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
          'flex-1 py-4 rounded-xl font-medium transition-all',
          isRecording
            ? 'bg-red-500 text-white recording-pulse relative'
            : 'gradient-primary text-white hover:shadow-xl',
        ]"
      >
        <i
          :class="[isRecording ? 'fas fa-stop' : 'fas fa-microphone', 'mr-2']"
        ></i>
        {{ isRecording ? `Recording... ${recordingTime}s` : "Hold to Record" }}
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
  emit("startRecording");
};

const handleStopRecording = () => {
  emit("stopRecording");
};
</script>
