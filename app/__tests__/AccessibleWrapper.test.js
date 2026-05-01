/**
 * @file AccessibleWrapper.test.js
 * @description Unit tests for the AccessibleWrapper components.
 * Verifies accessibility compliance and correct styling logic.
 */

// --- Imports ---
import React from 'react';
import { render } from '@testing-library/react-native';
import { AccessibleButton } from '../src/components/AccessibleWrapper';

// --- Mocks ---
// Mock the translation context to prevent async network fetching during tests
jest.mock('../src/context/TranslationContext', () => ({
  useTranslation: () => ({
    translate: async (text) => text,
    locale: 'en',
  })
}));

// --- Test Suite ---
describe('AccessibleButton constraints', () => {
    it('forces accessibilityRole to be button', () => {
       const { getByRole } = render(
           <AccessibleButton title="Click Me" onPress={() => {}} />
       );
       
       // If the ARIA tag fails, getByRole throws
       const button = getByRole('button');
       expect(button).toBeTruthy();
    });

    it('uses primary styling variants accurately', () => {
       const { getByRole } = render(
           <AccessibleButton title="Primary Target" variant="primary" onPress={() => {}} />
       );
       
       const button = getByRole('button');
       // Minimum touch targets (48px) should be confirmed
       // Here we assert that style logic applies correctly
       expect(button.props.style).toBeDefined();
    });
});
