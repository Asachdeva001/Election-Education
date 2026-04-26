import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AccessibleText, AccessibleButton } from '../components/AccessibleWrapper';
import TimelineEvent from '../components/TimelineEvent';
import { theme } from '../theme';

const MOCK_EVENTS = [
  {
    id: '1',
    title: 'Voter Registration Deadline',
    description: 'Last day to register to vote in your state.',
    date: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(), // +7 days
  },
  {
    id: '2',
    title: 'Absentee Ballot Request Deadline',
    description: 'Ensure your mail-in request is received.',
    date: new Date(new Date().getTime() + 14 * 24 * 60 * 60 * 1000).toISOString(), // +14 days
  },
  {
    id: '3',
    title: 'General Election Day',
    description: 'Polls are open from 7 AM to 8 PM.',
    date: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(), // +30 days
  }
];

export default function TimelineScreen() {
  const [notifyPref, setNotifyPref] = useState('all'); // default to All

  useEffect(() => {
    // Load local notification preferences
    const loadPref = async () => {
       const saved = await AsyncStorage.getItem('@notify_pref');
       if (saved) setNotifyPref(saved);
    };
    loadPref();
  }, []);

  const handleSetPreference = async (prefValue) => {
    setNotifyPref(prefValue);
    await AsyncStorage.setItem('@notify_pref', prefValue);
    
    // In production, this directly posts to our Task 5 /api/user/preferences endpoint
    console.log(`Synced to Backend: Preference set to ${prefValue}`);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <AccessibleText variant="header" style={styles.header}>
        Your Personalized Timeline
      </AccessibleText>

      {/* Events List */}
      <View style={styles.timelineBox}>
        {MOCK_EVENTS.map(ev => <TimelineEvent key={ev.id} event={ev} />)}
      </View>

      {/* Preferences Panel */}
      <View style={styles.prefPanel}>
        <AccessibleText variant="title" style={styles.prefHeader}>
          Notification Preferences
        </AccessibleText>
        <AccessibleText variant="body" style={styles.prefDesc}>
          Select what type of alerts you want our system to push to your device.
        </AccessibleText>

        <View style={styles.buttonRow}>
          <View style={styles.flexBtn}>
             <AccessibleButton
                title="All Reminders"
                variant={notifyPref === 'all' ? 'primary' : 'secondary'}
                onPress={() => handleSetPreference('all')}
                accessibilityLabel="Set push notification preferences to all reminders"
             />
          </View>
          <View style={styles.flexBtn}>
             <AccessibleButton
                title="Deadlines Only"
                variant={notifyPref === 'deadlines' ? 'primary' : 'secondary'}
                onPress={() => handleSetPreference('deadlines')}
                accessibilityLabel="Set push notification preferences to critical deadlines only"
             />
          </View>
        </View>

        <AccessibleButton
            title="Disable Notification Sync"
            variant={notifyPref === 'none' ? 'primary' : 'secondary'}
            onPress={() => handleSetPreference('none')}
            accessibilityLabel="Disable all push notifications"
         />
      </View>
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
  header: {
    color: theme.colors.primary,
    marginBottom: theme.spacing.lg,
  },
  timelineBox: {
    marginBottom: theme.spacing.xxl,
  },
  prefPanel: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    borderRadius: 12,
  },
  prefHeader: {
    marginBottom: theme.spacing.xs,
  },
  prefDesc: {
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  flexBtn: {
    flex: 1,
  }
});
