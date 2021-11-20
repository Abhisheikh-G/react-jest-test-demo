import { render, screen } from '@testing-library/react';
import SignUpPage from './SignUpPage';
import userEvent from '@testing-library/user-event';
import { setupServer } from 'msw/node';
import { rest } from 'msw';

describe('Sign Up Page', () => {
  describe('Layout', () => {
    it('has header', () => {
      render(<SignUpPage />);
      const header = screen.queryByRole('heading', { name: 'Sign Up' });
      expect(header).toBeInTheDocument();
    });
    it('has username input', () => {
      render(<SignUpPage />);
      const input = screen.getByLabelText('Username');
      expect(input).toBeInTheDocument();
    });
    it('has email input', () => {
      render(<SignUpPage />);
      const input = screen.getByLabelText('Email');
      expect(input).toBeInTheDocument();
    });
    it('has password input', () => {
      render(<SignUpPage />);
      const input = screen.getByLabelText('Password');
      expect(input).toBeInTheDocument();
    });
    it('has password type for password input', () => {
      render(<SignUpPage />);
      const input = screen.getByLabelText('Password');
      expect(input.type).toBe('password');
    });
    it('has confirm password input', () => {
      render(<SignUpPage />);
      const input = screen.getByLabelText('Confirm Password');
      expect(input).toBeInTheDocument();
    });
    it('has password type for password confirm input', () => {
      render(<SignUpPage />);
      const input = screen.getByLabelText('Confirm Password');
      expect(input.type).toBe('password');
    });
    it('has sign up button', () => {
      render(<SignUpPage />);
      const button = screen.queryByRole('button', { name: 'Sign Up' });
      expect(button).toBeInTheDocument();
    });
    it('sign up button initially disabled', () => {
      render(<SignUpPage />);
      const button = screen.queryByRole('button', { name: 'Sign Up' });
      expect(button).toBeDisabled();
    });
  });
  describe('Interactions', () => {
    it('sign up button enabled when password and confirm password fields match', () => {
      render(<SignUpPage />);
      const passwordInput = screen.getByLabelText('Password');
      const confirmPasswordInput = screen.getByLabelText('Confirm Password');
      userEvent.type(passwordInput, 'password');
      userEvent.type(confirmPasswordInput, 'password');
      const button = screen.queryByRole('button', { name: 'Sign Up' });
      expect(button).toBeEnabled();
    });
    it('sends username, email and password to backend after clicking', async () => {
      let reqBody;
      const server = setupServer(
        rest.post('/api/1.0/users', (req, res, ctx) => {
          reqBody = req.body;
          return res(ctx.status(200));
        })
      );

      server.listen();
      render(<SignUpPage />);
      const userInput = screen.getByLabelText('Username');
      const emailInput = screen.getByLabelText('Email');
      const passwordInput = screen.getByLabelText('Password');
      const confirmPasswordInput = screen.getByLabelText('Confirm Password');

      userEvent.type(userInput, 'Test User');
      userEvent.type(emailInput, 'test@test.com');
      userEvent.type(passwordInput, 'password');
      userEvent.type(confirmPasswordInput, 'password');

      const button = screen.queryByRole('button', { name: 'Sign Up' });

      // const mockFn = jest.fn();
      // axios.post = mockFn;
      // window.fetch = mockFn;

      userEvent.click(button);

      // const firstCallOfMockFunctions = mockFn.mock.calls[0];
      // with axios
      // const body = firstCallOfMockFunctions[1];
      await new Promise((resolve) => setTimeout(resolve, 100));

      // with fetch
      // const body = JSON.parse(firstCallOfMockFunctions[1].body);
      // axios.post('/.......', body);

      expect(reqBody).toEqual({
        username: 'Test User',
        email: 'test@test.com',
        password: 'password',
      });
    });
  });
});
