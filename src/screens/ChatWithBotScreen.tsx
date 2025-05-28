import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, KeyboardAvoidingView, Platform } from 'react-native';

const GEMINI_API_KEY = 'AIzaSyCvbZI4VPDQFla7pvgmx2YohJdOF7qY_Ww'; // Replace with your API key
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'bot';
};

const SYSTEM_PROMPT = "Bạn là một chuyên gia về bệnh của lá cà chua. Chỉ trả lời các câu hỏi liên quan đến bệnh của lá cà chua, cách phòng chống và cách trị bệnh. Nếu câu hỏi không liên quan, hãy lịch sự từ chối trả lời.";

const ChatWithBotScreen = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                { text: SYSTEM_PROMPT }
              ]
            },
            {
              role: "user",
              parts: [
                { text: userMsg.text }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
        })
      });

      const data = await response.json();
      const botReply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: botReply || 'Xin lỗi, tôi chỉ trả lời về bệnh lá cà chua, cách phòng chống và trị bệnh.',
        sender: 'bot',
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (e) {
      console.error('Error calling Gemini API:', e);
      setMessages(prev => [
        ...prev,
        { 
          id: (Date.now() + 2).toString(), 
          text: 'Xin lỗi, có lỗi xảy ra khi xử lý câu hỏi của bạn.', 
          sender: 'bot' 
        },
      ]);
    } finally {
      setLoading(false);
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    }
  };

  const renderItem = ({ item }: { item: Message }) => (
    <View style={[
      styles.messageBubble,
      item.sender === 'user' ? styles.userBubble : styles.botBubble
    ]}>
      <Text style={styles.messageText}>{item.text}</Text>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={{ padding: 16 }}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />
        <View style={styles.inputBar}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Nhập tin nhắn..."
            editable={!loading}
          />
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage} disabled={loading}>
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>{loading ? '...' : 'Gửi'}</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default ChatWithBotScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  messageBubble: {
    maxWidth: '80%',
    marginVertical: 4,
    padding: 10,
    borderRadius: 12,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#aae9f2',
  },
  botBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#e0e0e0',
  },
  messageText: { color: '#222', fontSize: 16 },
  inputBar: {
    flexDirection: 'row',
    padding: 8,
    borderTopWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fafafa',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    backgroundColor: '#fff',
  },
  sendButton: {
    backgroundColor: '#28a745',
    borderRadius: 20,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
