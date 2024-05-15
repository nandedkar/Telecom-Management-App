// RenewPlan.test.js
import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import RenewPlan from './RenewPlan';
import { server } from './mocks/server'; // Import the MSW server

// Establish API mocking before all tests
beforeAll(() => server.listen());

// Reset any runtime request handlers we may add during the tests
afterEach(() => server.resetHandlers());

// Clean up once the tests are done
afterAll(() => server.close());

describe('RenewPlan component', () => {
  test('fetches user data and displays name for userId=1', async () => {
    render(<RenewPlan userId="1" />);

    // Wait for the API call to resolve
    await screen.findByText('Renewing for User : Manoj Ucchekar');

    expect(screen.getByText('Renewing for User : Manoj Ucchekar')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toHaveValue('manoj@gmail.com');
    expect(screen.getByLabelText('Mobile Number')).toHaveValue('1234567890');
  });

  test('displays error for user not found for invalid userId', async () => {
    render(<RenewPlan userId="invalid" />);

    // Wait for the API call to resolve
    await screen.findByText('User not found');

    expect(screen.getByText('User not found')).toBeInTheDocument();
  });
});
