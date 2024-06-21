import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import WelcomePage from '../pages/WelcomePage';

test('renders WelcomePage with navigation links', () => {
  render(
    <Router>
      <WelcomePage />
    </Router>
  );

  const counterLink = screen.getByText(/Go to Counter/i);
  const settingsLink = screen.getByText(/Go to Settings/i);

  expect(counterLink).toBeInTheDocument();
  expect(settingsLink).toBeInTheDocument();
});