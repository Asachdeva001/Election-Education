/**
 * @file DocumentChecklist.js
 * @description Provides an interactive checklist for users to track which 
 * registration documents they have gathered. Progress is saved locally.
 */

// --- Imports ---
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Internal Components & Theme
import { AccessibleText } from './AccessibleWrapper';
import { theme } from '../theme';

// --- Main Component ---
/**
 * Renders the Document Checklist and manages its state with AsyncStorage.
 * 
 * @returns {JSX.Element} The DocumentChecklist component.
 */
export default function DocumentChecklist() {
  // --- State ---
  const [documents, setDocuments] = useState([
    { id: '1', title: 'State Issued Photo ID or Driver\'s License', checked: false },
    { id: '2', title: 'Proof of US Citizenship (Passport, Birth Certificate)', checked: false },
    { id: '3', title: 'Proof of Residence (Utility Bill, Bank Statement)', checked: false },
  ]);

  // --- Side Effects ---
  // Load saved progress on mount
  useEffect(() => {
    /**
     * Loads the saved checklist state from AsyncStorage.
     */
    const loadProgress = async () => {
      try {
        const savedData = await AsyncStorage.getItem('@document_checklist');
        if (savedData) {
          setDocuments(JSON.parse(savedData));
        }
      } catch (e) {
        console.error('Failed to load checklist.', e);
      }
    };
    loadProgress();
  }, []);

  // --- Helpers ---
  /**
   * Toggles the checked state of a document and saves progress persistently.
   * 
   * @param {string} id - The unique ID of the document to toggle.
   */
  const toggleDocument = async (id) => {
    const newDocs = documents.map(doc => 
      doc.id === id ? { ...doc, checked: !doc.checked } : doc
    );
    
    setDocuments(newDocs);

    try {
      await AsyncStorage.setItem('@document_checklist', JSON.stringify(newDocs));
    } catch (e) {
       console.error('Failed to save checklist.', e);
    }
  };

  // --- Render ---
  return (
    <View style={styles.container}>
      <AccessibleText variant="title" style={styles.header}>
        Required Documents
      </AccessibleText>

      {documents.map((doc) => (
        <TouchableOpacity
          key={doc.id}
          style={styles.checkItem}
          onPress={() => toggleDocument(doc.id)}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: doc.checked }}
          accessibilityLabel={doc.title}
        >
          <View style={[styles.box, doc.checked && styles.boxChecked]}>
             {doc.checked && <AccessibleText style={styles.checkMark}>✓</AccessibleText>}
          </View>
          <AccessibleText variant="body" style={[styles.text, doc.checked && styles.textChecked]}>
            {doc.title}
          </AccessibleText>
        </TouchableOpacity>
      ))}
    </View>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    borderRadius: 12,
    marginTop: theme.spacing.lg,
  },
  header: {
    color: theme.colors.primary,
    marginBottom: theme.spacing.md,
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: theme.spacing.sm,
    minHeight: 48, // Touch target minimum size
  },
  box: {
    width: 28,
    height: 28,
    borderWidth: 2,
    borderColor: theme.colors.secondary,
    borderRadius: 6,
    marginRight: theme.spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  boxChecked: {
    backgroundColor: theme.colors.success,
    borderColor: theme.colors.success,
  },
  checkMark: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  text: {
    flex: 1,
  },
  textChecked: {
    textDecorationLine: 'line-through',
    color: theme.colors.textSecondary,
  }
});
