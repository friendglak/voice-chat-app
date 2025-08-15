import { defineStore } from "pinia";
import type { User, VoiceMessage, Room } from "~/types";

export const useChatStore = defineStore("chat", {
  state: () => ({
    currentUser: null as User | null,
    messages: [] as VoiceMessage[],
    onlineUsers: [] as User[],
    selectedRoom: "general",
    rooms: [
      {
        id: "general",
        name: "🌍 General Chat",
        description: "Open conversation",
      },
      {
        id: "practice",
        name: "🎯 Practice Room",
        description: "Language practice",
      },
      {
        id: "pronunciation",
        name: "🗣️ Pronunciation",
        description: "Focus on pronunciation",
      },
      { id: "advanced", name: "🚀 Advanced", description: "Advanced topics" },
    ] as Room[],
  }),

  getters: {
    currentRoom: (state): Room | undefined => {
      return state.rooms.find((r) => r.id === state.selectedRoom);
    },

    userMessages: (state): VoiceMessage[] => {
      if (!state.currentUser) return [];
      return state.messages.filter(
        (m) => m.sender.id === state.currentUser!.id
      );
    },

    userStats: (state) => {
      if (!state.currentUser)
        return { messageCount: 0, totalDuration: 0, averageDuration: 0 };
      const messages = state.messages.filter(
        (m) => m.sender.id === state.currentUser!.id
      );
      const totalDuration = messages.reduce(
        (acc: number, m: VoiceMessage) => acc + m.duration,
        0
      );

      return {
        messageCount: messages.length,
        totalDuration,
        averageDuration:
          messages.length > 0 ? Math.round(totalDuration / messages.length) : 0,
      };
    },
  },

  actions: {
    login(nickname: string) {
      this.currentUser = {
        id: Date.now().toString(),
        nickname,
        joinedAt: Date.now(),
      };

      // Save to localStorage
      localStorage.setItem("voiceChat_user", JSON.stringify(this.currentUser));
      localStorage.setItem("voiceChat_room", this.selectedRoom);

      this.loadStoredMessages();
    },

    logout() {
      this.currentUser = null;
      this.messages = [];
      this.onlineUsers = [];

      localStorage.removeItem("voiceChat_user");
      localStorage.removeItem("voiceChat_room");
    },

    addMessage(message: VoiceMessage) {
      this.messages.push(message);
      this.saveMessagesToStorage();
    },

    changeRoom(roomId: string) {
      this.selectedRoom = roomId;
      this.messages = [];
      localStorage.setItem("voiceChat_room", roomId);
      this.loadStoredMessages();
    },

    addOnlineUser(user: User) {
      if (!this.onlineUsers.find((u) => u.id === user.id)) {
        this.onlineUsers.push(user);
      }
    },

    removeOnlineUser(userId: string) {
      const index = this.onlineUsers.findIndex((u) => u.id === userId);
      if (index > -1) {
        this.onlineUsers.splice(index, 1);
      }
    },

    saveMessagesToStorage() {
      const storageKey = `voiceChat_messages_${this.selectedRoom}`;
      const messagesToStore = this.messages.slice(-50); // Keep last 50 messages

      // Convert to storable format (without blob URLs)
      const storableMessages = messagesToStore.map((m) => ({
        ...m,
        audioUrl: null, // Don't store blob URLs
      }));

      localStorage.setItem(storageKey, JSON.stringify(storableMessages));
    },

    loadStoredMessages() {
      const storageKey = `voiceChat_messages_${this.selectedRoom}`;
      const stored = localStorage.getItem(storageKey);

      if (stored) {
        try {
          this.messages = JSON.parse(stored);
        } catch (e) {
          console.error("Failed to load messages:", e);
          this.messages = [];
        }
      }
    },

    clearMessages() {
      this.messages = [];
      localStorage.removeItem(`voiceChat_messages_${this.selectedRoom}`);
    },
  },
});
