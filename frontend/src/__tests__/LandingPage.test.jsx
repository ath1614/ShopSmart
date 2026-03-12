import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';

describe('LandingPage', () => {
  it('renders hero heading', () => {
    render(<MemoryRouter><LandingPage /></MemoryRouter>);
    expect(screen.getByText(/SHOP/i)).toBeInTheDocument();
  });

  it('renders Get Started link', () => {
    render(<MemoryRouter><LandingPage /></MemoryRouter>);
    expect(screen.getByText('GET STARTED')).toBeInTheDocument();
  });

  it('renders Log In link', () => {
    render(<MemoryRouter><LandingPage /></MemoryRouter>);
    expect(screen.getByText('LOG IN')).toBeInTheDocument();
  });

  it('renders all feature cards', () => {
    render(<MemoryRouter><LandingPage /></MemoryRouter>);
    expect(screen.getByText('AI-Powered Search')).toBeInTheDocument();
    expect(screen.getByText('Smart Cart')).toBeInTheDocument();
    expect(screen.getByText('Seller Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Secure Auth')).toBeInTheDocument();
  });
});
