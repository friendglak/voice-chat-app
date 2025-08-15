<template>
  <div class="min-h-screen flex items-center justify-center p-4">
    <div class="bg-white rounded-3xl p-8 w-[500px] animate-slide-up">
      <div class="text-center mb-8">
        <div
          class="w-24 h-24 gradient-primary rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-2xl"
        >
          <i class="fas fa-microphone-alt text-white text-4xl"></i>
        </div>
        <h1 class="text-3xl font-bold text-gray-800 mb-2">Voice Chat</h1>
        <p class="text-gray-600">Connect through voice messages</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label
            for="nickname"
            class="block text-sm font-semibold text-gray-700 mb-2"
          >
            <i class="fas fa-user mr-2"></i>Choose your nickname
          </label>
          <input
            id="nickname"
            v-model="nickname"
            type="text"
            class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none transition-all"
            placeholder="Enter nickname..."
            maxlength="20"
            required
          />
          <p class="text-xs text-gray-500 mt-1">
            {{ nickname.length }}/20 characters
          </p>
        </div>

        <fieldset>
          <legend class="block text-sm font-semibold text-gray-700 mb-2">
            <i class="fas fa-door-open mr-2"></i>Select chat room
          </legend>
          <div class="grid grid-cols-2 gap-3">
            <button
              v-for="room in rooms"
              :key="room.id"
              type="button"
              @click="selectedRoom = room.id"
              :class="[
                'p-3 rounded-xl border-2 transition-all text-left',
                selectedRoom === room.id
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 hover:border-gray-300',
              ]"
            >
              <div class="text-sm font-medium">{{ room.name }}</div>
              <div class="text-xs text-gray-500">{{ room.description }}</div>
            </button>
          </div>
        </fieldset>

        <button
          type="submit"
          class="w-full py-4 gradient-primary text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
          :disabled="!nickname.trim()"
        >
          <i class="fas fa-sign-in-alt mr-2"></i>
          Join Voice Chat
        </button>
      </form>

      <div
        class="mt-6 flex items-center justify-center space-x-4 text-xs text-gray-500"
      >
        <span><i class="fas fa-lock mr-1"></i>Secure</span>
        <span>•</span>
        <span><i class="fas fa-microphone mr-1"></i>Voice-based</span>
        <span>•</span>
        <span><i class="fas fa-bolt mr-1"></i>Real-time</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useChatStore } from "~/stores/chat";

const emit = defineEmits<{
  login: [nickname: string, room: string];
}>();

const chatStore = useChatStore();
const nickname = ref("");
const selectedRoom = ref("general");
const rooms = chatStore.rooms;

const handleLogin = () => {
  if (nickname.value.trim()) {
    chatStore.selectedRoom = selectedRoom.value;
    emit("login", nickname.value.trim(), selectedRoom.value);
  }
};
</script>
