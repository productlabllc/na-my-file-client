import { Box } from '@mui/material';

type MainBoxLayout = {
  children: JSX.Element | JSX.Element[];
};

function AgentMainBox({ children }: MainBoxLayout) {
  return <Box className="pl-[134px] 2xl:pl-[286px] my-[48px] w-full ">{children}</Box>;
}

export default AgentMainBox;
