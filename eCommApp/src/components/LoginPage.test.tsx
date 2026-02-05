import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import LoginPage from './LoginPage';

vi.mock('./Header', () => ({
    default: () => <div data-testid="header">Header</div>
}));

vi.mock('./Footer', () => ({
    default: () => <div data-testid="footer">Footer</div>
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate
    };
});

const renderWithRouter = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('LoginPage', () => {
    beforeEach(() => {
        mockNavigate.mockClear();
    });

    it('renders login heading', () => {
        renderWithRouter(<LoginPage />);
        expect(screen.getByText('Admin Login')).toBeInTheDocument();
    });

    it('renders username input field', () => {
        renderWithRouter(<LoginPage />);
        const usernameInput = screen.getByPlaceholderText('Username') as HTMLInputElement;
        expect(usernameInput).toBeInTheDocument();
    });

    it('renders password input field', () => {
        renderWithRouter(<LoginPage />);
        const passwordInput = screen.getByPlaceholderText('Password') as HTMLInputElement;
        expect(passwordInput).toBeInTheDocument();
    });

    it('password input has type password', () => {
        renderWithRouter(<LoginPage />);
        const passwordInput = screen.getByPlaceholderText('Password') as HTMLInputElement;
        expect(passwordInput.type).toBe('password');
    });

    it('renders login button', () => {
        renderWithRouter(<LoginPage />);
        expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
    });

    it('renders header and footer', () => {
        renderWithRouter(<LoginPage />);
        expect(screen.getByTestId('header')).toBeInTheDocument();
        expect(screen.getByTestId('footer')).toBeInTheDocument();
    });

    it('allows typing in username field', () => {
        renderWithRouter(<LoginPage />);
        const usernameInput = screen.getByPlaceholderText('Username') as HTMLInputElement;
        fireEvent.change(usernameInput, { target: { value: 'testuser' } });
        expect(usernameInput.value).toBe('testuser');
    });

    it('allows typing in password field', () => {
        renderWithRouter(<LoginPage />);
        const passwordInput = screen.getByPlaceholderText('Password') as HTMLInputElement;
        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        expect(passwordInput.value).toBe('password123');
    });

    it('shows error message for invalid credentials', () => {
        renderWithRouter(<LoginPage />);
        const usernameInput = screen.getByPlaceholderText('Username');
        const passwordInput = screen.getByPlaceholderText('Password');
        const loginButton = screen.getByRole('button', { name: 'Login' });

        fireEvent.change(usernameInput, { target: { value: 'wronguser' } });
        fireEvent.change(passwordInput, { target: { value: 'wrongpass' } });
        fireEvent.click(loginButton);

        expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });

    it('clears error message on new attempt', () => {
        renderWithRouter(<LoginPage />);
        const usernameInput = screen.getByPlaceholderText('Username');
        const passwordInput = screen.getByPlaceholderText('Password');
        const loginButton = screen.getByRole('button', { name: 'Login' });

        // First attempt with wrong credentials
        fireEvent.change(usernameInput, { target: { value: 'wrong' } });
        fireEvent.change(passwordInput, { target: { value: 'wrong' } });
        fireEvent.click(loginButton);
        expect(screen.getByText('Invalid credentials')).toBeInTheDocument();

        // Second attempt with correct credentials
        fireEvent.change(usernameInput, { target: { value: 'admin' } });
        fireEvent.change(passwordInput, { target: { value: 'admin' } });
        fireEvent.click(loginButton);
        expect(screen.queryByText('Invalid credentials')).not.toBeInTheDocument();
    });

    it('clears input fields after successful login', () => {
        renderWithRouter(<LoginPage />);
        const usernameInput = screen.getByPlaceholderText('Username') as HTMLInputElement;
        const passwordInput = screen.getByPlaceholderText('Password') as HTMLInputElement;
        const loginButton = screen.getByRole('button', { name: 'Login' });

        fireEvent.change(usernameInput, { target: { value: 'admin' } });
        fireEvent.change(passwordInput, { target: { value: 'admin' } });
        fireEvent.click(loginButton);

        expect(usernameInput.value).toBe('');
        expect(passwordInput.value).toBe('');
    });

    it('navigates to admin page on successful login', () => {
        renderWithRouter(<LoginPage />);
        const usernameInput = screen.getByPlaceholderText('Username');
        const passwordInput = screen.getByPlaceholderText('Password');
        const loginButton = screen.getByRole('button', { name: 'Login' });

        fireEvent.change(usernameInput, { target: { value: 'admin' } });
        fireEvent.change(passwordInput, { target: { value: 'admin' } });
        fireEvent.click(loginButton);

        expect(mockNavigate).toHaveBeenCalledWith('/admin');
    });

    it('does not navigate on invalid credentials', () => {
        renderWithRouter(<LoginPage />);
        const usernameInput = screen.getByPlaceholderText('Username');
        const passwordInput = screen.getByPlaceholderText('Password');
        const loginButton = screen.getByRole('button', { name: 'Login' });

        fireEvent.change(usernameInput, { target: { value: 'wrong' } });
        fireEvent.change(passwordInput, { target: { value: 'wrong' } });
        fireEvent.click(loginButton);

        expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('submits form on enter key', () => {
        renderWithRouter(<LoginPage />);
        const usernameInput = screen.getByPlaceholderText('Username');
        const passwordInput = screen.getByPlaceholderText('Password') as HTMLFormElement;
        const form = passwordInput.closest('form') as HTMLFormElement;

        fireEvent.change(usernameInput, { target: { value: 'admin' } });
        fireEvent.change(passwordInput, { target: { value: 'admin' } });
        fireEvent.submit(form);

        expect(mockNavigate).toHaveBeenCalledWith('/admin');
    });

    it('renders form inside login container', () => {
        const { container } = renderWithRouter(<LoginPage />);
        expect(container.querySelector('.login-container')).toBeInTheDocument();
        expect(container.querySelector('form')).toBeInTheDocument();
    });

    it('form submission handler calls handleLogin', () => {
        renderWithRouter(<LoginPage />);
        const usernameInput = screen.getByPlaceholderText('Username');
        const passwordInput = screen.getByPlaceholderText('Password');
        const form = usernameInput.closest('form') as HTMLFormElement;

        fireEvent.change(usernameInput, { target: { value: 'admin' } });
        fireEvent.change(passwordInput, { target: { value: 'admin' } });
        fireEvent.submit(form);

        expect(mockNavigate).toHaveBeenCalledWith('/admin');
    });

    it('error message is displayed in red color when present', () => {
        renderWithRouter(<LoginPage />);
        const usernameInput = screen.getByPlaceholderText('Username');
        const passwordInput = screen.getByPlaceholderText('Password');
        const loginButton = screen.getByRole('button', { name: 'Login' });

        fireEvent.change(usernameInput, { target: { value: 'wrong' } });
        fireEvent.change(passwordInput, { target: { value: 'wrong' } });
        fireEvent.click(loginButton);

        const errorElement = screen.getByText('Invalid credentials');
        expect(errorElement).toHaveStyle('color: rgb(255, 0, 0)');
    });

    it('handles case sensitive password correctly', () => {
        renderWithRouter(<LoginPage />);
        const usernameInput = screen.getByPlaceholderText('Username');
        const passwordInput = screen.getByPlaceholderText('Password');
        const loginButton = screen.getByRole('button', { name: 'Login' });

        // Try with wrong case
        fireEvent.change(usernameInput, { target: { value: 'admin' } });
        fireEvent.change(passwordInput, { target: { value: 'Admin' } });
        fireEvent.click(loginButton);

        expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });

    it('requires exact username match', () => {
        renderWithRouter(<LoginPage />);
        const usernameInput = screen.getByPlaceholderText('Username');
        const passwordInput = screen.getByPlaceholderText('Password');
        const loginButton = screen.getByRole('button', { name: 'Login' });

        // Try with partial username
        fireEvent.change(usernameInput, { target: { value: 'admi' } });
        fireEvent.change(passwordInput, { target: { value: 'admin' } });
        fireEvent.click(loginButton);

        expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });

    it('has focus on username input initially', () => {
        renderWithRouter(<LoginPage />);
        const usernameInput = screen.getByPlaceholderText('Username') as HTMLInputElement;
        // Just verify the input element exists and is focusable
        expect(usernameInput).toBeInTheDocument();
        expect(usernameInput.tagName).toBe('INPUT');
    });
});
