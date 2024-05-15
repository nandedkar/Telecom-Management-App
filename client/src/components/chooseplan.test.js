/* eslint-disable testing-library/prefer-find-by */
/* eslint-disable testing-library/prefer-screen-queries */
// ChoosePlan.test.js
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import axios from 'axios';
import ChoosePlan from './ChoosePlan';

// Mock the server and set up request handlers using MSW
const server = setupServer(
  rest.get('http://localhost:5000/api/customers', (req, res, ctx) => {
    return res(ctx.json([{ id: 1, name: 'John Doe' }]));
  }),
  rest.post('http://localhost:5000/api/customers/choosePlan', (req, res, ctx) => {
    return res(ctx.json({ message: 'Plan chosen successfully' }));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('ChoosePlan component', () => {
  test('renders without crashing', () => {
    render(<ChoosePlan />);
  });

  test('fetches user data on mount', async () => {
    const { getByText } = render(<ChoosePlan />);
    await waitFor(() => expect(getByText('John Doe')).toBeInTheDocument());
  });

  test('handles form submission', async () => {
    const { getByLabelText, getByText } = render(<ChoosePlan />);
    
    fireEvent.change(getByLabelText('Select Customer *'), { target: { value: 1 } });
    fireEvent.change(getByLabelText('Plan Name'), { target: { value: 'Platinum365' } });
    fireEvent.change(getByLabelText('Plan Cost'), { target: { value: '499' } });
    fireEvent.change(getByLabelText('Validity'), { target: { value: '365' } });
    fireEvent.change(getByLabelText('Plan Status'), { target: { value: 'Active' } });

    fireEvent.click(getByText('Submit'));

    await waitFor(() =>
      expect(axios.post).toHaveBeenCalledWith(
        'http://localhost:5000/api/customers/choosePlan',
        expect.objectContaining({
          id: 1,
          planName: 'Platinum365',
          planCost: '499',
          validity: '365',
          status: 'Active',
        })
      )
    );
    expect(getByText('Plan chosen successfully')).toBeInTheDocument();
  });

  // Add other test cases as needed
});
