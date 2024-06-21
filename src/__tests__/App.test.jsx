import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import App from '../App';

test('renders navigation links', () => {
  render(
    <Router>
      <App />
    </Router>
  );
  const homeLink = screen.getByText(/Home/i);
  const counterLink = screen.getByText(/Counter/i);
  const settingsLink = screen.getByText(/Settings/i);

  expect(homeLink).toBeInTheDocument();
  expect(counterLink).toBeInTheDocument();
  expect(settingsLink).toBeInTheDocument();
});

test('renders welcome message on WelcomePage', () => {
  render(
    <Router>
      <App />
    </Router>
  );
  const welcomeMessage = screen.getByText(/Welcome to the Counting App/i);
  expect(welcomeMessage).toBeInTheDocument();
});