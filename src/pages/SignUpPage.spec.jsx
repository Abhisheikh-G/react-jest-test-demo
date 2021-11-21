import {
  render,
  screen,
  waitForElementToBeRemoved,
  waitFor,
  act,
} from '@testing-library/react';
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
    let button, reqBody, passwordInput, confirmPasswordInput, usernameInput;
    const message = 'Please check your e-mail to activate your account';
    let counter = 0;
    const server = setupServer(
      rest.post('/api/1.0/users', (req, res, ctx) => {
        reqBody = req.body;
        counter += 1;
        return res(ctx.status(200));
      })
    );

    beforeEach(() => {
      counter = 0;
      server.resetHandlers();
    });

    beforeAll(() => server.listen());

    afterAll(() => server.close());

    const setup = () => {
      render(<SignUpPage />);
      usernameInput = screen.getByLabelText('Username');
      const emailInput = screen.getByLabelText('Email');
      passwordInput = screen.getByLabelText('Password');
      confirmPasswordInput = screen.getByLabelText('Confirm Password');
      userEvent.type(usernameInput, 'Test User');
      userEvent.type(emailInput, 'test@test.com');
      userEvent.type(passwordInput, 'password');
      userEvent.type(confirmPasswordInput, 'password');
      button = screen.queryByRole('button', { name: 'Sign Up' });
    };
    it('sign up button enabled when password and confirm password fields match', () => {
      setup();
      expect(button).toBeEnabled();
    });
    it('sends username, email and password to backend after clicking', async () => {
      setup();

      // const mockFn = jest.fn();
      // axios.post = mockFn;
      // window.fetch = mockFn;

      userEvent.click(button);

      // const firstCallOfMockFunctions = mockFn.mock.calls[0];
      // with axios
      // const body = firstCallOfMockFunctions[1];
      await screen.findByText(message);

      // with fetch
      // const body = JSON.parse(firstCallOfMockFunctions[1].body);
      // axios.post('/.......', body);

      expect(reqBody).toEqual({
        username: 'Test User',
        email: 'test@test.com',
        password: 'password',
      });
    });

    it('disables submit button when sending request to backend', async () => {
      setup();
      userEvent.click(button);
      userEvent.click(button);
      await screen.findByText(message);
      expect(counter).toBe(1);
    });

    it('display spinner while the api is in progress', async () => {
      setup();
      expect(
        screen.queryByRole('status', { hidden: true })
      ).not.toBeInTheDocument();
      userEvent.click(button);
      const spinner = screen.getByRole('status', { hidden: true });
      expect(spinner).toBeInTheDocument();
      await screen.findByText(message);
    });

    it('displays account activation notification after successful sign up request', async () => {
      setup();
      expect(screen.queryByText(message)).not.toBeInTheDocument();
      userEvent.click(button);
      const text = await screen.findByText(message);
      expect(text).toBeInTheDocument();
    });

    it('hides form after successful sign up request', async () => {
      setup();
      const form = screen.getByTestId('form-sign-up');
      userEvent.click(button);
      await waitForElementToBeRemoved(form);
    });

    const generateValidationError = (field, message) => {
      return rest.post('/api/1.0/users', (req, res, ctx) => {
        return res(
          ctx.status(400),
          ctx.json({
            validationErrors: {
              [field]: message,
            },
          })
        );
      });
    };

    it.each`
      field         | message
      ${'username'} | ${'Username cannot be null'}
      ${'email'}    | ${'Email cannot be null'}
      ${'password'} | ${'Password cannot be null'}
    `('displays $message for $field', async ({ field, message }) => {
      server.use(generateValidationError(field, message));
      setup();
      userEvent.click(button);
      const validationError = await screen.findByText(message);
      expect(validationError).toBeInTheDocument();
    });

    it('hides spinner and enables button', async () => {
      server.use(
        generateValidationError('username', 'Username cannot be null')
      );
      setup();
      userEvent.click(button);
      await screen.findByText('Username cannot be null');
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
      expect(button).toBeEnabled();
    });

    it('displays mismatch message for confirm password input', () => {
      setup();
      userEvent.type(passwordInput, 'P4ssword1');
      userEvent.type(confirmPasswordInput, 'P4ssword');
      const validationError = screen.queryByText('Passwords do not match');
      expect(validationError).toBeInTheDocument();
    });

    it('clears validation error after username field is updated', async () => {
      let validationError;
      server.use(
        generateValidationError('username', 'Username cannot be null')
      );
      setup();
      userEvent.click(button);
      validationError = await screen.findByText('Username cannot be null');

      userEvent.type(usernameInput, 'username001');
      userEvent.type(passwordInput, 'newpassword');

      userEvent.click(button);
      await waitFor(() => {
        expect(validationError).not.toBeInTheDocument();
      });
    });
  });
});
