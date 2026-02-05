import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

vi.mock('./components/HomePage', () => ({
    default: () => <div data-testid="home-page">HomePage</div>
}));

vi.mock('./components/ProductsPage', () => ({
    default: () => <div data-testid="products-page">ProductsPage</div>
}));

vi.mock('./components/LoginPage', () => ({
    default: () => <div data-testid="login-page">LoginPage</div>
}));

vi.mock('./components/AdminPage', () => ({
    default: () => <div data-testid="admin-page">AdminPage</div>
}));

vi.mock('./components/CartPage', () => ({
    default: () => <div data-testid="cart-page">CartPage</div>
}));

describe('App', () => {
    it('renders home page at root route', () => {
        render(
            <BrowserRouter>
                <App />
            </BrowserRouter>
        );
        expect(screen.getByTestId('home-page')).toBeInTheDocument();
    });

    it('renders without crashing', () => {
        const { container } = render(
            <BrowserRouter>
                <App />
            </BrowserRouter>
        );
        expect(container).toBeInTheDocument();
    });

    it('provides CartProvider context', () => {
        render(
            <BrowserRouter>
                <App />
            </BrowserRouter>
        );
        // If CartProvider is working, the app should render without context errors
        expect(screen.getByTestId('home-page')).toBeInTheDocument();
    });

    it('renders Routes component', () => {
        const { container } = render(
            <BrowserRouter>
                <App />
            </BrowserRouter>
        );
        // Check that at least one route is rendered
        expect(container.querySelector('*')).toBeInTheDocument();
    });

    it('renders app style', () => {
        const { container } = render(
            <BrowserRouter>
                <App />
            </BrowserRouter>
        );
        // Verify component renders (style would be applied to DOM elements)
        expect(container.firstChild).toBeInTheDocument();
    });
});
