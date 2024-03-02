import { useState, useEffect, ChangeEvent } from 'react';
import { v4 as uuidv4 } from 'uuid';
import File from '../../components/File/File';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import {
  Typography,
  Box,
  Tooltip,
  Icon,
  ClickAwayListener,
  Autocomplete,
  TextField,
  Select,
  MenuItem,
  Button,
  List
} from '@mui/material';
import {
  DndContext,
  MouseSensor,
  TouchSensor,
  closestCorners,
  KeyboardSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
  sortableKeyboardCoordinates
} from '@dnd-kit/sortable';

import { acceptedDocuments } from '../../assets/documentTypes/documentTypes';
const familyMember = ['Yuriy', 'Pavel', 'Leo'];

interface DocumentUpload {
  familyMember: string;
  documentType: string | undefined;
  description: string;
  files: string[];
}

interface DocumentForApi {
  id: string;
  thumbnail: string;
  files?: string;
  name: string;
  size: number;
  type: string;
}

interface Document {
  id: string;
  thumbnailUrl: string;
  title: string;
  createdAt: string;
  ownerUserId: string;
  familyMemberUser: string;
  documentUrl: string;
  description: string;
  status?: string;
  files: File[];
}

interface File {
  id: string;
  thumbnailUrl: string;
  name: string;
  file: string;
  size: number;
  type: string;
}

// interface File {
//   id: string;
//   thumbnailUrl: string;
//   name: string;
//   file: string;
//   size: number;
//   type: string;
// }

interface PDFUploaderProps {
  openAlertProp: () => void | undefined;
  buttonNameProp?: string;
  editDocumentProp?: Document;
}

function PDFUploader({
  buttonNameProp,
  openAlertProp,
  editDocumentProp
}: PDFUploaderProps) {
  const { register, control, handleSubmit, reset } = useForm<DocumentUpload>({
    defaultValues: {
      familyMember: editDocumentProp?.familyMemberUser
        ? editDocumentProp.familyMemberUser
        : familyMember[0],
      documentType: editDocumentProp?.title
        ? editDocumentProp.title
        : acceptedDocuments[0].documentName,
      description: editDocumentProp?.description
        ? editDocumentProp?.description
        : ''
    },
    mode: 'all',
    reValidateMode: 'onChange'
  });

  useEffect(() => {
    if (editDocumentProp) {
      const arr: DocumentForApi[] = [];
      editDocumentProp.files.forEach((file) => {
        arr.push({
          id: file.id,
          thumbnail: file.thumbnailUrl,
          files: file.file,
          name: file.name,
          size: file.size,
          type: file.type
        });
      });
      setUploadedFiles([...arr]);
    }
  }, [editDocumentProp]);

  const [openFamilyToolTip, setOpenFamilyToolTip] = useState(false);
  const [openDocumentTypeToolTip, setOpenDocumentTypeToolTip] = useState(false);
  const [openDescribeDocumentToolTip, setOpenDescribeDocumentToolTip] =
    useState(false);
  const [countChars, setCountChars] = useState<string>('');
  const [uploadedFiles, setUploadedFiles] = useState<DocumentForApi[]>([]);

  const onCount = (e: ChangeEvent) =>
    setCountChars((e.target as HTMLInputElement).value);

  const getFilePosition = (id: string) =>
    uploadedFiles.findIndex((file) => file.id === id);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id === over?.id) return;

    setUploadedFiles((files) => {
      //@ts-expect-error event doesn't have type
      const originalPos = getFilePosition(active.id);
      //@ts-expect-error event doesn't have type
      const newPos = getFilePosition(over.id);
      return arrayMove(files, originalPos, newPos);
    });
  };

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 2
      }
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 100,
        tolerance: 1
      }
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  const removeFile = (id: string) => {
    setUploadedFiles([...uploadedFiles.filter((f) => id !== f.id)]);
  };

  const handleFamilyTooltip = () => {
    setOpenFamilyToolTip((prev) => !prev);
  };

  const handleFamilyTootltipClose = () => {
    setOpenFamilyToolTip(false);
  };

  const handleDocumentTypeToolTip = () => {
    setOpenDocumentTypeToolTip((prev) => !prev);
  };

  const handleDocumentTypeClose = () => {
    setOpenDocumentTypeToolTip(false);
  };

  const handleDescribeDocument = () => {
    setOpenDescribeDocumentToolTip((prev) => !prev);
  };

  const handleDescribeDocumentClose = () => {
    setOpenDescribeDocumentToolTip(false);
  };

  const onSubmit: SubmitHandler<DocumentUpload> = (data) => {
    const newData = {
      ...data,
      files: uploadedFiles
    };

    console.log(newData);
    setCountChars('');
    setUploadedFiles([]);
    reset();
  };

  const handleUploadFiles = (
    event: ChangeEvent & {
      target: HTMLInputElement & EventTarget;
    }
  ) => {
    event?.preventDefault();
    const arr = [];
    console.log('HERE');
    if (!event.target.files) return;
    for (let i = 0; i < event.target.files.length; i++) {
      console.log(event.target.files[i].size);
      if (event.target.files[i].size > 10485760) {
        openAlertProp();
        event.target.value = '';
      } else {
        arr.push({
          id: uuidv4(),
          thumbnail: URL.createObjectURL(event.target.files[i]),
          file: event.target.files[i],
          name: event.target.files[i].name,
          size: event.target.files[i].size,
          type: event.target.files[i].type
        });
      }
    }
    setUploadedFiles([...uploadedFiles, ...arr]);
  };
  return (
    <>
      <Box className="">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box className="py-[16px] flex flex-row xl:!d-text-body-lg ">
            <Typography className="!d-text-body-md pt-[2px] xl:pt-0 xl:!d-text-body-lg !mr-[8px]">
              Family member
            </Typography>
            <ClickAwayListener onClickAway={handleFamilyTootltipClose}>
              <Tooltip
                arrow
                disableHoverListener
                describeChild
                title={
                  <Typography>
                    Select any family members or yourself that will be attach to
                    the document.
                  </Typography>
                }
                className="!h-[32px] !flex !items-center"
                onClose={handleFamilyTooltip}
                open={openFamilyToolTip}
                disableFocusListener
                placement="bottom"
                PopperProps={{
                  disablePortal: true,
                  className: '!w-[270px] !opacity-100'
                }}
                classes={{ tooltip: '!text-red', popper: '!text-red' }}
              >
                <Icon onClick={handleFamilyTooltip}>info_outlined</Icon>
              </Tooltip>
            </ClickAwayListener>
          </Box>
          <Controller
            name="familyMember"
            defaultValue={familyMember[0]}
            control={control}
            render={({ field }) => (
              <Select {...field} className="!w-full">
                {familyMember.map((member) => (
                  <MenuItem key={member} value={member}>
                    {member}
                  </MenuItem>
                ))}
              </Select>
            )}
          />

          <Box className="py-[16px] flex flex-row">
            <Typography className="!d-text-body-md pt-[2px] xl:pt-0 xl:!d-text-body-lg !mr-[8px]">
              Document Type
            </Typography>
            <ClickAwayListener onClickAway={handleDocumentTypeClose}>
              <Tooltip
                arrow
                disableHoverListener
                describeChild
                title={
                  <Typography>
                    Select a document type under the select field for the
                    requirement to your checklist or request.
                  </Typography>
                }
                className="!h-[32px] !flex !items-center"
                onClose={handleDocumentTypeToolTip}
                open={openDocumentTypeToolTip}
                disableFocusListener
                placement="bottom"
                PopperProps={{
                  disablePortal: true,
                  className: '!w-[270px] !opacity-100'
                }}
                classes={{ tooltip: '!text-red', popper: '!text-red' }}
              >
                <Icon onClick={handleDocumentTypeToolTip}>info_outlined</Icon>
              </Tooltip>
            </ClickAwayListener>
          </Box>
          <Autocomplete
            className="!w-full"
            options={acceptedDocuments.map((type) => {
              return type;
            })}
            groupBy={(option) => option.documentGroup}
            getOptionLabel={(option) => option.documentName}
            disableClearable
            defaultValue={acceptedDocuments[0] || null}
            renderInput={(params) => (
              <TextField {...params} {...register('documentType')} />
            )}
            // renderGroup={(params) => (
            //   <Box key={params.key}>
            //     <Box className="">{params.group}</Box>
            //     <Box>{params.children}</Box>
            //   </Box>
            // )}
          ></Autocomplete>

          <Box className="py-[16px] flex flex-row !d-text-body-lg ">
            <Typography className="!d-text-body-md pt-[2px] xl:pt-0 xl:!d-text-body-lg !mr-[8px]">
              Describe this document (optional)
            </Typography>
            <ClickAwayListener onClickAway={handleDescribeDocumentClose}>
              <Tooltip
                arrow
                disableHoverListener
                describeChild
                title={
                  <Typography>
                    Describe the document you are uploading in a couple of
                    words.
                  </Typography>
                }
                className="!h-[32px] !flex !items-center"
                onClose={handleDescribeDocument}
                open={openDescribeDocumentToolTip}
                disableFocusListener
                placement="bottom"
                PopperProps={{
                  disablePortal: true,
                  className: '!w-[270px] !opacity-100'
                }}
                classes={{ tooltip: '!text-red', popper: '!text-red' }}
              >
                <Icon onClick={handleDescribeDocument}>info_outlined</Icon>
              </Tooltip>
            </ClickAwayListener>
          </Box>
          <Box>
            <TextField
              {...register('description')}
              className="!w-full !mb-[32px]"
              multiline
              minRows={4}
              inputProps={{ maxLength: 300 }}
              helperText={`${countChars.length}/300`}
              onChange={onCount}
            ></TextField>
          </Box>
          <Box className="!mb-[24px] !bg-importantBackground !min-h-[120px] !flex !flex-col justify-center !py-[20px]">
            <Box className="flex !d-text-body-lg !px-[15px]">
              <Icon>warning_amber_outlined_icon</Icon>
              <Typography className="!pl-[13px] !d-text-body-sm-bold lg:!d-text-body-md-bold">
                Important
              </Typography>
            </Box>
            <Box>
              <Typography className="!px-[50px] !d-text-body-sm lg:!d-text-body-md">
                Upload one document at a time. Do not combine documents while
                uploading.
              </Typography>
            </Box>
          </Box>

          <Box className="!bg-primaryPress !bg-opacity-[4%] !mb-[150px] border-2 rounded-md !border-dashed !border-disabledBackground border-opacity-100 p-[5px] lg:!p-[12px] min-h-[100px]">
            {uploadedFiles.length > 0 ? (
              <DndContext
                collisionDetection={closestCorners}
                onDragEnd={handleDragEnd}
                sensors={sensors}
              >
                <List className="w-full !px-[12px]">
                  <Box className="pl-[12px] pt-[8px]">
                    <Typography className="!d-text-body-md xl:pt-0 xl:!d-text-body-lg !mb-[8px]">
                      Your documents
                    </Typography>
                    <Typography className="!d-text-body-md xl:pt-0 xl:!d-text-body-lg !mb-[24px]">
                      Drag to re-order. Accepted file types are .jpg, .png, .pdf
                    </Typography>
                  </Box>
                  <SortableContext
                    items={uploadedFiles}
                    strategy={verticalListSortingStrategy}
                  >
                    {uploadedFiles.map((uploadedFile) => (
                      <File
                        key={uploadedFile.id}
                        id={uploadedFile.id}
                        thumbnail={uploadedFile.thumbnail}
                        name={uploadedFile.name}
                        removeFile={removeFile}
                      />
                    ))}
                  </SortableContext>
                </List>
              </DndContext>
            ) : (
              <Box>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  hidden
                  multiple={true}
                  id="upload-file"
                  onChange={(e) => handleUploadFiles(e)}
                ></input>
                <label htmlFor="upload-file">
                  <Box className="!flex flex-col !justify-center !items-center !min-h-[100px] !w-full relative ">
                    <Icon className=" opacity-40 mb-[4px] w-full">
                      file_upload_outlined_icon
                    </Icon>
                    <Typography className="!d-text-body-md opacity-40 !text-center">
                      Upload a new file here.
                    </Typography>
                  </Box>
                </label>
              </Box>
            )}
          </Box>

          <Box
            sx={{ boxShadow: '0px -4px 4px -4px black' }}
            className="!fixed !py-[16px] !h-min-[70px] !z-20 bottom-0 w-full inset-x-0 !flex !flex-col !justify-center !bg-white !items-center"
          >
            <Button
              className="!mb-[16px] !w-[94%] md:!w-[660px] !h-10 !m-text-btn-md !normal-case !text-secondary !border-secondary"
              variant="outlined"
              component="label"
            >
              <input
                type="file"
                accept="image/*,.pdf"
                hidden
                multiple={true}
                onChange={(e) => handleUploadFiles(e)}
              />
              {/* <Icon className="mr-[10px]">add</Icon> */}
              Upload more pages
            </Button>

            <Button
              variant="contained"
              className={`!py-[16px] !w-[94%] md:!w-[660px] !h-10 ${
                uploadedFiles.length < 1 ? '' : '!bg-secondary'
              } !m-text-btn-md !normal-case`}
              //   onClick={() => navigate('/upload-generator')}
              type="submit"
              disabled={uploadedFiles.length < 1}
            >
              {buttonNameProp ? buttonNameProp : 'Generate Document'}
            </Button>
          </Box>
        </form>
      </Box>
    </>
  );
}

export default PDFUploader;
