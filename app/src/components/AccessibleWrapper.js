import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, AccessibilityInfo } from 'react-native';
import { theme } from '../theme';
import { useTranslation } from '../context/TranslationContext';

/**
 * Universal accessible wrapper enforcing WCAG 2.1 AA standards for buttons/touchables.
 * Automatically wires up React Native's ARIA equivalents.
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
 * Accessible Text Wrapper ensuring Grade-8 readable minimum standards
 */
export const AccessibleText = ({ 
    children, 
    variant = 'body', 
    style, 
    accessibilityRole = 'text',
    importantForAccessibility = 'auto'
}) => {
  const { translate, locale } = useTranslation();
  const [displayText, setDisplayText] = useState(children);

  useEffect(() => {
    let isMounted = true;
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
