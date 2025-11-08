import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import DeliveryForm from '../Pages/DeliveryForm';
import { AuthProvider } from '../Context/AuthContext';
import api from '../API';

jest.mock('../API');

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        {component}
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('AI Suggestion Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    localStorage.setItem('token', 'test-token');
  });

  it('should show AI button when delivery type is selected', () => {
    renderWithRouter(<DeliveryForm />);
    
    const deliveryTypeSelect = screen.getByLabelText(/Delivery Type/i);
    fireEvent.change(deliveryTypeSelect, { target: { value: 'IN_STORE' } });

    const aiButton = screen.getByText(/✨ AI/i);
    expect(aiButton).toBeInTheDocument();
  });

  it('should not show AI button when delivery type is not selected', () => {
    renderWithRouter(<DeliveryForm />);
    
    const aiButton = screen.queryByText(/✨ AI/i);
    expect(aiButton).not.toBeInTheDocument();
  });

  it('should call AI endpoint when button is clicked', async () => {
    const mockSuggestion = {
      suggestedTime: '2024-12-25T14:30',
      aiPowered: false
    };

    api.post.mockResolvedValue({ data: mockSuggestion });

    renderWithRouter(<DeliveryForm />);
    
    // Select delivery type
    const deliveryTypeSelect = screen.getByLabelText(/Delivery Type/i);
    fireEvent.change(deliveryTypeSelect, { target: { value: 'DELIVERY' } });

    // Click AI button
    const aiButton = screen.getByText(/✨ AI/i);
    fireEvent.click(aiButton);

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith(
        '/ai/suggest-time',
        expect.objectContaining({
          deliveryType: 'DELIVERY',
        }),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: expect.stringContaining('Bearer'),
          }),
        })
      );
    });
  });

  it('should apply suggested time to form', async () => {
    const mockSuggestion = {
      suggestedTime: '2024-12-25T14:30',
      aiPowered: true
    };

    api.post.mockResolvedValue({ data: mockSuggestion });

    renderWithRouter(<DeliveryForm />);
    
    const deliveryTypeSelect = screen.getByLabelText(/Delivery Type/i);
    fireEvent.change(deliveryTypeSelect, { target: { value: 'IN_STORE' } });

    const aiButton = screen.getByText(/✨ AI/i);
    fireEvent.click(aiButton);

    await waitFor(() => {
      const datetimeInput = screen.getByLabelText(/Pickup\/Delivery Date & Time/i);
      expect(datetimeInput.value).toBe('2024-12-25T14:30');
    });
  });

  it('should show message when delivery type is not selected', async () => {
    renderWithRouter(<DeliveryForm />);
    
    // Try to click AI button without selecting delivery type
    // Button shouldn't be visible, but let's test the validation
    const deliveryTypeSelect = screen.getByLabelText(/Delivery Type/i);
    expect(deliveryTypeSelect.value).toBe('');
    
    // AI button should not be visible
    const aiButton = screen.queryByText(/✨ AI/i);
    expect(aiButton).not.toBeInTheDocument();
  });

  it('should handle AI API errors gracefully', async () => {
    api.post.mockRejectedValue({ response: { data: { error: 'API error' } } });

    renderWithRouter(<DeliveryForm />);
    
    const deliveryTypeSelect = screen.getByLabelText(/Delivery Type/i);
    fireEvent.change(deliveryTypeSelect, { target: { value: 'CURBSIDE' } });

    const aiButton = screen.getByText(/✨ AI/i);
    fireEvent.click(aiButton);

    await waitFor(() => {
      expect(screen.getByText(/Unable to get suggestion/i)).toBeInTheDocument();
    });
  });

  it('should show loading state while fetching suggestion', async () => {
    let resolvePromise;
    const promise = new Promise((resolve) => {
      resolvePromise = resolve;
    });

    api.post.mockReturnValue(promise);

    renderWithRouter(<DeliveryForm />);
    
    const deliveryTypeSelect = screen.getByLabelText(/Delivery Type/i);
    fireEvent.change(deliveryTypeSelect, { target: { value: 'IN_STORE' } });

    const aiButton = screen.getByText(/✨ AI/i);
    fireEvent.click(aiButton);

    // Should show loading state
    expect(screen.getByText(/🤖\.\.\./i)).toBeInTheDocument();

    // Resolve the promise
    resolvePromise({ data: { suggestedTime: '2024-12-25T14:30', aiPowered: false } });

    await waitFor(() => {
      expect(screen.queryByText(/🤖\.\.\./i)).not.toBeInTheDocument();
    });
  });
});

