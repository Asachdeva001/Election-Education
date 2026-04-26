import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AccessibleText } from './AccessibleWrapper';
import DocumentChecklist from './DocumentChecklist';
import { theme } from '../theme';

export default function RegistrationGuide() {
  return (
    <View style={styles.container}>
      <AccessibleText variant="header" style={styles.header}>
        Voter Registration Guide
      </AccessibleText>
      
      <View style={styles.stepBox}>
         <AccessibleText variant="title" style={styles.stepTitle}>1. Gather Your Documents</AccessibleText>
         <AccessibleText variant="body">Before you begin, ensure you have the necessary documentation proving your identity and residence.</AccessibleText>
      </View>

      <DocumentChecklist />

      <View style={[styles.stepBox, { marginTop: theme.spacing.lg }]}>
         <AccessibleText variant="title" style={styles.stepTitle}>2. Submit Application</AccessibleText>
         <AccessibleText variant="body">You can apply online, in-person at your local election office, or by mail. We recommend online for the fastest turnaround.</AccessibleText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    color: theme.colors.primary,
    marginBottom: theme.spacing.md,
  },
  stepBox: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.secondary,
  },
  stepTitle: {
    marginBottom: theme.spacing.xs,
  }
});
