import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';

jest.mock('../store/authStore', () => ({
  __esModule: true,
  default: (selector) =>
    selector({ user: { name: 'Atharv', email: 'atharv@test.com' }, logout: jest.fn() }),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
  useLocation: () => ({ pathname: '/dashboard' }),
}));

describe('Navbar', () => {
  it('renders brand name', () => {
    render(<MemoryRouter><Navbar /></MemoryRouter>);
    expect(screen.getByText('SHOPSMART')).toBeInTheDocument();
  });

  it('renders nav links', () => {
    render(<MemoryRouter><Navbar /></MemoryRouter>);
    expect(screen.getByText('DASHBOARD')).toBeInTheDocument();
    expect(screen.getByText('PRODUCTS')).toBeInTheDocument();
    expect(screen.getByText('CART')).toBeInTheDocument();
    expect(screen.getByText('ORDERS')).toBeInTheDocument();
  });

  it('renders user name', () => {
    render(<MemoryRouter><Navbar /></MemoryRouter>);
    expect(screen.getByText('Atharv')).toBeInTheDocument();
  });

  it('renders logout button', () => {
    render(<MemoryRouter><Navbar /></MemoryRouter>);
    expect(screen.getByText('LOGOUT')).toBeInTheDocument();
  });
});
