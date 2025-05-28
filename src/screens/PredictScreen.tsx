import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  Image, Alert, ActivityIndicator, ScrollView
} from 'react-native';
import {
  launchImageLibrary,
  Asset,
  ImageLibraryOptions
} from 'react-native-image-picker';

const SERVER_URL = 'http://192.168.1.3:5000/predict'; // 🛠 Nếu dùng thiết bị thật, đổi thành IP local

const PredictionScreen = () => {
  const [selectedImage, setSelectedImage] = useState<Asset | null>(null);
  const [result, setResult] = useState<{ class: string, confidence: number } | null>(null);
  const [loading, setLoading] = useState(false);

  const chooseImage = () => {
    const options: ImageLibraryOptions = {
      mediaType: 'photo',
      quality: 0.8,
      selectionLimit: 1,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('📁 Người dùng đã hủy chọn ảnh');
      } else if (response.errorCode) {
        Alert.alert('Lỗi', response.errorMessage || 'Lỗi không xác định');
      } else if (response.assets && response.assets.length > 0) {
        const asset = response.assets[0];
        console.log('✅ Đã chọn ảnh:', asset.fileName || asset.uri);
        setSelectedImage(asset);
        setResult(null); // Xóa kết quả cũ
      }
    });
  };

  const handlePredict = async () => {
    if (!selectedImage?.uri) {
      Alert.alert('Thông báo', 'Vui lòng chọn ảnh trước');
      return;
    }

    const formData = new FormData();
    formData.append('file', {
      uri: selectedImage.uri,
      type: selectedImage.type || 'image/jpeg',
      name: selectedImage.fileName || 'image.jpg',
    });

    setLoading(true);
    try {
      const response = await fetch(SERVER_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        console.log('📦 Kết quả từ server:', data);
        setResult({ class: data.class, confidence: data.confidence });
      } else {
        Alert.alert('❌ Lỗi từ server', data.error || 'Lỗi không xác định');
      }
    } catch (error) {
      console.error('Lỗi gửi ảnh:', error);
      Alert.alert('Lỗi', 'Không thể kết nối đến server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.mainContainer}>
      <ScrollView contentContainerStyle={styles.container}>
        {selectedImage ? (
          <Image source={{ uri: selectedImage.uri }} style={styles.preview} />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>Chưa có ảnh</Text>
          </View>
        )}

        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={chooseImage} style={styles.button}>
            <Text style={styles.buttonText}>📁 Chọn ảnh</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handlePredict}
            style={[styles.button, { backgroundColor: '#28a745' }]}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? '⏳ Đang xử lý...' : '🧠 Dự đoán'}
            </Text>
          </TouchableOpacity>
        </View>

        {loading && <ActivityIndicator size="large" color="#007bff" style={{ marginTop: 20 }} />}

        {result && (
          <View style={styles.resultBox}>
            <Text style={styles.resultText}>📊 Kết quả:</Text>
            <Text style={styles.resultText}>🦠 Bệnh: {result.class}</Text>
            <Text style={styles.resultText}>🎯 Độ tin cậy: {(result.confidence * 100).toFixed(2)}%</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default PredictionScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flexGrow: 1,
    padding: 16,
  },
  preview: {
    width: '100%',
    height: 400,
    resizeMode: 'contain',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  placeholder: {
    width: '100%',
    height: 400,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  placeholderText: { color: '#888' },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  resultBox: {
    marginTop: 30,
    backgroundColor: '#e0ffe0',
    padding: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#28a745',
  },
  resultText: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
});
