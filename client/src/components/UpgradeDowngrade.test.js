import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'; // Import this for additional matchers like toBeInTheDocument
import axios from 'axios'; // Import axios to mock its behavior

import UpgradeDowngrade from './UpgradeDowngrade';

jest.mock('axios'); // Mock axios module

describe('UpgradeDowngrade component', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear all mock calls before each test
  });

  test('fetches user data and displays existing plan for userId=1', async () => {
    const userData = {
      id: '1',
      name: 'Manoj Ucchekar',
      planName: 'Platinum365',
      planCost: '499',
      validity: '365',
      status: 'Active',
    };

    axios.get.mockResolvedValueOnce({ data: userData }); // Mock axios.get to return user data

    render(<UpgradeDowngrade userId="1" />);

    // Wait for the API call to resolve
    await waitFor(() => {
      expect(screen.getByLabelText('Existing Plan')).toHaveValue('Platinum365');
      expect(screen.getByLabelText('Plan Name')).toHaveValue('Platinum365');
      expect(screen.getByLabelText('Plan Cost')).toHaveValue('499');
      expect(screen.getByLabelText('Validity')).toHaveValue('365');
      expect(screen.getByLabelText('Plan Status')).toHaveValue('Active');
    });
  });

  test('displays error message when user is not selected', () => {
    render(<UpgradeDowngrade />);

    expect(screen.getByText('User not selected for renewing plan, Please select user from below list.')).toBeInTheDocument();
  });

  test('submits form data on update button click', async () => {
    axios.post.mockResolvedValueOnce({ data: { isSuccess: true, message: 'Plan updated successfully' } }); // Mock axios.post to return success response

    render(<UpgradeDowngrade userId="1" />);

    // Fill in form fields
    fireEvent.change(screen.getByLabelText('Plan Name'), { target: { value: 'Gold180' } });
    fireEvent.change(screen.getByLabelText('Plan Cost'), { target: { value: '299' } });
    fireEvent.change(screen.getByLabelText('Validity'), { target: { value: '180' } });
    fireEvent.change(screen.getByLabelText('Plan Status'), { target: { value: 'Inactive' } });

    // Submit the form
    fireEvent.click(screen.getByText('Update'));

    // Wait for the form submission and response handling
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledTimes(1); // Check if axios.post is called once
      expect(screen.getByText('Plan updated successfully')).toBeInTheDocument();
    });
  });
});
