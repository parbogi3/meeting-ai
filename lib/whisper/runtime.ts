export async function initRuntime() {
  console.log(
    "Whisper Runtime Init"
  );
}

export async function runInference(
  pcm16k: Float32Array
) {
  console.log(
    "PCM Length:",
    pcm16k.length
  );

  return "전사 준비 완료";
}