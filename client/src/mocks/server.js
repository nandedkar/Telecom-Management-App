// src/mocks/server.js
import { setupServer } from 'msw/node';
import { rest } from 'msw';

// Mock API handler for GET request to fetch user data
const server = setupServer(
  rest.get('http://localhost:5000/api/customers/userById/:userId', (req, res, ctx) => {
    const { userId } = req.params;
    // Mock response data based on the userId
    if (userId === '1') {
      return res(
        ctx.status(200),
        ctx.json({
          id: '1',
          name: 'Manoj Ucchekar',
          email: 'manoj@gmail.com',
          mobile: '1234567890',
        })
      );
    } else {
      return res(
        ctx.status(404),
        ctx.json({ error: 'User not found' })
      );
    }
  })
);

export { server };
