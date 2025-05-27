import { View, Text } from 'react-native'
import React from 'react'
import PredictScreen from './src/screens/PredictScreen'

const App = () => <PredictScreen />

export default App

/*
Hướng dẫn chạy dự án trên máy thật:

1. Kết nối thiết bị thật với máy tính qua cáp USB.
2. Đảm bảo đã bật chế độ "Gỡ lỗi USB" (USB Debugging) trên thiết bị Android hoặc đã tin cậy máy tính trên iOS.
3. Cài đặt các phụ thuộc:
   npm install
   hoặc
   yarn install

4. Khởi động Metro bundler:
   npx react-native start

5. Mở một terminal mới, chạy:
   - Với Android:
     npx react-native run-android
   - Với iOS (yêu cầu máy Mac):
     npx react-native run-ios

6. Nếu gặp lỗi quyền camera/thư viện ảnh, hãy cấp quyền trên thiết bị.

Lưu ý:
- Đảm bảo thiết bị và máy tính cùng mạng WiFi (nếu dùng debug qua WiFi).
- Nếu dùng Android, kiểm tra thiết bị đã hiện trong danh sách khi chạy: adb devices
*/