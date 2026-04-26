import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AccessibleText, AccessibleButton } from './AccessibleWrapper';
import { theme } from '../theme';

export default function MapMarkerCard({ station, onClose }) {
  if (!station) return null;

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <AccessibleText variant="title" style={styles.title}>{station.name}</AccessibleText>
        <AccessibleButton
          title="X"
          variant="secondary"
          onPress={onClose}
          accessibilityLabel="Close polling place details"
        />
      </View>
      
      <AccessibleText variant="body" style={styles.type}>
         Method: <AccessibleText style={styles.highlight}>{station.type}</AccessibleText>
      </AccessibleText>
      
      <AccessibleText variant="body" style={styles.address}>
        {station.address}
      </AccessibleText>

      <AccessibleButton
        title="Get Directions"
        variant="primary"
        accessibilityLabel={`Get directions to ${station.name}`}
        onPress={() => console.log('Routing to', station.coordinate)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    position: 'absolute',
    bottom: theme.spacing.lg,
    left: theme.spacing.md,
    right: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    borderRadius: 16,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  title: {
    color: theme.colors.primary,
    flex: 1,
  },
  type: {
    marginBottom: theme.spacing.xs,
  },
  highlight: {
    color: theme.colors.secondary,
    fontWeight: 'bold',
  },
  address: {
    marginBottom: theme.spacing.md,
    color: theme.colors.textSecondary,
  }
});
