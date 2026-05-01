/**
 * @file EligibilityQuestionnaire.test.js
 * @description Unit tests for the EligibilityQuestionnaire component.
 * Verifies that the correct callbacks are triggered based on user answers.
 */

// --- Imports ---
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import EligibilityQuestionnaire from '../src/components/EligibilityQuestionnaire';

// --- Mocks ---
// Mock the translation context
jest.mock('../src/context/TranslationContext', () => ({
  useTranslation: () => ({
    translate: async (text) => text,
    locale: 'en',
  })
}));

// --- Test Suite ---
describe('EligibilityQuestionnaire', () => {
  it('triggers onIneligible if the user answers No to citizenship', () => {
    const mockOnEligible = jest.fn();
    const mockOnIneligible = jest.fn();

    const { getByText } = render(
      <EligibilityQuestionnaire 
        onEligible={mockOnEligible} 
        onIneligible={mockOnIneligible} 
      />
    );

    // Answer "No" to the first question
    fireEvent.press(getByText('No'));

    expect(mockOnIneligible).toHaveBeenCalledWith('citizenship');
    expect(mockOnEligible).not.toHaveBeenCalled();
  });

  it('progresses to the next step and triggers onEligible on completion', () => {
    const mockOnEligible = jest.fn();
    const mockOnIneligible = jest.fn();

    const { getByText } = render(
      <EligibilityQuestionnaire 
        onEligible={mockOnEligible} 
        onIneligible={mockOnIneligible} 
      />
    );

    // Answer "Yes" to the first question (Citizenship)
    fireEvent.press(getByText('Yes'));
    
    // UI should update to show Step 2 of 2
    expect(getByText('Step 2 of 2')).toBeTruthy();

    // Answer "Yes" to the second question (Age)
    fireEvent.press(getByText('Yes'));

    expect(mockOnEligible).toHaveBeenCalled();
    expect(mockOnIneligible).not.toHaveBeenCalled();
  });
});
