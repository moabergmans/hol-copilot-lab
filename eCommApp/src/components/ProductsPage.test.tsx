import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import ProductsPage from './ProductsPage';
import { CartProvider } from '../context/CartContext';
import { Product } from '../types';

vi.mock('./Header', () => ({
    default: () => <div data-testid="header">Header</div>
}));

vi.mock('./Footer', () => ({
    default: () => <div data-testid="footer">Footer</div>
}));

vi.mock('./ReviewModal', () => ({
    default: ({ product, onClose }: any) => (
        product ? (
            <div data-testid="review-modal">
                <button data-testid="close-review" onClick={onClose}>Close Review</button>
                <div>{product.name}</div>
            </div>
        ) : null
    )
}));

const mockProducts: Product[] = [
    {
        id: '1',
        name: 'Apple',
        price: 1.99,
        description: 'Fresh apple',
        image: 'apple.jpg',
        reviews: [],
        inStock: true
    },
    {
        id: '2',
        name: 'Banana',
        price: 0.99,
        description: 'Ripe banana',
        image: 'banana.jpg',
        reviews: [],
        inStock: false
    }
];

const renderWithContext = (component: React.ReactElement) => {
    return render(
        <BrowserRouter>
            <CartProvider>
                {component}
            </CartProvider>
        </BrowserRouter>
    );
};

describe('ProductsPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        global.fetch = vi.fn();
    });

    it('throws error if CartContext is missing', () => {
        const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        expect(() => {
            render(
                <BrowserRouter>
                    <ProductsPage />
                </BrowserRouter>
            );
        }).toThrow('CartContext must be used within a CartProvider');
        errorSpy.mockRestore();
    });

    it('shows loading message initially', () => {
        (global.fetch as any).mockImplementation(() => new Promise(() => {}));
        renderWithContext(<ProductsPage />);
        expect(screen.getByText('Loading products...')).toBeInTheDocument();
    });

    it('renders header and footer', async () => {
        (global.fetch as any).mockResolvedValue({
            ok: true,
            json: async () => mockProducts[0]
        });

        renderWithContext(<ProductsPage />);
        await waitFor(() => {
            expect(screen.getByTestId('header')).toBeInTheDocument();
            expect(screen.getByTestId('footer')).toBeInTheDocument();
        });
    });

    it('loads and displays products from JSON files', async () => {
        (global.fetch as any).mockResolvedValue({
            ok: true,
            json: async () => mockProducts[0]
        });

        renderWithContext(<ProductsPage />);
        await waitFor(() => {
            expect(screen.getByText('Our Products')).toBeInTheDocument();
        });
    });

    it('displays product names', async () => {
        (global.fetch as any).mockImplementation((url: string) => {
            if (url.includes('apple.json')) {
                return Promise.resolve({
                    ok: true,
                    json: async () => mockProducts[0]
                });
            }
            if (url.includes('grapes.json')) {
                return Promise.resolve({
                    ok: true,
                    json: async () => mockProducts[1]
                });
            }
            return Promise.resolve({
                ok: true,
                json: async () => ({ id: '3', name: 'Test', price: 1, reviews: [], inStock: true })
            });
        });

        renderWithContext(<ProductsPage />);
        await waitFor(() => {
            expect(screen.getAllByText('Apple')[0]).toBeInTheDocument();
        });
    });

    it('displays product prices', async () => {
        (global.fetch as any).mockResolvedValue({
            ok: true,
            json: async () => mockProducts[0]
        });

        renderWithContext(<ProductsPage />);
        await waitFor(() => {
            expect(screen.getAllByText('$1.99')[0]).toBeInTheDocument();
        });
    });

    it('displays product descriptions', async () => {
        (global.fetch as any).mockResolvedValue({
            ok: true,
            json: async () => mockProducts[0]
        });

        renderWithContext(<ProductsPage />);
        await waitFor(() => {
            expect(screen.getAllByText('Fresh apple')[0]).toBeInTheDocument();
        });
    });

    it('displays product images', async () => {
        (global.fetch as any).mockResolvedValue({
            ok: true,
            json: async () => mockProducts[0]
        });

        renderWithContext(<ProductsPage />);
        await waitFor(() => {
            const imgs = screen.getAllByAltText('Apple');
            expect(imgs[0]).toHaveAttribute('src', 'products/productImages/apple.jpg');
        });
    });

    it('shows add to cart button for in-stock products', async () => {
        (global.fetch as any).mockResolvedValue({
            ok: true,
            json: async () => mockProducts[0]
        });

        renderWithContext(<ProductsPage />);
        await waitFor(() => {
            const buttons = screen.getAllByRole('button');
            expect(buttons.some(btn => btn.textContent === 'Add to Cart')).toBe(true);
        });
    });

    it('shows out of stock button for out-of-stock products', async () => {
        (global.fetch as any).mockResolvedValue({
            ok: true,
            json: async () => mockProducts[1]
        });

        renderWithContext(<ProductsPage />);
        await waitFor(() => {
            const buttons = screen.getAllByRole('button');
            expect(buttons.some(btn => btn.textContent === 'Out of Stock')).toBe(true);
        });
    });

    it('disables add to cart button for out-of-stock products', async () => {
        (global.fetch as any).mockResolvedValue({
            ok: true,
            json: async () => mockProducts[1]
        });

        renderWithContext(<ProductsPage />);
        await waitFor(() => {
            const outOfStockButtons = screen.getAllByRole('button', { name: 'Out of Stock' });
            expect(outOfStockButtons[0]).toBeDisabled();
        });
    });

    it('opens review modal when image is clicked', async () => {
        (global.fetch as any).mockResolvedValue({
            ok: true,
            json: async () => mockProducts[0]
        });

        renderWithContext(<ProductsPage />);
        await waitFor(() => {
            const imgs = screen.getAllByAltText('Apple');
            fireEvent.click(imgs[0]);
            expect(screen.getByTestId('review-modal')).toBeInTheDocument();
        });
    });

    it('closes review modal when close button is clicked', async () => {
        (global.fetch as any).mockResolvedValue({
            ok: true,
            json: async () => mockProducts[0]
        });

        renderWithContext(<ProductsPage />);
        await waitFor(() => {
            const imgs = screen.getAllByAltText('Apple');
            fireEvent.click(imgs[0]);
            expect(screen.getByTestId('review-modal')).toBeInTheDocument();
        });

        const closeButton = await screen.findByTestId('close-review');
        fireEvent.click(closeButton);
        expect(screen.queryByTestId('review-modal')).not.toBeInTheDocument();
    });

    it('handles product load error gracefully', async () => {
        const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        (global.fetch as any).mockResolvedValue({
            ok: false
        });

        renderWithContext(<ProductsPage />);
        await waitFor(() => {
            expect(screen.queryByText('Loading products...')).not.toBeInTheDocument();
        });
        errorSpy.mockRestore();
    });

    it('handles fetch network error', async () => {
        const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        (global.fetch as any).mockRejectedValue(new Error('Network error'));

        renderWithContext(<ProductsPage />);
        await waitFor(() => {
            expect(screen.queryByText('Loading products...')).not.toBeInTheDocument();
        });
        errorSpy.mockRestore();
    });

    it('fetches all four product files', async () => {
        (global.fetch as any).mockResolvedValue({
            ok: true,
            json: async () => mockProducts[0]
        });

        renderWithContext(<ProductsPage />);
        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith('products/apple.json');
            expect(global.fetch).toHaveBeenCalledWith('products/grapes.json');
            expect(global.fetch).toHaveBeenCalledWith('products/orange.json');
            expect(global.fetch).toHaveBeenCalledWith('products/pear.json');
        });
    });

    it('renders products container with correct class', async () => {
        (global.fetch as any).mockResolvedValue({
            ok: true,
            json: async () => mockProducts[0]
        });

        const { container } = renderWithContext(<ProductsPage />);
        await waitFor(() => {
            expect(container.querySelector('.products-container')).toBeInTheDocument();
        });
    });

    it('renders products grid', async () => {
        (global.fetch as any).mockResolvedValue({
            ok: true,
            json: async () => mockProducts[0]
        });

        const { container } = renderWithContext(<ProductsPage />);
        await waitFor(() => {
            expect(container.querySelector('.products-grid')).toBeInTheDocument();
        });
    });

    it('renders product cards with correct class', async () => {
        (global.fetch as any).mockResolvedValue({
            ok: true,
            json: async () => mockProducts[0]
        });

        const { container } = renderWithContext(<ProductsPage />);
        await waitFor(() => {
            expect(container.querySelector('.product-card')).toBeInTheDocument();
        });
    });

    it('add to cart button has correct class', async () => {
        (global.fetch as any).mockResolvedValue({
            ok: true,
            json: async () => mockProducts[0]
        });

        renderWithContext(<ProductsPage />);
        await waitFor(() => {
            const buttons = screen.getAllByRole('button', { name: 'Add to Cart' });
            expect(buttons[0]).toHaveClass('add-to-cart-btn');
        });
    });

    it('out of stock button has disabled class', async () => {
        (global.fetch as any).mockResolvedValue({
            ok: true,
            json: async () => mockProducts[1]
        });

        renderWithContext(<ProductsPage />);
        await waitFor(() => {
            const buttons = screen.getAllByRole('button', { name: 'Out of Stock' });
            expect(buttons[0]).toHaveClass('disabled');
        });
    });

    it('product info section is displayed', async () => {
        (global.fetch as any).mockResolvedValue({
            ok: true,
            json: async () => mockProducts[0]
        });

        const { container } = renderWithContext(<ProductsPage />);
        await waitFor(() => {
            expect(container.querySelector('.product-info')).toBeInTheDocument();
        });
    });

    it('product name has correct CSS class', async () => {
        (global.fetch as any).mockResolvedValue({
            ok: true,
            json: async () => mockProducts[0]
        });

        const { container } = renderWithContext(<ProductsPage />);
        await waitFor(() => {
            expect(container.querySelector('.product-name')).toHaveTextContent('Apple');
        });
    });

    it('product price has correct CSS class', async () => {
        (global.fetch as any).mockResolvedValue({
            ok: true,
            json: async () => mockProducts[0]
        });

        const { container } = renderWithContext(<ProductsPage />);
        await waitFor(() => {
            expect(container.querySelector('.product-price')).toBeInTheDocument();
        });
    });

    it('product image has correct CSS class', async () => {
        (global.fetch as any).mockResolvedValue({
            ok: true,
            json: async () => mockProducts[0]
        });

        const { container } = renderWithContext(<ProductsPage />);
        await waitFor(() => {
            expect(container.querySelector('.product-image')).toBeInTheDocument();
        });
    });

    it('main content has correct CSS class', async () => {
        (global.fetch as any).mockResolvedValue({
            ok: true,
            json: async () => mockProducts[0]
        });

        const { container } = renderWithContext(<ProductsPage />);
        await waitFor(() => {
            expect(container.querySelector('main.main-content')).toBeInTheDocument();
        });
    });

    it('handles product without image gracefully', async () => {
        const productNoImage = { ...mockProducts[0], image: '' };
        (global.fetch as any).mockResolvedValue({
            ok: true,
            json: async () => productNoImage
        });

        renderWithContext(<ProductsPage />);
        await waitFor(() => {
            expect(screen.getAllByText('Apple')[0]).toBeInTheDocument();
            expect(screen.queryByAltText('Apple')).not.toBeInTheDocument();
        });
    });

    it('handles product without description gracefully', async () => {
        const productNoDesc = { ...mockProducts[0], description: undefined };
        (global.fetch as any).mockResolvedValue({
            ok: true,
            json: async () => productNoDesc
        });

        renderWithContext(<ProductsPage />);
        await waitFor(() => {
            expect(screen.getAllByText('Apple')[0]).toBeInTheDocument();
        });
    });
});
