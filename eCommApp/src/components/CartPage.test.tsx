import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { act } from 'react-dom/test-utils';
import CartPage from './CartPage';
import { CartContext, CartItem } from '../context/CartContext';

// Mock components
vi.mock('./Header', () => ({
    default: () => <div data-testid="header">Header</div>
}));

vi.mock('./Footer', () => ({
    default: () => <div data-testid="footer">Footer</div>
}));

vi.mock('./CheckoutModal', () => ({
    default: ({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) => (
        <div data-testid="checkout-modal">
            <button onClick={onConfirm} data-testid="confirm-checkout">Confirm</button>
            <button onClick={onCancel} data-testid="cancel-checkout">Cancel</button>
        </div>
    )
}));

const mockCartItems: CartItem[] = [
    {
        id: '1',
        name: 'Test Product 1',
        price: 29.99,
        quantity: 2,
        image: 'test1.jpg',
        reviews: [],
        inStock: true
    },
    {
        id: '2',
        name: 'Test Product 2',
        price: 49.99,
        quantity: 1,
        image: 'test2.jpg',
        reviews: [],
        inStock: true
    }
];

const mockCartContext = {
    cartItems: mockCartItems,
    addToCart: vi.fn(),
    clearCart: vi.fn()
};

const renderWithCartContext = (cartContext = mockCartContext) => {
    return render(
        <CartContext.Provider value={cartContext}>
            <CartPage />
        </CartContext.Provider>
    );
};

describe('CartPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('when cart has items', () => {
        beforeEach(() => {
            renderWithCartContext();
        });

        it('renders the cart header', () => {
            expect(screen.getByText('Your Cart')).toBeInTheDocument();
        });

        it('renders all cart item names', () => {
            expect(screen.getByText('Test Product 1')).toBeInTheDocument();
            expect(screen.getByText('Test Product 2')).toBeInTheDocument();
        });

        it('renders all cart item prices', () => {
            expect(screen.getByText('Price: $29.99')).toBeInTheDocument();
            expect(screen.getByText('Price: $49.99')).toBeInTheDocument();
        });

        it('renders all cart item quantities', () => {
            expect(screen.getByText('Quantity: 2')).toBeInTheDocument();
            expect(screen.getByText('Quantity: 1')).toBeInTheDocument();
        });

        it('shows checkout button', () => {
            expect(screen.getByText('Checkout')).toBeInTheDocument();
        });
    });

    describe('when cart is empty', () => {
        beforeEach(() => {
            renderWithCartContext({ ...mockCartContext, cartItems: [] });
        });

        it('shows empty cart message', () => {
            expect(screen.getByText('Your cart is empty.')).toBeInTheDocument();
        });

        it('does not show checkout button', () => {
            expect(screen.queryByText('Checkout')).not.toBeInTheDocument();
        });
    });

    it('throws error if CartContext is missing', () => {
        const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        expect(() => render(<CartPage />)).toThrow('CartContext must be used within a CartProvider');
        errorSpy.mockRestore();
    });

    describe('checkout modal flow', () => {
        beforeEach(() => {
            renderWithCartContext();
            act(() => {
                screen.getByText('Checkout').click();
            });
        });

        it('shows checkout modal when checkout button is clicked', () => {
            expect(screen.getByTestId('checkout-modal')).toBeInTheDocument();
        });

        it('closes checkout modal on cancel', () => {
            act(() => {
                screen.getByTestId('cancel-checkout').click();
            });
            expect(screen.queryByTestId('checkout-modal')).not.toBeInTheDocument();
        });

        it('calls clearCart and shows order processed state on confirm checkout', () => {
            act(() => {
                screen.getByTestId('confirm-checkout').click();
            });
            expect(mockCartContext.clearCart).toHaveBeenCalled();
            expect(screen.getByText('Your order has been processed!')).toBeInTheDocument();
        });
    });

    describe('after order is processed', () => {
        beforeEach(() => {
            renderWithCartContext();
            act(() => {
                screen.getByText('Checkout').click();
            });
            act(() => {
                screen.getByTestId('confirm-checkout').click();
            });
        });

        it('shows processed order message', () => {
            expect(screen.getByText('Your order has been processed!')).toBeInTheDocument();
        });

        it('shows processed cart items', () => {
            expect(screen.getByText('Test Product 1')).toBeInTheDocument();
            expect(screen.getByText('Test Product 2')).toBeInTheDocument();
        });

        it('does not show checkout button or cart header', () => {
            expect(screen.queryByText('Checkout')).not.toBeInTheDocument();
            expect(screen.queryByText('Your Cart')).not.toBeInTheDocument();
        });
    });

    describe('edge cases for cart items', () => {
        it('renders cart item with zero quantity', () => {
            const items = [{ ...mockCartItems[0], quantity: 0 }];
            renderWithCartContext({ ...mockCartContext, cartItems: items });
            expect(screen.getByText('Quantity: 0')).toBeInTheDocument();
        });

        it('renders cart item with missing image', () => {
            const items = [{ ...mockCartItems[0], image: '' }];
            renderWithCartContext({ ...mockCartContext, cartItems: items });
            expect(screen.getByAltText('Test Product 1')).toBeInTheDocument();
        });

        it('renders cart item with negative price', () => {
            const items = [{ ...mockCartItems[0], price: -10 }];
            renderWithCartContext({ ...mockCartContext, cartItems: items });
            expect(screen.getByText('Price: $-10.00')).toBeInTheDocument();
        });

        it('renders cart item with missing name', () => {
            const items = [{ ...mockCartItems[0], name: '' }];
            renderWithCartContext({ ...mockCartContext, cartItems: items });
            expect(screen.getByText('Price: $29.99')).toBeInTheDocument();
        });
    });

    it('shows empty cart after checkout and clearing cart', () => {
        renderWithCartContext();
        act(() => {
            screen.getByText('Checkout').click();
        });
        act(() => {
            screen.getByTestId('confirm-checkout').click();
        });
        renderWithCartContext({ ...mockCartContext, cartItems: [] });
        expect(screen.getByText(/cart is empty/i)).toBeInTheDocument();
    });
});
