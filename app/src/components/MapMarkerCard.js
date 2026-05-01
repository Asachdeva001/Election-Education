/**
 * @file MapMarkerCard.js
 * @description A floating card component that displays details for a selected 
 * polling station or drop-box on the Locator Map.
 */

// --- Imports ---
import React from 'react';
import { View, StyleSheet } from 'react-native';

// Internal Components & Theme
import { AccessibleText, AccessibleButton } from './AccessibleWrapper';
import { theme } from '../theme';

// --- Main Component ---
/**
 * Renders an overlay card with polling station information.
 * 
 * @param {Object} props - Component properties.
 * @param {Object|null} props.station - The polling station data object.
 * @param {Function} props.onClose - Callback triggered when the close button is pressed.
 * @returns {JSX.Element|null} The MapMarkerCard component or null if no station.
 */
export default function MapMarkerCard({ station, onClose }) {
  // If no station is selected, don't render the card
  if (!station) return null;

  // --- Render ---
  return (
    <View style={styles.card}>
      {/* Header Row: Title & Close Button */}
      <View style={styles.headerRow}>
        <AccessibleText variant="title" style={styles.title}>{station.name}</AccessibleText>
        <AccessibleButton
          title="X"
          variant="secondary"
          onPress={onClose}
          accessibilityLabel="Close polling place details"
        />
      </View>
      
      {/* Type Information */}
      <AccessibleText variant="body" style={styles.type}>
         Method: <AccessibleText style={styles.highlight}>{station.type}</AccessibleText>
      </AccessibleText>
      
      {/* Address */}
      <AccessibleText variant="body" style={styles.address}>
        {station.address}
      </AccessibleText>

      {/* Action Button */}
      <AccessibleButton
        title="Get Directions"
        variant="primary"
        accessibilityLabel={`Get directions to ${station.name}`}
        onPress={() => console.log('Routing to', station.coordinate)}
      />
    </View>
  );
}

// --- Styles ---
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
