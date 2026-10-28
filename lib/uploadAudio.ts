import { supabase } from "@/lib/supabase";

export async function uploadAudioFile(
  file: File,
  meetingId: string
) {
  const fileName =
    `${Date.now()}-${file.name}`;

  const { error } =
    await supabase.storage
      .from("audio-files")
      .upload(fileName, file);

  if (error) {
    throw new Error(error.message);
  }

  const {
    data: { publicUrl },
  } = supabase.storage
    .from("audio-files")
    .getPublicUrl(fileName);

  const { error: updateError } =
    await supabase
      .from("meetings")
      .update({
        audio_url: publicUrl,
      })
      .eq("id", meetingId);

  if (updateError) {
    throw new Error(
      updateError.message
    );
  }

  return publicUrl;
}
