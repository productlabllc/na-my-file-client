import { describe, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import CustomLogo from './CustomLogo';
import CustomLogoIcon from '../../assets/custom-logo.svg';

describe('CustomLogo', () => {
  it('has logo CustomLogo with src="../../assets/custom-logo.svg"', () => {
    render(<CustomLogo />);

    expect(screen.getByRole('img')).toHaveAttribute('src', CustomLogoIcon);
  });
});
