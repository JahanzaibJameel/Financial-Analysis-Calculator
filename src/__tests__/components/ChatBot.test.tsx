import { render, screen, fireEvent, waitFor } from '../utils/test-utils';
import ChatBot from '../../app/components/ChatBot';

describe('ChatBot Component', () => {
  it('renders chat interface', () => {
    render(<ChatBot />);

    expect(screen.getByText('AI Financial Assistant')).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/Ask me anything about finance/i)
    ).toBeInTheDocument();
  });

  it('toggles mock mode', async () => {
    render(<ChatBot />);

    const mockModeButton = screen.getByText('Mock Mode');
    expect(mockModeButton).toBeInTheDocument();

    fireEvent.click(mockModeButton);

    await waitFor(() => {
      expect(screen.getByText('Live Mode')).toBeInTheDocument();
    });
  });

  it('sends messages', async () => {
    render(<ChatBot />);

    const input = screen.getByPlaceholderText(/Ask me anything about finance/i);
    const sendButton = screen.getByRole('button', { name: /send/i });

    fireEvent.change(input, {
      target: { value: 'What is compound interest?' },
    });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(
        screen.getByText('What is compound interest?')
      ).toBeInTheDocument();
    });
  });
});
