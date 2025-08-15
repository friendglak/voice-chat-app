import { useAudioRecorder } from "~/composables/useAudioRecorder";
import { AUDIO_CONFIG } from "~/config/audio";
import type { VoiceMessage, User } from "~/types";

export const useRecordingHandler = () => {
  const audioRecorder = useAudioRecorder({
    minDuration: AUDIO_CONFIG.recording.minDuration,
    maxDuration: AUDIO_CONFIG.recording.maxDuration,
    minBlobSize: AUDIO_CONFIG.recording.minBlobSize,
  });

  const startRecording = async (): Promise<void> => {
    try {
      await audioRecorder.startRecording();
    } catch (error) {
      console.error("❌ Error starting recording:", error);
    }
  };

  const handleStopRecording = async (
    currentUser: User | null,
    addMessage: (message: VoiceMessage) => void,
    simulateBotResponse: (currentUserId: string) => void,
    scrollToBottom: (container: HTMLElement | undefined) => void,
    messagesContainer: HTMLElement | undefined
  ) => {
    try {
      const result = await audioRecorder.stopRecording();

      if (result && currentUser) {
        const message: VoiceMessage = {
          id: Date.now().toString(),
          sender: currentUser,
          audioUrl: result.url,
          duration: result.duration,
          timestamp: Date.now(),
          isPlaying: false,
          playbackSpeed: AUDIO_CONFIG.playback.defaultSpeed,
          progress: 0,
          waveform: result.waveform,
        };

        addMessage(message);

        setTimeout(
          () => simulateBotResponse(currentUser.id),
          2000 + Math.random() * 3000
        );

        scrollToBottom(messagesContainer);
      } else if (!result) {
        console.log("❌ Recording completed but no valid audio data");
      }
    } catch (error) {
      console.error("❌ Error stopping recording:", error);
      if (error instanceof Error) {
        console.log("🔍 Error details:", {
          name: error.name,
          message: error.message,
          stack: error.stack,
        });
      } else {
        console.log("🔍 Unknown error type:", typeof error);
      }
    }
  };

  return {
    isRecording: audioRecorder.isRecording,
    recordingTime: audioRecorder.recordingTime,
    permissionError: audioRecorder.permissionError,
    startRecording,
    handleStopRecording,
    config: audioRecorder.config,
  };
};
