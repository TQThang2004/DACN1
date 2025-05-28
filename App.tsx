import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaView, StyleSheet } from 'react-native';
import PredictionScreen from './src/screens/PredictScreen';
import ChatWithBotScreen from './src/screens/ChatWithBotScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Tab = createBottomTabNavigator();

const App = () => (
  <SafeAreaView style={styles.container}>
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName = '';
            if (route.name === 'Dự đoán bệnh') iconName = 'analytics-sharp';
            else if (route.name === 'Chat với Bot') iconName = 'chatbubble-ellipses-outline';
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#007bff',
          tabBarInactiveTintColor: 'gray',
          headerShown: true,
        })}
      >
        <Tab.Screen name="Dự đoán bệnh" component={PredictionScreen} />
        <Tab.Screen name="Chat với Bot" component={ChatWithBotScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default App;