import { describe, it } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import LandingPage from './LandingPage';

describe('Landing page', () => {
  it('has "Login button"', () => {
    render(<LandingPage />);

    expect(screen.getByTestId('login-button')).toBeInTheDocument();
  });

  it('has "Create account" button', () => {
    render(<LandingPage />);

    expect(screen.getByTestId('signup-button')).toBeInTheDocument();
  });

  it('has having nycid-info buttton link', () => {});

  it('has a divider between link and language selector', () => {});

  it('has a language selector', () => {});

  it('language selector has 13 languanges', () => {});

  it('"Login" button re-route you to NYCID login page', async () => {
    // ARRANGE
    render(<LandingPage />);
    // ACT
    fireEvent.click(screen.getByTestId('signup-button'));

    // EXPECT
    expect(window.location.href).toBe('www.google.com');
  });

  it('"Create account" button re-route you to NYCID login page', () => {
    // ARRANGE
    render(<LandingPage />);

    // ACT
    // EXPECT

    expect(
      screen.getByRole('heading', {
        level: 1
      })
    ).toHaveTextContent('Hello World');
  });

  it('"Having trouble logging in?" link re-route you to "/nycid-info" page', () => {});

  it('contains the <Footer/> component', () => {});
});
