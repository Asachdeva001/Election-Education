/**
 * @file RegistrationGuide.js
 * @description Provides a step-by-step guide for users who are eligible to register to vote.
 * Integrates Google Cloud Text-to-Speech (TTS) for enhanced accessibility.
 */

// --- Imports ---
import React, { useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { Audio } from 'expo-av';

// Internal Components & Theme
import { AccessibleText, AccessibleButton } from './AccessibleWrapper';
import DocumentChecklist from './DocumentChecklist';
import { theme } from '../theme';

// --- Constants ---
// In a real app, this points to your deployed backend. Using a placeholder or local IP.
const TTS_API_URL = 'http://localhost:8080/api/tts/synthesize';

// --- Main Component ---
/**
 * Renders the Registration Guide with instructions, a document checklist,
 * and a Text-to-Speech (TTS) accessibility feature.
 * 
 * @returns {JSX.Element} The RegistrationGuide component.
 */
export default function RegistrationGuide() {
  // --- State ---
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [soundObject, setSoundObject] = useState(null);

  // The text payload to synthesize
  const instructionsText = "Voter Registration Guide. Step 1. Gather Your Documents. Before you begin, ensure you have the necessary documentation proving your identity and residence. Step 2. Submit Application. You can apply online, in-person at your local election office, or by mail. We recommend online for the fastest turnaround.";

  // --- Helpers ---
  
  /**
   * Fetches TTS audio from the backend and plays it.
   */
  const handleListen = async () => {
    if (isPlaying && soundObject) {
      await soundObject.stopAsync();
      setIsPlaying(false);
      return;
    }

    setIsLoadingAudio(true);
    try {
      // 1. Fetch synthesized audio from our secure proxy backend
      const response = await fetch(TTS_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: instructionsText })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to synthesize speech');
      }

      // 2. Load and Play using Expo Audio
      // data.audioContent is a base64 encoded string from Google Cloud TTS
      const uri = `data:audio/mp3;base64,${data.audioContent}`;
      const { sound } = await Audio.Sound.createAsync(
        { uri },
        { shouldPlay: true }
      );
      
      setSoundObject(sound);
      setIsPlaying(true);

      // Reset state when audio finishes
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          setIsPlaying(false);
        }
      });
      
    } catch (error) {
      console.error('Audio Playback Error:', error);
      // Fallback or user alert could go here
    } finally {
      setIsLoadingAudio(false);
    }
  };

  // --- Render ---
  return (
    <View style={styles.container}>
      {/* Header & Accessibility Controls */}
      <View style={styles.headerRow}>
        <AccessibleText variant="header" style={styles.header}>
          Voter Registration Guide
        </AccessibleText>
        
        {/* TTS Integration */}
        <View style={styles.audioControls}>
          {isLoadingAudio ? (
            <ActivityIndicator color={theme.colors.secondary} />
          ) : (
            <AccessibleButton 
              title={isPlaying ? "Stop Listening" : "Listen to Instructions"} 
              variant="secondary"
              onPress={handleListen}
              accessibilityLabel="Read instructions aloud"
            />
          )}
        </View>
      </View>
      
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
  headerRow: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.md,
  },
  header: {
    color: theme.colors.primary,
    marginBottom: theme.spacing.sm,
  },
  audioControls: {
    marginBottom: theme.spacing.sm,
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
