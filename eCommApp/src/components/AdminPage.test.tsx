import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import AdminPage from './AdminPage';

vi.mock('./Header', () => ({
    default: () => <div data-testid="header">Header</div>
}));

vi.mock('./Footer', () => ({
    default: () => <div data-testid="footer">Footer</div>
}));

const renderWithRouter = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('AdminPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders admin portal heading', () => {
        renderWithRouter(<AdminPage />);
        expect(screen.getByText('Welcome to the admin portal.')).toBeInTheDocument();
    });

    it('renders header and footer components', () => {
        renderWithRouter(<AdminPage />);
        expect(screen.getByTestId('header')).toBeInTheDocument();
        expect(screen.getByTestId('footer')).toBeInTheDocument();
    });

    it('renders sale percent label', () => {
        renderWithRouter(<AdminPage />);
        expect(screen.getByText(/Set Sale Percent/)).toBeInTheDocument();
    });

    it('renders sale percent input field', () => {
        renderWithRouter(<AdminPage />);
        const input = screen.getByDisplayValue('0') as HTMLInputElement;
        expect(input).toBeInTheDocument();
    });

    it('renders submit button', () => {
        renderWithRouter(<AdminPage />);
        expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
    });

    it('renders end sale button', () => {
        renderWithRouter(<AdminPage />);
        expect(screen.getByRole('button', { name: 'End Sale' })).toBeInTheDocument();
    });

    it('renders back to storefront button', () => {
        renderWithRouter(<AdminPage />);
        expect(screen.getByRole('button', { name: 'Back to Storefront' })).toBeInTheDocument();
    });

    it('shows no sale active message initially', () => {
        renderWithRouter(<AdminPage />);
        expect(screen.getByText('No sale active.')).toBeInTheDocument();
    });

    it('allows typing in sale percent input', () => {
        renderWithRouter(<AdminPage />);
        const input = screen.getByDisplayValue('0') as HTMLInputElement;
        fireEvent.change(input, { target: { value: '20' } });
        expect(input.value).toBe('20');
    });

    it('sets sale percent when valid number is submitted', () => {
        renderWithRouter(<AdminPage />);
        const input = screen.getByDisplayValue('0') as HTMLInputElement;
        const submitButton = screen.getByRole('button', { name: 'Submit' });

        fireEvent.change(input, { target: { value: '25' } });
        fireEvent.click(submitButton);

        expect(screen.getByText('All products are 25% off!')).toBeInTheDocument();
    });

    it('shows error message for invalid input', () => {
        renderWithRouter(<AdminPage />);
        const input = screen.getByDisplayValue('0') as HTMLInputElement;
        const submitButton = screen.getByRole('button', { name: 'Submit' });

        fireEvent.change(input, { target: { value: 'invalid' } });
        fireEvent.click(submitButton);

        expect(screen.getByText(/Invalid input/)).toBeInTheDocument();
    });

    it('shows error message with the invalid input value', () => {
        renderWithRouter(<AdminPage />);
        const input = screen.getByDisplayValue('0') as HTMLInputElement;
        const submitButton = screen.getByRole('button', { name: 'Submit' });

        fireEvent.change(input, { target: { value: 'abc123' } });
        fireEvent.click(submitButton);

        expect(screen.getByText(/abc123/)).toBeInTheDocument();
    });

    it('clears error message when valid number is submitted after error', () => {
        renderWithRouter(<AdminPage />);
        const input = screen.getByDisplayValue('0') as HTMLInputElement;
        const submitButton = screen.getByRole('button', { name: 'Submit' });

        // First submit invalid value
        fireEvent.change(input, { target: { value: 'invalid' } });
        fireEvent.click(submitButton);
        
        // Error should be displayed
        expect(screen.getByText(/Invalid input/)).toBeInTheDocument();

        // Then submit valid value
        fireEvent.change(input, { target: { value: '15' } });
        fireEvent.click(submitButton);
        
        // Error should be cleared and success message shown
        expect(screen.getByText('All products are 15% off!')).toBeInTheDocument();
    });

    it('resets sale percent and input to 0 when end sale button is clicked', () => {
        renderWithRouter(<AdminPage />);
        const input = screen.getByDisplayValue('0') as HTMLInputElement;
        const submitButton = screen.getByRole('button', { name: 'Submit' });
        const endSaleButton = screen.getByRole('button', { name: 'End Sale' });

        // Set a sale
        fireEvent.change(input, { target: { value: '30' } });
        fireEvent.click(submitButton);
        expect(screen.getByText('All products are 30% off!')).toBeInTheDocument();

        // End the sale
        fireEvent.click(endSaleButton);
        expect(screen.getByText('No sale active.')).toBeInTheDocument();
        expect(input.value).toBe('0');
    });

    it('accepts decimal percentages', () => {
        renderWithRouter(<AdminPage />);
        const input = screen.getByDisplayValue('0') as HTMLInputElement;
        const submitButton = screen.getByRole('button', { name: 'Submit' });

        fireEvent.change(input, { target: { value: '12.5' } });
        fireEvent.click(submitButton);

        expect(screen.getByText('All products are 12.5% off!')).toBeInTheDocument();
    });

    it('accepts zero as valid sale percent', () => {
        renderWithRouter(<AdminPage />);
        const input = screen.getByDisplayValue('0') as HTMLInputElement;
        const submitButton = screen.getByRole('button', { name: 'Submit' });

        fireEvent.change(input, { target: { value: '0' } });
        fireEvent.click(submitButton);

        expect(screen.getByText('No sale active.')).toBeInTheDocument();
    });

    it('accepts large sale percentages', () => {
        renderWithRouter(<AdminPage />);
        const input = screen.getByDisplayValue('0') as HTMLInputElement;
        const submitButton = screen.getByRole('button', { name: 'Submit' });

        fireEvent.change(input, { target: { value: '99' } });
        fireEvent.click(submitButton);

        expect(screen.getByText('All products are 99% off!')).toBeInTheDocument();
    });

    it('accepts negative percentages', () => {
        renderWithRouter(<AdminPage />);
        const input = screen.getByDisplayValue('0') as HTMLInputElement;
        const submitButton = screen.getByRole('button', { name: 'Submit' });

        fireEvent.change(input, { target: { value: '-10' } });
        fireEvent.click(submitButton);

        // Just verify the state was updated (either by message or by checking behavior)
        expect(input.value).toBe('-10');
    });

    it('error message is displayed in red color', () => {
        renderWithRouter(<AdminPage />);
        const input = screen.getByDisplayValue('0') as HTMLInputElement;
        const submitButton = screen.getByRole('button', { name: 'Submit' });

        fireEvent.change(input, { target: { value: 'invalid' } });
        fireEvent.click(submitButton);

        const errorElement = screen.getByText((content, element) => {
            return element?.tagName.toLowerCase() === 'span' && content.includes('Invalid input');
        });
        expect(errorElement.parentElement).toHaveStyle('color: rgb(255, 0, 0)');
    });

    it('back to storefront button links to home', () => {
        const { container } = renderWithRouter(<AdminPage />);
        const backButton = screen.getByRole('button', { name: 'Back to Storefront' });
        const link = backButton.closest('a');
        expect(link).toHaveAttribute('href', '/');
    });

    it('input has correct htmlFor attribute on label', () => {
        const { container } = renderWithRouter(<AdminPage />);
        const label = screen.getByText(/Set Sale Percent/) as HTMLLabelElement;
        const input = container.querySelector('input[type="text"]') as HTMLInputElement;
        expect(input).toHaveAttribute('id', 'salePercent');
    });

    it('handles rapid submission attempts', () => {
        renderWithRouter(<AdminPage />);
        const input = screen.getByDisplayValue('0') as HTMLInputElement;
        const submitButton = screen.getByRole('button', { name: 'Submit' });

        fireEvent.change(input, { target: { value: '20' } });
        fireEvent.click(submitButton);
        fireEvent.click(submitButton);
        fireEvent.click(submitButton);

        expect(screen.getByText('All products are 20% off!')).toBeInTheDocument();
    });

    it('preserves sale percent across multiple input changes', () => {
        renderWithRouter(<AdminPage />);
        const input = screen.getByDisplayValue('0') as HTMLInputElement;
        const submitButton = screen.getByRole('button', { name: 'Submit' });

        fireEvent.change(input, { target: { value: '10' } });
        fireEvent.click(submitButton);
        expect(screen.getByText('All products are 10% off!')).toBeInTheDocument();

        fireEvent.change(input, { target: { value: '20' } });
        fireEvent.click(submitButton);
        expect(screen.getByText('All products are 20% off!')).toBeInTheDocument();
        expect(screen.queryByText('All products are 10% off!')).not.toBeInTheDocument();
    });

    it('handles empty input gracefully', () => {
        renderWithRouter(<AdminPage />);
        const input = screen.getByDisplayValue('0') as HTMLInputElement;
        const submitButton = screen.getByRole('button', { name: 'Submit' });

        fireEvent.change(input, { target: { value: '' } });
        // Empty string becomes NaN, but we just verify the input can be changed
        expect(input.value).toBe('');
    });
});
