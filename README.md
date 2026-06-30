# Hướng dẫn chạy và bảo trì Dự án Optimind (React Native / Expo)

Tài liệu này hướng dẫn cách cài đặt, khởi chạy dự án, xử lý sự cố khi xóa thư mục `android` / `node_modules`, và cách cập nhật file cấu hình `app.json`.

---

## 1. Lưu ý về thư viện và các file

### face_landmarker.task - ML Kit Face Detection

Công cụ để nhận diện khuôn mặt và lấy face_landmark
Copy và paste model vào trong `android/app/src/main/assets` sau khi prebuild android, nếu chưa có thì tạo thủ công thư mục và copy model vào trong đó

### react-native-orientation-director (only SDK 50 and above are supported, the plugin is configured to handle only the kotlin template.)

#### Android: override the onConfigurationChanged method in MainActivity.kt

// ...

import android.content.Intent
import android.content.res.Configuration
import com.orientationdirector.implementation.ConfigurationChangedBroadcastReceiver

class MainActivity : ReactActivity() {

// ...

import android.content.Intent
import android.content.res.Configuration
import com.orientationdirector.implementation.ConfigurationChangedBroadcastReceiver

```
class MainActivity : ReactActivity() {

// ...

override fun onConfigurationChanged(newConfig: Configuration) {

   super.onConfigurationChanged(newConfig)

   val orientationDirectorCustomAction =
        "${packageName}.${ConfigurationChangedBroadcastReceiver.CUSTOM_INTENT_ACTION}"

   val intent = Intent(orientationDirectorCustomAction).apply {
          putExtra("newConfig", newConfig)
          setPackage(packageName)
        }

   this.sendBroadcast(intent)

   }
}
```

#### iOS

In your AppDelegate.swift file, implement the supportedInterfaceOrientationsFor method as follows:

```
import OrientationDirector

func application(_ application: UIApplication, supportedInterfaceOrientationsFor window: UIWindow?) -> UIInterfaceOrientationMask {

  return SharedOrientationDirectorImpl.shared.supportedInterfaceOrientations
}
```

## 2. Cách chạy codebase

### Yêu cầu:

- Node.js (phiên bản khuyến nghị LTS 18 hoặc 20).
- Java Development Kit (JDK) 17 (bắt buộc cho Android build).
- Android Studio và thiết bị ảo (Emulator) hoặc thiết bị thật đã bật chế độ nhà phát triển (Developer Mode) và USB Debugging.

### Các bước khởi chạy:

**Xóa node_modules & lockfile (nếu cần)**:

```powershell
# Trên Windows (PowerShell)
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json
```

1. **Xóa cache của NPM**

   ```bash
   npm cache clean --force
   ```

   **Cài đặt lại thư viện**

   ```bash
   npm install
   ```

2. **Tạo lại thư mục Android sạch**:
   ```bash
   npx expo prebuild --clean
   ```
   **Thêm các config, cấu hình cần thiết:**
   - android/gradle.properties
   - các thư viện native

**Khởi động server phát triển và chạy trên Android**:

```bash
npm run android
```

## 3. Cách cập nhật và lưu ý quan trọng về `app.json`

File `app.json` chứa các thông tin cấu hình cốt lõi của ứng dụng Expo.
