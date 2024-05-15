/* eslint-disable testing-library/prefer-screen-queries */
// Register.test.js
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import axios from 'axios';
import Register from './Register';

// Mock the server and set up request handlers using MSW
const server = setupServer(
  rest.post('http://localhost:5000/api/customers/register', (req, res, ctx) => {
    // Simulate a successful registration
    return res(ctx.json({ message: 'Registration successful', isSuccess: true }));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('Register component', () => {
  test('handles form submission', async () => {
    const { getByLabelText, getByText } = render(<Register />);
    
    fireEvent.change(getByLabelText('Name'), { target: { value: 'John Doe' } });
    fireEvent.change(getByLabelText('DOB'), { target: { value: '01/01/1990' } });
    fireEvent.change(getByLabelText('Email'), { target: { value: 'johndoe@example.com' } });
    fireEvent.change(getByLabelText('Aadhar'), { target: { value: '123456789012' } });
    fireEvent.change(getByLabelText('Mobile No'), { target: { value: '9876543210' } });

    fireEvent.click(getByText('Register'));

    await waitFor(() =>
      expect(axios.post).toHaveBeenCalledWith(
        'http://localhost:5000/api/customers/register',
        expect.objectContaining({
          name: 'John Doe',
          dob: '01/01/1990',
          email: 'johndoe@example.com',
          adharNumber: '123456789012',
          mobileNumber: '9876543210',
        })
      )
    );

    // Assert success message after form submission
    expect(getByText('Registration successful')).toBeInTheDocument();
  });
});
