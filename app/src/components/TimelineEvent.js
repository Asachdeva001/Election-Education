import React from 'react';
import { View, StyleSheet, Linking } from 'react-native';
import { AccessibleText, AccessibleButton } from './AccessibleWrapper';
import { theme } from '../theme';

/**
 * Encodes dynamic date logic to build a web-intent compatible with calendar.google.com
 */
export default function TimelineEvent({ event }) {
  const handleAddToCalendar = () => {
    // Basic formatting for Google Calendar API
    // Dates must be in YYYYMMDDTHHmmSSZ format
    const formatGoogleDate = (date) => date.toISOString().replace(/-|:|\.\d\d\d/g, "");
    
    // Default assumption for election deadlines: All-day event or standard block
    const startDate = formatGoogleDate(new Date(event.date));
    const endDate = formatGoogleDate(new Date(new Date(event.date).getTime() + 60 * 60 * 1000)); 

    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${startDate}/${endDate}&details=${encodeURIComponent(event.description)}`;
    
    Linking.openURL(url).catch((err) => console.error('Error opening Google Calendar Link:', err));
  };

  return (
    <View style={styles.card}>
       <View style={styles.dateCol}>
          <AccessibleText variant="title" style={styles.dateNum}>
            {new Date(event.date).getDate()}
          </AccessibleText>
          <AccessibleText variant="body" style={styles.dateMonth}>
            {new Date(event.date).toLocaleString('default', { month: 'short' })}
          </AccessibleText>
       </View>

       <View style={styles.eventInfo}>
          <AccessibleText variant="title" style={styles.title}>{event.title}</AccessibleText>
          <AccessibleText variant="body" style={styles.description}>{event.description}</AccessibleText>
          <View style={styles.buttonWrapper}>
             <AccessibleButton
                title="Add to Google Calendar"
                variant="secondary"
                onPress={handleAddToCalendar}
                accessibilityLabel={`Add ${event.title} to your Google Calendar`}
             />
          </View>
       </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: 8,
    marginBottom: theme.spacing.md,
    borderLeftWidth: 6,
    borderLeftColor: theme.colors.primary,
  },
  dateCol: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
    width: 60,
  },
  dateNum: {
    color: theme.colors.primary,
    fontSize: 28,
  },
  dateMonth: {
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
  eventInfo: {
    flex: 1,
  },
  title: {
    marginBottom: theme.spacing.xs,
  },
  description: {
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
  },
  buttonWrapper: {
    alignItems: 'flex-start'
  }
});
