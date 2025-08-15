import { ref, onUnmounted } from "vue";
import type { User, VoiceMessage } from "~/types";

interface BroadcastMessage {
  type: "message" | "user_joined" | "user_left" | "typing";
  payload?: any;
  user?: User;
  userId?: string;
}

export const useBroadcastChannel = (channelName: string) => {
  const channel = ref<BroadcastChannel | null>(null);
  const isConnected = ref(false);

  const initialize = (onMessage: (data: BroadcastMessage) => void): void => {
    if (channel.value) {
      channel.value.close();
    }

    channel.value = new BroadcastChannel(channelName);
    isConnected.value = true;

    channel.value.onmessage = (event) => {
      onMessage(event.data);
    };
  };

  const sendMessage = (message: VoiceMessage): void => {
    if (channel.value) {
      channel.value.postMessage({
        type: "message",
        payload: message,
      });
    }
  };

  const announceUserJoined = (user: User): void => {
    if (channel.value) {
      channel.value.postMessage({
        type: "user_joined",
        user,
      });
    }
  };

  const announceUserLeft = (userId: string): void => {
    if (channel.value) {
      channel.value.postMessage({
        type: "user_left",
        userId,
      });
    }
  };

  const close = (): void => {
    if (channel.value) {
      channel.value.close();
      channel.value = null;
      isConnected.value = false;
    }
  };

  onUnmounted(() => {
    close();
  });

  return {
    isConnected: readonly(isConnected),
    initialize,
    sendMessage,
    announceUserJoined,
    announceUserLeft,
    close,
  };
};
