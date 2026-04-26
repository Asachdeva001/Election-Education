import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { AccessibleText, AccessibleButton } from './AccessibleWrapper';
import { theme } from '../theme';

export default function EligibilityQuestionnaire({ onEligible, onIneligible }) {
  const [step, setStep] = useState(0);

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

  const handleAnswer = (isYes) => {
    if (!isYes) {
      onIneligible(questions[step].id);
      return;
    }

    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      onEligible();
    }
  };

  return (
    <ScrollView style={styles.container}>
      <AccessibleText variant="header" style={styles.header}>
        Eligibility Check
      </AccessibleText>
      
      <View style={styles.card}>
        <AccessibleText variant="title" style={styles.question}>
          {questions[step].text}
        </AccessibleText>

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
      <AccessibleText variant="body" style={styles.disclaimer}>
        Step {step + 1} of {questions.length}
      </AccessibleText>
    </ScrollView>
  );
}

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
