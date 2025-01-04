import { PlacesType, Tooltip } from 'react-tooltip';
import { Typography } from '@mui/material';

interface TooltipProps {
  anchorSelect: string;
  place: PlacesType;
  content: string;
  onHover?: boolean;
  booletpoint?: boolean;
}

function TooltipUI({ anchorSelect, place, content, onHover = false, booletpoint = true }: TooltipProps) {
  const contentItems = content.split('\n').filter((item) => item.trim() !== '');
  const [title, ...bulletPoints] = contentItems;

  return (
    <Tooltip
      anchorSelect={anchorSelect}
      opacity={1}
      className="!opacity-[100%] !z-30 !bg-black !text-white !absolute !w-[230px] lg:!w-[300px] rounded-4"
      place={place}
      openOnClick={onHover ? false : true}
    >
      <div className="space-y-2">
        {title && <Typography className="lg:!d-text-body-sm !m-text-body-md font-semibold">{title}</Typography>}
        {!booletpoint &&
          bulletPoints.map((item, index) => (
            <Typography key={index} className="lg:!d-text-body-xsm !m-text-body-sm">
              {item}
            </Typography>
          ))}
        {bulletPoints.length > 0 && booletpoint && (
          <ul className="list-disc pl-4 space-y-1">
            {bulletPoints.map((item, index) => (
              <li key={index}>
                <Typography className="lg:!d-text-body-xsm !m-text-body-sm">{item}</Typography>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Tooltip>
  );
}

export default TooltipUI;
