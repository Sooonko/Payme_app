import { Tabs } from 'expo-router';
import { BarChart3, CreditCard, Home, User } from 'lucide-react-native';
import React from 'react';
import { View } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#1D1F33',
          borderTopWidth: 0,
          height: 85,
          paddingBottom: 25,
          paddingTop: 10,
        },
        tabBarActiveTintColor: '#7F3DFF',
        tabBarInactiveTintColor: '#8F92A1',
        tabBarShowLabel: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <View className={`items-center justify-center ${focused ? 'opacity-100' : 'opacity-60'}`}>
              <Home size={24} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Statistics',
          tabBarIcon: ({ color, focused }) => (
            <View className={`items-center justify-center ${focused ? 'opacity-100' : 'opacity-60'}`}>
              <BarChart3 size={24} color={color} />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="cards"
        options={{
          title: 'Cards',
          tabBarIcon: ({ color, focused }) => (
            <View className={`items-center justify-center ${focused ? 'opacity-100' : 'opacity-60'}`}>
              <CreditCard size={24} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <View className={`items-center justify-center ${focused ? 'opacity-100' : 'opacity-60'}`}>
              <User size={24} color={color} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
