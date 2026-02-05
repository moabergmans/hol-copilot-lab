import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ReviewModal from './ReviewModal';
import { Product, Review } from '../types';

describe('ReviewModal', () => {
    const mockProduct: Product = {
        id: '1',
        name: 'Test Product',
        price: 29.99,
        reviews: [
            {
                author: 'John Doe',
                comment: 'Great product!',
                date: '2025-01-01T00:00:00.000Z'
            }
        ],
        inStock: true
    };

    const mockOnClose = vi.fn();
    const mockOnSubmit = vi.fn();

    beforeEach(() => {
        mockOnClose.mockClear();
        mockOnSubmit.mockClear();
    });

    it('returns null when product is null', () => {
        const { container } = render(
            <ReviewModal product={null} onClose={mockOnClose} onSubmit={mockOnSubmit} />
        );
        expect(container.firstChild).toBeNull();
    });

    it('renders modal when product is provided', () => {
        const { container } = render(
            <ReviewModal product={mockProduct} onClose={mockOnClose} onSubmit={mockOnSubmit} />
        );
        expect(container.querySelector('.modal-backdrop')).toBeInTheDocument();
    });

    it('renders product name in modal title', () => {
        render(
            <ReviewModal product={mockProduct} onClose={mockOnClose} onSubmit={mockOnSubmit} />
        );
        expect(screen.getByText('Reviews for Test Product')).toBeInTheDocument();
    });

    it('displays existing reviews', () => {
        render(
            <ReviewModal product={mockProduct} onClose={mockOnClose} onSubmit={mockOnSubmit} />
        );
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('Great product!')).toBeInTheDocument();
    });

    it('formats review date correctly', () => {
        render(
            <ReviewModal product={mockProduct} onClose={mockOnClose} onSubmit={mockOnSubmit} />
        );
        // The date should be displayed in the review - check for 2025-01-01 ISO format
        expect(screen.getByText(/John Doe/)).toBeInTheDocument();
        const reviewContainer = screen.getByText('Great product!').parentElement;
        expect(reviewContainer?.textContent || '').toContain('2025');
    });

    it('shows no reviews message when product has no reviews', () => {
        const productWithoutReviews: Product = {
            ...mockProduct,
            reviews: []
        };
        render(
            <ReviewModal product={productWithoutReviews} onClose={mockOnClose} onSubmit={mockOnSubmit} />
        );
        expect(screen.getByText('No reviews yet.')).toBeInTheDocument();
    });

    it('renders review form with author input', () => {
        render(
            <ReviewModal product={mockProduct} onClose={mockOnClose} onSubmit={mockOnSubmit} />
        );
        expect(screen.getByPlaceholderText('Your name')).toBeInTheDocument();
    });

    it('renders review form with comment textarea', () => {
        render(
            <ReviewModal product={mockProduct} onClose={mockOnClose} onSubmit={mockOnSubmit} />
        );
        expect(screen.getByPlaceholderText('Your review')).toBeInTheDocument();
    });

    it('renders submit button', () => {
        render(
            <ReviewModal product={mockProduct} onClose={mockOnClose} onSubmit={mockOnSubmit} />
        );
        expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
    });

    it('renders close button', () => {
        render(
            <ReviewModal product={mockProduct} onClose={mockOnClose} onSubmit={mockOnSubmit} />
        );
        expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
    });

    it('calls onClose when close button is clicked', () => {
        render(
            <ReviewModal product={mockProduct} onClose={mockOnClose} onSubmit={mockOnSubmit} />
        );
        const closeButton = screen.getByRole('button', { name: 'Close' });
        fireEvent.click(closeButton);
        expect(mockOnClose).toHaveBeenCalled();
    });

    it('calls onClose when backdrop is clicked', () => {
        const { container } = render(
            <ReviewModal product={mockProduct} onClose={mockOnClose} onSubmit={mockOnSubmit} />
        );
        const backdrop = container.querySelector('.modal-backdrop') as HTMLElement;
        fireEvent.click(backdrop);
        expect(mockOnClose).toHaveBeenCalled();
    });

    it('does not call onClose when modal content is clicked', () => {
        const { container } = render(
            <ReviewModal product={mockProduct} onClose={mockOnClose} onSubmit={mockOnSubmit} />
        );
        const modalContent = container.querySelector('.modal-content') as HTMLElement;
        fireEvent.click(modalContent);
        expect(mockOnClose).not.toHaveBeenCalled();
    });

    it('submits review with author and comment', () => {
        render(
            <ReviewModal product={mockProduct} onClose={mockOnClose} onSubmit={mockOnSubmit} />
        );
        const authorInput = screen.getByPlaceholderText('Your name') as HTMLInputElement;
        const commentInput = screen.getByPlaceholderText('Your review') as HTMLTextAreaElement;
        const submitButton = screen.getByRole('button', { name: 'Submit' });

        fireEvent.change(authorInput, { target: { value: 'Jane Smith' } });
        fireEvent.change(commentInput, { target: { value: 'Excellent product!' } });
        fireEvent.click(submitButton);

        expect(mockOnSubmit).toHaveBeenCalledWith({
            author: 'Jane Smith',
            comment: 'Excellent product!',
            date: expect.any(String)
        });
    });

    it('includes current date when submitting review', () => {
        render(
            <ReviewModal product={mockProduct} onClose={mockOnClose} onSubmit={mockOnSubmit} />
        );
        const authorInput = screen.getByPlaceholderText('Your name');
        const commentInput = screen.getByPlaceholderText('Your review');
        const submitButton = screen.getByRole('button', { name: 'Submit' });

        fireEvent.change(authorInput, { target: { value: 'Test User' } });
        fireEvent.change(commentInput, { target: { value: 'Test comment' } });
        fireEvent.click(submitButton);

        expect(mockOnSubmit).toHaveBeenCalledWith({
            author: 'Test User',
            comment: 'Test comment',
            date: expect.stringMatching(/^\d{4}-\d{2}-\d{2}/)
        });
    });

    it('resets form after submission', () => {
        render(
            <ReviewModal product={mockProduct} onClose={mockOnClose} onSubmit={mockOnSubmit} />
        );
        const authorInput = screen.getByPlaceholderText('Your name') as HTMLInputElement;
        const commentInput = screen.getByPlaceholderText('Your review') as HTMLTextAreaElement;
        const submitButton = screen.getByRole('button', { name: 'Submit' });

        fireEvent.change(authorInput, { target: { value: 'Jane Smith' } });
        fireEvent.change(commentInput, { target: { value: 'Excellent product!' } });
        fireEvent.click(submitButton);

        expect(authorInput.value).toBe('');
        expect(commentInput.value).toBe('');
    });

    it('renders form as a form element', () => {
        const { container } = render(
            <ReviewModal product={mockProduct} onClose={mockOnClose} onSubmit={mockOnSubmit} />
        );
        expect(container.querySelector('form.review-form')).toBeInTheDocument();
    });

    it('requires author input to submit', () => {
        render(
            <ReviewModal product={mockProduct} onClose={mockOnClose} onSubmit={mockOnSubmit} />
        );
        const authorInput = screen.getByPlaceholderText('Your name') as HTMLInputElement;
        expect(authorInput).toHaveAttribute('required');
    });

    it('requires comment input to submit', () => {
        render(
            <ReviewModal product={mockProduct} onClose={mockOnClose} onSubmit={mockOnSubmit} />
        );
        const commentInput = screen.getByPlaceholderText('Your review') as HTMLTextAreaElement;
        expect(commentInput).toHaveAttribute('required');
    });

    it('displays multiple reviews', () => {
        const productWithMultipleReviews: Product = {
            ...mockProduct,
            reviews: [
                { author: 'John', comment: 'Great!', date: '2025-01-01T00:00:00.000Z' },
                { author: 'Jane', comment: 'Good!', date: '2025-01-02T00:00:00.000Z' },
                { author: 'Bob', comment: 'Amazing!', date: '2025-01-03T00:00:00.000Z' }
            ]
        };
        render(
            <ReviewModal product={productWithMultipleReviews} onClose={mockOnClose} onSubmit={mockOnSubmit} />
        );
        expect(screen.getByText('John')).toBeInTheDocument();
        expect(screen.getByText('Jane')).toBeInTheDocument();
        expect(screen.getByText('Bob')).toBeInTheDocument();
    });

    it('shows leave a review heading', () => {
        render(
            <ReviewModal product={mockProduct} onClose={mockOnClose} onSubmit={mockOnSubmit} />
        );
        expect(screen.getByText('Leave a Review')).toBeInTheDocument();
    });
});
