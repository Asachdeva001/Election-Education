/**
 * @file EligibilityQuestionnaire.js
 * @description A multi-step questionnaire component that determines 
 * if a user meets the basic criteria for voter registration.
 * Implements active Accessibility Announcements for screen readers.
 */

// --- Imports ---
import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, AccessibilityInfo } from 'react-native';

// Internal Components & Theme
import { AccessibleText, AccessibleButton } from './AccessibleWrapper';
import { theme } from '../theme';

// --- Main Component ---
/**
 * Renders an interactive questionnaire for voter eligibility.
 * 
 * @param {Object} props - Component properties.
 * @param {Function} props.onEligible - Callback triggered when the user passes all checks.
 * @param {Function} props.onIneligible - Callback triggered when the user fails a check.
 * @returns {JSX.Element} The EligibilityQuestionnaire component.
 */
export default function EligibilityQuestionnaire({ onEligible, onIneligible }) {
  // --- State ---
  const [step, setStep] = useState(0);

  // --- Constants ---
  const questions = [
    {
      id: 'citizenship',
      text: "Are you a U.S. citizen?",
    },
    {
      id: 'age',
      text: "Will you be 18 years or older on Election Day?",
    }
  ];

  // --- Helpers ---
  /**
   * Processes the user's answer and advances to the next step or triggers callbacks.
   * Uses AccessibilityInfo to announce changes to visually impaired users dynamically.
   * 
   * @param {boolean} isYes - True if the user answered 'Yes', otherwise false.
   */
  const handleAnswer = (isYes) => {
    if (!isYes) {
      AccessibilityInfo.announceForAccessibility("You answered No. You are currently ineligible.");
      onIneligible(questions[step].id);
      return;
    }

    if (step < questions.length - 1) {
      const nextStep = step + 1;
      setStep(nextStep);
      // Actively announce the next question so screen readers don't wait for focus
      AccessibilityInfo.announceForAccessibility(`Step ${nextStep + 1}. ${questions[nextStep].text}`);
    } else {
      AccessibilityInfo.announceForAccessibility("You answered Yes to all questions. You are eligible to register.");
      onEligible();
    }
  };

  // --- Render ---
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <AccessibleText variant="header" style={styles.header}>
        Eligibility Check
      </AccessibleText>
      
      {/* Question Card */}
      <View style={styles.card}>
        <AccessibleText variant="title" style={styles.question}>
          {questions[step].text}
        </AccessibleText>

        {/* Answer Buttons */}
        <View style={styles.buttonRow}>
          <View style={styles.btnWrapper}>
            <AccessibleButton
              title="Yes"
              accessibilityLabel={`Answer Yes to: ${questions[step].text}`}
              variant="primary"
              onPress={() => handleAnswer(true)}
            />
          </View>
          <View style={styles.btnWrapper}>
            <AccessibleButton
              title="No"
              accessibilityLabel={`Answer No to: ${questions[step].text}`}
              variant="secondary"
              onPress={() => handleAnswer(false)}
            />
          </View>
        </View>
      </View>

      {/* Progress Indicator */}
      <AccessibleText variant="body" style={styles.disclaimer}>
        Step {step + 1} of {questions.length}
      </AccessibleText>
    </ScrollView>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    color: theme.colors.primary,
    marginBottom: theme.spacing.lg,
  },
  card: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    borderRadius: 12,
    marginBottom: theme.spacing.md,
  },
  question: {
    marginBottom: theme.spacing.xl,
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: theme.spacing.md,
  },
  btnWrapper: {
    flex: 1,
  },
  disclaimer: {
    textAlign: 'center',
    color: theme.colors.textSecondary,
  }
});
