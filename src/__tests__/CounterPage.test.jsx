import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CounterPage from '../pages/CounterPage';
import { SupabaseProvider } from '../integrations/supabase/index.js';

test('renders CounterPage and increments count', () => {
  render(
    <SupabaseProvider>
      <CounterPage />
    </SupabaseProvider>
  );

  const incrementButton = screen.getAllByText('+')[0];
  fireEvent.click(incrementButton);

  const countText = screen.getByText(/Count: 1/i);
  expect(countText).toBeInTheDocument();
});

test('renders CounterPage and decrements count', () => {
  render(
    <SupabaseProvider>
      <CounterPage />
    </SupabaseProvider>
  );

  const incrementButton = screen.getAllByText('+')[0];
  fireEvent.click(incrementButton);

  const decrementButton = screen.getAllByText('-')[0];
  fireEvent.click(decrementButton);

  const countText = screen.getByText(/Count: 0/i);
  expect(countText).toBeInTheDocument();
});

test('renders CounterPage and toggles lock', () => {
  render(
    <SupabaseProvider>
      <CounterPage />
    </SupabaseProvider>
  );

  const lockButton = screen.getAllByText(/Lock/i)[0];
  fireEvent.click(lockButton);

  const unlockButton = screen.getAllByText(/Unlock/i)[0];
  expect(unlockButton).toBeInTheDocument();
});