/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}', '*'],
  theme: {
    extend: {
      colors: {
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
        errorText: '#CF2A46',
        errorBackground: '#F8D9DE',
        importantBackground: '#FFDF8D',
        importantText: '#5C3D00',
        successBackground: '#A8DD7C',
        successText: '#006333',
        white: '#FCFCFC',
        black: '#1A1A1A',
        infoBackground: '#DCEDF5',
        infoText: '#0047D1',
        greyBox: '#EEEEEE',
        applicationActive: '#5B23B0',
        applicationClose: '#4C4E52',
        darkGreyBorder: '#C0C0C0',
        lightGreyBorder: '#DFDFDF',
        offWhiteBlue: '#0047D1',
        sideNavBar: '#EDF2FA',
        documentPending: '#696A6D',
        documentUnderReview: '#906E1A',
        documentResubmit: '#A81D35',
        documentApproved: '#02522B',
        pageBackground: '#FCFCFC'
        // infoBackground: '#DCEDF5'
      },
      screens: {
        '2xl': '1440px',
        '3xl': '1800px'
      },
      fontSize: {
        'd-h1-size': '3.5rem',
        'd-h2-size': '2.75rem',
        'd-h3-size': '2.25rem',
        'd-h4-size': '1.75rem',
        'd-h5-size': '1.375rem',
        'd-lg': '1.25rem',
        'd-md': '1.125rem',
        'd-sm': '1rem',
        'd-xs': '0.875rem'
      },
      lineHeight: {
        'desktop-heading-1': '4.25rem',
        'desktop-heading-2': '3.25rem',
        'desktop-heading-3': '2.75rem'
      },
      fontWeight: {
        'desktop-heading-1': '700',
        'desktop-heading-2': '700',
        'desktop-heading-3': '700'
      },
      fontFamily: {
        'desktop-heading-1': ['Montserrat', 'sans'],
        'desktop-heading-2': ['Montserrat', 'sans'],
        'desktop-heading-3': ['Montserrat', 'sans']
      }
    }
  },
  plugins: [require('tailwindcss'), require('autoprefixer')]
};
