export function splitAudioIntoChunks(
  pcm: Float32Array,
  sampleRate = 16000,
  chunkSeconds = 30
) {
  const chunkSize =
    sampleRate * chunkSeconds;

  const chunks: Float32Array[] = [];

  for (
    let start = 0;
    start < pcm.length;
    start += chunkSize
  ) {
    chunks.push(
      pcm.slice(
        start,
        start + chunkSize
      )
    );
  }

  return chunks;
}
