import { Ionicons } from '@expo/vector-icons';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import 'react-native-reanimated';
import "../global.css";

import { useColorScheme } from '@/hooks/use-color-scheme';
import { NetworkAlert } from '@/src/components/NetworkAlert';
import { NetworkProvider } from '@/src/contexts/NetworkContext';
import "@/src/i18n/i18n"; // Initialize i18n configuration


export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <NetworkProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <NetworkAlert />
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarShowLabel: false,
            tabBarActiveTintColor: '#A78BFA',
            tabBarInactiveTintColor: 'rgba(255,255,255,0.4)',
            tabBarStyle: {
              backgroundColor: 'rgba(255, 255, 255, 0.08)', // More glass-like
              position: 'absolute',
              bottom: 25,
              left: 60,
              right: 60,
              borderRadius: 30,
              height: 75,
              borderTopWidth: 1,
              borderColor: 'rgba(255, 255, 255, 0.1)',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: 0.3,
              shadowRadius: 20,
              elevation: 5,
            },
          }}
        >
          <Tabs.Screen
            name="home"
            options={{
              title: 'Home',
              tabBarIcon: ({ color, focused }) => (
                <View style={[styles.iconContainer, focused && styles.activeIconContainer]}>
                  <Ionicons name="home" size={24} color={color} />
                </View>
              ),
            }}
          />
          <Tabs.Screen
            name="wallet"
            options={{
              title: 'Wallet',
              href: null, // Hide from bottom bar
              tabBarIcon: ({ color, focused }) => (
                <View style={[styles.iconContainer, focused && styles.activeIconContainer]}>
                  <Ionicons name="card-outline" size={24} color={color} />
                </View>
              ),
            }}
          />
          <Tabs.Screen
            name="scan"
            options={{
              title: '',
              tabBarIcon: () => (
                <View style={{
                  backgroundColor: '#6366F1',
                  borderRadius: 22,
                  width: 60,
                  height: 60,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: 35, // Lifted center button
                  shadowColor: '#6366F1',
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: 0.4,
                  shadowRadius: 12,
                  elevation: 8,
                  borderWidth: 4,
                  borderColor: 'rgba(255,255,255,0.1)',
                }}>
                  <Ionicons name="qr-code-outline" size={30} color="white" />
                </View>
              ),
            }}
          />
          <Tabs.Screen
            name="activity"
            options={{
              title: 'Activity',
              href: null, // Hide from bottom bar
              tabBarIcon: ({ color, focused }) => (
                <View style={[styles.iconContainer, focused && styles.activeIconContainer]}>
                  <Ionicons name="stats-chart-outline" size={24} color={color} />
                </View>
              ),
            }}
          />
          <Tabs.Screen
            name="profile"
            options={{
              title: 'Profile',
              tabBarIcon: ({ color, focused }) => (
                <View style={[styles.iconContainer, focused && styles.activeIconContainer]}>
                  <Ionicons name="person-outline" size={24} color={color} />
                </View>
              ),
            }}
          />

          {/* Hidden screens - no tab bar shown */}
          <Tabs.Screen
            name="topup"
            options={{
              href: null,
              tabBarStyle: { display: 'none' },
            }}
          />
          <Tabs.Screen
            name="index"
            options={{
              href: null,
              tabBarStyle: { display: 'none' },
            }}
          />
          <Tabs.Screen
            name="login"
            options={{
              href: null,
              tabBarStyle: { display: 'none' },
            }}
          />
          <Tabs.Screen
            name="register"
            options={{
              href: null,
              tabBarStyle: { display: 'none' },
            }}
          />
          <Tabs.Screen
            name="user-search"
            options={{
              href: null,
              tabBarStyle: { display: 'none' },
            }}
          />
          <Tabs.Screen
            name="send-money"
            options={{
              href: null,
            }}
          />
          <Tabs.Screen
            name="modal"
            options={{
              href: null,
            }}
          />
          <Tabs.Screen
            name="edit-profile"
            options={{
              href: null,
              tabBarStyle: { display: 'none' },
            }}
          />
          <Tabs.Screen
            name="cards"
            options={{
              href: null,
              tabBarStyle: { display: 'none' },
            }}
          />
          <Tabs.Screen
            name="add-card"
            options={{
              href: null,
              tabBarStyle: { display: 'none' },
            }}
          />
        </Tabs>
        <StatusBar style="auto" />
      </ThemeProvider>
    </NetworkProvider>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  activeIconContainer: {
    backgroundColor: 'rgba(167, 139, 250, 0.12)',
  },
});

