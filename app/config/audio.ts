// Configuración de audio para la aplicación
export const AUDIO_CONFIG = {
  // Configuración de grabación - MUY permisiva
  recording: {
    minDuration: 0.05, // Duración mínima en segundos (50ms) - muy baja
    maxDuration: 30,   // Duración máxima en segundos
    minBlobSize: 1,    // Tamaño mínimo del blob en bytes - muy bajo
    mimeType: "audio/webm;codecs=opus", // Formato de audio
  },

  // Configuración de reproducción
  playback: {
    defaultSpeed: 1, // Velocidad de reproducción por defecto
    speedOptions: [0.5, 0.75, 1, 1.25, 1.5, 2], // Opciones de velocidad
  },

  // Configuración de análisis de audio
  analysis: {
    fftSize: 256, // Tamaño FFT para análisis de frecuencia
    waveformSamples: 16, // Número de muestras para la forma de onda
  },

  // Configuración de permisos
  permissions: {
    audioConstraints: {
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true,
      // Agregar más opciones para mejor compatibilidad
      sampleRate: 44100,
      channelCount: 1,
    },
  },
} as const;

// Tipos para la configuración
export type AudioConfig = typeof AUDIO_CONFIG;
export type RecordingConfig = AudioConfig["recording"];
export type PlaybackConfig = AudioConfig["playback"];
