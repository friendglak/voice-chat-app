<template>
  <div>
    <div
      class="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 overflow-hidden"
    >
      <LoginScreen v-if="!isLoggedIn" @login="onLogin" />
      <div v-else class="min-h-screen flex flex-col overflow-hidden">
        <!-- Header -->
        <header
          class="bg-black/25 backdrop-blur-md border border-white/20 shadow-lg text-white flex-shrink-0"
        >
          <div class="max-w-6xl mx-auto px-4 py-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-4">
                <div
                  class="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center"
                >
                  <i class="fas fa-microphone-alt"></i>
                </div>
                <div>
                  <h1 class="text-lg font-bold">Voice Chat</h1>
                  <p class="text-xs text-gray-300">{{ currentRoom?.name }}</p>
                </div>
              </div>

              <div class="flex items-center space-x-4">
                <div class="flex items-center space-x-2">
                  <div
                    class="w-2 h-2 bg-green-500 rounded-full animate-pulse"
                  ></div>
                  <span class="text-sm">{{ onlineUsers.length }} online</span>
                </div>

                <button
                  @click="handleLogout"
                  class="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition"
                >
                  <i class="fas fa-sign-out-alt mr-2"></i>Logout
                </button>
              </div>
            </div>
          </div>
        </header>

        <!-- Main Content -->
        <div
          class="flex-1 max-w-6xl mx-auto w-full px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden"
        >
          <!-- Chat Section -->
          <div class="lg:col-span-2 min-h-0">
            <div
              class="bg-white/25 backdrop-blur-md border border-white/20 shadow-lg rounded-2xl h-full max-h-[calc(100vh-200px)] flex flex-col overflow-hidden"
            >
              <!-- Chat Header -->
              <div class="p-4 border-b border-gray-100 flex-shrink-0">
                <div class="flex items-center justify-between">
                  <h2 class="text-lg font-semibold text-gray-900">
                    <i class="fas fa-comments mr-2 text-indigo-600"></i>
                    Voice Messages
                  </h2>
                  <select
                    :value="selectedRoom"
                    @change="onRoomChange($event)"
                    class="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option
                      v-for="room in rooms"
                      :key="room.id"
                      :value="room.id"
                    >
                      {{ room.name }}
                    </option>
                  </select>
                </div>
              </div>

              <!-- Messages Container -->
              <div
                ref="messagesContainer"
                class="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar min-h-0"
              >
                <TransitionGroup name="message-list">
                  <VoiceMessage
                    v-for="message in messages"
                    :key="message.id"
                    :message="message"
                    :current-user-id="currentUser?.id"
                    @toggle-playback="togglePlayback"
                    @set-speed="setPlaybackSpeed"
                  />
                </TransitionGroup>

                <!-- Empty State -->
                <div
                  v-if="messages.length === 0"
                  class="flex flex-col items-center justify-center h-full text-gray-400"
                >
                  <i
                    class="fas fa-microphone-slash text-6xl mb-4 opacity-50"
                  ></i>
                  <p class="text-lg font-medium">No messages yet</p>
                  <p class="text-sm">
                    Start recording to begin the conversation
                  </p>
                </div>
              </div>

              <!-- Record Button -->
              <div class="p-4 border-t border-gray-100 flex-shrink-0">
                <RecordButton
                  :is-recording="isRecording"
                  :recording-time="recordingTime"
                  :permission-error="permissionError"
                  :has-messages="messages.length > 0"
                  @start-recording="startRecording"
                  @stop-recording="onStopRecording"
                  @clear="onClearMessages"
                />
              </div>
            </div>
          </div>

          <!-- Sidebar -->
          <div
            class="space-y-6 min-h-0 overflow-y-auto max-h-[calc(100vh-200px)]"
          >
            <!-- Stats Card -->
            <div
              class="bg-white/25 backdrop-blur-md border border-white/20 shadow-lg rounded-xl p-6"
            >
              <h3 class="text-lg font-semibold text-gray-900 mb-4">
                <i class="fas fa-chart-bar mr-2 text-indigo-600"></i>Your Stats
              </h3>
              <div class="space-y-3">
                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-600">Messages Sent</span>
                  <span
                    class="text-sm font-semibold text-gray-900 bg-indigo-50 px-2 py-1 rounded"
                  >
                    {{ userStats.messageCount }}
                  </span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-600">Total Duration</span>
                  <span
                    class="text-sm font-semibold text-gray-900 bg-purple-50 px-2 py-1 rounded"
                  >
                    {{ userStats.averageDuration }}s
                  </span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-600">Avg Duration</span>
                  <span
                    class="text-sm font-semibold text-gray-900 bg-green-50 px-2 py-1 rounded"
                  >
                    {{ userStats.averageDuration }}s
                  </span>
                </div>

                <!-- Progress Bar -->
                <div class="mt-4 pt-4 border-t border-gray-100">
                  <div class="flex justify-between text-xs text-gray-500 mb-2">
                    <span>Daily Goal</span>
                    <span
                      >{{ Math.min(userStats.messageCount * 20, 100) }}%</span
                    >
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-2">
                    <div
                      class="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                      :style="`width: ${Math.min(userStats.messageCount * 20, 100)}%`"
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Online Users -->
            <div
              class="bg-white/25 backdrop-blur-md border border-white/20 shadow-lg rounded-xl p-6"
            >
              <h3 class="text-lg font-semibold text-gray-900 mb-4">
                <i class="fas fa-users mr-2 text-green-600"></i>Online Users
                <span
                  class="ml-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full"
                >
                  {{ onlineUsers.length }}
                </span>
              </h3>
              <div class="space-y-2 max-h-48 overflow-y-auto">
                <TransitionGroup name="user-list">
                  <div
                    v-for="user in onlineUsers"
                    :key="user.id"
                    class="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition cursor-pointer"
                  >
                    <div class="relative">
                      <div
                        class="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center"
                      >
                        <span class="text-white text-xs font-bold">
                          {{ user.nickname.charAt(0).toUpperCase() }}
                        </span>
                      </div>
                      <div
                        class="absolute -bottom-0 -right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white animate-pulse"
                      ></div>
                    </div>
                    <div class="flex-1">
                      <p class="text-sm font-medium text-gray-900">
                        {{ user.nickname }}
                        <span
                          v-if="user.id === currentUser?.id"
                          class="text-xs text-indigo-600 ml-1"
                          >(You)</span
                        >
                      </p>
                      <p class="text-xs text-gray-500">
                        {{
                          user.id === currentUser?.id
                            ? "Active now"
                            : getRandomStatus()
                        }}
                      </p>
                    </div>
                  </div>
                </TransitionGroup>
              </div>
            </div>

            <!-- Tips Card -->
            <div
              class="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6"
            >
              <h3 class="text-lg font-semibold text-gray-900 mb-4">
                <i class="fas fa-lightbulb mr-2 text-amber-600"></i>Quick Tips
              </h3>
              <ul class="space-y-2 text-sm text-gray-600">
                <li class="flex items-start">
                  <i
                    class="fas fa-check-circle text-green-500 mr-2 mt-0.5 flex-shrink-0"
                  ></i>
                  <span>Hold the button to record up to 30 seconds</span>
                </li>
                <li class="flex items-start">
                  <i
                    class="fas fa-check-circle text-green-500 mr-2 mt-0.5 flex-shrink-0"
                  ></i>
                  <span>Use speed controls for better comprehension</span>
                </li>
                <li class="flex items-start">
                  <i
                    class="fas fa-check-circle text-green-500 mr-2 mt-0.5 flex-shrink-0"
                  ></i>
                  <span>Speak clearly and naturally</span>
                </li>
                <li class="flex items-start">
                  <i
                    class="fas fa-check-circle text-green-500 mr-2 mt-0.5 flex-shrink-0"
                  ></i>
                  <span>Messages are saved locally for practice</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from "vue";
import { useChat } from "~/composables/useChat";
import { useSimulation } from "~/composables/useSimulation";
import { useRecordingHandler } from "~/composables/useRecordingHandler";
import { useAudioPlayer } from "~/composables/useAudioPlayer";

const messagesContainer = ref<HTMLElement>();

const {
  isLoggedIn,
  currentUser,
  messages,
  onlineUsers,
  selectedRoom,
  rooms,
  currentRoom,
  userStats,
  handleLogin,
  handleLogout,
  handleRoomChange,
  addMessage,
  clearMessages,
  scrollToBottom,
  getRandomStatus,
} = useChat();

const { simulateOnlineUsers, simulateBotResponse } = useSimulation();

const {
  isRecording,
  recordingTime,
  permissionError,
  startRecording,
  handleStopRecording,
} = useRecordingHandler();

const { togglePlayback, setPlaybackSpeed } = useAudioPlayer();

const onLogin = (nickname: string, room: string) => {
  handleLogin(nickname, room);
  if (currentUser.value) {
    simulateOnlineUsers(currentUser.value.id);
  }
};

const onStopRecording = async () => {
  await handleStopRecording(
    currentUser.value,
    addMessage,
    simulateBotResponse,
    scrollToBottom,
    messagesContainer.value
  );
};

const onRoomChange = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  const roomId = target.value;
  handleRoomChange(roomId);

  if (currentUser.value) {
    simulateOnlineUsers(currentUser.value.id);
  }
};

const onClearMessages = () => {
  clearMessages();
};

watch(
  () => messages.value.length,
  () => {
    nextTick(() => {
      scrollToBottom(messagesContainer.value);
    });
  }
);
</script>
