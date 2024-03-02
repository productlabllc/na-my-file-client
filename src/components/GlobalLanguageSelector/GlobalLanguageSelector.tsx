import { useState, useEffect } from 'react';
import {
  Select,
  MenuItem,
  FormControl,
  Icon,
  SelectChangeEvent
} from '@mui/material';
import { languages } from '../../assets/languages/languages';
import { ExpandMore } from '@mui/icons-material';
import { useBoundStore } from '../../store/store';

const LanguageSelector = () => {
  const [anchorEl, setAnchorEl] = useState<null | Element>(null);
  const open = Boolean(anchorEl);
  const [language, setLanguage] = useState(localStorage.getItem('language'));
  const { setLang, getLang } = useBoundStore();

  const handleClick = (event: { currentTarget: Element }) => {
    setAnchorEl(event.currentTarget);
  };

  useEffect(() => {
    // Get user language API call
    if (language) {
      setLang(language);
    } else {
      localStorage.setItem('language', 'en');
      setLanguage('en');
      setLang('en');
    }

    if (!localStorage.getItem('language')) {
      localStorage.setItem('language', getLang());
      setLanguage(localStorage.getItem('language') as string);
    }
  }, [language]);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageChange = (event: SelectChangeEvent<string | null>) => {
    setLanguage(event.target.value);

    if (!localStorage.getItem('language')) {
      localStorage.setItem(
        'language',
        (event.target as HTMLInputElement).value
      );
    } else {
      localStorage.removeItem('language');
      localStorage.setItem(
        'language',
        (event.target as HTMLInputElement).value
      );
    }

    setLanguage(localStorage.getItem('language'));
    setLang(localStorage.language);
  };

  return (
    <div className="flex items-center">
      {/* Selector */}

      <Icon data-testid="language-icon" className="!text-[20px]">
        translate
      </Icon>
      <FormControl
        sx={{
          '& fieldset': { border: 'none' }
        }}
      >
        <Select
          id="language-menu-2 "
          open={open}
          value={language}
          onChange={(e) => handleLanguageChange(e)}
          onClose={handleClose}
          onOpen={(e) => handleClick(e)}
          className="!pr-[6px] !stroke-black !d-text-body-md lg:!d-text-body-sm !w-[150px] !pt-0"
          IconComponent={ExpandMore}
          data-testid="select-language"

          // sx={{
          //   '.MuiSvgIcon-root': {
          //     color: 'primary'
          //   }
          // }}
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
