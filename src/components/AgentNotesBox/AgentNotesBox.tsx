import { Box, Typography, Button, ListItem } from '@mui/material';
import { CaseNote, Case } from '@namyfile/api-client';
import dayjs from 'dayjs';
import AddIcon from '@mui/icons-material/Add';
import { useTranslation } from 'react-i18next';

interface AgentNotesBoxProps {
  caseNotes: CaseNote[];
  expandNotesBox: (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => void;
  expandNotes: boolean;
  handleOpenNotesDialog: (e: React.MouseEvent<HTMLSpanElement, MouseEvent>, caseItem: Case) => void;
  caseItem: Case;
}
function AgentNotesBox({
  caseNotes,
  expandNotesBox,
  expandNotes,
  handleOpenNotesDialog,
  caseItem
}: AgentNotesBoxProps) {
  const { t } = useTranslation('agent');
  return (
    <Box>
      <Box className="flex flex-row items-center w-full justify-between !mb-[16px] ">
        <Box className="flex flex-row items-center">
          <Typography className="!d-text-body-md-bold !mr-[8px]">{t('notesSectionTitle')}</Typography>
          {/* {caseNotes?.length > 2 && (
            <Button
              variant="text"
              className="!d-text-btn-xsm !text-primary !normal-case !underline !underline-offset-[4px] hover:!underline hover:!decoration-secondary hover:!underline-offset-4 !cursor-pointer"
              onClick={(e) => expandNotesBox(e)}
            >
              {expandNotes ? t('hideNotes') : t('expandNotes')}
            </Button>
          )} */}
        </Box>
        <Button
          variant="text"
          className="!text-secondary !normal-case !d-text-btn-sm !p-0 "
          onClick={(e) => handleOpenNotesDialog(e, caseItem)}
        >
          <AddIcon className="mr-[8px]" />
          {t('addNotesButton')}
        </Button>
      </Box>

      <Box className="p-[16px] border-[1px] rounded border-darkGreyBorder  flex flex-row items-center justify-between">
        {caseNotes.length === 0 ? (
          <Typography className="!d-text-body-sm">{t('noaddNotes')}</Typography>
        ) : (
          <Box className="">
            <Box className="px-[16px]">
              {!expandNotes &&
                caseNotes.slice(0, 2).map((note) => (
                  <Box key={note.id}>
                    <Box className="flex flex-row items-center ">
                      <Typography className="!mr-[16px] !d-text-body-sm">
                        {note.AuthorUser?.FirstName} {note.AuthorUser?.LastName}
                      </Typography>
                      <Typography className="!d-text-body-xsm !italic">
                        {dayjs(note.CreatedAt).format('MM/DD/YYYY hh:mmA')}
                      </Typography>
                    </Box>
                    <ListItem style={{ display: 'list-item' }} className="!d-text-body-sm">
                      {note.NoteText}
                    </ListItem>
                  </Box>
                ))}{' '}
              {expandNotes &&
                caseNotes.map((note) => (
                  <Box key={note.id}>
                    <Box className="flex flex-row items-center ">
                      <Typography className="!mr-[16px] !d-text-body-sm">
                        {note.AuthorUser?.FirstName} {note.AuthorUser?.LastName}
                      </Typography>
                      <Typography className="!d-text-body-xsm !italic">
                        {dayjs(note.CreatedAt).format('MM/DD/YYYY hh:mmA')}
                      </Typography>
                    </Box>
                    <ListItem style={{ display: 'list-item' }} className="!d-text-body-sm">
                      {note.NoteText}
                    </ListItem>
                  </Box>
                ))}
            </Box>
            {caseNotes?.length > 2 && (
              <Box className="mt-[16px]">
                <Typography
                  // variant="text"
                  className=" !p-0 !w-fit !d-text-btn-xsm !text-primary !normal-case hover:!underline hover:!decoration-primary hover:!underline-offset-4 !cursor-pointer"
                  onClick={(e) => expandNotesBox(e)}
                >
                  {expandNotes ? t('hideNotes') : t('expandNotes')}
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default AgentNotesBox;
