import { useAudioRecorder } from "~/composables/useAudioRecorder";
import type { VoiceMessage, User } from "~/types";

export const useRecordingHandler = () => {
  const audioRecorder = useAudioRecorder();

  const handleStopRecording = async (
    currentUser: User | null,
    addMessage: (message: VoiceMessage) => void,
    simulateBotResponse: (currentUserId: string) => void,
    scrollToBottom: (container: HTMLElement | undefined) => void,
    messagesContainer: HTMLElement | undefined
  ) => {
    const result = await audioRecorder.stopRecording();

    if (result && currentUser) {
      const message: VoiceMessage = {
        id: Date.now().toString(),
        sender: currentUser,
        audioUrl: result.url,
        duration: result.duration,
        timestamp: Date.now(),
        isPlaying: false,
        playbackSpeed: 1,
        progress: 0,
        waveform: result.waveform,
      };

      addMessage(message);

      // Simulate bot response after a delay
      setTimeout(() => simulateBotResponse(currentUser.id), 2000 + Math.random() * 3000);

      scrollToBottom(messagesContainer);
    } else if (!result) {
      // Show error message if recording failed
      alert("Recording was too short or silent. Please try again.");
    }
  };

  return {
    isRecording: audioRecorder.isRecording,
    recordingTime: audioRecorder.recordingTime,
    permissionError: audioRecorder.permissionError,
    startRecording: audioRecorder.startRecording,
    handleStopRecording,
  };
};
