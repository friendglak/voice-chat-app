import { ref, computed, onUnmounted, readonly } from "vue";
import { useChatStore } from "~/stores/chat";
import { useBroadcastChannel } from "~/composables/useBroadcastChannel";
import type { VoiceMessage } from "~/types";

export const useChat = () => {
  const chatStore = useChatStore();
  const isLoggedIn = ref(false);
  const broadcastChannelRef = ref<ReturnType<
    typeof useBroadcastChannel
  > | null>(null);

  const currentUser = computed(() => chatStore.currentUser);
  const messages = computed(() => chatStore.messages);
  const onlineUsers = computed(() => chatStore.onlineUsers);
  const selectedRoom = computed(() => chatStore.selectedRoom);
  const rooms = computed(() => chatStore.rooms);
  const currentRoom = computed(() => chatStore.currentRoom);
  const userStats = computed(() => chatStore.userStats);

  const handleLogin = (nickname: string, room: string) => {
    chatStore.selectedRoom = room;
    chatStore.login(nickname);
    isLoggedIn.value = true;
    initializeChat();
  };

  const handleLogout = () => {
    if (currentUser.value && broadcastChannelRef.value) {
      broadcastChannelRef.value.announceUserLeft(currentUser.value.id);
    }
    chatStore.logout();
    isLoggedIn.value = false;
    if (broadcastChannelRef.value) {
      broadcastChannelRef.value.close();
    }
  };

  const initializeChat = () => {
    if (!currentUser.value) return;

    const channelName = `voiceChat_${chatStore.selectedRoom}`;

    const channel = useBroadcastChannel(channelName);
    broadcastChannelRef.value = channel;

    channel.initialize((data) => {
      if (data.type === "message" && data.payload) {
        const message = data.payload;
        if (message.sender.id !== currentUser.value?.id) {
          // Reconstruir el mensaje con la estructura completa
          const reconstructedMessage: VoiceMessage = {
            id: message.id,
            sender: message.sender,
            audioUrl: undefined, // Los mensajes recibidos no tienen audio
            audioBlob: undefined,
            duration: message.duration,
            timestamp: message.timestamp,
            isPlaying: false,
            playbackSpeed: 1,
            progress: 0,
            waveform: message.waveform,
          };
          chatStore.addMessage(reconstructedMessage);
        }
      } else if (data.type === "user_joined" && data.user) {
        if (data.user.id !== currentUser.value?.id) {
          chatStore.addOnlineUser(data.user);
        }
      } else if (data.type === "user_left" && data.userId) {
        chatStore.removeOnlineUser(data.userId);
      }
    });

    channel.announceUserJoined(currentUser.value);

    chatStore.loadStoredMessages();
  };

  const handleRoomChange = (roomId: string) => {
    if (currentUser.value && broadcastChannelRef.value) {
      broadcastChannelRef.value.announceUserLeft(currentUser.value.id);
    }
    if (broadcastChannelRef.value) {
      broadcastChannelRef.value.close();
    }

    chatStore.changeRoom(roomId);

    initializeChat();
  };

  const addMessage = (message: VoiceMessage) => {
    chatStore.addMessage(message);

    if (broadcastChannelRef.value) {
      // Crear una copia del mensaje sin datos no serializables
      const messageToSend = {
        id: message.id,
        sender: {
          id: message.sender.id,
          nickname: message.sender.nickname,
          joinedAt: message.sender.joinedAt,
        },
        duration: message.duration,
        timestamp: message.timestamp,
        isPlaying: message.isPlaying,
        playbackSpeed: message.playbackSpeed,
        progress: message.progress,
        waveform: message.waveform,
        // No incluir audioBlob ni audioUrl
      };
      
      broadcastChannelRef.value.sendMessage(messageToSend);
    }
  };

  const getBroadcastChannel = () => broadcastChannelRef.value;

  const clearMessages = () => {
    if (confirm("Are you sure you want to clear all messages in this room?")) {
      chatStore.clearMessages();
    }
  };

  const scrollToBottom = (messagesContainer: HTMLElement | undefined) => {
    if (messagesContainer) {
      setTimeout(() => {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }, 50);
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

  onUnmounted(() => {
    if (currentUser.value && broadcastChannelRef.value) {
      broadcastChannelRef.value.announceUserLeft(currentUser.value.id);
    }
    if (broadcastChannelRef.value) {
      broadcastChannelRef.value.close();
    }
  });

  return {
    isLoggedIn: readonly(isLoggedIn),

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
    formatTotalDuration,
    getRandomStatus,
    getBroadcastChannel,
  };
};
