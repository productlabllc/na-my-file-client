import { useState, useEffect, ChangeEvent, useCallback, useMemo, SetStateAction } from 'react';
import { v4 as uuidv4 } from 'uuid';
import File from '../../components/File/File';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import {
  APPLICATION_RESUBMIT_TOAST_MESSAGE,
  FILE_REACHED_MORE_THAN_10_MB,
  FILE_FAILED_DIMENSIONS
} from '../../utils/client-toast-messages';
import {
  Typography,
  Box,
  Icon,
  Autocomplete,
  TextField,
  Select,
  MenuItem,
  Button,
  List,
  FormControl,
  InputLabel
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

import TooltipUI from '../TooltipUI/TooltipUI';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';

import FileType from '../../types/FileType';
import { useApi } from '../../utils/use-api';
import { useAsync } from 'react-use';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { GeneratedUserFile } from '@namyfile/api-client';
import { batchPromises } from '../../lib/batch-promise';
import { useTranslation } from 'react-i18next';
import { useBoundStore } from '../../store/store';
import { rulesetsFileTypeExtractor } from '../../utils/extract-file-types-from-criterion-rulesets';

interface DocumentUpload {
  familyMember: string | undefined;
  documentType: { documentGroup: string; documentName: string } | null;
  description: string | undefined;
  files: string[];
}

interface PDFUploaderProps {
  openAlertProp: () => void | undefined;
  buttonNameProp?: string;
  editDocumentProp?: GeneratedUserFile;
  allowedFileTypes?: string[];
  applicationId: string | undefined;
  checklistId: string | undefined;
}

function PDFUploader({
  buttonNameProp,
  openAlertProp,
  editDocumentProp,
  allowedFileTypes = [],
  applicationId,
  checklistId
}: PDFUploaderProps) {
  const api = useApi();
  const params = useParams();
  const location = useLocation();
  // const [spin, setSpin] = useState(false);
  const {
    addSelectedDocumentsBeforeSubmittedList,
    getSelectedForUploadChecklistItem,
    setSelectedForUploadChecklistItem,
    setUploadSpinner,
    setShowToastMessageClient,
    setToastMessageActionTypeClient
  } = useBoundStore();

  const { t } = useTranslation('docs');
  const { value } = useAsync(() => api.getFamilyMembers(), [api]);
  const { value: user } = useAsync(() => api.getUser(), [api]);
  const reUpload = location.pathname.split('/').pop() === 're-upload-generator';

  const familyMembers = useMemo(
    () => [
      ...(value ?? []),
      {
        DOB: user?.DOB,
        FirstName: 'Self',
        LastName: '',
        Relationship: 'Parent',
        UserId: user?.id,
        id: user?.id
      }
    ],
    [user?.DOB, user?.id, value]
  );

  const { value: docs } = useAsync(api.getUserFileTypes);

  const acceptedDocuments = useMemo(() => {
    if (allowedFileTypes.length) {
      return docs?.filter((doc) => allowedFileTypes.includes(doc.documentName));
    } else {
      return docs;
    }
  }, [allowedFileTypes, docs]);

  // const [rawFiles, setRawFiles] = useState<File[]>([]);

  const [, setCreationState] = useState(false);

  const documentType = acceptedDocuments?.find((file) => file.documentName === editDocumentProp?.FileType);

  const { register, control, handleSubmit, reset, setValue, getValues, watch } = useForm<DocumentUpload>({
    defaultValues: {
      familyMember: editDocumentProp?.UserFamilyMember?.id ? editDocumentProp?.UserFamilyMember?.id : undefined,
      documentType: documentType ? documentType : undefined,
      description: editDocumentProp?.Description ? editDocumentProp?.Description : ''
    },
    mode: 'all',
    reValidateMode: 'onChange'
  });

  const prepareExistingFiles = useCallback(async () => {
    const downloadUrls = await batchPromises(
      editDocumentProp?.FromUserFiles?.map(
        (ele) => () =>
          api.getUserFileDownloadUrl({
            fileId: ele.id!,
            uploadVersionId: ele.UploadedMediaAssetVersions?.[0]?.id ?? ''
          })
      ) ?? [],
      10
    );

    setUploadedFiles(() => {
      return (
        editDocumentProp?.FromUserFiles?.map((ele, index) => {
          return {
            thumbnailUrl: downloadUrls[index].downloadUrl!,
            id: ele.id!,
            name: ele.OriginalFilename!,
            old: true,
            file: '',
            size: parseInt(ele.UploadedMediaAssetVersions?.[0].SizeInBytes ?? '', 10),
            type: ele.FileType!
          };
        }) ?? []
      );
    });
  }, [editDocumentProp, api]);

  const [countChars, setCountChars] = useState<string>('');
  const [deletedFiles, setDeletedFiles] = useState<string[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<FileType[]>([]);

  const onCount = (e: ChangeEvent) => setCountChars((e.target as HTMLInputElement).value);

  const navigate = useNavigate();

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
    const file = uploadedFiles.find((ele) => ele.id === id);

    if (file?.old) {
      setDeletedFiles((prev) => [...prev, id]);
    }

    setUploadedFiles([...uploadedFiles.filter((f) => id !== f.id)]);
  };

  const handleReSubmit = useCallback(() => {
    const filesToDelete: SetStateAction<string[]> = [];

    editDocumentProp?.FromUserFiles?.map((file) => {
      filesToDelete.push(file.id!);
    });

    setDeletedFiles(filesToDelete);
  }, [editDocumentProp?.FromUserFiles]);

  const onSubmit: SubmitHandler<DocumentUpload> = async (data) => {
    try {
      setUploadSpinner(true);
      // TODO: start loading activity
      // bkydykova_birthcertificate.pdf

      const familyMember = familyMembers.find((familyMember) => familyMember.id === data.familyMember);
      const fileName =
        data.familyMember === user?.id
          ? user?.FirstName?.toLowerCase() +
            '_' +
            user?.LastName?.toLowerCase() +
            '_' +
            data.documentType?.documentName.toLowerCase() +
            '.pdf'
          : familyMember?.FirstName?.toLowerCase() +
            '_' +
            familyMember?.LastName?.toLowerCase() +
            '_' +
            data.documentType?.documentName.toLowerCase() +
            '.pdf';

      setCreationState(true);
      const newData = {
        id: editDocumentProp?.id,
        UserFamilyMemberId: data.familyMember === user?.id ? undefined : data.familyMember,
        GeneratedFileId: editDocumentProp?.id,
        DeletedFiles: deletedFiles,
        Title: fileName,
        Description: data.description,
        FileType: data.documentType?.documentName,
        FilesOrder: uploadedFiles.map((ele) => ({ old: !!ele.old, id: ele.id })),
        Files: uploadedFiles
          .filter((ele) => !ele.old)
          .map((file, index) => {
            return {
              id: file.id,
              ContentType: file.type,
              OriginalFilename: file.name,
              SizeInBytes: file.size,
              PageNumber: index + 1
            };
          })
      };

      const response = await api.generateUserFile({ requestBody: newData });

      // upload files
      const uploadFileMap = response.UserFiles?.map((file) => {
        return {
          id: file.id,
          uploadUrl: file.UploadUrl,
          file: uploadedFiles.filter((ele) => !ele.old).find((f) => f.id === file.oldId)?.file
        };
      });

      // upload to s3 using the uploadUrl and promise.all
      const headers = new Headers();
      headers.append('Content-Type', 'application/octet-stream');

      await Promise.all(
        uploadFileMap!.map(async (file) => {
          return await fetch(file.uploadUrl!, {
            method: 'PUT',
            body: file.file as unknown as Blob,
            headers
          });
        })
      );
      if (applicationId && checklistId) {
        // @ts-expect-error Property 'GeneratedFile' does not exist on type 'CreateUserFileResponse'
        if (response.GeneratedFile && !reUpload) {
          // @ts-expect-error Property 'GeneratedFile' does not exist on type 'CreateUserFileResponse'
          addSelectedDocumentsBeforeSubmittedList([response.GeneratedFile!]);
          navigate(
            `/application/${params.applicationTitle}/${params.applicationId}/${params.checklistTitle}/${params.checklistId}`
          );
          setUploadSpinner(false);
        }
        // @ts-expect-error Property 'GeneratedFile' does not exist on type 'CreateUserFileResponse'
        else if (response.GeneratedFile && reUpload) {
          await api
            .updateCaseFile({
              // @ts-expect-error Property 'GeneratedFile' does not exist on type 'CreateUserFileResponse'
              id: response.GeneratedFile!.CaseFiles[0]!.id,
              requestBody: {
                Status: 'PENDING'
              }
            })
            .then(() => {
              setTimeout(() => {
                setUploadSpinner(false);
                navigate(
                  `/application/${params.applicationTitle}/${params.applicationId}/${params.checklistTitle}/${params.checklistId}`
                );
                setShowToastMessageClient(true);
                setToastMessageActionTypeClient(APPLICATION_RESUBMIT_TOAST_MESSAGE);
              }, 15000);
            });
          // setUploadSpinner(false);
        }
      } else {
        setTimeout(() => {
          setCountChars('');
          setUploadedFiles([]);
          reset();
          setCreationState(false);
          setTimeout(() => {
            setUploadSpinner(false);
            navigate(-1);
          }, 10000);
        }, 2000);
      }
    } catch (error) {
      setUploadSpinner(false);
      console.log('Upload error: ', error);
    }
  };

  const handleUploadFiles = (
    event: ChangeEvent & {
      target: HTMLInputElement & EventTarget;
    }
  ) => {
    event?.preventDefault();

    if (!event.target.files) return;

    // Create an array to store valid files
    const arr: {
      id: string;
      thumbnailUrl: string;
      file: File;
      name: string;
      size: number;
      type: string;
    }[] = [];

    // Convert FileList to an array and map each file to a Promise
    const filePromises = Array.from(event.target.files).map((file) => {
      return new Promise<void>((resolve, reject) => {
        // Check file size
        if (file.size > 10485760) {
          openAlertProp();
          setToastMessageActionTypeClient(FILE_REACHED_MORE_THAN_10_MB);
          reject(new Error('File size exceeds 10MB'));
        } else if (file.type.includes('pdf')) {
          // Handle PDFs
          arr.push({
            id: uuidv4(),
            thumbnailUrl: URL.createObjectURL(file),
            file,
            name: file.name,
            size: file.size,
            type: file.type
          });
          resolve();
        } else {
          // Handle images
          const img = new Image();
          img.src = URL.createObjectURL(file);

          img.onload = () => {
            if (img.width < 200 || img.height < 200) {
              openAlertProp();
              console.log('Image dimensions are too small');
              setToastMessageActionTypeClient(FILE_FAILED_DIMENSIONS);
              reject(new Error('Image dimensions are too small'));
            } else {
              arr.push({
                id: uuidv4(),
                thumbnailUrl: URL.createObjectURL(file),
                file,
                name: file.name,
                size: file.size,
                type: file.type
              });
              resolve();
            }
            URL.revokeObjectURL(img.src); // Cleanup object URL
          };

          img.onerror = () => {
            console.log('Invalid image file');
            reject(new Error('Invalid image file'));
          };
        }
      });
    });

    // Process all file promises
    Promise.allSettled(filePromises).then((results) => {
      console.log('results', results);
      const hasError = results.some((result) => result.status === 'rejected');

      if (hasError) {
        console.log('One or more files failed.');
        event.target.value = ''; // Clear the input field
        setUploadedFiles((prev) => [...prev]); // Optionally reset or leave unchanged
      } else {
        setUploadedFiles((prev) => [...prev, ...arr]);
      }

      console.log(arr); // Log the updated array
    });
  };

  const watchedFields = watch(['familyMember', 'documentType']);
  const familyMemberForm = getValues('familyMember');

  const submitAllowed = () => {
    const documentTypeForm = getValues('documentType');

    if (uploadedFiles.length < 1 || !familyMemberForm || !documentTypeForm) {
      return true;
    } else {
      return false;
    }
  };

  useEffect(() => {
    const checklistItem = getSelectedForUploadChecklistItem();
    const selectedChecklistItemFileType = rulesetsFileTypeExtractor(
      (checklistItem?.RuleSets as string | undefined) ?? '[]'
    );

    if (acceptedDocuments && acceptedDocuments.length > 0) {
      if (documentType) {
        setValue('documentType', documentType);
      } else if (checklistItem && applicationId && selectedChecklistItemFileType.length > 0) {
        const documentTypeStore = {
          documentName: selectedChecklistItemFileType[0]!,
          documentGroup: checklistItem.CriterionGroupName!
        };
        setValue('documentType', documentTypeStore);
        setSelectedForUploadChecklistItem(undefined);
      }
    }

    if (editDocumentProp) {
      if (!reUpload) {
        prepareExistingFiles();
      } else {
        handleReSubmit();
      }

      setValue('description', editDocumentProp.Description);
      if (editDocumentProp.UserFamilyMember) {
        setValue('familyMember', editDocumentProp.UserFamilyMember.id);
      } else {
        setValue('familyMember', familyMembers[0].id);
      }
    }
  }, [
    editDocumentProp,
    acceptedDocuments,
    documentType,
    prepareExistingFiles,
    setValue,
    familyMembers,
    params,
    getSelectedForUploadChecklistItem,
    applicationId,
    setSelectedForUploadChecklistItem,
    reUpload,
    handleReSubmit
  ]);

  useEffect(() => {}, [watchedFields]);

  // if (spin) {
  //   return <CircularProgress />;
  // }

  return (
    <>
      <Box className="">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box className="mb-[24px]">
            <Box className="mb-[16px] flex flex-row xl:!d-text-body-lg ">
              <Typography className="!m-text-body-md md:!d-text-body-md pt-[2px] md:pt-0 !mr-[8px] !flex !items-center">
                {t('thisDocumentBelogsTo')}
                <Icon className="ml-2" id="tooltip-family-member-info">
                  info_outlined_icon
                </Icon>
              </Typography>
              <TooltipUI
                anchorSelect="#tooltip-family-member-info"
                place="bottom"
                content={t('selectFamilyMemberTootip')}
              />
            </Box>
            <Controller
              name="familyMember"
              control={control}
              rules={{
                required: t('selectFamilyMemberPlaceholder')
              }}
              render={({ field }) => (
                <FormControl fullWidth>
                  <InputLabel id="select-family-member">{t('selectFamilyMemberPlaceholder')}</InputLabel>
                  {/* <InputLabel id="select-family-member">Select family member</InputLabel> */}
                  <Select
                    {...field}
                    labelId="select-family-member"
                    className="!w-full"
                    label={t('selectFamilyMemberPlaceholder')}
                    // label="Select family member"
                    value={field.value ?? ''}
                    // renderValue={field.value || null}
                  >
                    {familyMembers.map((member) => {
                      return (
                        <MenuItem key={member.id} value={member.id}>
                          {`${member.FirstName} ${member.LastName}`}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              )}
            />
          </Box>
          <Box className="mb-[24px]">
            <Box className="mb-[16px]">
              <Typography className="!m-text-body-md md:!d-text-body-md pt-[2px] md:pt-0 !mr-[8px] !flex !items-center">
                {t('docType')}
                {/* <Icon className="ml-2" id="document-type-info">
                  info_outlined_icon
                </Icon> */}
              </Typography>
              {/* <TooltipUI anchorSelect="#document-type-info" place="bottom" content={t('selectDocType')} /> */}
            </Box>
            {/* This input field doese not render default data */}
            <Controller
              name="documentType"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  {...field}
                  value={field.value || null}
                  className="w-full"
                  options={acceptedDocuments ?? []}
                  groupBy={(option) => option.documentGroup}
                  getOptionLabel={(option) => option.documentName}
                  onChange={(_event, newValue) => {
                    setValue('documentType', newValue);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      {...field.value}
                      InputProps={{
                        ...params.InputProps,
                        readOnly: true
                      }}
                      placeholder={t('selectDocumentPlaceholder')}
                      label={t('selectDocumentPlaceholder')}
                    />
                  )}
                  disableCloseOnSelect={false}
                  forcePopupIcon={true}
                />
              )}
            />
          </Box>
          <Box className="mb-[16px]">
            <Typography className="!m-text-body-md md:!d-text-body-md pt-[2px] md:pt-0 !mr-[8px] !flex !items-center">
              {t('description_optional')}
              <Icon className="ml-2" id="desribe-document-info">
                info_outlined_icon
              </Icon>
            </Typography>
            <TooltipUI anchorSelect="#desribe-document-info" place="bottom" content={t('describeDoc')} />
          </Box>
          <Box>
            <TextField
              {...register('description')}
              className="!w-full !mb-[32px]"
              multiline
              minRows={2}
              placeholder={t('descriptionPlaceholder')}
              inputProps={{ maxLength: 300 }}
              helperText={`${countChars.length}/300`}
              onChange={onCount}
            ></TextField>
          </Box>
          {/* <Box className="!mb-[24px] !bg-importantBackground !min-h-[120px] !flex !flex-col justify-center !py-[20px]">
            <Box className="flex !d-text-body-lg !px-[15px]">
              <Icon>warning_amber_outlined_icon</Icon>
              <Typography className="!pl-[13px] !d-text-body-sm-bold lg:!d-text-body-md-bold">
                {t('important')}
              </Typography>
            </Box>
            <Box>
              <Typography className="!px-[50px] !d-text-body-sm lg:!d-text-body-md">{t('oneDocAtTime')}</Typography>
            </Box>
          </Box> */}

          <Box className="!bg-primary !bg-opacity-[4%] !mb-[150px] border-2 rounded-md !border-dashed !border-secondary border-opacity-100 lg:!p-[12px] min-h-[100px]">
            {uploadedFiles.length > 0 ? (
              <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd} sensors={sensors}>
                <List className="w-full !px-[8px]">
                  <Box className=" pt-[8px]">
                    <Typography className="!m-text-body-md md:!d-text-body-md xl:pt-0 !mb-[8px]">
                      {t('dragToReorder')}
                    </Typography>
                  </Box>
                  <SortableContext items={uploadedFiles} strategy={verticalListSortingStrategy}>
                    {uploadedFiles.map((uploadedFile) => {
                      return (
                        <File
                          key={uploadedFile.id}
                          id={uploadedFile.id}
                          thumbnail={uploadedFile.thumbnailUrl}
                          name={uploadedFile.name}
                          type={uploadedFile.type}
                          removeFile={removeFile}
                        />
                      );
                    })}
                  </SortableContext>
                </List>
              </DndContext>
            ) : (
              <Box>
                <input
                  type="file"
                  accept=".png, .jpg, .jpeg, .pdf"
                  hidden
                  multiple={true}
                  id="upload-file"
                  onChange={(e) => handleUploadFiles(e)}
                ></input>
                <label htmlFor="upload-file">
                  <Box className="!flex flex-col !justify-center !items-center !min-h-[100px] !w-full relative p-[16px]">
                    <FileUploadOutlinedIcon className="mb-[8px] w-full !text-black" />
                    <Typography className="!m-text-body-md-bold md:!d-text-body-md-bold !text-black !text-center !mb-[8px]">
                      {t('uploadNew')}
                    </Typography>
                    <Typography className="!m-text-body-md md:!d-text-body-md !text-black !text-center">
                      {t('acceptedFiles')}
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
            {uploadedFiles.length > 0 && (
              <Button
                className="!mb-[16px] !w-[94%] md:!w-[660px] !h-10 !m-text-btn-md !normal-case !text-secondary !border-secondary"
                variant="outlined"
                component="label"
              >
                <input
                  type="file"
                  accept=".png, .jpg, .jpeg, .pdf"
                  hidden
                  multiple={true}
                  onChange={(e) => handleUploadFiles(e)}
                />
                {/* <Icon className="mr-[10px]">add</Icon> */}
                {t('uploadMorePages')}
              </Button>
            )}

            <Button
              variant="contained"
              className={`!py-[16px] !w-[94%] md:!w-[660px] !h-10 ${
                submitAllowed() ? '' : '!bg-secondary'
              } !m-text-btn-md !normal-case`}
              //   onClick={() => navigate('/upload-generator')}
              type="submit"
              disabled={submitAllowed()}
            >
              {reUpload && <span>{'Replace document'}</span>}
              {buttonNameProp && !reUpload && <span>{buttonNameProp}</span>}
              {!buttonNameProp && !reUpload && <span>{t('uploadDoc')}</span>}
            </Button>
          </Box>
        </form>
      </Box>
    </>
  );
}

export default PDFUploader;
