import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Summary from '../Pages/Summary';
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

describe('Summary Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.setItem('token', 'test-token');
  });

  it('should show loading state initially', () => {
    api.get.mockImplementation(() => new Promise(() => {})); // Never resolves
    
    localStorage.setItem('orderId', '1');
    renderWithRouter(<Summary />);
    
    expect(screen.getByText(/Loading order details/i)).toBeInTheDocument();
  });

  it('should display order summary consistently', async () => {
    const mockOrder = {
      id: 1,
      deliveryType: 'DELIVERY',
      phone: '1234567890',
      address: '123 Main St',
      pickupDatetime: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
      notes: 'Test notes'
    };

    api.get.mockResolvedValue({ data: mockOrder });
    localStorage.setItem('orderId', '1');

    renderWithRouter(<Summary />);

    await waitFor(() => {
      expect(screen.getByText(/Order Summary/i)).toBeInTheDocument();
      expect(screen.getByText(/#1/i)).toBeInTheDocument();
      expect(screen.getByText(/Home Delivery/i)).toBeInTheDocument();
      expect(screen.getByText(/1234567890/i)).toBeInTheDocument();
      expect(screen.getByText(/123 Main St/i)).toBeInTheDocument();
      expect(screen.getByText(/Test notes/i)).toBeInTheDocument();
    });
  });

  it('should display IN_STORE order correctly', async () => {
    const mockOrder = {
      id: 2,
      deliveryType: 'IN_STORE',
      pickupDatetime: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString()
    };

    api.get.mockResolvedValue({ data: mockOrder });
    localStorage.setItem('orderId', '2');

    renderWithRouter(<Summary />);

    await waitFor(() => {
      expect(screen.getByText(/In Store Pickup/i)).toBeInTheDocument();
      expect(screen.queryByText(/Phone/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/Address/i)).not.toBeInTheDocument();
    });
  });

  it('should display CURBSIDE order correctly', async () => {
    const mockOrder = {
      id: 3,
      deliveryType: 'CURBSIDE',
      phone: '9876543210',
      pickupDatetime: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString()
    };

    api.get.mockResolvedValue({ data: mockOrder });
    localStorage.setItem('orderId', '3');

    renderWithRouter(<Summary />);

    await waitFor(() => {
      expect(screen.getByText(/Curbside Pickup/i)).toBeInTheDocument();
      expect(screen.getByText(/9876543210/i)).toBeInTheDocument();
      expect(screen.queryByText(/Address/i)).not.toBeInTheDocument();
    });
  });

  it('should have Edit Order and Sign Out buttons', async () => {
    const mockOrder = {
      id: 1,
      deliveryType: 'IN_STORE',
      pickupDatetime: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString()
    };

    api.get.mockResolvedValue({ data: mockOrder });
    localStorage.setItem('orderId', '1');

    renderWithRouter(<Summary />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Edit Order/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Sign Out/i })).toBeInTheDocument();
    });
  });
});

