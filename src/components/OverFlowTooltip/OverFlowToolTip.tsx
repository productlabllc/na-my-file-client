import { Box, Tooltip } from '@mui/material';
import { useRef, useState, useEffect } from 'react';

function OverFlowToolTip({ result }: { result: string }) {
  const textElementRef = useRef<HTMLInputElement | null>(null);

  const compareSize = () => {
    if (textElementRef.current) {
      const compare = textElementRef.current.scrollWidth > textElementRef.current.clientWidth;
      setHover(compare);
    }
  };

  useEffect(() => {
    compareSize();
    window.addEventListener('resize', compareSize);
  }, []);

  useEffect(
    () => () => {
      window.removeEventListener('resize', compareSize);
    },
    []
  );

  const [hoverStatus, setHover] = useState(false);
  return (
    <Tooltip
      title={<Box className="!d-text-body-xsm">{result}</Box>}
      className=""
      disableHoverListener={!hoverStatus}
      // disableTouchListener
    >
      <Box
        // className="!max-w-full !truncate !..."
        // id="box-document-type"
        ref={textElementRef}
        style={{
          whiteSpace: 'nowrap', // Prevent text from wrapping
          overflow: 'hidden', // Hide the overflowing text
          textOverflow: 'ellipsis' // Show ellipsis for overflowed text
        }}
      >
        {result}
      </Box>
    </Tooltip>
  );
}

export default OverFlowToolTip;
