import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { TextField, MenuItem, Select, Box, Button, Icon, Typography, SelectChangeEvent } from '@mui/material';
import TooltipUI from '../TooltipUI/TooltipUI';

import HPDApplicationType from '../../types/HPDApplicationType';
import { useApi } from '../../utils/use-api';
import { GetCaseResponse } from '@namyfile/api-client';
import { useTranslation } from 'react-i18next';

interface ApplicationHPDFormProps {
  application: HPDApplicationType;
  handleCloseDialog: (application: GetCaseResponse) => void;
  refetchApplications: () => void;
}

interface FormInput {
  shelterName: string;
  buildingUnit: string;
  ssn: string;
}

const shelters = [
  "Willow Men's Shelter-Bronx",
  "Franklin Women's Shelter-Bronx",
  'Seneca Houses Family Shelter-Bronx',
  'Nelson Fam Resid Family Shelter-Bronx',
  'Dean Street Family Shelter-Brooklyn',
  'Legacy Family Residence Family Shelter-Brooklyn',
  'Regent Family Residence Family Shelter-Manhattan',
  'Briarwood Family Residence Family Shelter-Queens',
  'Jamaica Residence Family Shelter-Queens'
];

const buildingUnits = ['Rockaway Village Apartments – Phase 4', 'Rockaway Village Apartments – Phase 5'];

function ApplicationHPDForm({ handleCloseDialog, application, refetchApplications }: ApplicationHPDFormProps) {
  const { t } = useTranslation('applications');

  const { register, formState, handleSubmit, setValue } = useForm<FormInput>({
    mode: 'all',
    reValidateMode: 'onChange',
    shouldFocusError: true
  });

  const api = useApi();
  const onSubmit: SubmitHandler<FormInput> = async (data) => {
    await api
      .updateCase({
        caseId: application.id,
        requestBody: {
          SSN: data.ssn,
          CaseAttributes: [
            ...(application?.caseAttributes?.filter(
              (ele) => ele.name !== 'ssn' && ele.name !== 'shelterName' && ele.name !== 'buildingUnit'
            ) ?? []),
            { name: 'ssn', value: data.ssn || ssn || '' },
            { name: 'shelterName', value: data.shelterName || shelter || '' },
            { name: 'buildingUnit', value: data.buildingUnit || buildingUnit || '' }
          ]
        }
      })
      .then((data) => {
        handleCloseDialog(data);

        refetchApplications();
      });
    // navigate('/family-members');
    // reset();
    // handleCloseDialog(application);
  };

  const [shelter, setShelter] = useState(application?.shelterName);
  const [buildingUnit, setBuildingUnit] = useState(application?.buildingUnit);
  const [ssn, setSnn] = useState(application?.ssn);

  const handleChangeShelter = (e: SelectChangeEvent<string>) => {
    setValue('shelterName', e.target.value);
    setShelter(e.target.value);
  };

  const handleChangeBuldingUnit = (e: SelectChangeEvent<string>) => {
    setValue('buildingUnit', e.target.value);
    setBuildingUnit(e.target.value);
  };

  function formatSSN(value: string) {
    if (!value) return value;
    const ssn = value.replace(/[^\d]/g, '');
    const ssnLength = ssn.length;

    if (ssnLength < 4) return ssn;

    if (ssnLength < 6) {
      return `${ssn.slice(0, 3)}-${ssn.slice(3)}`;
    }

    // finally, if the ssnLength is greater then 6, we add the last
    // bit of formatting and return it.
    return `${ssn.slice(0, 3)}-${ssn.slice(3, 5)}-${ssn.slice(5, 9)}`;
  }

  const handleSSN = (e: React.ChangeEvent<HTMLInputElement>) => {
    // setSnn(e.target.value);
    // setValue('ssn', e.target.value);
    const formattedSSN = formatSSN(e.target.value);
    setValue('ssn', formattedSSN);
    setSnn(formattedSSN);
  };

  const { errors } = formState;

  return (
    <div>
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
            <Box className="!mb-[16px] ">
              <Typography className="!m-text-body-md lg:!d-text-body-md !flex !items-center">
                {t('shelter')}
                <Icon className="ml-2 !flex" id="edit-shelter-info">
                  info_outlined_icon
                </Icon>
              </Typography>
              <TooltipUI anchorSelect="#edit-shelter-info" place="bottom" content={t('shelterToolTip')} />
            </Box>

            <Select
              defaultValue={shelter}
              value={shelter}
              onChange={(e) => handleChangeShelter(e)}
              className="!w-full !mb-[24px]"
            >
              {shelters.map((shelter, index) => (
                <MenuItem key={index} value={shelter}>
                  {shelter}
                </MenuItem>
              ))}
            </Select>

            <Box className="!mb-[16px]">
              <Typography className="!m-text-body-md lg:!d-text-body-md !flex !items-center">
                {t('buildingUnit')}
                {/* <Icon className="ml-2 !flex" id="shelter-info">
            info_outlined_icon
          </Icon> */}
              </Typography>
              {/* <TooltipUI anchorSelect="#shelter-info" place="bottom" content={t('shelterToolTip')} /> */}
            </Box>

            <Select
              defaultValue={buildingUnit}
              value={buildingUnit}
              onChange={(e) => handleChangeBuldingUnit(e)}
              className="!w-full !mb-[24px]"
            >
              {buildingUnits.map((buildingUnit, index) => (
                <MenuItem key={index} value={buildingUnit}>
                  {buildingUnit}
                </MenuItem>
              ))}
            </Select>

            <Box className="!mb-[16px]">
              <Typography className="!m-text-body-md lg:!d-text-body-md !flex !items-center">
                {t('caresId')}
                <Icon className="ml-2 !flex" id="edit-ssn-info">
                  info_outlined_icon
                </Icon>
              </Typography>
              <TooltipUI anchorSelect="#edit-ssn-info" place="bottom-end" content={t('ssnToolTip')} />
            </Box>

            <TextField
              {...register('ssn', {
                onChange: (e) => {
                  handleSSN(e);
                },
                required: t('validation.caresIdRequire')
                // minLength: {
                //   value: 11,
                //   message: t('validation.ssnRequiredMessage')
                // }
              })}
              error={!!errors.ssn}
              helperText={errors.ssn?.message ? `${errors.ssn?.message}` : t('validation.caresIdHelper')}
              value={ssn}
              className="!w-full !mb-[24px]"
            />
            <Button
              variant="outlined"
              className={`!absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 !bottom-0 !py-[16px] !w-[90%] sm:!w-[570px] !h-12 ${
                !formState.isValid ? '' : '!text-secondary !border-secondary'
              } !m-text-btn-md !normal-case`}
              disabled={!formState.isValid}
              type="submit"
            >
              {t('save')}
            </Button>
          </form>
        </Box>
      </Box>
    </div>
  );
}

export default ApplicationHPDForm;
