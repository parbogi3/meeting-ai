export type Meeting = {
  id: string;

  title: string;

  transcript: string;

  summary?: string | null;
  audio_url?: string | null;

  categories?: string[] | null;

  meeting_date?: string | null;
  meeting_time?: string | null;
  meeting_location?: string | null;

  participants?: string | null;

  writer?: string | null;

  meeting_subject?: string | null;

  discussion_points?: string | null;

  decisions?: string | null;

  action_items?: string | null;

  created_at: string;
};