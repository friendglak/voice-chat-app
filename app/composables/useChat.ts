import { ref, computed, onUnmounted, readonly } from "vue";
import { useChatStore } from "~/stores/chat";
import { useBroadcastChannel } from "~/composables/useBroadcastChannel";
import type { User, VoiceMessage } from "~/types";

export const useChat = () => {
  const chatStore = useChatStore();
  const isLoggedIn = ref(false);
  const broadcastChannel = ref<ReturnType<typeof useBroadcastChannel> | null>(null);

  // Computed properties
  const currentUser = computed(() => chatStore.currentUser);
  const messages = computed(() => chatStore.messages);
  const onlineUsers = computed(() => chatStore.onlineUsers);
  const selectedRoom = computed(() => chatStore.selectedRoom);
  const rooms = computed(() => chatStore.rooms);
  const currentRoom = computed(() => chatStore.currentRoom);
  const userStats = computed(() => chatStore.userStats);

  // Methods
  const handleLogin = (nickname: string, room: string) => {
    chatStore.selectedRoom = room;
    chatStore.login(nickname);
    isLoggedIn.value = true;
    initializeChat();
  };

  const handleLogout = () => {
    if (currentUser.value && broadcastChannel.value) {
      broadcastChannel.value.announceUserLeft(currentUser.value.id);
    }
    chatStore.logout();
    isLoggedIn.value = false;
    if (broadcastChannel.value) {
      broadcastChannel.value.close();
    }
  };

  const initializeChat = () => {
    if (!currentUser.value) return;

    // Initialize broadcast channel
    const channel = useBroadcastChannel(`voiceChat_${chatStore.selectedRoom}`);
    broadcastChannel.value = channel;

    // Initialize broadcast channel with message handler
    channel.initialize((data) => {
      if (data.type === "message" && data.payload) {
        const message = data.payload;
        if (message.sender.id !== currentUser.value?.id) {
          chatStore.addMessage(message);
        }
      } else if (data.type === "user_joined" && data.user) {
        chatStore.addOnlineUser(data.user);
      } else if (data.type === "user_left" && data.userId) {
        chatStore.removeOnlineUser(data.userId);
      }
    });

    // Announce current user joined
    channel.announceUserJoined(currentUser.value);

    // Load stored messages
    chatStore.loadStoredMessages();
  };

  const handleRoomChange = (roomId: string) => {
    // Leave current room
    if (currentUser.value && broadcastChannel.value) {
      broadcastChannel.value.announceUserLeft(currentUser.value.id);
    }
    if (broadcastChannel.value) {
      broadcastChannel.value.close();
    }

    // Change room
    chatStore.changeRoom(roomId);

    // Reinitialize with new room
    initializeChat();
  };

  const addMessage = (message: VoiceMessage) => {
    chatStore.addMessage(message);
    if (broadcastChannel.value) {
      broadcastChannel.value.sendMessage(message);
    }
  };

  const clearMessages = () => {
    if (confirm("Are you sure you want to clear all messages in this room?")) {
      chatStore.clearMessages();
    }
  };

  const scrollToBottom = (messagesContainer: HTMLElement | undefined) => {
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  };

  const formatTotalDuration = (seconds: number): string => {
    if (seconds < 60) return `${seconds}s`;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getRandomStatus = (): string => {
    const statuses = [
      "Recording",
      "Listening",
      "Active",
      "Practicing",
      "Learning",
    ];
    return statuses[Math.floor(Math.random() * statuses.length)] || "Active";
  };

  // Lifecycle cleanup
  onUnmounted(() => {
    if (currentUser.value && broadcastChannel.value) {
      broadcastChannel.value.announceUserLeft(currentUser.value.id);
    }
    if (broadcastChannel.value) {
      broadcastChannel.value.close();
    }
  });

  return {
    // State
    isLoggedIn: readonly(isLoggedIn),
    
    // Computed
    currentUser,
    messages,
    onlineUsers,
    selectedRoom,
    rooms,
    currentRoom,
    userStats,
    
    // Methods
    handleLogin,
    handleLogout,
    handleRoomChange,
    addMessage,
    clearMessages,
    scrollToBottom,
    formatTotalDuration,
    getRandomStatus,
  };
};
