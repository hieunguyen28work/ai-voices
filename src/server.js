const express = require("express");
const cors = require("cors");
const ttsService = require("./services/ttsService");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

/**
 * POST /api/tts
 * Body: { text: string, voice?: string, emotion?: string, options?: { pitch?, rate?, volume? } }
 * Emotions: neutral, gentle, aggressive, cheerful, sad, calm, excited
 * Response: { success: true, data: { base64, text, voice, emotion, info } }
 */
app.post("/api/tts", async (req, res) => {
  try {
    const { text, voice, emotion, options = {} } = req.body;

    if (!text || typeof text !== "string" || text.trim() === "") {
      return res.status(400).json({
        success: false,
        error: "Text is required and must be a non-empty string",
      });
    }

    const selectedVoice = voice || ttsService.DEFAULT_VOICE;
    const selectedEmotion = emotion || "neutral";
    const startTime = Date.now();

    // Merge emotion presets with custom options
    const emotionOptions = ttsService.getEmotionOptions(selectedEmotion);
    const finalOptions = { ...emotionOptions, ...options };

    const { base64, info } = await ttsService.getAudioBase64(
      text.trim(),
      selectedVoice,
      finalOptions
    );

    const elapsed = Date.now() - startTime;

    res.json({
      success: true,
      data: {
        base64,
        text: text.trim(),
        voice: selectedVoice,
        emotion: selectedEmotion,
        options: finalOptions,
        info: {
          ...info,
          generationTimeMs: elapsed,
        },
      },
    });
  } catch (error) {
    console.error("TTS Error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to generate audio",
    });
  }
});

/**
 * POST /api/tts/audio
 * Returns audio file directly (playable in Postman/browser)
 * Body: { text: string, voice?: string, emotion?: string }
 */
app.post("/api/tts/audio", async (req, res) => {
  try {
    const { text, voice, emotion, options = {} } = req.body;

    if (!text || typeof text !== "string" || text.trim() === "") {
      return res.status(400).json({ error: "Text is required" });
    }

    const selectedVoice = voice || ttsService.DEFAULT_VOICE;
    const emotionOptions = ttsService.getEmotionOptions(emotion || "neutral");
    const finalOptions = { ...emotionOptions, ...options };

    const { base64 } = await ttsService.getAudioBase64(
      text.trim(),
      selectedVoice,
      finalOptions
    );

    const audioBuffer = Buffer.from(base64, "base64");

    res.set({
      "Content-Type": "audio/mpeg",
      "Content-Length": audioBuffer.length,
      "Content-Disposition": 'inline; filename="speech.mp3"',
    });

    res.send(audioBuffer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/emotions
 * List all available emotion presets
 */
app.get("/api/emotions", (req, res) => {
  res.json({
    success: true,
    data: {
      emotions: Object.keys(ttsService.EMOTION_PRESETS),
      presets: ttsService.EMOTION_PRESETS,
    },
  });
});

/**
 * GET /api/voices
 * Response: { success: true, data: { voices: [...], total: number } }
 */
app.get("/api/voices", async (req, res) => {
  try {
    const { lang } = req.query;
    let voices = await ttsService.getVoices();

    if (lang) {
      voices = voices.filter(
        (v) => v.Locale === lang || v.Locale.startsWith(lang + "-")
      );
    }

    res.json({
      success: true,
      data: {
        voices: voices.map((v) => ({
          name: v.ShortName,
          gender: v.Gender,
          locale: v.Locale,
          friendlyName: v.FriendlyName,
        })),
        total: voices.length,
      },
    });
  } catch (error) {
    console.error("Voices Error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to get voices",
    });
  }
});

/**
 * GET /api/voices/vietnamese
 * Response: { success: true, data: { voices: [...] } }
 */
app.get("/api/voices/vietnamese", async (req, res) => {
  try {
    const voices = await ttsService.getVietnameseVoices();

    res.json({
      success: true,
      data: {
        voices: voices.map((v) => ({
          name: v.ShortName,
          gender: v.Gender,
          friendlyName: v.FriendlyName,
        })),
        default: ttsService.DEFAULT_VOICE,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`🎤 Edge TTS API running at http://localhost:${PORT}`);
  console.log(`\n📚 Endpoints:`);
  console.log(`   POST /api/tts              - Generate audio from text`);
  console.log(`   GET  /api/voices           - List all voices`);
  console.log(`   GET  /api/voices/vietnamese - List Vietnamese voices`);
  console.log(`   GET  /health               - Health check`);
});
