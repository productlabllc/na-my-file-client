import { ChangeEvent } from 'react';
import { useFormContext } from 'react-hook-form';
import {
  Box,
  Button,
  Typography,
  TextField,
  Select,
  MenuItem,
  SelectChangeEvent,
  Icon,
  InputLabel
} from '@mui/material';
import TooltipUI from '../TooltipUI/TooltipUI';
import { useTranslation } from 'react-i18next';
import BackButton from '../BackButton/BackButton';

interface StepTwoHPDApplicationProps {
  shelterData: string;
  handleChangeShelter: (e: SelectChangeEvent<string>) => void;
  handleChangeBuildingUnit: (e: SelectChangeEvent<string>) => void;
  shelters: string[];
  buildingUnits: string[];
  buildingUnitData: string;
  handleSSN: (e: ChangeEvent<HTMLInputElement>) => void;
  organization: string;
  ssn: string;
  prevStep: () => void;
  nextStep: () => void;
}

function StepTwoHPDApplication({
  shelterData,
  handleChangeShelter,
  handleChangeBuildingUnit,
  shelters,
  buildingUnits,
  buildingUnitData,
  handleSSN,
  // organization,
  ssn,
  prevStep,
  nextStep
}: StepTwoHPDApplicationProps) {
  const { register, formState } = useFormContext();
  const { errors } = formState;

  const { t } = useTranslation('applications');

  return (
    <>
      <Box className="mb-[24px]">
        <BackButton text={t('return')} step={prevStep} />
      </Box>
      <Typography className="!mb-[8px] !m-text-italic md:!d-text-italic">{t('stepTwo')}</Typography>
      <Typography className="!mb-[8px] !m-text-h5 lg:!d-text-h5">{t('startService')}</Typography>
      <Typography className="!mb-[24px] !m-text-body-md lg:!d-text-body-md">{t('applyHPD')}</Typography>
      <Box className="!mb-[16px]">
        <Typography className="!m-text-body-md lg:!d-text-body-md !flex !items-center">
          {t('shelter')}
          <Icon className="ml-2 !flex" id="shelter-info">
            info_outlined_icon
          </Icon>
        </Typography>
        <TooltipUI anchorSelect="#shelter-info" place="bottom" content={t('shelterToolTip')} />
      </Box>

      <InputLabel id="select_id">{t('selectShelter')}</InputLabel>
      <Select
        id="select_id"
        defaultValue={shelterData}
        value={shelterData}
        onChange={handleChangeShelter}
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
        defaultValue={buildingUnitData}
        value={buildingUnitData}
        onChange={handleChangeBuildingUnit}
        className="!w-full !mb-[24px]"
      >
        {buildingUnits.map((buildingUnit, index) => (
          <MenuItem key={index} value={buildingUnit}>
            {buildingUnit}
          </MenuItem>
        ))}
      </Select>

      <Box className="!mb-[16px]">
        <Typography className=" !m-text-body-md lg:!d-text-body-md !flex !items-center">
          {t('caresId')}
          <Icon className="ml-2" id="ssn-info">
            info_outlined_icon
          </Icon>
        </Typography>
        <TooltipUI anchorSelect="#ssn-info" place="bottom" content={t('caseNumberTooltip')} />
      </Box>

      <TextField
        {...register('ssn', {
          onChange: (e) => {
            handleSSN(e);
          },
          required: t('validation.caresIdRequire'),
          minLength: {
            value: 4,
            message: t('validation.caresIdRequire')
          },
          maxLength: {
            value: 12,
            message: 'Maximun character 12'
          }
        })}
        error={!!errors.ssn}
        helperText={errors.ssn?.message ? `${errors.ssn?.message}` : t('exampleDSS')}
        value={ssn}
        className="!w-full !mb-[24px]"
        label="DHS CARES ID"
        type="number"
      />
      <Box
        sx={{ boxShadow: '0px -4px 4px -4px black' }}
        className="!fixed !py-[16px] !h-min-[70px] !z-20 bottom-0 w-full inset-x-0 !flex !flex-col !justify-center !bg-white !items-center"
      >
        {/* <Button
            variant="text"
            className="sm:!mr-[16px] !flex-1 !m-text-btn-md !mr-2 !border-secondary !text-secondary sm:!min-w-[290px] !h-[48px] !normal-case"
            onClick={prevStep}
          >
            {t('back')}
          </Button> */}
        <Button
          variant="contained"
          className={`!m-text-btn-md !w-[94%] md:!w-[660px] ${
            !formState.isValid ? '' : '!text-white !bg-secondary'
          } sm:!min-w-[290px] !h-[48px] !normal-case`}
          onClick={nextStep}
          disabled={!formState.isValid}
        >
          {t('continue')}
        </Button>
      </Box>
    </>
  );
}

export default StepTwoHPDApplication;
