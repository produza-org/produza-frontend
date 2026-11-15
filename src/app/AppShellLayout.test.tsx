import { beforeEach, describe, expect, it, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { AppShellLayout } from '@/app/AppShellLayout';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { useAuthStore } from '@/core/store/useAuthStore';
import { renderWithTheme } from '@/test/renderWithTheme';

vi.mock('@mui/material/useMediaQuery', () => ({
  default: vi.fn(),
}));

import useMediaQuery from '@mui/material/useMediaQuery';

const mockedUseMediaQuery = vi.mocked(useMediaQuery);

function renderShell() {
  return renderWithTheme(
    <ThemeProvider>
      <LanguageProvider>
        <MemoryRouter initialEntries={['/raw-materials']}>
          <Routes>
            <Route element={<AppShellLayout />}>
              <Route
                path="/raw-materials"
                element={<div>Raw materials content</div>}
              />
            </Route>
          </Routes>
        </MemoryRouter>
      </LanguageProvider>
    </ThemeProvider>
  );
}

describe('AppShellLayout', () => {
  beforeEach(() => {
    useAuthStore.setState({
      accessToken: 'token',
      user: {
        id: 'u1',
        email: 'user@produza.test',
        organizationId: 'o1',
        organizationName: 'Produza Org',
      },
      status: 'authenticated',
    });
  });

  it('shows hamburger nav and hides permanent drawer on mobile', () => {
    mockedUseMediaQuery.mockReturnValue(false);
    renderShell();

    expect(
      screen.getByRole('button', { name: /open navigation menu|abrir menu de navegação/i })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('button', {
        name: /collapse sidebar|recolher menu/i,
      })
    ).not.toBeInTheDocument();
    expect(screen.getByText('Raw materials content')).toBeInTheDocument();
  });

  it('keeps permanent sidebar controls on desktop', () => {
    mockedUseMediaQuery.mockReturnValue(true);
    renderShell();

    expect(
      screen.queryByRole('button', {
        name: /open navigation menu|abrir menu de navegação/i,
      })
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /collapse sidebar|recolher menu/i })
    ).toBeInTheDocument();
  });
});
