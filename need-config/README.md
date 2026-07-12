# Hướng Dẫn Setup & Cấu Hình Chế Độ Xoay Ngang (Landscape Mode)

Tài liệu này tổng hợp cụ thể các thiết lập, cấu hình phần mềm và mã nguồn dành riêng cho chế độ **Xoay Ngang (Landscape Mode / Tracking 90°)** trong ứng dụng Optimind.

---

## 1. Mục Đích & Trường Hợp Sử Dụng (Use Cases)

Chế độ Xoay Ngang được kích hoạt khi giao diện ứng dụng cố định ở chiều Dọc (Locked Portrait UI), áp dụng cho 2 trường hợp chính:

1. **Điện thoại đặt NẰM NGANG (Landscape)** trên chân đế/giá sạc và người dùng ngồi học thẳng đứng.
2. **Người dùng nằm ngang học tập** và đặt điện thoại đứng (Portrait).

---

## 2. Chi Tiết Các Bước Cấu Hình & Setup Chính

### 📱 Bước 1: Cấu hình khóa chiều giao diện ở Portrait (`app.json`)

Giữ UI cố định để các nút bấm và overlay không bị xoay nhầm khi nghiêng máy:

```json
{
  "expo": {
    "orientation": "portrait"
  }
}
```

---

### ⚙️ Bước 2: Cấu hình Native Android Build (`android/gradle.properties`)

Cấp bộ nhớ RAM cho Gradle Daemon để xử lý mượt mà bộ xoay ma trận ảnh camera:

```properties
# 1. Tăng bộ nhớ RAM và tối ưu Garbage Collection cho Gradle Daemon
org.gradle.jvmargs=-Xmx4g -XX:MaxMetaspaceSize=1g -XX:+UseParallelGC

# 2. Xử lý trùng lặp Native Shared Library
android.packagingOptions.pickFirsts=**/libmix.so
```

---

### 🖼️ Bước 3: Cấu hình Ma Trận Xoay Ảnh Native (`FaceLandmarkDetectionFrameProcessorPlugin.kt`)

File Native Plugin: `node_modules/react-native-mediapipe/.../FaceLandmarkDetectionFrameProcessorPlugin.kt` (được lưu trong `patches/react-native-mediapipe+0.6.0.patch`).

- **Phép xoay ma trận góc $180^\circ$ / $0^\circ$**: Xoay khung hình camera về đúng hướng thẳng đứng đối với MediaPipe khi điện thoại nằm ngang.
- **Ma trận dịch chuyển bù trừ (`postTranslate`)**: Định vị ảnh về đúng khung nhìn Canvas, **tránh bị lệch, xén hoặc đen ảnh**.
- **Bộ đệm tái sử dụng (`rotatedBitmapBuffer`)**: Tránh cấp phát bộ nhớ rác (Zero-GC) để giữ 30+ FPS.

```kotlin
private var rotatedBitmapBuffer: Bitmap? = null
private val matrix: Matrix = Matrix()

private fun rotateBitmap(source: Bitmap, angle: Float): Bitmap {
    if (angle == 0f || angle == 360f) return source

    matrix.reset()
    val newWidth = if (angle == 90f || angle == 270f) source.height else source.width
    val newHeight = if (angle == 90f || angle == 270f) source.width else source.height

    matrix.postRotate(angle)
    when (angle) {
        90f -> matrix.postTranslate(newWidth.toFloat(), 0f)
        180f -> matrix.postTranslate(newWidth.toFloat(), newHeight.toFloat())
        270f -> matrix.postTranslate(0f, newHeight.toFloat())
    }

    if (rotatedBitmapBuffer == null ||
        rotatedBitmapBuffer!!.width != newWidth ||
        rotatedBitmapBuffer!!.height != newHeight ||
        rotatedBitmapBuffer!!.isRecycled) {
      rotatedBitmapBuffer?.recycle()
      rotatedBitmapBuffer = Bitmap.createBitmap(newWidth, newHeight, Bitmap.Config.ARGB_8888)
    }

    val canvas = Canvas(rotatedBitmapBuffer!!)
    canvas.drawColor(0, PorterDuff.Mode.CLEAR)
    canvas.drawBitmap(source, matrix, null)
    return rotatedBitmapBuffer!!
}
```

---

### 🌀 Bước 4: Cấu hình Worklet & Tiết Tốc Độ Frame (`components/faceLandmarkDetection/index.tsx`)

1. **Thiết lập `orientationStr` cho chế độ xoay ngang**:
   ```typescript
   if (orientationMode === "landscape") {
     orientationStr =
       deviceOrientation === 2 ? "landscape-right" : "landscape-left";
   }
   ```
2. **Tiết kiệm CPU bằng `runAtTargetFps`**:
   Bọc hàm xử lý trong `runAtTargetFps` để chỉ gửi frame mục tiêu xuống Native xoay ảnh (ví dụ 1 FPS khi theo dõi, 5 FPS khi calibration), bỏ qua 29 frame camera thừa/giây nhằm tiết kiệm tối đa pin & CPU.

---

### 🎯 Bước 5: Cấu hình Giao Diện & Tọa Độ Landmark (`components/study/FocusCamera.tsx`)

1. **Nút bấm chuyển đổi trên UI**:
   - Icon chiếc điện thoại xoay ngang $90^\circ$.
   - Tự động đặt `orientationLockMode = "landscape"` và gọi `resetFocusCalibration()`.
2. **Trích xuất `rawFaceLandmarks`**:
   - Truyền tọa độ nguyên bản `rawFaceLandmarks` vào `FocusFeatureExtractor.ts` để đảm bảo góc nghiêng đầu `roll ≈ 0°` đạt chuẩn ngay từ góc 0°, không bị lệch $90^\circ$ và không bắt buộc người dùng nghiêng máy $30-45^\circ$.

```typescript
const faceLandmarks =
  results.results[0].rawFaceLandmarks?.[0] ??
  results.results[0].trackingFaceLandmarks?.[0] ??
  results.results[0].faceLandmarks[0];

onCameraFrame(faceLandmarks);
```
