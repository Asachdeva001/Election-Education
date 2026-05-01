/**
 * @file App.js
 * @description Main entry point for the Election Assistant React Native application.
 * It sets up the global providers (SafeArea, Translation, Navigation) and defines
 * the main stack navigator for the app's screens.
 */

// --- Imports ---
// React & Core Navigation
import React from 'react';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Screens
import HomeScreen from './src/screens/HomeScreen';
import RegistrationScreen from './src/screens/RegistrationScreen';
import LocatorScreen from './src/screens/LocatorScreen';
import TimelineScreen from './src/screens/TimelineScreen';

// Contexts & Theme
import { TranslationProvider } from './src/context/TranslationContext';
import { theme } from './src/theme';

// --- Configuration ---
const Stack = createNativeStackNavigator();

/**
 * Override default React Navigation theme to match our High-Contrast PWA palette.
 * This ensures the navigation header and background align with the app's theme.
 */
const AppTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: theme.colors.background,
    card: theme.colors.surface,
    text: theme.colors.textPrimary,
  },
};

// --- Main App Component ---
/**
 * The root component of the application.
 * Wraps the app with necessary providers and configures the navigation stack.
 * 
 * @returns {JSX.Element} The rendered application.
 */
export default function App() {
  return (
    <SafeAreaProvider>
      <TranslationProvider>
        <NavigationContainer theme={AppTheme}>
          <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{
              headerStyle: { backgroundColor: theme.colors.surface },
              headerTintColor: theme.colors.primary,
              headerTitleStyle: { ...theme.typography.title },
            }}
          >
            {/* Screen Configurations */}
            <Stack.Screen 
              name="Home" 
              component={HomeScreen} 
              options={{ title: 'Election Assistant' }}
            />
            <Stack.Screen 
              name="Registration" 
              component={RegistrationScreen} 
              options={{ title: 'Register to Vote' }}
            />
            <Stack.Screen 
              name="Locator" 
              component={LocatorScreen} 
              options={{ title: 'Polling Place Locator' }}
            />
            <Stack.Screen 
              name="Timeline" 
              component={TimelineScreen} 
              options={{ title: 'Election Timeline' }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </TranslationProvider>
    </SafeAreaProvider>
  );
}
