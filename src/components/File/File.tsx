import {
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
  Icon,
  Button
} from '@mui/material';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function File({
  id,
  thumbnail,
  name,
  removeFile
}: {
  id: string;
  thumbnail: string;
  name: string;
  removeFile: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = { transition, transform: CSS.Transform.toString(transform) };
  return (
    <ListItem
      key={id}
      style={style}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className="border-b-2  border-disabledBackground border-opacity-80 hover:border-opacity-100  mb-[12px] !px-[12px] !py-[12px] flex"
      secondaryAction={<Icon>drag_indicator</Icon>}
      // sx={{ touchAction: 'none' }}
    >
      <ListItemAvatar className="!min-w-10">
        <img
          className="h-[60px] w-[60px] sm:!h-[70px] sm:!w-[70px]"
          src={thumbnail}
        />
      </ListItemAvatar>
      <ListItemText className="!flex !flex-col">
        <Typography className="!pl-[12px] pb-[12px] sm:!m-text-body-md !m-text-body-sm !w-[82%] sm:!w-full !truncate !... ">
          {name}
        </Typography>
        <Button
          className="!pl-[12px] !normal-case !m-text-btn-sm sm:!m-text-btn-md !text-secondary"
          onClick={() => removeFile(id)}
        >
          Remove
        </Button>
      </ListItemText>
    </ListItem>
  );
}

export default File;
