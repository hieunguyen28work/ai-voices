# Edge TTS API

Dự án API Text-to-Speech (TTS) sử dụng Microsoft Edge TTS Engine, hỗ trợ đọc tiếng Việt tự nhiên và miễn phí. Dự án được viết bằng Node.js và Express.

## 🚀 Tính năng

- **Chuyển đổi văn bản thành giọng nói (TTS)**: Hỗ trợ tiếng Việt và nhiều ngôn ngữ khác.
- **Không cần API Key**: Sử dụng engine miễn phí của Edge.
- **Emotion Presets**: Hỗ trợ tinh chỉnh cảm xúc (Vui, buồn, mạnh mẽ, nhẹ nhàng...).
- **Đầu ra đa dạng**: Base64 JSON hoặc file audio trực tiếp.
- **Nhẹ nhàng**: Không cần Python, chạy trực tiếp trên Node.js.

## 🛠 Cài đặt

1. Clone repo:

   ```bash
   git clone https://github.com/hieunguyen28work/ai-voices.git
   cd ai-voices
   ```

2. Cài đặt dependencies:
   ```bash
   npm install
   ```

## ▶️ Chạy Server

### Môi trường Development (Auto-restart)

```bash
npm run dev
```

### Môi trường Production

```bash
npm start
```

Server sẽ chạy tại: `http://localhost:3000`

## 📚 API Documentation

### 1. Tạo Audio (Base64 JSON)

Dùng cho integration với Frontend/Mobile App.

- **URL**: `POST /api/tts`
- **Body**:
  ```json
  {
    "text": "Xin chào Việt Nam!",
    "voice": "vi-VN-HoaiMyNeural",
    "emotion": "cheerful"
  }
  ```
- **Response**: Trả về chuỗi Base64 của file audio.

### 2. Tạo Audio (File MP3 trực tiếp)

Dùng để test trên Postman hoặc play trực tiếp trên trình duyệt.

- **URL**: `POST /api/tts/audio`
- **Body**:
  ```json
  {
    "text": "Alo 1 2 3 4",
    "voice": "vi-VN-NamMinhNeural",
    "emotion": "aggressive"
  }
  ```
- **Response**: File `speech.mp3`.

### 3. Lấy danh sách Emotions

- **URL**: `GET /api/emotions`

### 4. Lấy danh sách Voices

- **URL**: `GET /api/voices`
- **URL**: `GET /api/voices/vietnamese` (Chỉ lấy tiếng Việt)

## 🎭 Danh sách cảm xúc (Emotion Presets)

| Emotion      | Mô tả                               |
| ------------ | ----------------------------------- |
| `neutral`    | Bình thường                         |
| `gentle`     | Nhẹ nhàng (Chậm rãi, cao độ nhẹ)    |
| `aggressive` | Mạnh mẽ (Chậm rãi đe dọa, trầm, to) |
| `cheerful`   | Vui vẻ (Nhanh, cao)                 |
| `sad`        | Buồn (Chậm, trầm, nhỏ)              |
| `calm`       | Bình tĩnh                           |
| `excited`    | Phấn khích                          |

## 📦 Voices Tiếng Việt

- `vi-VN-HoaiMyNeural` (Nữ - Mặc định)
- `vi-VN-NamMinhNeural` (Nam)

## 📝 License

ISC
