import { Typography, ListItem, ListItemAvatar, ListItemText, IconButton, Box } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import PDFImage from '../../assets/document_16509258.png';

function AgentUploadedFile({
  id,
  thumbnail,
  name,
  removeFile,
  type
}: {
  id: string;
  thumbnail: string;
  name: string;
  removeFile: (id: string) => void;
  type: string;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = { transition, transform: CSS.Transform.toString(transform) };
  return (
    <ListItem
      key={id}
      id={id}
      style={style}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className="!bg-primary !bg-opacity-5 border-[1px]  border-disabledBackground border-opacity-20 hover:border-opacity-100  mb-[8px] !px-[12px] !py-[12px] flex"
      secondaryAction={
        <IconButton
          className="!pl-[12px] !normal-case !m-text-btn-sm sm:!m-text-btn-md !text-secondary"
          onClick={() => removeFile(id)}
        >
          <DeleteOutlineIcon />
        </IconButton>
      }
      // sx={{ touchAction: 'none' }}
    >
      <Box className="w-[85%] flex flex-row items-center">
        <ListItemAvatar className="!min-w-10">
          <img
            className={`h-[60px] w-[60px] ${type.includes('pdf') ? 'object-contain' : ''} sm:!h-[70px] sm:!w-[70px]`}
            src={type.includes('pdf') ? PDFImage : thumbnail}
          />
        </ListItemAvatar>
        <ListItemText className="!w-[80%]">
          <Typography className="!pl-[12px] !d-text-body-md !w-[82%] sm:!w-full !truncate !... ">{name}</Typography>
        </ListItemText>
      </Box>
    </ListItem>
  );
}

export default AgentUploadedFile;
