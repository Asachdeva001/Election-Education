/**
 * @file RegistrationGuide.js
 * @description Provides a step-by-step guide for users who are eligible to register to vote.
 */

// --- Imports ---
import React from 'react';
import { View, StyleSheet } from 'react-native';

// Internal Components & Theme
import { AccessibleText } from './AccessibleWrapper';
import DocumentChecklist from './DocumentChecklist';
import { theme } from '../theme';

// --- Main Component ---
/**
 * Renders the Registration Guide with instructions and a document checklist.
 * 
 * @returns {JSX.Element} The RegistrationGuide component.
 */
export default function RegistrationGuide() {
  // --- Render ---
  return (
    <View style={styles.container}>
      {/* Header */}
      <AccessibleText variant="header" style={styles.header}>
        Voter Registration Guide
      </AccessibleText>
      
      {/* Step 1: Gather Documents */}
      <View style={styles.stepBox}>
         <AccessibleText variant="title" style={styles.stepTitle}>1. Gather Your Documents</AccessibleText>
         <AccessibleText variant="body">Before you begin, ensure you have the necessary documentation proving your identity and residence.</AccessibleText>
      </View>

      {/* Checklist Component */}
      <DocumentChecklist />

      {/* Step 2: Submit Application */}
      <View style={[styles.stepBox, { marginTop: theme.spacing.lg }]}>
         <AccessibleText variant="title" style={styles.stepTitle}>2. Submit Application</AccessibleText>
         <AccessibleText variant="body">You can apply online, in-person at your local election office, or by mail. We recommend online for the fastest turnaround.</AccessibleText>
      </View>
    </View>
  );
}

// --- Styles ---
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
