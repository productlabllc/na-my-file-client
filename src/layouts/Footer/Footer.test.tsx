import { describe, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import Footer from './Footer';
import NYCMayorsOffice from '../../assets/nyc-mayors-office.svg';
import { MemoryRouter } from 'react-router-dom';
describe('Footer', () => {
  it('has NYCLogo', () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );
    const image = screen.getByAltText('nyc-logo');
    expect(image).toHaveAttribute('src', NYCMayorsOffice);
  });

  it('redirects to the "/terms-of-use" page', () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );

    expect(screen.getByRole('link', { name: 'Terms of Use' })).toHaveAttribute(
      'href',
      '/terms-of-use'
    );
  });

  it('redirects to the "/about" page', () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );

    expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute(
      'href',
      '/about'
    );
  });

  it('redirects to the "/faq" page', () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );

    expect(screen.getByRole('link', { name: 'FAQ' })).toHaveAttribute(
      'href',
      '/faq'
    );
  });

  it('has MyFile brand copyright', () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );

    expect(screen.getByTestId('copyright')).toHaveTextContent(
      `© 2023 City of New York. All Rights Reserved. NYC Mayor’s Office for Economic Opportunity is a trademark and service mark of the City of New York.`
    );
  });
});
