/**
 * @file AccessibleWrapper.js
 * @description Provides accessible wrapper components for text and buttons.
 * These components enforce WCAG 2.1 AA standards and integrate seamlessly 
 * with the app's translation and theming systems.
 */

// --- Imports ---
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, AccessibilityInfo } from 'react-native';

// Internal Dependencies
import { theme } from '../theme';
import { useTranslation } from '../context/TranslationContext';

// --- Components ---

/**
 * Universal accessible wrapper enforcing WCAG 2.1 AA standards for buttons/touchables.
 * Automatically wires up React Native's ARIA equivalents.
 * 
 * @param {Object} props - Component properties.
 * @param {Function} props.onPress - Callback for button press.
 * @param {string} props.title - The text displayed on the button.
 * @param {string} [props.accessibilityLabel] - Screen reader label (defaults to title).
 * @param {string} [props.accessibilityHint] - Additional context for screen readers.
 * @param {'primary' | 'secondary'} [props.variant='primary'] - Visual style variant.
 * @param {boolean} [props.disabled=false] - Whether the button is disabled.
 * @returns {JSX.Element} The accessible button component.
 */
export const AccessibleButton = ({ 
  onPress, 
  title, 
  accessibilityLabel, 
  accessibilityHint,
  variant = 'primary',
  disabled = false 
}) => {
  const isPrimary = variant === 'primary';
  
  return (
    <TouchableOpacity
      style={[
        styles.button, 
        isPrimary ? styles.primary : styles.secondary,
        disabled && styles.disabled
      ]}
      onPress={onPress}
      disabled={disabled}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled }}
      activeOpacity={0.8}
    >
      <Text style={[styles.text, isPrimary ? styles.textPrimary : styles.textSecondary]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

/**
 * Accessible Text Wrapper ensuring Grade-8 readable minimum standards.
 * Automatically handles translation if a string is passed as children.
 * 
 * @param {Object} props - Component properties.
 * @param {string|React.ReactNode} props.children - The text content to display.
 * @param {string} [props.variant='body'] - The typography variant from the theme.
 * @param {Object} [props.style] - Additional styles to apply.
 * @param {string} [props.accessibilityRole='text'] - ARIA role for the text.
 * @param {string} [props.importantForAccessibility='auto'] - Android accessibility importance.
 * @returns {JSX.Element} The accessible text component.
 */
export const AccessibleText = ({ 
    children, 
    variant = 'body', 
    style, 
    accessibilityRole = 'text',
    importantForAccessibility = 'auto'
}) => {
  // --- Hooks & State ---
  const { translate, locale } = useTranslation();
  const [displayText, setDisplayText] = useState(children);

  // --- Side Effects ---
  useEffect(() => {
    let isMounted = true;
    
    /**
     * Translates the text content if it's a string.
     */
    const updateText = async () => {
      if (typeof children === 'string') {
        const res = await translate(children);
        if (isMounted) setDisplayText(res);
      } else {
        if (isMounted) setDisplayText(children);
      }
    };

    // Ensure translation re-triggers if locale or text specifically changes
    updateText();
    
    return () => { isMounted = false; };
  }, [children, locale, translate]);

  // --- Render ---
  return (
    <Text 
      style={[styles.baseText, theme.typography[variant], style]}
      accessible={true}
      accessibilityRole={accessibilityRole}
      importantForAccessibility={importantForAccessibility}
    >
      {displayText}
    </Text>
  );
};

// --- Styles ---
const styles = StyleSheet.create({
  button: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: theme.spacing.sm,
    minHeight: 48, // Touch target minimum size WCAG standard
  },
  primary: {
    backgroundColor: theme.colors.primary,
  },
  secondary: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: theme.colors.secondary,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    ...theme.typography.button,
  },
  textPrimary: {
    color: theme.colors.background, // Dark text on Yellow
  },
  textSecondary: {
    color: theme.colors.secondary, // Light Blue text on dark background
  },
  baseText: {
    color: theme.colors.textPrimary,
  }
});
