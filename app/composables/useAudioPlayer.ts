import { onUnmounted } from "vue";
import type { VoiceMessage, PlaybackSpeed } from "~/types";

export const useAudioPlayer = () => {
  const audioElements = new Map<string, HTMLAudioElement>();

  const playAudio = (message: VoiceMessage): void => {
    let audio = audioElements.get(message.id);

    if (!audio && message.audioUrl) {
      audio = new Audio(message.audioUrl);
      audioElements.set(message.id, audio);

      audio.addEventListener("timeupdate", () => {
        if (audio) {
          message.progress = (audio.currentTime / audio.duration) * 100;
        }
      });

      audio.addEventListener("ended", () => {
        message.isPlaying = false;
        message.progress = 0;
      });
    }

    if (audio) {
      audio.playbackRate = message.playbackSpeed;
      audio.play();
      message.isPlaying = true;
    }
  };

  const pauseAudio = (message: VoiceMessage): void => {
    const audio = audioElements.get(message.id);
    if (audio) {
      audio.pause();
      message.isPlaying = false;
    }
  };

  const togglePlayback = (message: VoiceMessage): void => {
    if (message.isPlaying) {
      pauseAudio(message);
    } else {
      // Pause all other messages
      audioElements.forEach((audio, id) => {
        if (id !== message.id) {
          audio.pause();
        }
      });
      playAudio(message);
    }
  };

  const setPlaybackSpeed = (
    message: VoiceMessage,
    speed: PlaybackSpeed
  ): void => {
    message.playbackSpeed = speed;
    const audio = audioElements.get(message.id);
    if (audio) {
      audio.playbackRate = speed;
    }
  };

  const cleanup = (): void => {
    audioElements.forEach((audio) => {
      audio.pause();
      audio.src = "";
    });
    audioElements.clear();
  };

  onUnmounted(() => {
    cleanup();
  });

  return {
    togglePlayback,
    setPlaybackSpeed,
    pauseAudio,
    cleanup,
  };
};
