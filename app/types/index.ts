export interface User {
  id: string;
  nickname: string;
  avatar?: string;
  joinedAt: number;
}

export interface VoiceMessage {
  id: string;
  sender: User;
  audioBlob?: Blob;
  audioUrl?: string;
  duration: number;
  timestamp: number;
  isPlaying: boolean;
  playbackSpeed: number;
  progress: number;
  waveform?: number[];
}

export interface Room {
  id: string;
  name: string;
  description: string;
  icon?: string;
}

export interface ChatState {
  currentUser: User | null;
  messages: VoiceMessage[];
  onlineUsers: User[];
  selectedRoom: string;
  isRecording: boolean;
  recordingTime: number;
}

export type PlaybackSpeed = 1 | 1.5 | 2;
