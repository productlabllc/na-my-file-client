import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { colorTokens } from '../../theme';
import { Box, Button, IconButton, Menu, MenuItem, SxProps, Typography, useTheme } from '@mui/material';
import {
  ArrowDropDown,
  KeyboardArrowLeft,
  KeyboardDoubleArrowLeft,
  KeyboardArrowRight,
  KeyboardDoubleArrowRight,
} from '@mui/icons-material';
import { capitalCase } from 'change-case';

interface Column {
  id: 'name' | 'code' | 'population' | 'size' | 'density';
  label: string;
  minWidth?: number;
  align?: 'right';
  format?: (value: any, row: any) => string;
}

export type DataTablePropsType = {
  incomingRows: Array<any>;
  formatKeysMap: Record<string, string>;
  formatValuesMap: Record<string, (value: any, row: any) => string>;
  formatColumnMinWidthKeys?: Record<string, number>;
  hiddenColumnKeys?: Array<string>;
  headerStyle?: SxProps;
  rowStyle?: SxProps;
  sx?: SxProps;
  recordCount?: number;
  page?: number;
  pageSize?: number;
  changePageHandler?: (page: number, pageSize: number) => void;
  changePageSizeHandler?: (page: number, pageSize: number) => void;
  maxHeight?: string;
  showPagination?: boolean;
  headerBackgroundColor?: string;
  beginRowAddition?: (row: any) => React.ReactNode;
  beginRowAdditionHeader?: string;
  endRowAddition?: (row: any) => React.ReactNode;
  endRowAdditionHeader?: string;
  onRowClick?: (row: any) => void;
};

const createColumn = (
  row: any,
  formatValuesMap: Record<string, (value: any, row: any) => string>,
  formatKeysMap: Record<string, string>,
  formatColumnMinWidthKeys: Record<string, number>,
  hiddenColumnKeys: Array<string>,
) => {
  return Object.keys(row)
    .filter(key => !hiddenColumnKeys.includes(key))
    .map(key => ({
      id: key,
      label: formatKeysMap[key] || capitalCase(key),
      minWidth: formatColumnMinWidthKeys[key] || 170,
      // align?: 'right';
      format: formatValuesMap[key],
    })) as Array<Column>;
};

const DataTable = (props: DataTablePropsType) => {
  const {
    incomingRows,
    formatValuesMap,
    formatKeysMap,
    formatColumnMinWidthKeys,
    hiddenColumnKeys = [],
    recordCount,
    headerStyle,
    rowStyle,
    sx,
    page,
    pageSize,
    changePageHandler,
    changePageSizeHandler,
    maxHeight,
    showPagination = true,
    beginRowAddition,
    beginRowAdditionHeader,
    endRowAddition,
    endRowAdditionHeader,
    onRowClick,
  } = props;
  // console.log(props);
  const columns =
    incomingRows && incomingRows.length > 0
      ? createColumn(incomingRows[0], formatValuesMap, formatKeysMap, formatColumnMinWidthKeys || {}, hiddenColumnKeys)
      : [];
  // console.log(`columns: ${JSON.stringify(columns, null, 2)}`);
  const [rows, setRows] = React.useState(incomingRows);
  // console.log(`incoming rows: ${JSON.stringify(incomingRows.length, null, 2)}`);
  // console.log(`rows: ${JSON.stringify(rows.length, null, 2)}`);
  const theme = useTheme();
  const colors = colorTokens(theme.palette.mode);
  const [internalPage, setInternalPage] = React.useState(page);
  const [internalPageSize, setInternalPageSize] = React.useState(pageSize);
  // Page {internalPage} of {Math.floor(recordCount / internalPageSize)} (Displaying items {((internalPage - 1) * internalPageSize) + 1} - {internalPage * internalPageSize})
  const lastPage = showPagination ? Math.ceil(recordCount! / internalPageSize!) : 1;
  const isFirstPage = internalPage === 1;
  const isLastPage = internalPage === lastPage;
  const getPaginatedRecordCountEnd = () => (isLastPage ? recordCount : internalPage! * internalPageSize!);

  const handleChangePage = (newPage: number) => {
    changePageHandler!(newPage, internalPageSize!);
    // console.log(`page change: ${newPage}`);
    setInternalPage(newPage);
  };

  const handleChangePageSize = (newPageSize: number) => {
    changePageSizeHandler!(1, newPageSize);
    setInternalPageSize(newPageSize);
    setInternalPage(1);
    setAnchorElNav(null);
  };

  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    console.log(event);
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        ...(sx || {}),
      }}
    >
      <TableContainer sx={{ maxHeight: maxHeight || '100%' }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow sx={{}}>
              {beginRowAddition && (
                <TableCell
                  align="center"
                  sx={{
                    backgroundColor: props.headerBackgroundColor ? props.headerBackgroundColor : colors.primary[400],
                    fontSize: '1.15rem',
                    fontWeight: 'bold',
                  }}
                >
                  {beginRowAdditionHeader ? beginRowAdditionHeader : ''}
                </TableCell>
              )}
              {columns.map(column => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                  sx={headerStyle || {
                    backgroundColor: props.headerBackgroundColor ? props.headerBackgroundColor : colors.primary[400],
                    fontSize: '1.15rem',
                    fontWeight: 'bold',
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
              {endRowAddition && (
                <TableCell
                  align="center"
                  sx={{
                    backgroundColor: props.headerBackgroundColor ? props.headerBackgroundColor : colors.primary[400],
                    fontSize: '1.15rem',
                    fontWeight: 'bold',
                  }}
                >
                  {endRowAdditionHeader ? endRowAdditionHeader : ''}
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {incomingRows
              // .slice(internalPage * internalPageSize, internalPage * internalPageSize + internalPageSize)
              .map(row => {
                // console.log(row.CLAIM_ID);
                return (
                  <TableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={row.code}
                    sx={rowStyle || {
                      '&:hover': {
                        cursor: onRowClick ? 'pointer' : 'default',
                      },
                    }}
                    onClick={() => {
                      if (onRowClick) {
                        onRowClick(row);
                      }
                    }}
                  >
                    {beginRowAddition && <TableCell align="center">{beginRowAddition(row)}</TableCell>}
                    {columns.map(column => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align} sx={rowStyle || {}}>
                          {column.format ? column.format(value, row) : value}
                        </TableCell>
                      );
                    })}
                    {endRowAddition && <TableCell align="center">{endRowAddition(row)}</TableCell>}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* PAGINATION */}
      {showPagination && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row-reverse',
            borderTop: `solid 1px ${colors.primary[100]}`,
            backgroundColor: colors.primary[400],
            padding: '20px 0 20px 10px',
          }}
        >
          <Box sx={{ padding: '0 10px' }}>
            <IconButton
              disabled={isLastPage}
              onClick={event => {
                handleChangePage(internalPage! + 1);
              }}
            >
              <KeyboardArrowRight />
            </IconButton>
            <IconButton
              disabled={isLastPage}
              onClick={event => {
                handleChangePage(lastPage);
              }}
            >
              <KeyboardDoubleArrowRight />
            </IconButton>
          </Box>
          <Typography
            sx={{
              alignSelf: 'center',
            }}
          >
            Page {internalPage} of {lastPage} (Displaying items {(internalPage! - 1) * internalPageSize! + 1} -{' '}
            {getPaginatedRecordCountEnd()} of {recordCount})
          </Typography>
          <Box sx={{ padding: '0 10px' }}>
            <IconButton
              disabled={isFirstPage}
              onClick={event => {
                handleChangePage(1);
              }}
            >
              <KeyboardDoubleArrowLeft />
            </IconButton>
            <IconButton
              disabled={isFirstPage}
              onClick={event => {
                handleChangePage(internalPage! - 1);
              }}
            >
              <KeyboardArrowLeft />
            </IconButton>
          </Box>
          <Box sx={{ display: 'flex' }}>
            <Typography
              sx={{
                width: '100%',
                textTransform: 'capitalize',
                cursor: 'pointer',
                textAlign: 'right',
                paddingLeft: '10px',
                alignSelf: 'center',
                display: 'flex',
                '&:hover': {
                  color: colors.blueAccent[400],
                },
              }}
              onClick={handleOpenNavMenu}
            >
              Page Size: {internalPageSize}
              <ArrowDropDown />
            </Typography>
            <Menu
              id="basic-menu"
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              anchorEl={anchorElNav}
              anchorOrigin={{
                horizontal: 'center',
                vertical: 'top',
              }}
              anchorPosition={{ left: 0, top: 0 }}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}
              sx={{ marginLeft: '0px', marginTop: '0px' }}
            >
              <MenuItem
                onClick={event => {
                  handleChangePageSize(100);
                }}
              >
                100
              </MenuItem>
              <MenuItem
                onClick={event => {
                  handleChangePageSize(250);
                }}
              >
                250
              </MenuItem>
              <MenuItem
                onClick={event => {
                  handleChangePageSize(500);
                }}
              >
                500
              </MenuItem>
            </Menu>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default DataTable;
