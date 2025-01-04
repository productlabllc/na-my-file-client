import { Dispatch, SetStateAction } from 'react';
import { Menu, MenuItem, Typography } from '@mui/material';

import { GeneratedUserFile } from '@myfile/api-client';
import { useTranslation } from 'react-i18next';

interface OptionsSortProps<D> {
  anchorElSortMenu: HTMLElement | null;
  setAnchorElSortMenu: Dispatch<SetStateAction<HTMLElement | null>>;
  setData: Dispatch<SetStateAction<D[]>>;
  data: D[];
}

function OptionsSortMenu<D extends GeneratedUserFile>({
  anchorElSortMenu,
  setAnchorElSortMenu,
  setData,
  data
}: OptionsSortProps<D>) {
  const { t } = useTranslation('docs');

  const handleCloseSortMenu = () => {
    setAnchorElSortMenu(null);
  };

  const sortByAZ = () => {
    if (data) {
      setData([...data].sort((a, b) => (a?.Title && b?.Title ? a?.Title.localeCompare(b.Title) : -1)));
      setAnchorElSortMenu(null);
    }
  };
  const sortByZA = () => {
    if (data) {
      setData([...data].sort((a, b) => (a?.Title && b?.Title ? b?.Title.localeCompare(a?.Title) : -1)));
      setAnchorElSortMenu(null);
    }
  };

  // const sortByClosestDay = () => {
  //   if (data) {
  //     setData(
  //       [...data].sort((a, b): number => {
  //         if (b?.CreatedAt && a?.CreatedAt) {
  //           return new Date(b?.CreatedAt).valueOf() - new Date(a.CreatedAt).valueOf();
  //         }
  //         return -1;
  //       })
  //     );
  //     setAnchorElSortMenu(null);
  //   }
  // };

  // const sortByFarthestDay = () => {
  //   if (data) {
  //     setData(
  //       [...data].sort((a, b) => {
  //         if (a?.CreatedAt && b?.CreatedAt) {
  //           return new Date(a?.CreatedAt).valueOf() - new Date(b.CreatedAt).valueOf();
  //         }
  //         return -1;
  //       })
  //     );
  //     setAnchorElSortMenu(null);
  //   }
  // };

  return (
    <>
      <Menu
        id="customized-menu"
        anchorEl={anchorElSortMenu}
        open={Boolean(anchorElSortMenu)}
        onClose={handleCloseSortMenu}
        className=""
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        sx={{
          '.MuiMenu-paper': {
            boxShadow: '1px',
            minWidth: '200px'
          }
        }}
      >
        <MenuItem className="!text-secondary !m-text-body-md sm:!d-text-body-md" onClick={sortByAZ}>
          <Typography>{t('sortDocsAZ')}</Typography>
        </MenuItem>
        <MenuItem className="!text-secondary !m-text-body-md sm:!d-text-body-md" onClick={sortByZA}>
          <Typography>{t('sortDocsZA')}</Typography>
        </MenuItem>
        {/* <MenuItem className="!text-secondary !m-text-body-md sm:!d-text-body-md" onClick={sortByClosestDay}>
          <Typography>{t('sortDocsDateNew')}</Typography>
        </MenuItem>
        <MenuItem className="!text-secondary !m-text-body-md sm:!d-text-body-md" onClick={sortByFarthestDay}>
          <Typography>{t('sortDocsDateOld')}</Typography>
        </MenuItem> */}
      </Menu>
    </>
  );
}

export default OptionsSortMenu;
