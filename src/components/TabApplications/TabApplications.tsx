import { Box, Button } from '@mui/material';

function TabApplications() {
  return (
    <Box className="flex flex-col items-center w-full !border-2 !border-disabledBackground rounded py-[44px] sm:py-[24px] lg:py-[32px] d-text-body-md sm:d-text-body-lg ">
      <Box className="lg:w-[650px] sm:w-[500px] pb-[24px] px-[16px]">
        <p className="text-center">
          There are no active applications saved to your aacount yet. You can
          create an application for HPD (Housing Preservation & Development) or
          PATH (Presentation Assistance and Temporary Housing).
        </p>
      </Box>
      <Button className="!bg-secondary !text-white !h-12 lg:!m-text-btn-lg sm:!m-text-btn-md !m-text-btn-md !normal-case !min-w-[220px]">
        Add application
      </Button>
    </Box>
  );
}
export default TabApplications;
