import { Box } from '@mui/material';

export interface LayoutProps {
  children: React.ReactNode;
}

function ActivityLogItemBox({ children }: LayoutProps) {
  return <Box className="!py-[24px] !border-b-[2px] flex flex-row">{children}</Box>;
}

export default ActivityLogItemBox;
