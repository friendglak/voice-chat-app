import { ref, onUnmounted } from "vue";

export interface RecordingResult {
  blob: Blob;
  duration: number;
  url: string;
  waveform?: number[];
}

export const useAudioRecorder = () => {
  const isRecording = ref(false);
  const recordingTime = ref(0);
  const hasPermission = ref(false);
  const permissionError = ref("");

  let mediaRecorder: MediaRecorder | null = null;
  let recordingTimer: NodeJS.Timeout | null = null;
  let audioContext: AudioContext | null = null;
  let analyser: AnalyserNode | null = null;
  let stream: MediaStream | null = null;
  const audioChunks = ref<Blob[]>([]);

  const requestPermission = async (): Promise<boolean> => {
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      hasPermission.value = true;
      permissionError.value = "";

      // Setup audio context for analysis
      audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
      analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);
      analyser.fftSize = 256;

      return true;
    } catch (error) {
      hasPermission.value = false;
      permissionError.value =
        "Microphone access denied. Please allow microphone access to continue.";
      console.error("Error accessing microphone:", error);
      return false;
    }
  };

  const startRecording = async (): Promise<void> => {
    if (!hasPermission.value) {
      const permitted = await requestPermission();
      if (!permitted) return;
    }

    if (!stream) return;

    audioChunks.value = [];

    mediaRecorder = new MediaRecorder(stream, {
      mimeType: "audio/webm;codecs=opus",
    });

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunks.value.push(event.data);
      }
    };

    mediaRecorder.start();
    isRecording.value = true;
    recordingTime.value = 0;

    // Start recording timer
    recordingTimer = setInterval(() => {
      recordingTime.value++;
      if (recordingTime.value >= 30) {
        stopRecording();
      }
    }, 1000);
  };

  const stopRecording = (): Promise<RecordingResult | null> => {
    return new Promise((resolve) => {
      if (!mediaRecorder || mediaRecorder.state !== "recording") {
        resolve(null);
        return;
      }

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks.value, { type: "audio/webm" });

        // Validate audio is not silent
        const isValid = await validateAudio(audioBlob);

        if (isValid) {
          resolve({
            blob: audioBlob,
            duration: recordingTime.value,
            url: URL.createObjectURL(audioBlob),
            waveform: getWaveform(),
          });
        } else {
          resolve(null);
        }
      };

      mediaRecorder.stop();
      isRecording.value = false;

      if (recordingTimer) {
        clearInterval(recordingTimer);
        recordingTimer = null;
      }
      recordingTime.value = 0;
    });
  };

  const validateAudio = async (blob: Blob): Promise<boolean> => {
    // Basic validation - check if blob has content
    if (blob.size < 1000) return false;

    // Advanced validation using AudioContext
    if (analyser) {
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(dataArray);

      // Check if there's any significant audio activity
      const average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
      return average > 10; // Threshold for silence
    }

    return true;
  };

  const getWaveform = (): number[] => {
    if (!analyser) return [];

    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(dataArray);

    // Sample waveform data for visualization
    const samples = 16;
    const blockSize = Math.floor(dataArray.length / samples);
    const waveform: number[] = [];

    for (let i = 0; i < samples; i++) {
      const blockStart = blockSize * i;
      let sum = 0;
      for (let j = 0; j < blockSize && blockStart + j < dataArray.length; j++) {
        sum += dataArray[blockStart + j] || 0;
      }
      waveform.push(sum / blockSize / 255); // Normalize to 0-1
    }

    return waveform;
  };

  const cleanup = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    if (audioContext && audioContext.state !== "closed") {
      audioContext.close();
    }
    if (recordingTimer) {
      clearInterval(recordingTimer);
    }
  };

  onUnmounted(() => {
    cleanup();
  });

  return {
    isRecording: readonly(isRecording),
    recordingTime: readonly(recordingTime),
    hasPermission: readonly(hasPermission),
    permissionError: readonly(permissionError),
    startRecording,
    stopRecording,
    getWaveform,
    requestPermission,
    cleanup,
  };
};
