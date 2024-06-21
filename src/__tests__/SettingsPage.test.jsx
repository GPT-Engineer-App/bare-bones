import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SettingsPage from '../pages/SettingsPage';
import { SupabaseProvider } from '../integrations/supabase/index.js';

test('renders SettingsPage and adds keyword', () => {
  render(
    <SupabaseProvider>
      <SettingsPage />
    </SupabaseProvider>
  );

  const input = screen.getByPlaceholderText(/Add new keyword/i);
  fireEvent.change(input, { target: { value: 'newKeyword' } });

  const addButton = screen.getByText(/Add/i);
  fireEvent.click(addButton);

  const newKeyword = screen.getByText(/newKeyword/i);
  expect(newKeyword).toBeInTheDocument();
});

test('renders SettingsPage and removes keyword', () => {
  render(
    <SupabaseProvider>
      <SettingsPage />
    </SupabaseProvider>
  );

  const removeButton = screen.getAllByText(/Remove/i)[0];
  fireEvent.click(removeButton);

  const removedKeyword = screen.queryByText(/keyword1/i);
  expect(removedKeyword).not.toBeInTheDocument();
});