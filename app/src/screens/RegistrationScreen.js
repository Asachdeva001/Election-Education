/**
 * @file RegistrationScreen.js
 * @description Screen for guiding users through voter eligibility checks 
 * and providing registration instructions based on their results.
 */

// --- Imports ---
import React, { useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';

// Internal Components & Theme
import { AccessibleText, AccessibleButton } from '../components/AccessibleWrapper';
import EligibilityQuestionnaire from '../components/EligibilityQuestionnaire';
import RegistrationGuide from '../components/RegistrationGuide';
import { theme } from '../theme';

// --- Main Component ---
/**
 * Renders the Registration Screen containing the eligibility flow.
 * 
 * @param {Object} props - Component properties.
 * @param {Object} props.navigation - React Navigation object.
 * @returns {JSX.Element} The RegistrationScreen component.
 */
export default function RegistrationScreen({ navigation }) {
  // --- State ---
  // status: 'checking' | 'eligible' | 'ineligible'
  const [status, setStatus] = useState('checking'); 
  const [failReason, setFailReason] = useState(null);

  // --- Event Handlers ---
  /**
   * Called when the user passes the eligibility questionnaire.
   */
  const handleEligible = () => {
    setStatus('eligible');
  };

  /**
   * Called when the user fails the eligibility questionnaire.
   * @param {string} reason - The reason for ineligibility (e.g., 'age', 'citizenship').
   */
  const handleIneligible = (reason) => {
    setFailReason(reason);
    setStatus('ineligible');
  };

  // --- Render Helpers ---
  /**
   * Renders the feedback view when a user is determined to be ineligible.
   * @returns {JSX.Element}
   */
  const renderIneligible = () => (
    <View style={styles.ineligibleContainer}>
      <AccessibleText variant="header" style={styles.dangerHeader}>
        Not Currently Eligible
      </AccessibleText>
      
      <AccessibleText variant="body" style={styles.reasonText}>
        Based on your answers, you do not currently meet the requirements to register to vote.
        {failReason === 'age' && " You must be 18 years old by Election Day."}
        {failReason === 'citizenship' && " You must be a United States citizen to vote in federal elections."}
      </AccessibleText>
      
      <AccessibleButton
        title="Return Home"
        variant="secondary"
        onPress={() => navigation.goBack()}
      />
    </View>
  );

  // --- Render ---
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {status === 'checking' && (
        <EligibilityQuestionnaire 
           onEligible={handleEligible} 
           onIneligible={handleIneligible} 
        />
      )}
      
      {status === 'ineligible' && renderIneligible()}
      
      {status === 'eligible' && <RegistrationGuide />}
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
    padding: theme.spacing.lg,
  },
  ineligibleContainer: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.xl,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing.xl,
  },
  dangerHeader: {
    color: theme.colors.danger,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  reasonText: {
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  }
});
