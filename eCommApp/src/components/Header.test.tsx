import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Header from './Header';

const renderWithRouter = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('Header', () => {
    it('renders the app title', () => {
        renderWithRouter(<Header />);
        expect(screen.getByText('The Daily Harvest')).toBeInTheDocument();
    });

    it('renders navigation links', () => {
        renderWithRouter(<Header />);
        expect(screen.getByText('Home')).toBeInTheDocument();
        expect(screen.getByText('Products')).toBeInTheDocument();
        expect(screen.getByText('Cart')).toBeInTheDocument();
    });

    it('renders admin login button', () => {
        renderWithRouter(<Header />);
        expect(screen.getByText('Admin Login')).toBeInTheDocument();
    });

    it('has correct link hrefs', () => {
        renderWithRouter(<Header />);
        const homeLink = screen.getByText('Home').closest('a');
        const productsLink = screen.getByText('Products').closest('a');
        const cartLink = screen.getByText('Cart').closest('a');

        expect(homeLink).toHaveAttribute('href', '/');
        expect(productsLink).toHaveAttribute('href', '/products');
        expect(cartLink).toHaveAttribute('href', '/cart');
    });

    it('has header with correct CSS class', () => {
        const { container } = renderWithRouter(<Header />);
        expect(container.querySelector('header.app-header')).toBeInTheDocument();
    });

    it('has navigation element', () => {
        const { container } = renderWithRouter(<Header />);
        expect(container.querySelector('nav')).toBeInTheDocument();
    });

    it('admin login button is inside a link', () => {
        renderWithRouter(<Header />);
        const adminButton = screen.getByText('Admin Login');
        expect(adminButton.tagName).toBe('BUTTON');
        expect(adminButton.closest('a')).toHaveAttribute('href', '/login');
    });
});
