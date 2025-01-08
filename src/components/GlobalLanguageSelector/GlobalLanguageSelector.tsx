import { useContext, useEffect, useState } from 'react';
import { AccountContext } from '../../pages/auth/Account';
import { Box, Button, Menu, MenuItem } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { languages } from '../../assets/languages/languages';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';

const GlobalLanguageSelector = () => {
  const { getSession } = useContext(AccountContext);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { i18n } = useTranslation();
  const open = Boolean(anchorEl);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await getSession();
        setIsAuthenticated(true);
      } catch (err) {
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, [getSession]);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageSelect = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
    handleClose();
  };

  const currentLanguage = languages.find((lang) => lang.code === i18n.language);

  return (
    <Box>
      <Button
        id="language-button"
        aria-controls={open ? 'language-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        endIcon={open ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
        sx={{
          color: isAuthenticated ? '#000000' : '#000000',
          textTransform: 'none',
          fontSize: '14px',
          fontWeight: 400
        }}
      >
        {currentLanguage?.label || 'English'}
      </Button>
      <Menu
        id="language-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'language-button'
        }}
      >
        {languages.map((language) => (
          <MenuItem
            key={language.code}
            onClick={() => handleLanguageSelect(language.code)}
            selected={i18n.language === language.code}
          >
            {language.label}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default GlobalLanguageSelector;
