import { Ionicons } from '@expo/vector-icons';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
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
            tabBarActiveTintColor: '#FFFFFF',
            tabBarInactiveTintColor: 'rgba(255,255,255,0.5)',
            tabBarBackground: () => (
              <View style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                zIndex: 0
              }}>
                <BlurView
                  intensity={20}
                  tint="light"
                  style={{
                    ...StyleSheet.absoluteFillObject,
                    left: 30,
                    right: 30,
                    bottom: 10,
                    borderRadius: 15,
                    overflow: 'hidden',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    borderWidth: 1.2,
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                  }}
                />
              </View>
            ),
            tabBarStyle: {
              backgroundColor: 'transparent',
              position: 'absolute',
              bottom: 25,
              left: 20,
              right: 20,
              borderRadius: 30,
              height: 70,
              borderTopWidth: 0,
              borderWidth: 0,
              elevation: 0,
              paddingHorizontal: 40,
              zIndex: 1000, // Ensure it's on top of everything
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
            name="loan"
            options={{
              title: 'Loan',
              tabBarIcon: ({ color, focused }) => (
                <View style={[styles.iconContainer, focused && styles.activeIconContainer]}>
                  <Ionicons name="cash-outline" size={24} color={color} />
                </View>
              ),
            }}
          />
          <Tabs.Screen
            name="scan"
            options={{
              title: '',
              tabBarIcon: ({ color, focused }) => (
                <View style={[styles.iconContainer, focused && styles.activeIconContainer]}>
                  <Image
                    source={require('../assets/logo/mainIcon.svg')}
                    style={{ width: 24, height: 24, tintColor: color }}
                    contentFit="contain"
                  />
                </View>
              ),
            }}
          />
          <Tabs.Screen
            name="news"
            options={{
              title: 'News',
              tabBarIcon: ({ color, focused }) => (
                <View style={[styles.iconContainer, focused && styles.activeIconContainer]}>
                  <Ionicons name="newspaper-outline" size={24} color={color} />
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
            name="wallet"
            options={{
              href: null,
            }}
          />
          <Tabs.Screen
            name="activity"
            options={{
              href: null,
              tabBarStyle: { display: 'none' },
            }}
          />
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
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    marginTop: 16,
    marginBottom: 0,
  },
  activeIconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
});

