import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
//SubmitHandler
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import { convertAgentRoleIntoAgency } from '../../assets/agent-role/agent-role';
import { useApi } from '../../utils/use-api';
import { useAsync } from 'react-use';
import { GetUser } from '@namyfile/api-client';
import { useBoundStore } from '../../store/store';

import {
  Box,
  Breadcrumbs,
  Typography,
  Button,
  // Divider,
  // FormControl,
  List,
  TextField,
  Select,
  MenuItem
  // SelectChangeEvent,
  // Dialog,
  // IconButton
} from '@mui/material';

import AgentHeader from '../../layouts/AgentHeader/AgentHeader';
import AgentSideBar from '../../layouts/AgentSideBar/AgentSideBar';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import CloseIcon from '@mui/icons-material/Close';

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

import FileType from '../../types/FileType';
import AgentUploadedFile from '../../components/AgentUploadedFile/AgentUploadedFile';
import AgentDialogGenerateDocument from '../../components/AgentDialogGenerateDocument/AgentDialogGenerateDocument';
import queryString from 'query-string';
import { useTranslation } from 'react-i18next';

interface DocumentUpload {
  FamilyMember: string | undefined;
  FileType: string | undefined;
  Description: string | undefined;
  Files: string[] | [];
}
interface SelectFamilyMember {
  id: string | undefined;
  FirstName: string | undefined;
  LastName: string | undefined;
}

const findFirstSSN = (data: GetUser) => {
  if (data.CaseTeamAssignments) {
    for (const caseAssignment of data.CaseTeamAssignments) {
      const caseDetails = caseAssignment.Case;
      if (caseDetails && caseDetails.CaseAttributes) {
        for (const attribute of caseDetails.CaseAttributes) {
          if (attribute.name === 'ssn') {
            return attribute.value;
          }
        }
      }
    }
  }
  return null; // Return null if no SSN is found
};

const findFirstCareID = (data: GetUser) => {
  if (data.CaseTeamAssignments) {
    for (const caseAssignment of data.CaseTeamAssignments) {
      const caseDetails = caseAssignment.Case;
      if (caseDetails && caseDetails.AgencyCaseIdentifier) {
        console.log('PATH NUMBER:', caseDetails.AgencyCaseIdentifier);
        return caseDetails.AgencyCaseIdentifier;
      }
    }
  }

  return null;
};

function AgentUploadGenerator() {
  const navigate = useNavigate();
  const params = useParams();
  const api = useApi();
  const [countChars, setCountChars] = useState<string>('');
  const [uploadedFiles, setUploadedFiles] = useState<FileType[]>([]);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [submitDocumentSpinner, setSubmitDocumentSpinner] = useState(false);
  const { navigateAfterGeneratedDocument } = useBoundStore();
  const { t } = useTranslation('agent');

  const [windowHeight, setWindowHeight] = useState(0);

  const { fileTypes: allowedFileTypes = [] } = (queryString.parse(location.search) ?? {}) as { fileTypes?: string[] };

  const documentType = Array.isArray(allowedFileTypes) ? allowedFileTypes[0] : (allowedFileTypes as string);

  const { value: agent } = useAsync(api.getUser);

  const agentRole = agent?.StakeholderGroupRoles?.[0]?.StakeholderGroupRole?.Name;

  const calculateBottomPosition = () => {
    const bottom = window.innerHeight + window.scrollY - 65;
    setWindowHeight(bottom);
  };

  console.log(convertAgentRoleIntoAgency(agentRole!));

  const { value: clientInfo } = useAsync(() => {
    return api.getUserAdmin({ userId: params.clientId ?? '' });
  }, []);

  const {
    value: cases
    // loading: loadingCases,
  } = useAsync(() => api.getUserCasesAdmin({ userId: params.clientId ?? '' }), []);

  const checklistItemName = useMemo(() => {
    if (cases) {
      const foundCase = cases?.find((caseD) => caseD.id === params.caseId);
      const checklistItem = foundCase?.CaseCriteria?.find((newCriteria) => newCriteria.id === params.checklistItemId);
      console.log('checklistItem', checklistItem);
      const ruleset = JSON.parse(checklistItem?.RuleSets as string);
      if (ruleset) {
        const generateChecklistItemName = ruleset?.[0].value
          ?.map((ele: { name: string }) => ele.name)
          .flat()
          .join(', ');

        return generateChecklistItemName;
      } else return 'Not found';
    }
  }, [cases]);

  const familyMembers = useMemo(() => {
    const addPrimmaryUser: SelectFamilyMember[] =
      clientInfo?.UserFamilyMembers?.map((member) => {
        return { id: member.id, FirstName: member.FirstName, LastName: member.LastName };
      }) ?? [];
    addPrimmaryUser.unshift({ id: clientInfo?.id, FirstName: clientInfo?.FirstName, LastName: clientInfo?.LastName });
    return addPrimmaryUser;
  }, [clientInfo]);

  useEffect(() => {
    const handleResize = () => {
      calculateBottomPosition();
    };

    const handleScroll = () => {
      calculateBottomPosition();
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);

    // Set initial position
    calculateBottomPosition();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // handleSubmit, reset, setValue
  const { register, control, handleSubmit, getValues, reset } = useForm<DocumentUpload>({
    defaultValues: {
      FamilyMember: '',
      FileType: '',
      Description: ''
    },
    mode: 'all',
    reValidateMode: 'onChange'
  });

  useEffect(() => {
    reset({ FamilyMember: familyMembers[0].id, FileType: documentType, Description: '' });
  }, [familyMembers]);

  const getSelectedFamilyMember = useMemo(() => {
    return familyMembers.find((member) => member.id === getValues('FamilyMember'));
  }, [getValues('FamilyMember'), familyMembers]);

  console.log('getSelectedFamilyMember', getSelectedFamilyMember);

  const onCount = (e: React.ChangeEvent) => setCountChars((e.target as HTMLInputElement).value);

  const handleUploadFiles = (
    event: React.ChangeEvent & {
      target: HTMLInputElement & EventTarget;
    }
  ) => {
    event?.preventDefault();
    const arr = [];
    if (!event.target.files) return;
    for (let i = 0; i < event.target.files.length; i++) {
      console.log(event.target.files[i].size);
      if (event.target.files[i].size > 10485760) {
        event.target.value = '';
      } else {
        arr.push({
          id: uuidv4(),
          thumbnailUrl: URL.createObjectURL(event.target.files[i]),
          file: event.target.files[i],
          name: event.target.files[i].name,
          size: event.target.files[i].size,
          type: event.target.files[i].type
        });
      }
    }
    setUploadedFiles([...uploadedFiles, ...arr]);
  };

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

  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false);
  };

  const onSubmit: SubmitHandler<DocumentUpload> = async (data) => {
    setSubmitDocumentSpinner(true);
    const newData = {
      Description: data.Description,
      ...(data.FamilyMember && data.FamilyMember !== clientInfo?.id ? { UserFamilyMemberId: data.FamilyMember } : {}),
      FileType: documentType,
      // Adding the two below fields will automatically create case files
      CaseCriterionId: params.checklistItemId,
      ForUserId: params.clientId,
      Title: uploadedFiles[0].name,
      Files: uploadedFiles.map((file, index) => {
        return {
          id: file.id,
          ContentType: file.type,
          OriginalFilename: file.name,
          SizeInBytes: file.size,
          PageNumber: index + 1
        };
      })
    };
    console.log('submit data', newData);
    try {
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

      // setCreationState(false);
      // setSpin(false);
      setCountChars('');
      setUploadedFiles([]);
      setOpenConfirmDialog(false);
      reset();
      setSubmitDocumentSpinner(false);
      if (navigateAfterGeneratedDocument) {
        navigate(`/client/${params.clientId}/case/${params.caseId}/checklist-item/${params.checklistItemId}`);
      }
      console.log('response', response);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Box>
      <Box className="relative !z-30">
        <AgentHeader />
      </Box>
      <Box className="flex flex-row w-fit">
        <Box className="relative !z-10">
          <AgentSideBar />
        </Box>

        <Box sx={{ height: `${windowHeight}px` }} className={`2xl:!ml-[286px] !ml-[134px] w-full relative`}>
          <Box className="mb-[40px] mt-[48px]">
            <Breadcrumbs separator="›" aria-label="breadcrumb" className="!text-secondary ">
              <Typography
                color="inherit"
                className="!cursor-pointer !d-text-body-sm-bold underline underline-offset-4"
                onClick={() => navigate('/agent-dashboard')}
              >
                {t('dashboard')}
              </Typography>
              <Typography
                className="!cursor-pointer !d-text-body-sm-bold underline underline-offset-4"
                onClick={() => navigate(`/client/${params.clientId}`)}
              >
                {clientInfo?.FirstName} {clientInfo?.LastName}
              </Typography>
              <Typography
                onClick={() =>
                  navigate(`/client/${params.clientId}/case/${params.caseId}/checklist-item/${params.checklistItemId}`)
                }
                className="!cursor-pointer !d-text-body-sm-bold underline underline-offset-4"
              >
                {checklistItemName}
              </Typography>
              <Typography className="!cursor-default !d-text-body-sm-bold">{t('uploadDocument')}</Typography>
            </Breadcrumbs>
          </Box>

          <Box className="mb-[40px] relative">
            <Box>
              <Box className="flex !flex-row !items-end mb-[16px]">
                <Box className="absolute right-[100px] ">
                  <Button
                    onClick={() =>
                      navigate(
                        `/client/${params.clientId}/case/${params.caseId}/checklist-item/${params.checklistItemId}`
                      )
                    }
                    className="flex flex-row items-center !text-secondary !normal-case min-w-[120px]"
                  >
                    <CloseIcon className="mr-[8px]" />
                    <Typography className="!d-text-btn-sm">Close</Typography>
                  </Button>
                </Box>
                <Typography className="!d-text-h5 !mr-[12px]">
                  {clientInfo?.FirstName} {clientInfo?.LastName}
                </Typography>
                <Typography className="!d-text-body-sm !text-applicationClose">
                  {convertAgentRoleIntoAgency(agentRole!) === 'PATH'
                    ? `CARES ID: ${findFirstCareID(clientInfo ?? {})}`
                    : `CARES ID: ${findFirstSSN(clientInfo ?? {})}`}
                </Typography>
                {/* <Typography className="!d-text-body-sm">CARES ID: CL 212414 </Typography> */}
              </Box>
              <Typography className="!d-text-body-lg-bold !mb-[16px]">
                {`${t('noFilesInChecklistButton')} ${documentType}`}
              </Typography>
              <Box className="max-w-[600px]">
                <Typography className="!d-text-body-md">{t('uploadDocumentDescription')}</Typography>
              </Box>
            </Box>
          </Box>
          <form id="hook-form" onSubmit={handleSubmit(onSubmit)}>
            <Box className="flex flex-row mr-[48px] pb-[100px]">
              <Box className="w-[450px] 3xl:w-[500px] mr-[100px] 2xl:mr-[160px] 3xl:mr-[200px]">
                <Box className="mb-[36px]">
                  <Typography className="!d-text-body-lg !mb-[16px]">{t('familyMemberApplicationDocument')}</Typography>
                  <Controller
                    name="FamilyMember"
                    control={control}
                    render={({ field }) => (
                      <Select {...field} className="!w-full">
                        {familyMembers.map((member) => (
                          <MenuItem key={member.id} value={member.id}>
                            {`${member.FirstName} ${member.LastName}`}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                </Box>
                <Box>
                  <Typography className="!d-text-body-lg !mb-[16px]">{t('describeDocument')}</Typography>
                  <TextField
                    {...register('Description')}
                    className="!w-full !mb-[32px]"
                    multiline
                    minRows={4}
                    inputProps={{ maxLength: 300, placeholder: t('describeDocumentPlaceholder') }}
                    helperText={`${countChars.length}/300`}
                    onChange={onCount}
                  ></TextField>
                </Box>
              </Box>

              <Box className="w-[400px] xl:w-[450px] 2xl:w-[450px] 3xl:w-[600px] mr-[24px]">
                <Box>
                  <input
                    type="file"
                    accept=".png,.jpeg,.pdf"
                    hidden
                    multiple={true}
                    id="upload-file"
                    onChange={(e) => handleUploadFiles(e)}
                  ></input>
                  <label htmlFor="upload-file">
                    <Box className="!h-[140px] !w-full !bg-primary !bg-opacity-5 hover:!bg-opacity-10 flex flex-col !items-center justify-center border-2 border-dashed rounded-md mb-[24px]">
                      <FileUploadOutlinedIcon className="!d-text-h4 mb-[8px]" />
                      <Typography className="!d-text-body-md-bold !mb-[8px]">{t('uploadFileHere')}</Typography>
                      <Typography className="!d-text-body-md">{t('acceptedFileTypes')}</Typography>
                    </Box>
                  </label>
                </Box>

                <Box>
                  {uploadedFiles.length > 0 ? (
                    <Typography className="!d-text-body-lg !mb-[4px]">{t('uploads')}</Typography>
                  ) : (
                    ''
                  )}
                  {uploadedFiles.length > 0 ? (
                    <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd} sensors={sensors}>
                      <Typography className="!d-text-body-sm !mb-[8px]">{t('dragAndDrop')}</Typography>
                      <List className="max-h-[460px] overflow-y-scroll">
                        <SortableContext items={uploadedFiles} strategy={verticalListSortingStrategy}>
                          {uploadedFiles.map((uploadedFile) => (
                            <AgentUploadedFile
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
                    <Box></Box>
                  )}
                </Box>
              </Box>
            </Box>
            <Box
              // sx={{ boxShadow: '0px -4px 4px -4px black' }}
              className="!absolute !py-[24px] !h-min-[70px] !z-0 bottom-0 !w-full !bg-pageBackground inset-x-0 !flex !flex-col !justify-center !items-center"
            >
              {/* <Button
              className="!mb-[16px] !w-[94%] md:!w-[660px] !h-10 !m-text-btn-md !normal-case !text-secondary !border-secondary"
              variant="outlined"
              component="label"
            >
              <input type="file" accept="image/*,.pdf" hidden multiple={true} onChange={(e) => handleUploadFiles(e)} />
             
              {content?.uploadMorePages}
            </Button> */}

              <Button
                variant="contained"
                className={`!py-[16px] w-[660px] md:!w-[660px] !h-12 ${
                  uploadedFiles.length < 1 ? '' : '!bg-secondary'
                } !m-text-btn-md !normal-case`}
                onClick={() => setOpenConfirmDialog(true)}
                // type="submit"
                disabled={uploadedFiles.length < 1}
              >
                {t('complete')}
              </Button>
            </Box>
            <AgentDialogGenerateDocument
              handleCloseConfirmDialog={handleCloseConfirmDialog}
              client={getSelectedFamilyMember}
              documentType={documentType}
              openConfirmDialog={openConfirmDialog}
              submitDocumentSpinner={submitDocumentSpinner}
            />
          </form>
        </Box>
      </Box>
    </Box>
  );
}

export default AgentUploadGenerator;
