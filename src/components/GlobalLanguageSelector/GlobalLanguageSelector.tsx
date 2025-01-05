import { useState, useEffect } from 'react';
import { Select, MenuItem, FormControl, Icon, SelectChangeEvent } from '@mui/material';
import { languages } from '../../assets/languages/languages';
import { ExpandMore } from '@mui/icons-material';
import { useBoundStore } from '../../store/store';
import { UpdateUserRequest } from '@namyfile/api-client';
import { useAuth } from 'react-oidc-context';
import { useTranslation } from 'react-i18next';

const LanguageSelector = () => {
  const auth = useAuth();

  const [anchorEl, setAnchorEl] = useState<null | Element>(null);
  const open = Boolean(anchorEl);
  const { getUserLang, updateUser, loading } = useBoundStore();
  const { i18n } = useTranslation();
  const [language, setLanguage] = useState<string | undefined>(i18n.language);

  const handleClick = (event: { currentTarget: Element }) => {
    setAnchorEl(event.currentTarget);
  };

  useEffect(() => {
    if (auth.isAuthenticated) {
      setLanguage(getUserLang());
    }
  }, [getUserLang, setLanguage, language, loading, auth.isAuthenticated]);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageChange = (event: SelectChangeEvent<string | null>) => {
    const newLang: UpdateUserRequest = {
      LanguageIsoCode: event.target.value?.toString() as unknown as HTMLInputElement['value']
    };
    if (auth.isAuthenticated) {
      updateUser(newLang).then(() => {
        setLanguage(getUserLang());
      });
    } else {
      if (newLang.LanguageIsoCode) {
        i18n.changeLanguage(newLang.LanguageIsoCode);
        setLanguage(i18n.language);
      }
    }
  };

  return (
    <div className="flex items-center">
      {/* Selector */}

      <Icon data-testid="language-icon" className="!text-[17px]">
        translate
      </Icon>
      <FormControl
        sx={{
          '& fieldset': { border: 'none' }
        }}
      >
        <Select
          id="language-menu-2"
          open={open}
          value={language}
          onChange={(e) => handleLanguageChange(e)}
          onClose={handleClose}
          onOpen={(e) => handleClick(e)}
          className="!pr-[6px] !stroke-black !d-text-body-sm lg:!d-text-body-xsm !min-w-[130px] !pt-0"
          IconComponent={ExpandMore}
          data-testid="select-language"
          sx={{
            '.MuiSvgIcon-root': {
              height: '20px',
              paddingTop: '3px'
            }
          }}
        >
          {Object.keys(languages).map((code) => (
            <MenuItem key={code} value={code}>
              {languages[code]}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

export default LanguageSelector;
