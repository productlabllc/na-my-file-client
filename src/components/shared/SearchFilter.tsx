import { Typography, Box, useTheme, Modal, Button, Stack, Chip, useMediaQuery } from '@mui/material';
import { colorTokens } from '../../theme';
import { useAppState } from '../../app-state-store';
import { useEffect, useState } from 'react';
import { FilterAltOutlined } from '@mui/icons-material';
import { SearchFilterType } from '../../lib/types-and-interfaces';
import { isMobileSize, isNotDesktopSize } from '../../lib/media-queries-implemented'; // Media Query Size

type GroupNumberSelectorChipPropsType = {
  groupNumber: string;
  label: string;
  selected: boolean;
  existingSelection: boolean;
  onClickHandler: (groupNumber: string) => void;
};

const GroupNumberSelectorChip = ({
  groupNumber,
  label,
  selected,
  existingSelection,
  onClickHandler,
}: GroupNumberSelectorChipPropsType) => {
  return (
    <Chip
      sx={{ margin: '6px', border: 'solid 1px #cccccc44' }}
      label={label}
      variant={selected ? 'filled' : 'outlined'}
      onClick={() => onClickHandler(groupNumber)}
      color={existingSelection ? 'success' : selected ? 'info' : 'default'}
    />
  );
};

type SearchFilterPropsType = {
  onSaveFilterHandler: (filter: SearchFilterType) => void;
};
const SearchFilter = ({ onSaveFilterHandler }: SearchFilterPropsType) => {
  const theme = useTheme();
  const colors = colorTokens(theme.palette.mode);
  const isMobile = useMediaQuery(`(max-width: ${isMobileSize}px)`); // Media Query for Mobile
  const isNotDesktop = useMediaQuery(`(max-width: ${isNotDesktopSize}px)`); // Media Query for Mobile
  const {
    globals: { globalGroupNumberFilter, setGlobalGroupNumberFilter },
    partnerDetail,
  } = useAppState();
  const [showSearchFilterModal, setSearchFilterModal] = useState<boolean>(false);
  const [selectedGroupNumbers, setSelectedGroupNumbers] = useState<string[]>(globalGroupNumberFilter || []);
  const [filterStateHasChanged, setFilterStateHasChanged] = useState<boolean>(false);

  const evaluateFilterDiff = (proposedSelectedGroupNumbers: Array<string>) => {
    const localFilterIsDifferentThanGlobalFilter = !(
      globalGroupNumberFilter &&
      proposedSelectedGroupNumbers.every((val, idx) => globalGroupNumberFilter.some(gn => gn === val)) &&
      globalGroupNumberFilter.length === proposedSelectedGroupNumbers.length
    );
    setFilterStateHasChanged(localFilterIsDifferentThanGlobalFilter);
  };

  const toggleSelectGroupNumber = (groupNumber: string) => {
    const isCurrentlySelected = selectedGroupNumbers.includes(groupNumber);
    let proposedSelectedGroupNumbers: Array<string> = [];
    if (isCurrentlySelected) {
      proposedSelectedGroupNumbers = selectedGroupNumbers.filter(gn => gn !== groupNumber);
      // setGlobalGroupNumberFilter(selectedGroupNumbers.filter(gn => gn !== groupNumber));
    } else {
      proposedSelectedGroupNumbers = [...selectedGroupNumbers, groupNumber];
      // setGlobalGroupNumberFilter([...selectedGroupNumbers, groupNumber]);
    }
    evaluateFilterDiff(proposedSelectedGroupNumbers);
    setSelectedGroupNumbers(proposedSelectedGroupNumbers);
  };

  useEffect(() => {
    evaluateFilterDiff(selectedGroupNumbers);
  }, []);

  return (
    <>
      <Button
        variant="text"
        color={selectedGroupNumbers.length > 0 ? 'info' : 'inherit'}
        sx={{ marginLeft: '8px' }}
        onClick={() => setSearchFilterModal(true)}
      >
        <FilterAltOutlined />
      </Button>

      {/* Group Number Filter Modal */}
      <Modal
        open={showSearchFilterModal}
        onClose={() => {
          setSearchFilterModal(false);
        }}
      >
        <Box
          sx={{
            width: isMobile ? '90vw' : '50vw', // Adjust width of modal for mobile screens
            minHeight: '25vh',
            marginLeft: isMobile ? '4vw' : 'calc(50vw - 25vw + 100px)', // Adjust width of modal for mobile screens
            marginTop: isMobile ? '5vh' : '20vh', // Adjust width of modal for mobile screens
            border: `solid 1px ${colors.primary[700]}`,
            boxShadow: `8px 8px 8px ${colors.primary[500]}CC`,
            backgroundColor: colors.primary[400],
            borderRadius: '10px',
            overflowY: 'auto',
            maxHeight: isMobile ? '90vh' : '70vh',
            padding: isMobile ? '14px' : '20px',
          }}
        >
          <Typography
            sx={{
              color: colors.greenAccent[theme.palette.mode === 'dark' ? 600 : 400],
              marginBottom: '40px',
            }}
            variant="h2"
          >
            Select Group Numbers{' '}
            <Button
              variant="text"
              color="info"
              onClick={event => {
                evaluateFilterDiff([]);
                setSelectedGroupNumbers([]);
              }}
            >
              deselect all
            </Button>
          </Typography>

          <Typography variant="h4">Your Group Numbers</Typography>
          <Box
            sx={{
              display: 'block',
              overflowWrap: 'anywhere',
            }}
          >
            {partnerDetail.groupNumberHierarchy!.directGroupNumbers.map(({ GroupNumberValue, PartnerName }) => (
              <GroupNumberSelectorChip
                groupNumber={GroupNumberValue}
                label={`${GroupNumberValue}`}
                existingSelection={
                  !!(globalGroupNumberFilter && globalGroupNumberFilter.some(gn => gn === GroupNumberValue))
                }
                selected={selectedGroupNumbers.some(gn => gn === GroupNumberValue)}
                onClickHandler={toggleSelectGroupNumber}
              />
            ))}
          </Box>
          {partnerDetail.groupNumberHierarchy && partnerDetail.groupNumberHierarchy.primaryGroupNumbers.length > 0 && (
            <>
              <Typography variant="h4" sx={{ marginTop: '8px' }}>
                Primary Referred Group Numbers
              </Typography>
              <Box
                sx={{
                  display: 'block',
                  overflowWrap: 'anywhere',
                }}
              >
                {partnerDetail.groupNumberHierarchy!.primaryGroupNumbers.map(({ GroupNumberValue, PartnerName }) => (
                  <GroupNumberSelectorChip
                    groupNumber={GroupNumberValue}
                    label={`${GroupNumberValue} (${PartnerName})`}
                    existingSelection={
                      !!(globalGroupNumberFilter && globalGroupNumberFilter.some(gn => gn === GroupNumberValue))
                    }
                    selected={selectedGroupNumbers.some(gn => gn === GroupNumberValue)}
                    onClickHandler={toggleSelectGroupNumber}
                  />
                ))}
              </Box>
            </>
          )}
          {partnerDetail.groupNumberHierarchy &&
            partnerDetail.groupNumberHierarchy.secondaryGroupNumbers.length > 0 && (
              <>
                <Typography variant="h4" sx={{ marginTop: '8px' }}>
                  Secondary Referred Group Numbers
                </Typography>
                <Box
                  sx={{
                    display: 'block',
                    overflowWrap: 'anywhere',
                  }}
                >
                  {partnerDetail.groupNumberHierarchy!.secondaryGroupNumbers.map(
                    ({ GroupNumberValue, PartnerName }) => (
                      <GroupNumberSelectorChip
                        groupNumber={GroupNumberValue}
                        label={`${GroupNumberValue} (${PartnerName})`}
                        existingSelection={
                          !!(globalGroupNumberFilter && globalGroupNumberFilter.some(gn => gn === GroupNumberValue))
                        }
                        selected={selectedGroupNumbers.some(gn => gn === GroupNumberValue)}
                        onClickHandler={toggleSelectGroupNumber}
                      />
                    ),
                  )}
                </Box>
              </>
            )}
          <Stack direction={'row-reverse'} spacing={2}>
            <Button
              variant="contained"
              color="info"
              disabled={!filterStateHasChanged}
              onClick={() => {
                setSearchFilterModal(false);
                setGlobalGroupNumberFilter([...selectedGroupNumbers]);
                onSaveFilterHandler({
                  groupNumberFilter: selectedGroupNumbers,
                });
              }}
            >
              Submit
            </Button>
            <Button
              variant="contained"
              color="inherit"
              onClick={() => {
                setSearchFilterModal(false);
              }}
            >
              Cancel
            </Button>
          </Stack>
        </Box>
      </Modal>
    </>
  );
};

export default SearchFilter;
