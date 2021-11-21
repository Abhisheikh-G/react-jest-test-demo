import { render } from '@testing-library/react';
import Input from './Input';

xit('has is-invalid class for input when error is set', () => {
  const { container } = render(
    <Input errors={[{ username: 'Username cannot be null' }]} />
  );
  const input = container.querySelector('input');
  expect(input.classList).toContain('is-invalid');
});

xit('has invalid-feedback class for div when error is set', () => {
  const { container } = render(
    <Input errors={[{ username: 'Username cannot be null' }]} />
  );
  const input = container.querySelector('div');
  expect(input.classList).toContain('invalid-feedback');
});

it('does not have is-invalid class for input when error is not set', () => {
  const { container } = render(<Input errors={[]} />);
  const input = container.querySelector('input');
  expect(input.classList).not.toContain('is-invalid');
});
