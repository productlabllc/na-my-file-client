import { PlacesType, Tooltip } from 'react-tooltip';
import { Typography } from '@mui/material';

interface TooltipProps {
  anchorSelect: string;
  place: PlacesType;
  content: string;
}

function TooltipUI({ anchorSelect, place, content }: TooltipProps) {
  return (
    <Tooltip
      anchorSelect={anchorSelect}
      opacity={1}
      className="!opacity-[100%] !z-30 !bg-black !text-white !absolute !w-[230px] lg:!w-[300px] rounded-4"
      place={place}
      openOnClick={true}
    >
      <Typography className="lg:!d-text-body-xsm !m-text-body-sm">
        {content}
      </Typography>
    </Tooltip>
  );
}

export default TooltipUI;
