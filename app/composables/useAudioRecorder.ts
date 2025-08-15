import { ref, onUnmounted } from "vue";
import { AUDIO_CONFIG } from "~/config/audio";

export interface RecordingResult {
  blob: Blob;
  duration: number;
  url: string;
  waveform?: number[];
}

export interface RecordingConfig {
  minDuration: number; // Duración mínima en segundos
  maxDuration: number; // Duración máxima en segundos
  minBlobSize: number; // Tamaño mínimo del blob en bytes
}

export const useAudioRecorder = (config: Partial<RecordingConfig> = {}) => {
  // Configuración por defecto desde el archivo de configuración global
  const defaultConfig: RecordingConfig = {
    minDuration: AUDIO_CONFIG.recording.minDuration,
    maxDuration: AUDIO_CONFIG.recording.maxDuration,
    minBlobSize: AUDIO_CONFIG.recording.minBlobSize,
  };

  const recordingConfig = { ...defaultConfig, ...config };

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
    console.log("🔐 Requesting microphone permission...");
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: AUDIO_CONFIG.permissions.audioConstraints,
      });

      console.log("✅ Microphone stream obtained:", stream);
      hasPermission.value = true;
      permissionError.value = "";

      // Setup audio context for analysis
      console.log("🎵 Setting up AudioContext...");
      audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
      analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);
      analyser.fftSize = AUDIO_CONFIG.analysis.fftSize;
      console.log("✅ AudioContext setup complete");

      return true;
    } catch (error) {
      console.error("❌ Error accessing microphone:", error);
      hasPermission.value = false;
      permissionError.value =
        "Microphone access denied. Please allow microphone access to continue.";
      return false;
    }
  };

  const startRecording = async (): Promise<void> => {
    console.log("🎤 useAudioRecorder.startRecording called");
    
    if (!hasPermission.value) {
      console.log("🔐 No permission, requesting...");
      const permitted = await requestPermission();
      if (!permitted) {
        console.log("❌ Permission denied");
        return;
      }
      console.log("✅ Permission granted");
    }

    if (!stream) {
      console.log("❌ No audio stream available");
      return;
    }

    console.log("🎵 Setting up MediaRecorder...");
    audioChunks.value = [];

    try {
      mediaRecorder = new MediaRecorder(stream, {
        mimeType: AUDIO_CONFIG.recording.mimeType,
      });

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.value.push(event.data);
          console.log("📦 Audio chunk received, size:", event.data.size);
        }
      };

      mediaRecorder.onstart = () => {
        console.log("🚀 MediaRecorder started successfully");
      };

      mediaRecorder.onerror = (event) => {
        console.error("❌ MediaRecorder error:", event);
      };

      mediaRecorder.start();
      isRecording.value = true;
      recordingTime.value = 0;
      console.log("✅ Recording state updated");

      // Start recording timer
      recordingTimer = setInterval(() => {
        recordingTime.value++;
        console.log("⏱️ Recording time:", recordingTime.value);
        if (recordingTime.value >= recordingConfig.maxDuration) {
          console.log("⏰ Max duration reached, stopping...");
          stopRecording();
        }
      }, 1000);

      console.log("✅ Recording started successfully");
    } catch (error) {
      console.error("❌ Error in startRecording:", error);
      throw error;
    }
  };

  const stopRecording = (): Promise<RecordingResult | null> => {
    return new Promise((resolve) => {
      console.log("🛑 stopRecording called");
      console.log("📊 MediaRecorder state:", mediaRecorder?.state);
      console.log("📊 Recording time:", recordingTime.value);
      console.log("📊 Audio chunks count:", audioChunks.value.length);
      
      if (!mediaRecorder || mediaRecorder.state !== "recording") {
        console.log("❌ MediaRecorder not in recording state");
        resolve(null);
        return;
      }

      // Guardar la duración ANTES de resetear
      const finalDuration = recordingTime.value;
      console.log("💾 Final duration captured:", finalDuration, "seconds");

      mediaRecorder.onstop = async () => {
        console.log("🔄 MediaRecorder stopped, processing audio...");
        const audioBlob = new Blob(audioChunks.value, { type: "audio/webm" });
        console.log("📦 Audio blob created, size:", audioBlob.size, "bytes");

        // Usar la duración guardada, NO recordingTime.value
        const isValidDuration = finalDuration >= recordingConfig.minDuration;
        const isValidSize = audioBlob.size >= recordingConfig.minBlobSize;

        console.log("✅ Validation results:");
        console.log("  - Duration:", finalDuration, "s (min:", recordingConfig.minDuration, "s)");
        console.log("  - Size:", audioBlob.size, "bytes (min:", recordingConfig.minBlobSize, "bytes)");
        console.log("  - Duration valid:", isValidDuration);
        console.log("  - Size valid:", isValidSize);

        if (isValidDuration && isValidSize) {
          console.log("✅ Audio validation passed, creating result");
          const result = {
            blob: audioBlob,
            duration: finalDuration, // Usar la duración guardada
            url: URL.createObjectURL(audioBlob),
            waveform: getWaveform(),
          };
          console.log("✅ Recording result created:", result);
          
          // Limpiar estado después de crear el resultado
          cleanupRecordingState();
          resolve(result);
        } else {
          console.log("❌ Audio validation failed");
          if (!isValidDuration) {
            console.log("  - Duration too short:", finalDuration, "s <", recordingConfig.minDuration, "s");
          }
          if (!isValidSize) {
            console.log("  - Size too small:", audioBlob.size, "bytes <", recordingConfig.minBlobSize, "bytes");
          }
          
          // Limpiar estado después de la validación fallida
          cleanupRecordingState();
          resolve(null);
        }
      };

      console.log("🛑 Stopping MediaRecorder...");
      mediaRecorder.stop();
      isRecording.value = false;

      // Limpiar timer y resetear estado DESPUÉS de la validación
      if (recordingTimer) {
        clearInterval(recordingTimer);
        recordingTimer = null;
      }
      
      // NO resetear recordingTime aquí, se hará después de la validación
      console.log("⏱️ Timer cleaned up, waiting for MediaRecorder.onstop...");
    });
  };

  const getWaveform = (): number[] => {
    if (!analyser) return [];

    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(dataArray);

    // Sample waveform data for visualization
    const samples = AUDIO_CONFIG.analysis.waveformSamples;
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

  const cleanupRecordingState = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    if (audioContext && audioContext.state !== "closed") {
      audioContext.close();
    }
    if (recordingTimer) {
      clearInterval(recordingTimer);
    }
    audioChunks.value = []; // Clear audio chunks after recording
    mediaRecorder = null; // Reset mediaRecorder
    recordingTime.value = 0; // Reset recording time
    isRecording.value = false; // Reset recording state
  };

  onUnmounted(() => {
    cleanupRecordingState(); // Ensure cleanup on component unmount
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
    cleanup: cleanupRecordingState, // Expose the cleanup function
    config: readonly(recordingConfig),
  };
};
