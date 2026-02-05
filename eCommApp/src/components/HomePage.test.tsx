import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import HomePage from './HomePage';

vi.mock('./Header', () => ({
    default: () => <div data-testid="header">Header</div>
}));

vi.mock('./Footer', () => ({
    default: () => <div data-testid="footer">Footer</div>
}));

const renderWithRouter = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('HomePage', () => {
    it('renders main app container', () => {
        const { container } = renderWithRouter(<HomePage />);
        expect(container.querySelector('.app')).toBeInTheDocument();
    });

    it('renders header component', () => {
        renderWithRouter(<HomePage />);
        expect(screen.getByTestId('header')).toBeInTheDocument();
    });

    it('renders footer component', () => {
        renderWithRouter(<HomePage />);
        expect(screen.getByTestId('footer')).toBeInTheDocument();
    });

    it('renders welcome heading', () => {
        renderWithRouter(<HomePage />);
        expect(screen.getByText('Welcome to the The Daily Harvest!')).toBeInTheDocument();
    });

    it('heading is h2 element', () => {
        renderWithRouter(<HomePage />);
        const heading = screen.getByText('Welcome to the The Daily Harvest!');
        expect(heading.tagName).toBe('H2');
    });

    it('renders products page link text', () => {
        renderWithRouter(<HomePage />);
        expect(screen.getByText(/Check out our products page/)).toBeInTheDocument();
    });

    it('renders main content section', () => {
        const { container } = renderWithRouter(<HomePage />);
        expect(container.querySelector('main.main-content')).toBeInTheDocument();
    });

    it('contains all expected text content', () => {
        renderWithRouter(<HomePage />);
        expect(screen.getByText('Welcome to the The Daily Harvest!')).toBeInTheDocument();
        expect(screen.getByText('Check out our products page for some great deals.')).toBeInTheDocument();
    });
});
