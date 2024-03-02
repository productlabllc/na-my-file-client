import { describe, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import NYCLogo from './NYCLogo';
import NYCLogoIcon from '../../assets/NYC.svg';

describe('NYCLogo', () => {
  it('has logo NYCLogo with src="../../assets/NYC.svg"', () => {
    render(<NYCLogo />);

    expect(screen.getByRole('img')).toHaveAttribute('src', NYCLogoIcon);
  });
});
