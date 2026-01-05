const { EdgeTTS, Constants } = require("@andresaya/edge-tts");

// Vietnamese voices: vi-VN-HoaiMyNeural (Female), vi-VN-NamMinhNeural (Male)
const DEFAULT_VOICE = "vi-VN-HoaiMyNeural";

/**
 * Emotion presets - adjust pitch and rate to simulate emotions
 */
const EMOTION_PRESETS = {
  neutral: { pitch: 0, rate: 0, volume: 0 },
  gentle: { pitch: 5, rate: -15, volume: -5 },      // Nhẹ nhàng: chậm, cao độ nhẹ
  aggressive: { pitch: -10, rate: -15, volume: 10 }, // Mạnh mẽ: chậm(đe dọa), trầm, to
  cheerful: { pitch: 10, rate: 10, volume: 5 },     // Vui vẻ: nhanh, cao
  sad: { pitch: -5, rate: -20, volume: -10 },       // Buồn: chậm, trầm, nhỏ
  calm: { pitch: -2, rate: -10, volume: -5 },       // Bình tĩnh: chậm nhẹ
  excited: { pitch: 15, rate: 20, volume: 10 },     // Phấn khích: nhanh, cao, to
};

/**
 * Get emotion options from preset name
 */
function getEmotionOptions(emotion) {
  const preset = EMOTION_PRESETS[emotion] || EMOTION_PRESETS.neutral;
  return {
    pitch: `${preset.pitch >= 0 ? "+" : ""}${preset.pitch}Hz`,
    rate: `${preset.rate >= 0 ? "+" : ""}${preset.rate}%`,
    volume: `${preset.volume >= 0 ? "+" : ""}${preset.volume}%`,
  };
}

/**
 * Generate audio as Base64 from text (no file I/O - faster)
 * @param {string} text - Text to convert to speech
 * @param {string} voice - Voice name (optional)
 * @param {object} options - Synthesis options (pitch, rate, volume)
 * @returns {Promise<{base64: string, info: object}>} Base64 encoded audio and info
 */
async function getAudioBase64(text, voice = DEFAULT_VOICE, options = {}) {
  const tts = new EdgeTTS();

  try {
    await tts.synthesize(text, voice, {
      outputFormat: Constants.OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3,
      ...options,
    });
  } catch (error) {
    throw new Error(`TTS Synthesis failed: ${error.message}`);
  }

  try {
    const base64Audio = tts.toBase64();
    const audioInfo = tts.getAudioInfo();

    return {
      base64: base64Audio,
      info: audioInfo,
    };
  } catch (error) {
    // This usually means synthesis didn't produce data (Invalid voice or empty text)
    if (error.message.includes("No audio data")) {
      throw new Error(
        `Failed to generate audio. Valid voice? (Requested: ${voice}) Valid text?`
      );
    }
    throw error;
  }
}

/**
 * Generate audio and save to file
 * @param {string} text - Text to convert to speech
 * @param {string} outputPath - File path to save audio (without extension)
 * @param {string} voice - Voice name (optional)
 * @param {object} options - Synthesis options
 * @returns {Promise<string>} Full file path
 */
async function saveAudioToFile(
  text,
  outputPath,
  voice = DEFAULT_VOICE,
  options = {}
) {
  const tts = new EdgeTTS();

  await tts.synthesize(text, voice, {
    outputFormat: Constants.OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3,
    ...options,
  });

  return await tts.toFile(outputPath);
}

/**
 * Get list of all available voices
 * @returns {Promise<Array>} List of voices
 */
async function getVoices() {
  const tts = new EdgeTTS();
  return await tts.getVoices();
}

/**
 * Get Vietnamese voices only
 * @returns {Promise<Array>} List of Vietnamese voices
 */
async function getVietnameseVoices() {
  const tts = new EdgeTTS();
  return await tts.getVoicesByLanguage("vi-VN");
}

/**
 * Stream audio for real-time playback
 * @param {string} text - Text to convert to speech
 * @param {string} voice - Voice name (optional)
 * @returns {AsyncGenerator} Audio chunks
 */
async function* streamAudio(text, voice = DEFAULT_VOICE) {
  const tts = new EdgeTTS();
  for await (const chunk of tts.synthesizeStream(text, voice)) {
    yield chunk;
  }
}

module.exports = {
  getAudioBase64,
  saveAudioToFile,
  getVoices,
  getVietnameseVoices,
  streamAudio,
  getEmotionOptions,
  EMOTION_PRESETS,
  DEFAULT_VOICE,
  Constants,
};
