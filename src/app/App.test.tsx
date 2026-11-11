import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { App } from './App';
import { AUTH_TOKEN_STORAGE_KEY } from '@/core/store/authToken';
import { useAuthStore } from '@/core/store/useAuthStore';

describe('App', () => {
  beforeEach(() => {
    window.localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
    useAuthStore.setState({
      accessToken: null,
      user: null,
      status: 'idle',
    });
  });

  it('redirects unauthenticated users to the login page', async () => {
    window.history.pushState({}, '', '/');
    render(<App />);

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: 'Produza' })
      ).toBeInTheDocument();
    });
    expect(screen.getByLabelText(/e-?mail/i)).toBeInTheDocument();
    expect(document.getElementById('login-password')).toBeInTheDocument();
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
  });
});
