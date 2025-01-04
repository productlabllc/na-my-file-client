import { useState, ChangeEvent } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { TextField, Box, Button, Icon, Typography } from '@mui/material';
import TooltipUI from '../TooltipUI/TooltipUI';

import PATHApplication from '../../types/PATHApplicationType';
import { useApi } from '../../utils/use-api';
import { GetCaseResponse } from '@myfile/api-client';
import { useTranslation } from 'react-i18next';

interface FormInput {
  caseNumber: string;
}

interface ApplicationPATHFormProps {
  application: PATHApplication;
  handleCloseDialog: (application: GetCaseResponse) => void;
  refetchApplications: () => void;
}

function ApplicationPATHForm({ application, handleCloseDialog, refetchApplications }: ApplicationPATHFormProps) {
  const { t } = useTranslation('applications');
  const { register, formState, handleSubmit, setValue } = useForm<FormInput>({
    defaultValues: {
      caseNumber: application?.caseNumber
    },
    mode: 'all',
    reValidateMode: 'onChange',
    shouldFocusError: true
  });

  const [updatedCaseNumber, setUpdatedCaseNumber] = useState(application?.caseNumber);
  const { errors } = formState;

  const api = useApi();

  const onSubmit: SubmitHandler<FormInput> = async (data) => {
    if (application?.id)
      await api
        .updateCase({
          caseId: application.id,
          requestBody: {
            AgencyCaseIdentifier: data.caseNumber
          }
        })
        .then((data) => {
          handleCloseDialog(data);
          refetchApplications();
        });
  };

  const onChangeCaseNumber = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length < 10) {
      setUpdatedCaseNumber(e.target.value);
      setValue('caseNumber', e.target.value);
    }
  };

  return (
    <>
      <Box className="sm:flex sm:justify-center w-[100%] !pt-[24px]">
        <Box className="!px-[16px] w-full sm:w-[600px]">
          <Box className="!w-full flex justify-end mb-[24px]">
            <Button
              className="!normal-case !text-secondary !d-text-btn-md"
              onClick={() => handleCloseDialog(application)}
            >
              <Icon fontSize="medium" className="mr-2">
                close_icon
              </Icon>{' '}
              {t('close')}
            </Button>
          </Box>
          <Typography className="!m-text-h5 lg:!d-text-h5 !mb-[8px]">{t('editApplication')}</Typography>
          <Typography className="!m-text-body-md lg:!d-text-body-md !mb-[24px]">{t('updateInfoDisclamer')}</Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box className="!mb-[8px]">
              <Typography className="!m-text-body-md lg:!d-text-body-md !flex !items-center">
                {t('caseNumber')}
                <Icon className="ml-2 !flex" id="edit-cares-id-info">
                  info_outlined_icon
                </Icon>
              </Typography>
              <TooltipUI anchorSelect="#edit-cares-id-info" place="bottom-end" content={t('caresIdTooltip')} />
            </Box>

            <Typography className="!m-text-body-md lg:!d-text-body-md !mb-[24px]">
              {t('caresIdReturnFamily')}
            </Typography>
            <TextField
              {...register('caseNumber', {
                required: t('validation.caresIdRequire'),
                onChange: (e) => {
                  onChangeCaseNumber(e);
                }
              })}
              type="number"
              // InputProps={{
              //   startAdornment: <InputAdornment position="start">CL</InputAdornment>
              // }}
              value={updatedCaseNumber}
              error={!!errors.caseNumber}
              // helperText={`${errors.caseNumber?.message}`}
              helperText={errors.caseNumber ? `${errors.caseNumber?.message}` : t('validation.caresIdHelper')}
              className="!w-full"
              sx={{
                '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
                  display: 'none'
                },
                '& input[type=number]': {
                  MozAppearance: 'textfield'
                }
              }}
            />
            <Button
              variant="outlined"
              className={`!absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 !bottom-0 !py-[16px] !w-[90%] sm:!w-[570px] !h-12 ${
                application?.caseNumber === updatedCaseNumber || !formState.isValid
                  ? ''
                  : '!text-secondary !border-secondary'
              } !m-text-btn-md !normal-case`}
              disabled={application?.caseNumber === updatedCaseNumber || !formState.isValid}
              type="submit"
            >
              {t('save')}
            </Button>
          </form>
        </Box>
      </Box>
    </>
  );
}

export default ApplicationPATHForm;
