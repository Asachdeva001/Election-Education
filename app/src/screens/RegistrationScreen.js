import React, { useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { AccessibleText, AccessibleButton } from '../components/AccessibleWrapper';
import EligibilityQuestionnaire from '../components/EligibilityQuestionnaire';
import RegistrationGuide from '../components/RegistrationGuide';
import { theme } from '../theme';

export default function RegistrationScreen({ navigation }) {
  const [status, setStatus] = useState('checking'); // 'checking', 'eligible', 'ineligible'
  const [failReason, setFailReason] = useState(null);

  const handleEligible = () => {
    setStatus('eligible');
  };

  const handleIneligible = (reason) => {
    setFailReason(reason);
    setStatus('ineligible');
  };

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
