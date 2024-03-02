import { createTheme } from '@mui/material/styles';

const MUITheme = createTheme({
  components: {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore - MuiDataGrid wasn't included in the MUI theme exports
    MuiDataGrid: {
      styleOverrides: {
        cell: {
          borderTop: 'none',
          outline: 'none !important'
        },
        columnHeader: {
          outline: 'none !important',
          fontSize: '14px',
          fontWeight: 600
        },
        row: {
          cursor: 'pointer'
        },
        root: {
          border: 'none'
        }
      },
      defaultProps: {
        rowHeight: 100,
        disableColumnMenu: true,
        showColumnVerticalBorder: false,
        showCellVerticalBorder: false,
        pageSizeOptions: [10, 20, 50]
      }
    },
    MuiTypography: {
      styleOverrides: {
        // TODO set these to more consistent values
        // overriding because defaults were way too large
        h1: {
          fontSize: '36px',
          fontWeight: 600
        },
        h2: {
          fontSize: '28px',
          fontWeight: 600
        },
        h3: {
          fontSize: '22px',
          fontWeight: 600
        },
        h4: {
          fontSize: '20px',
          fontWeight: 600
        },
        h5: {
          fontSize: '18px',
          fontWeight: 600
        },
        h6: {
          fontSize: '16px',
          fontWeight: 600
        }
      }
    }
  },
  breakpoints: {
    values: {
      xs: 390,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280
    }
  },
  color: {
    primary: '#004CBE',
    primaryHover: '#031553',
    primaryPress: '#4157AA',
    secondary: '#031553',
    secondaryHover: '#00369F',
    secondaryPress: '#217CEB',
    tertiary: '#11D4B1',
    tertiaryHover: '#AEF4E7',
    tertiaryPress: '#E6FEFA',
    disabledBackground: '#999CA4',
    disabledText: '#F9F9FA',
    errorText: '#870016',
    errorBackground: '#FC928B',
    importantBackground: '#FCDD8C',
    importantText: '#8F5F00',
    successBackground: '#8BFC9E',
    successText: '#007539',
    white: '#FCFCFC',
    black: '#1A1A1A'
  }
});

export default MUITheme;
