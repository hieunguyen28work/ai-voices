const { EdgeTTS, Constants } = require("@andresaya/edge-tts");

async function test(name, text, options, voice = "vi-VN-HoaiMyNeural") {
  console.log(`\n🧪 Testing ${name} [Text: "${text}"]`);
  try {
    const tts = new EdgeTTS();
    await tts.synthesize(text, voice, {
        outputFormat: Constants.OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3,
        ...options
    });
    const base64 = tts.toBase64();
    console.log(`✅ Success! Length: ${base64.length}`);
  } catch (error) {
    console.error(`❌ Failed: ${error.message}`);
  }
}

async function run() {
  await test("Punctuation only", ".", {});
  await test("Empty text", "", {});
  await test("Spaces", "   ", {});
  await test("Invalid Voice", "Hello", {}, "INVALID-VOICE-123");
  await test("Invalid Rate", "Hello", { rate: "invalid" });
}

run();
