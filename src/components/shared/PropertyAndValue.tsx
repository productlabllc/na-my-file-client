import * as React from 'react';
import { Box, Theme, Typography } from '@mui/material';
import { SxProps } from '@mui/material';

export default function PropertyAndValue(props: {
  propertyName: string;
  valueText: any;
  sx?: SxProps;
  isTitleComponent?: boolean;
}) {
  const { sx, propertyName, valueText, isTitleComponent = true } = props;

  const propertyNameStyle: SxProps<Theme> = theme => ({
    textTransform: isTitleComponent ? 'uppercase' : 'none',
    fontWeight: isTitleComponent ? 'bold' : 'normal',
    // color: theme.palette.primary[500],
  });

  const formattedValue = (proposedValue: any = '') => {
    // console.log(`propertyName: ${propertyName}; typeof: ${typeof proposedValue}; value: ${proposedValue}`);
    const valueType = typeof proposedValue;
    let retVal = proposedValue;
    switch (valueType) {
      case 'boolean':
      case 'number':
        retVal = proposedValue.toString();
        break;
      case 'string':
        retVal = proposedValue.trim().length === 0 ? ' - ' : proposedValue;
        break;
    }
    return retVal;
  };

  const valueTextStyle: SxProps<Theme> = theme => ({
    fontWeight: isTitleComponent ? 'bold' : 'normal',
    color: theme.palette.primary.light,
  });

  return (
    <Box
      sx={{
        marginRight: '1.5em',
        flexDirection: 'column',
        ...sx,
      }}
    >
      <Typography sx={propertyNameStyle} variant="body2">
        {propertyName}
      </Typography>
      <Typography sx={valueTextStyle} variant="body2">
        {formattedValue(valueText)}
      </Typography>
    </Box>
  );
}
