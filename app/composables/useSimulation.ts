import { useChatStore } from "~/stores/chat";
import type { User, VoiceMessage } from "~/types";

export const useSimulation = () => {
  const chatStore = useChatStore();

  const simulateOnlineUsers = (currentUserId: string) => {
    const mockUsers: User[] = [
      { id: "1", nickname: "Alex Chen", joinedAt: Date.now() },
      { id: "2", nickname: "Maria Garcia", joinedAt: Date.now() },
      { id: "3", nickname: "John Smith", joinedAt: Date.now() },
      { id: "4", nickname: "Sophie Martin", joinedAt: Date.now() },
      { id: "5", nickname: "Carlos Rodriguez", joinedAt: Date.now() },
    ];

    // Reset online users with current user
    chatStore.onlineUsers = [
      { id: currentUserId, nickname: "You", joinedAt: Date.now() },
    ];

    // Add random number of mock users (1-3)
    const randomCount = Math.floor(Math.random() * 3) + 1;
    const shuffled = mockUsers.sort(() => Math.random() - 0.5);
    shuffled.slice(0, randomCount).forEach((user) => {
      chatStore.addOnlineUser(user);
    });
  };

  const simulateBotResponse = (currentUserId: string) => {
    const botNames = [
      "AI Assistant",
      "Language Bot",
      "Practice Partner",
      "Tutor Bot",
    ];
    const botName = botNames[Math.floor(Math.random() * botNames.length)];

    const botUser: User = {
      id: `bot_${Date.now()}`,
      nickname: botName || "AI Assistant",
      joinedAt: Date.now(),
    };

    const message: VoiceMessage = {
      id: Date.now().toString(),
      sender: botUser,
      audioUrl: undefined, // Simulated message without actual audio
      duration: Math.floor(Math.random() * 10) + 5,
      timestamp: Date.now(),
      isPlaying: false,
      playbackSpeed: 1,
      progress: 0,
      waveform: Array(16)
        .fill(0)
        .map(() => Math.random()),
    };

    chatStore.addMessage(message);
  };

  return {
    simulateOnlineUsers,
    simulateBotResponse,
  };
};
