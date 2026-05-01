/**
 * @file HomeScreen.js
 * @description The main landing screen of the Election Assistant application.
 * Provides navigation to key features and a language selection interface.
 */

// --- Imports ---
import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';

// Internal Components & Context
import { AccessibleText, AccessibleButton } from '../components/AccessibleWrapper';
import { theme } from '../theme';
import { useTranslation, LANGUAGES } from '../context/TranslationContext';

// --- Main Component ---
/**
 * Renders the Home Screen with introduction text and navigation buttons.
 * Allows users to change the app language dynamically.
 * 
 * @param {Object} props - Component properties.
 * @param {Object} props.navigation - React Navigation object.
 * @returns {JSX.Element} The HomeScreen component.
 */
export default function HomeScreen({ navigation }) {
  // --- Hooks ---
  const { locale, changeLanguage } = useTranslation();

  // --- Render ---
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header Section */}
      <AccessibleText variant="header" style={styles.header}>
        Welcome to the Election Education Assistant
      </AccessibleText>
      
      <AccessibleText variant="body" style={styles.body}>
        We are here to help you understand the election process, check your eligibility, and find your local polling place. Let's get started.
      </AccessibleText>

      {/* Language Selection Grid */}
      <View style={styles.langContainer}>
         {LANGUAGES.map(lang => (
           <AccessibleButton
              key={lang.code}
              title={lang.code.toUpperCase()}
              variant={locale === lang.code ? 'primary' : 'secondary'}
              onPress={() => changeLanguage(lang.code)}
              accessibilityLabel={`Change Language to ${lang.label}`}
           />
         ))}
      </View>

      {/* Primary Navigation Options */}
      <View style={styles.buttonContainer}>
        <AccessibleButton
          title="Check Eligibility & Register"
          accessibilityLabel="Start the voter eligibility questionnaire and registration guide"
          variant="primary"
          onPress={() => navigation.navigate('Registration')}
        />
        
        <AccessibleButton
          title="Find Polling Place"
          accessibilityLabel="Locate where to vote or drop off your ballot"
          variant="secondary"
          onPress={() => navigation.navigate('Locator')}
        />

        <AccessibleButton
          title="Ask the Assistant"
          accessibilityLabel="Open the FAQ chatbot to ask election questions"
          variant="secondary"
          onPress={() => console.log('Navigate to NLP FAQ')}
        />

        <AccessibleButton
          title="View My Timelines"
          accessibilityLabel="See your personalized election deadlines and calendar"
          variant="secondary"
          onPress={() => navigation.navigate('Timeline')}
        />
      </View>
    </ScrollView>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.xl,
    paddingTop: theme.spacing.xxl * 2,
  },
  header: {
    marginBottom: theme.spacing.lg,
    color: theme.colors.primary,
  },
  body: {
    marginBottom: theme.spacing.md,
  },
  langContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.xl,
    flexWrap: 'wrap',
  },
  buttonContainer: {
    gap: theme.spacing.md,
  }
});
