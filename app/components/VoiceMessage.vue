<template>
  <div
    :class="[
      'voice-message p-4 rounded-xl transition-all',
      isOwnMessage
        ? 'bg-gradient-to-r from-indigo-50 to-purple-50 ml-auto'
        : 'bg-white',
      'max-w-[80%]',
    ]"
  >
    <div class="flex items-start space-x-3">
      <div
        class="w-10 h-10 rounded-full gradient-primary flex items-center justify-center flex-shrink-0"
      >
        <span class="text-white text-sm font-bold">
          {{ message.sender.nickname.charAt(0).toUpperCase() }}
        </span>
      </div>

      <div class="flex-1">
        <div class="flex items-center space-x-2 mb-2">
          <span class="font-medium text-gray-900">{{
            message.sender.nickname
          }}</span>
          <span class="text-xs text-gray-500">{{
            formatTime(message.timestamp)
          }}</span>
          <span
            v-if="message.duration"
            class="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full"
          >
            {{ formatDuration(message.duration) }}
          </span>
        </div>

        <!-- Audio Player -->
        <div class="bg-white/50 rounded-lg p-3">
          <div class="flex items-center space-x-3">
            <button
              @click="handleTogglePlayback"
              class="w-10 h-10 rounded-full gradient-primary text-white flex items-center justify-center hover:opacity-90 transition"
            >
              <i
                :class="[
                  message.isPlaying ? 'fas fa-pause' : 'fas fa-play',
                  'text-sm',
                ]"
              ></i>
            </button>

            <!-- Waveform Visualization -->
            <div class="flex-1">
              <div
                v-if="message.isPlaying && message.waveform"
                class="waveform"
              >
                <div
                  v-for="(amplitude, index) in message.waveform"
                  :key="index"
                  class="waveform-bar"
                  :class="{ active: message.isPlaying }"
                  :style="{ height: `${amplitude * 100}%` }"
                ></div>
              </div>
              <div v-else class="h-10 flex items-center">
                <div class="w-full h-1 bg-gray-200 rounded-full">
                  <div
                    class="h-1 gradient-primary rounded-full transition-all"
                    :style="`width: ${message.progress || 0}%`"
                  ></div>
                </div>
              </div>
            </div>

            <!-- Speed Controls -->
            <div class="flex items-center space-x-1">
              <button
                v-for="speed in speeds"
                :key="speed"
                @click="handleSetSpeed(speed)"
                :class="[
                  'px-2 py-1 rounded text-xs font-medium transition',
                  message.playbackSpeed === speed
                    ? 'gradient-primary text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
                ]"
              >
                {{ speed }}x
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { VoiceMessage, PlaybackSpeed } from "~/types";

const props = defineProps<{
  message: VoiceMessage;
  currentUserId?: string;
}>();

const emit = defineEmits<{
  togglePlayback: [message: VoiceMessage];
  setSpeed: [message: VoiceMessage, speed: PlaybackSpeed];
}>();

const speeds: PlaybackSpeed[] = [1, 1.5, 2];

const isOwnMessage = computed(
  () => props.currentUserId && props.message.sender.id === props.currentUserId
);

const handleTogglePlayback = () => {
  emit("togglePlayback", props.message);
};

const handleSetSpeed = (speed: PlaybackSpeed) => {
  emit("setSpeed", props.message, speed);
};

const formatTime = (timestamp: number): string => {
  return new Date(timestamp).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};
</script>
