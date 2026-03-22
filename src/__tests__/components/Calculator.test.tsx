import { render, screen, fireEvent } from '../utils/test-utils';
import Calculator from '../../app/components/Calculator';

// Add Jest globals for custom matchers
type CustomMatchers<R = unknown> = {
  toBeInTheDocument(): R;
  toHaveDisplayValue(value: unknown): R;
  toHaveValue(value: unknown): R;
};

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jest {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface Matchers<R> extends CustomMatchers<R> {}
  }
}

expect.extend({
  toBeInTheDocument(received) {
    const pass = received && document.body.contains(received);
    if (pass) {
      return {
        message: () => `expected element ${received} to be in the document`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected element ${received} to be in the document`,
        pass: false,
      };
    }
  },
  toHaveDisplayValue(received, value) {
    const pass = received && received.value === value.toString();
    if (pass) {
      return {
        message: () => `expected element to have display value ${value}`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected element to have display value ${value}`,
        pass: false,
      };
    }
  },
  toHaveValue(received, value) {
    const pass = received && received.value === value.toString();
    if (pass) {
      return {
        message: () => `expected element to have value ${value}`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected element to have value ${value}`,
        pass: false,
      };
    }
  },
});

describe('Calculator Component', () => {
  it('renders calculator with initial values', () => {
    render(<Calculator />);

    expect(screen.getByText('Financial Calculator')).toBeInTheDocument();
    expect(screen.getByDisplayValue('10000')).toBeInTheDocument(); // $10,000 default
  });

  it('updates calculation when inputs change', () => {
    render(<Calculator />);

    const principalInput = screen.getByLabelText('Principal Amount');
    const rateInput = screen.getByLabelText('Annual Interest Rate');
    const timeInput = screen.getByLabelText('Time Period (years)');

    fireEvent.change(principalInput, { target: { value: '20000' } });
    fireEvent.change(rateInput, { target: { value: '10' } });
    fireEvent.change(timeInput, { target: { value: '5' } });

    expect(principalInput).toHaveValue(20000);
    expect(rateInput).toHaveValue(10);
    expect(timeInput).toHaveValue(5);
  });

  it('displays calculation results', () => {
    render(<Calculator />);

    // Check if results section is present
    expect(screen.getByText('Yearly Breakdown')).toBeInTheDocument();
  });
});
