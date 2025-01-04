import { Breadcrumbs } from '@mui/material';
import { NavigateNext } from '@mui/icons-material';
import { ReactNode } from 'react';

function PathBar({ children }: { children: ReactNode }) {
  return (
    <Breadcrumbs separator={<NavigateNext fontSize="small" />} aria-label="breadcrumb" className="pl-6 pb-4 pt-5">
      {children}
    </Breadcrumbs>
  );
}

export default PathBar;
