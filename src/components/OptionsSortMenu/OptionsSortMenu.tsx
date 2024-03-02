import { Dispatch, SetStateAction } from 'react';
import { Menu, MenuItem, Typography } from '@mui/material';

import Document from '../../types/Document';

interface OptionsSortProps {
  anchorElSortMenu: HTMLElement | null;
  setAnchorElSortMenu: Dispatch<SetStateAction<HTMLElement | null>>;
  setData: Dispatch<SetStateAction<Document[] | null>>;
  data: Document[];
}

function OptionsSortMenu({
  anchorElSortMenu,
  setAnchorElSortMenu,
  setData,
  data
}: OptionsSortProps) {
  const handleCloseSortMenu = () => {
    setAnchorElSortMenu(null);
  };

  const sortByAZ = () => {
    setData([...data].sort((a, b) => a.title.localeCompare(b.title)));
    setAnchorElSortMenu(null);
  };
  const sortByZA = () => {
    setData([...data].sort((a, b) => b.title.localeCompare(a.title)));
    setAnchorElSortMenu(null);
  };

  const sortByClosestDay = () => {
    setData(
      [...data].sort((a, b): number => {
        return (
          new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf()
        );
      })
    );
    setAnchorElSortMenu(null);
  };

  const sortByFarthestDay = () => {
    setData(
      [...data].sort((a, b) => {
        return (
          new Date(a.createdAt).valueOf() - new Date(b.createdAt).valueOf()
        );
      })
    );
    setAnchorElSortMenu(null);
  };
  return (
    <>
      <Menu
        id="customized-menu"
        anchorEl={anchorElSortMenu}
        open={Boolean(anchorElSortMenu)}
        onClose={handleCloseSortMenu}
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
        <MenuItem
          className="!text-secondary !m-text-body-md sm:!d-text-body-md"
          onClick={sortByAZ}
        >
          <Typography>Document Name A-Z</Typography>
        </MenuItem>
        <MenuItem
          className="!text-secondary !m-text-body-md sm:!d-text-body-md"
          onClick={sortByZA}
        >
          <Typography>Document Name Z-A</Typography>
        </MenuItem>
        <MenuItem
          className="!text-secondary !m-text-body-md sm:!d-text-body-md"
          onClick={sortByClosestDay}
        >
          <Typography>Date Added closest to now</Typography>
        </MenuItem>
        <MenuItem
          className="!text-secondary !m-text-body-md sm:!d-text-body-md"
          onClick={sortByFarthestDay}
        >
          <Typography>Date added farthest from now</Typography>
        </MenuItem>
      </Menu>
    </>
  );
}

export default OptionsSortMenu;
