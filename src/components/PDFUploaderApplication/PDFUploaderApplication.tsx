import { useState, ChangeEvent } from 'react';
import { v4 as uuidv4 } from 'uuid';
import File from '../../components/File/File';
import { useBoundStore } from '../../store/store';
import { useNavigate } from 'react-router-dom';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { Typography, Box, Icon, Autocomplete, TextField, Select, MenuItem, Button, List } from '@mui/material';
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

import TooltipUI from '../TooltipUI/TooltipUI';

// import DocumentType from '../../types/DocumentType';
// import DocumentForApiCallType from '../../types/DocumentForApiCallType';
import FileType from '../../types/FileType';
import { UserFile } from '@namyfile/api-client';
import { useApi } from '../../utils/use-api';
import { useAsync } from 'react-use';
import { useTranslation } from 'react-i18next';

const familyMember = ['Yuriy', 'Pavel', 'Leo'];

interface DocumentForm {
  id: string;
  FamilyMember: string;
  DocumentType: string;
  ContentType: string;
  OriginalFilename: string;
  Title: string;
}

interface PDFUploaderProps {
  openAlertProp: () => void | undefined;
  buttonNameProp?: string;
  editDocumentProp?: UserFile;
}

function PDFUploader({ buttonNameProp, openAlertProp, editDocumentProp }: PDFUploaderProps) {
  const api = useApi();
  const { t } = useTranslation('docs');
  const { value } = useAsync(api.getUserFileTypes);

  const acceptedDocuments = value ?? [];

  const { register, control, handleSubmit, reset } = useForm<DocumentForm>({
    defaultValues: {
      FamilyMember: editDocumentProp?.UserFamilyMember ? editDocumentProp.UserFamilyMember.FirstName : familyMember[0],
      DocumentType: editDocumentProp?.FileType ? editDocumentProp.FileType : acceptedDocuments[0]?.documentName
    },
    mode: 'all',
    reValidateMode: 'onChange'
  });

  const [, setCountChars] = useState<string>('');
  const [uploadedFiles, setUploadedFiles] = useState<FileType[] | []>([]);
  const { addDocumentsToBeforeSubmittedList, addCheckListItemDocument } = useBoundStore();
  const navigate = useNavigate();
  const applicationUrlPath = location.pathname.split('/');
  const backNavigation = applicationUrlPath.splice(1, 5).join('/');

  const getFilePosition = (id: string) => uploadedFiles.findIndex((file) => file.id === id);

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

  const onSubmit: SubmitHandler<DocumentForm> = (data) => {
    const newData = {
      ...data,
      id: uuidv4(),
      files: uploadedFiles
    };

    addDocumentsToBeforeSubmittedList(newData);
    addCheckListItemDocument(newData);
    setCountChars('');
    setUploadedFiles([]);
    reset();
    navigate('/' + backNavigation);
  };

  const handleUploadFiles = (
    event: ChangeEvent & {
      target: HTMLInputElement & EventTarget;
    }
  ) => {
    event?.preventDefault();
    const arr: FileType[] = [];
    if (!event.target.files) return;
    for (let i = 0; i < event.target.files.length; i++) {
      console.log(event.target.files[i].size);
      if (event.target.files[i].size > 10485760) {
        openAlertProp();
        event.target.value = '';
      } else {
        const file: FileType = {
          id: uuidv4(),
          thumbnailUrl: URL.createObjectURL(event.target.files[i]),
          file: event.target.files[i],
          name: event.target.files[i].name,
          size: event.target.files[i].size,
          type: event.target.files[i].type
        };
        arr.push(file);
      }
    }
    setUploadedFiles([...uploadedFiles, ...arr]);
  };

  return (
    <>
      <Box className="">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box className="py-[16px] flex flex-row xl:!d-text-body-lg ">
            <Typography className="!d-text-body-md pt-[2px] xl:pt-0 xl:!d-text-body-lg !mr-[8px] !flex !items-center">
              {t('familyMember')}
              <Icon className="ml-2" id="family-member-info">
                info_outlined_icon
              </Icon>
            </Typography>
            <TooltipUI
              anchorSelect="#family-member-info"
              place="bottom"
              content="Select any family member or yourself that will be attach to the document"
            />
          </Box>
          <Controller
            name="FamilyMember"
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

          <Box className="py-[16px]">
            <Typography className="!d-text-body-md pt-[2px] xl:pt-0 xl:!d-text-body-lg !mr-[8px] !flex !items-center">
              {t('docType')}
              <Icon className="ml-2" id="document-type-info">
                info_outlined_icon
              </Icon>
            </Typography>
            <TooltipUI
              anchorSelect="#document-type-info"
              place="bottom"
              content="Select a document type under the select field for the requirement to your checklist or request"
            />
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
            renderInput={(params) => <TextField {...params} {...register('DocumentType')} />}
            // renderGroup={(params) => (
            //   <Box key={params.key}>
            //     <Box className="">{params.group}</Box>
            //     <Box>{params.children}</Box>
            //   </Box>
            // )}
          ></Autocomplete>

          <Box className="py-[16px] !d-text-body-lg ">
            <Typography className="!d-text-body-md pt-[2px] xl:pt-0 xl:!d-text-body-lg !mr-[8px] !flex !items-center">
              {t('description_optional')}
              <Icon className="ml-2" id="desribe-document-info">
                info_outlined_icon
              </Icon>
            </Typography>
            <TooltipUI
              anchorSelect="#desribe-document-info"
              place="bottom"
              content="Describe the document you are uploading in a couple of words"
            />
          </Box>
          <Box></Box>
          <Box className="!mb-[24px] !bg-importantBackground !min-h-[120px] !flex !flex-col justify-center !py-[20px]">
            <Box className="flex !d-text-body-lg !px-[15px]">
              <Icon>warning_amber_outlined_icon</Icon>
              <Typography className="!pl-[13px] !d-text-body-sm-bold lg:!d-text-body-md-bold">
                {t('important')}
              </Typography>
            </Box>
            <Box>
              <Typography className="!px-[50px] !d-text-body-sm lg:!d-text-body-md">{t('oneDocAtTime')}</Typography>
            </Box>
          </Box>

          <Box className="!bg-primaryPress !bg-opacity-[4%] !mb-[150px] border-2 rounded-md !border-dashed !border-disabledBackground border-opacity-100 p-[5px] lg:!p-[12px] min-h-[100px]">
            {uploadedFiles.length > 0 ? (
              <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd} sensors={sensors}>
                <List className="w-full !px-[12px]">
                  <Box className="pl-[12px] pt-[8px]">
                    <Typography className="!d-text-body-md xl:pt-0 xl:!d-text-body-lg !mb-[8px]">
                      {t('dragToReorder')}
                    </Typography>
                  </Box>
                  <SortableContext items={uploadedFiles} strategy={verticalListSortingStrategy}>
                    {uploadedFiles.map((uploadedFile) => (
                      <File
                        key={uploadedFile.id}
                        id={uploadedFile.id}
                        thumbnail={uploadedFile.thumbnailUrl}
                        name={uploadedFile.name}
                        removeFile={removeFile}
                        type={uploadedFile.type}
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
                    <Icon className=" opacity-40 mb-[4px] w-full">file_upload_outlined_icon</Icon>
                    <Typography className="!d-text-body-md opacity-40 !text-center">{t('uploadNew')}</Typography>
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
              <input type="file" accept="image/*,.pdf" hidden multiple={true} onChange={(e) => handleUploadFiles(e)} />
              {/* <Icon className="mr-[10px]">add</Icon> */}
              {t('uploadMorePages')}
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
              {buttonNameProp ? buttonNameProp : t('generateDoc')}
            </Button>
          </Box>
        </form>
      </Box>
    </>
  );
}

export default PDFUploader;
