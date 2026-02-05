import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { act } from 'react';
import { CartProvider, CartContext } from './CartContext';
import { Product } from '../types';
import { ReactNode, useContext } from 'react';

// Test component that uses CartContext
const TestComponent = () => {
    const context = useContext(CartContext);
    if (!context) {
        return <div>No Context</div>;
    }
    const { cartItems, addToCart, clearCart } = context;

    return (
        <div>
            <div data-testid="item-count">{cartItems.length}</div>
            <div data-testid="total-quantity">
                {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
            </div>
            <button
                data-testid="add-product"
                onClick={() => addToCart({
                    id: '1',
                    name: 'Test Product',
                    price: 29.99,
                    reviews: [],
                    inStock: true
                })}
            >
                Add Product
            </button>
            <button data-testid="clear-cart" onClick={clearCart}>
                Clear Cart
            </button>
            {cartItems.map((item) => (
                <div key={item.id} data-testid={`item-${item.id}`}>
                    {item.name} - Qty: {item.quantity}
                </div>
            ))}
        </div>
    );
};

describe('CartContext', () => {
    describe('CartProvider', () => {
        it('provides initial empty cart', () => {
            render(
                <CartProvider>
                    <TestComponent />
                </CartProvider>
            );
            expect(screen.getByTestId('item-count')).toHaveTextContent('0');
            expect(screen.getByTestId('total-quantity')).toHaveTextContent('0');
        });

        it('allows adding a single product to cart', () => {
            render(
                <CartProvider>
                    <TestComponent />
                </CartProvider>
            );
            act(() => {
                screen.getByTestId('add-product').click();
            });
            expect(screen.getByTestId('item-count')).toHaveTextContent('1');
            expect(screen.getByTestId('total-quantity')).toHaveTextContent('1');
            expect(screen.getByTestId('item-1')).toHaveTextContent('Test Product - Qty: 1');
        });

        it('increments quantity when adding same product twice', () => {
            render(
                <CartProvider>
                    <TestComponent />
                </CartProvider>
            );
            act(() => {
                screen.getByTestId('add-product').click();
                screen.getByTestId('add-product').click();
            });
            expect(screen.getByTestId('item-count')).toHaveTextContent('1');
            expect(screen.getByTestId('total-quantity')).toHaveTextContent('2');
            expect(screen.getByTestId('item-1')).toHaveTextContent('Test Product - Qty: 2');
        });

        it('adds multiple different products', () => {
            const MultiProductComponent = () => {
                const context = useContext(CartContext);
                if (!context) return null;
                const { cartItems, addToCart } = context;

                return (
                    <div>
                        <div data-testid="item-count">{cartItems.length}</div>
                        <button
                            data-testid="add-product-1"
                            onClick={() => addToCart({
                                id: '1',
                                name: 'Product 1',
                                price: 10,
                                reviews: [],
                                inStock: true
                            })}
                        >
                            Add Product 1
                        </button>
                        <button
                            data-testid="add-product-2"
                            onClick={() => addToCart({
                                id: '2',
                                name: 'Product 2',
                                price: 20,
                                reviews: [],
                                inStock: true
                            })}
                        >
                            Add Product 2
                        </button>
                        {cartItems.map((item) => (
                            <div key={item.id} data-testid={`item-${item.id}`}>
                                {item.name}
                            </div>
                        ))}
                    </div>
                );
            };

            render(
                <CartProvider>
                    <MultiProductComponent />
                </CartProvider>
            );
            act(() => {
                screen.getByTestId('add-product-1').click();
                screen.getByTestId('add-product-2').click();
            });
            expect(screen.getByTestId('item-count')).toHaveTextContent('2');
            expect(screen.getByTestId('item-1')).toHaveTextContent('Product 1');
            expect(screen.getByTestId('item-2')).toHaveTextContent('Product 2');
        });

        it('clears cart when clearCart is called', () => {
            render(
                <CartProvider>
                    <TestComponent />
                </CartProvider>
            );
            act(() => {
                screen.getByTestId('add-product').click();
            });
            expect(screen.getByTestId('item-count')).toHaveTextContent('1');
            act(() => {
                screen.getByTestId('clear-cart').click();
            });
            expect(screen.getByTestId('item-count')).toHaveTextContent('0');
        });

        it('preserves product data when adding to cart', () => {
            const ComplexProductComponent = () => {
                const context = useContext(CartContext);
                if (!context) return null;
                const { cartItems, addToCart } = context;

                return (
                    <div>
                        <button
                            data-testid="add-complex-product"
                            onClick={() => addToCart({
                                id: '123',
                                name: 'Premium Product',
                                price: 99.99,
                                description: 'A great product',
                                image: 'product.jpg',
                                reviews: [{ author: 'John', comment: 'Great!', date: '2025-01-01' }],
                                inStock: true
                            })}
                        >
                            Add
                        </button>
                        {cartItems.length > 0 && (
                            <div data-testid="product-details">
                                <span>{cartItems[0].name}</span>
                                <span>{cartItems[0].price}</span>
                                <span>{cartItems[0].description}</span>
                                <span>{cartItems[0].image}</span>
                                <span>{cartItems[0].reviews.length}</span>
                            </div>
                        )}
                    </div>
                );
            };

            render(
                <CartProvider>
                    <ComplexProductComponent />
                </CartProvider>
            );
            act(() => {
                screen.getByTestId('add-complex-product').click();
            });
            expect(screen.getByTestId('product-details')).toHaveTextContent('Premium Product');
            expect(screen.getByTestId('product-details')).toHaveTextContent('99.99');
            expect(screen.getByTestId('product-details')).toHaveTextContent('A great product');
            expect(screen.getByTestId('product-details')).toHaveTextContent('product.jpg');
            expect(screen.getByTestId('product-details')).toHaveTextContent('1');
        });
    });
});
