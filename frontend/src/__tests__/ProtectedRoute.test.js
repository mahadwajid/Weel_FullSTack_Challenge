import { render, screen } from '@testing-library/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider, AuthContext } from '../Context/AuthContext';
import Login from '../Pages/Login';
import DeliveryForm from '../Pages/DeliveryForm';
import React from 'react';

const ProtectedRoute = ({ children }) => {
  const { token } = React.useContext(AuthContext);
  return token ? children : <Login />;
};

describe('Route Guard Tests', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should redirect to login when not authenticated', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/delivery" element={
              <ProtectedRoute>
                <DeliveryForm />
              </ProtectedRoute>
            } />
            <Route path="/login" element={<Login />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    );

    expect(screen.getByText(/Sign In/i)).toBeInTheDocument();
  });

  it('should allow access when authenticated', () => {
    localStorage.setItem('token', 'test-token');

    render(
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/delivery" element={
              <ProtectedRoute>
                <DeliveryForm />
              </ProtectedRoute>
            } />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    );

    expect(screen.getByText(/Delivery Preference/i)).toBeInTheDocument();
  });
});

