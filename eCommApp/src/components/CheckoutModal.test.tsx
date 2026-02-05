import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import CheckoutModal from './CheckoutModal';

describe('CheckoutModal', () => {
    const mockOnConfirm = vi.fn();
    const mockOnCancel = vi.fn();

    beforeEach(() => {
        mockOnConfirm.mockClear();
        mockOnCancel.mockClear();
    });

    it('renders modal backdrop', () => {
        const { container } = render(
            <CheckoutModal onConfirm={mockOnConfirm} onCancel={mockOnCancel} />
        );
        expect(container.querySelector('.modal-backdrop')).toBeInTheDocument();
    });

    it('renders modal content', () => {
        const { container } = render(
            <CheckoutModal onConfirm={mockOnConfirm} onCancel={mockOnCancel} />
        );
        expect(container.querySelector('.modal-content')).toBeInTheDocument();
    });

    it('renders confirmation heading', () => {
        render(
            <CheckoutModal onConfirm={mockOnConfirm} onCancel={mockOnCancel} />
        );
        expect(screen.getByText('Are you sure?')).toBeInTheDocument();
    });

    it('renders confirmation message', () => {
        render(
            <CheckoutModal onConfirm={mockOnConfirm} onCancel={mockOnCancel} />
        );
        expect(screen.getByText('Do you want to proceed with the checkout?')).toBeInTheDocument();
    });

    it('renders continue checkout button', () => {
        render(
            <CheckoutModal onConfirm={mockOnConfirm} onCancel={mockOnCancel} />
        );
        expect(screen.getByRole('button', { name: 'Continue Checkout' })).toBeInTheDocument();
    });

    it('renders return to cart button', () => {
        render(
            <CheckoutModal onConfirm={mockOnConfirm} onCancel={mockOnCancel} />
        );
        expect(screen.getByRole('button', { name: 'Return to cart' })).toBeInTheDocument();
    });

    it('calls onConfirm when continue checkout button is clicked', () => {
        render(
            <CheckoutModal onConfirm={mockOnConfirm} onCancel={mockOnCancel} />
        );
        const continueButton = screen.getByRole('button', { name: 'Continue Checkout' });
        fireEvent.click(continueButton);
        expect(mockOnConfirm).toHaveBeenCalled();
    });

    it('calls onCancel when return to cart button is clicked', () => {
        render(
            <CheckoutModal onConfirm={mockOnConfirm} onCancel={mockOnCancel} />
        );
        const cancelButton = screen.getByRole('button', { name: 'Return to cart' });
        fireEvent.click(cancelButton);
        expect(mockOnCancel).toHaveBeenCalled();
    });

    it('cancel button has correct CSS class', () => {
        render(
            <CheckoutModal onConfirm={mockOnConfirm} onCancel={mockOnCancel} />
        );
        const cancelButton = screen.getByRole('button', { name: 'Return to cart' });
        expect(cancelButton).toHaveClass('cancel-btn');
    });

    it('action buttons are in correct container', () => {
        const { container } = render(
            <CheckoutModal onConfirm={mockOnConfirm} onCancel={mockOnCancel} />
        );
        expect(container.querySelector('.checkout-modal-actions')).toBeInTheDocument();
    });

    it('both buttons are in the actions container', () => {
        const { container } = render(
            <CheckoutModal onConfirm={mockOnConfirm} onCancel={mockOnCancel} />
        );
        const actionsContainer = container.querySelector('.checkout-modal-actions');
        expect(actionsContainer?.querySelectorAll('button')).toHaveLength(2);
    });

    it('does not call onConfirm when cancel button is clicked', () => {
        render(
            <CheckoutModal onConfirm={mockOnConfirm} onCancel={mockOnCancel} />
        );
        const cancelButton = screen.getByRole('button', { name: 'Return to cart' });
        fireEvent.click(cancelButton);
        expect(mockOnConfirm).not.toHaveBeenCalled();
    });

    it('does not call onCancel when confirm button is clicked', () => {
        render(
            <CheckoutModal onConfirm={mockOnConfirm} onCancel={mockOnCancel} />
        );
        const confirmButton = screen.getByRole('button', { name: 'Continue Checkout' });
        fireEvent.click(confirmButton);
        expect(mockOnCancel).not.toHaveBeenCalled();
    });

    it('renders h2 heading', () => {
        const { container } = render(
            <CheckoutModal onConfirm={mockOnConfirm} onCancel={mockOnCancel} />
        );
        const heading = container.querySelector('h2');
        expect(heading).toHaveTextContent('Are you sure?');
    });

    it('renders confirmation message as paragraph', () => {
        const { container } = render(
            <CheckoutModal onConfirm={mockOnConfirm} onCancel={mockOnCancel} />
        );
        const paragraph = container.querySelector('p');
        expect(paragraph).toHaveTextContent('Do you want to proceed with the checkout?');
    });
});
