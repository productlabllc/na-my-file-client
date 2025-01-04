import { ListItem, ListItemAvatar, ListItemText, Typography, Icon, Button } from '@mui/material';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import PDFImage from '../../assets/document_16509258.png';

function File({
  id,
  thumbnail,
  name,
  removeFile
  // type
}: {
  id: string;
  thumbnail: string;
  name: string;
  removeFile: (id: string) => void;
  type: string;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const nameSplit = name.split('.');
  const fileType = nameSplit[nameSplit.length - 1];

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
          className={`h-[60px] w-[60px] ${fileType === 'pdf' ? 'object-contain' : ''} sm:!h-[70px] sm:!w-[70px]`}
          src={fileType === 'pdf' ? PDFImage : thumbnail}
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
