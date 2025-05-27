// src/utils/permissions.ts
import { PermissionsAndroid, Platform } from 'react-native';

export const requestPermissions = async (): Promise<boolean> => {
  if (Platform.OS === 'ios') {
    // iOS thường xử lý quyền riêng, bạn có thể xin quyền camera ở nơi khác hoặc assume true ở đây
    return true;
  }

  try {
    // Danh sách quyền cần xin trên Android
    const permissions = [PermissionsAndroid.PERMISSIONS.CAMERA];

    permissions.push(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
      );

    const grantedResults = await PermissionsAndroid.requestMultiple(permissions);

    // Kiểm tra tất cả quyền đều được cấp
    const allGranted = permissions.every(
      permission => grantedResults[permission] === PermissionsAndroid.RESULTS.GRANTED
    );

    return allGranted;
  } catch (error) {
    console.warn('Permission request error:', error);
    return false;
  }
};
