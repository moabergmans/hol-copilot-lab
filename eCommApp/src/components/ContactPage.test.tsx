import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import ContactPage from './ContactPage';

// Mock components
vi.mock('./Header', () => ({
    default: () => <div data-testid="header">Header</div>
}));

vi.mock('./Footer', () => ({
    default: () => <div data-testid="footer">Footer</div>
}));

describe('ContactPage', () => {
    it('renders contact page heading', () => {
        render(<ContactPage />);
        expect(screen.getByText('Contact Us')).toBeInTheDocument();
    });

    it('displays phone number with tel link', () => {
        render(<ContactPage />);
        const phoneLink = screen.getByText('+467-22-33-44-55');
        expect(phoneLink).toBeInTheDocument();
        expect(phoneLink).toHaveAttribute('href', 'tel:+467-22-33-44-55');
    });

    it('displays email with mailto link', () => {
        render(<ContactPage />);
        const emailLink = screen.getByText('dailyharvest@mail.se');
        expect(emailLink).toBeInTheDocument();
        expect(emailLink).toHaveAttribute('href', 'mailto:dailyharvest@mail.se');
    });

    it('displays address', () => {
        render(<ContactPage />);
        expect(screen.getByText('T-centralen Stockholm')).toBeInTheDocument();
    });

    it('displays Google Maps link', () => {
        render(<ContactPage />);
        const mapsLink = screen.getByText('View on Google Maps');
        expect(mapsLink).toBeInTheDocument();
        expect(mapsLink).toHaveAttribute('href', expect.stringContaining('google.com/maps'));
        expect(mapsLink).toHaveAttribute('target', '_blank');
        expect(mapsLink).toHaveAttribute('rel', 'noopener noreferrer');
    });
});
