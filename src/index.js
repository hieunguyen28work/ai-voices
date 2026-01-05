const ttsService = require("./services/ttsService");

async function main() {
  console.log("🎤 Edge TTS Demo - Vietnamese Voice\n");

  const text = "Việt Nam là một đất nước giàu truyền thống lịch sử và văn hóa, nằm bên bờ Biển Đông với hình dáng chữ S thân thương. Trải qua hàng nghìn năm dựng nước và giữ nước, Việt Nam đã hình thành nên tinh thần đoàn kết, lòng yêu nước và ý chí kiên cường của con người. Bên cạnh đó, Việt Nam còn nổi tiếng với cảnh sắc thiên nhiên đa dạng: từ những cánh đồng lúa xanh mướt, dãy núi hùng vĩ đến bờ biển dài thơ mộng. Con người Việt Nam hiền hòa, cần cù và mến khách, luôn gìn giữ bản sắc dân tộc trong nhịp sống hiện đại.";

  try {
    // Demo 1: Get Base64 audio
    console.log("📝 Text:", text);
    console.log("\n⏳ Generating audio as Base64...");

    const startTime = Date.now();
    const { base64, info } = await ttsService.getAudioBase64(text);
    const elapsed = Date.now() - startTime;

    console.log(`✅ Done in ${elapsed}ms`);
    console.log(`📦 Base64 length: ${base64.length} characters`);
    console.log(`📊 Audio info:`, info);
    console.log(`🔊 Preview (first 100 chars): ${base64.substring(0, 100)}...`);

    // Demo 2: Save to file
    console.log("\n⏳ Saving audio to file...");
    const filePath = await ttsService.saveAudioToFile(text, "./sample_output");
    console.log(`✅ File saved at: ${filePath}`);

    // Demo 3: List Vietnamese voices
    console.log("\n🇻🇳 Available Vietnamese voices:");
    const vnVoices = await ttsService.getVietnameseVoices();
    vnVoices.forEach((v) => {
      console.log(`  - ${v.ShortName} (${v.Gender}): ${v.FriendlyName}`);
    });
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

main();
