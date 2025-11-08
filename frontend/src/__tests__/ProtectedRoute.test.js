import { render, screen } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import App from '../App';

describe('Route Guard Tests', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should redirect to login when not authenticated', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    expect(screen.getByText(/Sign In/i)).toBeInTheDocument();
  });

  it('should allow access when authenticated', () => {
    localStorage.setItem('token', 'test-token');

    render(
      <MemoryRouter initialEntries={['/delivery']}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText(/Delivery Preference/i)).toBeInTheDocument();
  });
});

