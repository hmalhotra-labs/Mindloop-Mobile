import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import { MoodSelector } from '../src/components/mood/MoodSelector';
import { MoodOption } from '../src/data/moodOptions';

// Mock the mood service
jest.mock('../src/services/moodService', () => ({
  moodService: {
    saveMoodEntry: jest.fn().mockResolvedValue(undefined),
  },
}));

describe('MoodSelector', () => {
  const mockOnMoodSelect = jest.fn();
  const mockOnSkip = jest.fn();

  const renderMoodSelector = (props = {}) => {
    const defaultProps = {
      onMoodSelect: mockOnMoodSelect,
      onSkip: mockOnSkip,
      selectedMoodId: undefined,
      ...props,
    };

    return render(<MoodSelector {...defaultProps} />);
  };

  it('renders correctly', () => {
    renderMoodSelector();

    expect(screen.getByText('How did this reset feel?')).toBeTruthy();
    expect(screen.getByText('Choose the option that best matches your mood')).toBeTruthy();
    expect(screen.getByText('Skip for now')).toBeTruthy();
  });

  it('allows mood selection', () => {
    renderMoodSelector();

    // Find and press one of the mood buttons
    const moodButton = screen.getByText('Good');
    fireEvent.press(moodButton);

    // Verify the callback was called
    expect(mockOnMoodSelect).toHaveBeenCalled();
  });

  it('allows skipping the mood check-in', () => {
    renderMoodSelector();

    const skipButton = screen.getByText('Skip for now');
    fireEvent.press(skipButton);

    // Verify the skip callback was called
    expect(mockOnSkip).toHaveBeenCalled();
  });
});