export type Meeting = {
  id: string;
  title: string;
  transcript: string;
  summary?: string | null;
  audio_url?: string | null;
  created_at: string;
};
