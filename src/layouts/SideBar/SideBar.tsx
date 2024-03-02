import { Container, Skeleton } from '@mui/material';
import { ReactNode } from 'react';

interface SideBarProps {
  children: ReactNode;
  showContentLoading?: boolean;
}

function SideBar({ children, showContentLoading }: SideBarProps) {
  return (
    <div className="md:!bg-slate-50 md:h-full">
      <div className="md:fixed md:h-screen md:w-96 md:top-16 md:border-l md:border-b md:!bg-slate-50">
        <Container className="md:pt-10 pb-4">
          {showContentLoading && (
            <>
              <Skeleton variant="text" />
              <Skeleton variant="text" />
              <Skeleton variant="text" />
            </>
          )}

          {children}
        </Container>
      </div>
    </div>
  );
}

export default SideBar;
