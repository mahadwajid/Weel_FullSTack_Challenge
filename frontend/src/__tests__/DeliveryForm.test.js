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

describe('DeliveryForm Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.setItem('token', 'test-token');
  });

  it('should render delivery form', () => {
    renderWithRouter(<DeliveryForm />);
    expect(screen.getByText(/Delivery Preference/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Delivery Type/i)).toBeInTheDocument();
  });

  describe('Conditional Fields', () => {
    it('should show phone field when DELIVERY is selected', () => {
      renderWithRouter(<DeliveryForm />);
      
      const select = screen.getByLabelText(/Delivery Type/i);
      fireEvent.change(select, { target: { value: 'DELIVERY' } });

      expect(screen.getByLabelText(/Phone Number/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Delivery Address/i)).toBeInTheDocument();
    });

    it('should show phone field when CURBSIDE is selected', () => {
      renderWithRouter(<DeliveryForm />);
      
      const select = screen.getByLabelText(/Delivery Type/i);
      fireEvent.change(select, { target: { value: 'CURBSIDE' } });

      expect(screen.getByLabelText(/Phone Number/i)).toBeInTheDocument();
      expect(screen.queryByLabelText(/Delivery Address/i)).not.toBeInTheDocument();
    });

    it('should not show phone or address when IN_STORE is selected', () => {
      renderWithRouter(<DeliveryForm />);
      
      const select = screen.getByLabelText(/Delivery Type/i);
      fireEvent.change(select, { target: { value: 'IN_STORE' } });

      expect(screen.queryByLabelText(/Phone Number/i)).not.toBeInTheDocument();
      expect(screen.queryByLabelText(/Delivery Address/i)).not.toBeInTheDocument();
    });
  });

  describe('Past Time Block', () => {
    it('should allow future datetime', async () => {
      api.post.mockResolvedValue({ data: { id: 1 } });
      
      renderWithRouter(<DeliveryForm />);
      
      const select = screen.getByLabelText(/Delivery Type/i);
      fireEvent.change(select, { target: { value: 'IN_STORE' } });

      const futureDate = new Date(Date.now() + 1000 * 60 * 60 * 24);
      const dateTimeInput = screen.getByLabelText(/Pickup\/Delivery Date & Time/i);
      const formattedDate = futureDate.toISOString().slice(0, 16);
      
      fireEvent.change(dateTimeInput, { target: { value: formattedDate } });
      fireEvent.click(screen.getByRole('button', { name: /Continue/i }));

      await waitFor(() => {
        expect(api.post).toHaveBeenCalled();
      });
    });

    it('should block past datetime on backend', async () => {
      api.post.mockRejectedValue({
        response: { data: { error: 'Pickup time must be in the future' } }
      });

      renderWithRouter(<DeliveryForm />);
      
      const select = screen.getByLabelText(/Delivery Type/i);
      fireEvent.change(select, { target: { value: 'IN_STORE' } });

      const pastDate = new Date(Date.now() - 1000 * 60 * 60 * 24);
      const dateTimeInput = screen.getByLabelText(/Pickup\/Delivery Date & Time/i);
      const formattedDate = pastDate.toISOString().slice(0, 16);
      
      fireEvent.change(dateTimeInput, { target: { value: formattedDate } });
      fireEvent.click(screen.getByRole('button', { name: /Continue/i }));

      await waitFor(() => {
        expect(screen.getByText(/Pickup time must be in the future/i)).toBeInTheDocument();
      });
    });
  });
});

