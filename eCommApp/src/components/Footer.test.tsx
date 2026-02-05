import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Footer from './Footer';

describe('Footer', () => {
    it('renders footer element', () => {
        const { container } = render(<Footer />);
        expect(container.querySelector('footer.app-footer')).toBeInTheDocument();
    });

    it('displays copyright text', () => {
        render(<Footer />);
        expect(screen.getByText(/2025 The Daily Harvest/)).toBeInTheDocument();
    });

    it('displays rights reserved text', () => {
        render(<Footer />);
        expect(screen.getByText(/All rights reserved/)).toBeInTheDocument();
    });

    it('copyright text is in a paragraph', () => {
        const { container } = render(<Footer />);
        const paragraph = container.querySelector('footer p');
        expect(paragraph).toHaveTextContent('2025 The Daily Harvest. All rights reserved.');
    });
});
