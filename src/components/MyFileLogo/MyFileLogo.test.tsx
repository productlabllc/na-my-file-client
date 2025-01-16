import { describe, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import MyFileLogo from './MyFileLogo';
import MyFileLogoFull from '../../assets/my-file-logo-head.svg';
import MyFileLogoIcon from '../../assets/my-file-logo-head.svg';

describe('MyFileLogo', () => {
  it('MyFileLogo has logo with src="../../assets/my-file-logo-head.svg" on Lading Page', () => {
    render(
      <BrowserRouter>
        <MyFileLogo center={true} variant="full" notClickable={false} />
      </BrowserRouter>
    );

    expect(screen.getByRole('img')).toHaveAttribute('src', MyFileLogoFull);
  });

  it('MyFileLogo has logo with src="./../assets/my-file-logo-head.svg" on Dashboard', () => {
    render(
      <BrowserRouter>
        <MyFileLogo center={true} variant="icon" notClickable={false} />
      </BrowserRouter>
    );

    expect(screen.getByRole('img')).toHaveAttribute('src', MyFileLogoIcon);
  });
});
