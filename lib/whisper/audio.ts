export async function fileToAudioBuffer(
  file: File
) {
  const arrayBuffer =
    await file.arrayBuffer();

  const audioContext =
    new AudioContext();

  const audioBuffer =
    await audioContext.decodeAudioData(
      arrayBuffer
    );

  return audioBuffer;
}

export function audioBufferToFloat32(
  audioBuffer: AudioBuffer
) {
  const channelData =
    audioBuffer.getChannelData(0);

  return new Float32Array(channelData);
}

export async function resampleTo16k(
  audioBuffer: AudioBuffer
) {
  const offlineContext =
    new OfflineAudioContext(
      1,
      Math.ceil(
        audioBuffer.duration * 16000
      ),
      16000
    );

  const source =
    offlineContext.createBufferSource();

  source.buffer = audioBuffer;

  source.connect(
    offlineContext.destination
  );

  source.start(0);

  const renderedBuffer =
    await offlineContext.startRendering();

  return renderedBuffer.getChannelData(0);
}