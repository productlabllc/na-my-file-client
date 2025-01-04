import {
  Box,
  Button,
  Icon,
  Select,
  MenuItem,
  TextField,
  Divider,
  Typography,
  FormControl,
  InputLabel
} from '@mui/material';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { v4 as uuidv4 } from 'uuid';
import { DateField } from '@mui/x-date-pickers/DateField';
import { useBoundStore } from '../../store/store';
import { FamilyMember } from '@myfile/api-client';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n/config';

interface IFormFamilyMember {
  FirstName: string;
  LastName: string;
  DOB: string | dayjs.Dayjs;
  Relationship: string;
}

const relationshipData = [
  { label: i18n.t('user:familyMemberTypes.parent'), value: 'Parent' },
  { label: i18n.t('user:familyMemberTypes.child'), value: 'Child' },
  { label: i18n.t('user:familyMemberTypes.spouse'), value: 'Spouse/Married' },
  { label: i18n.t('user:familyMemberTypes.aunt_uncle'), value: 'Aunt/Uncle' },
  { label: i18n.t('user:familyMemberTypes.cousin'), value: 'Cousin' },
  { label: i18n.t('user:familyMemberTypes.domestic_partner'), value: 'Partner/Domestic Partner' },
  { label: i18n.t('user:familyMemberTypes.legal_guardian'), value: 'Legal Guardian' },
  { label: i18n.t('user:familyMemberTypes.grant_parent'), value: 'Grandparent' },
  { label: i18n.t('user:familyMemberTypes.live_aid'), value: 'Live-in Aide' },
  { label: i18n.t('user:familyMemberTypes.niece_nephew'), value: 'Niece/Nephew' },
  { label: i18n.t('user:familyMemberTypes.sibling'), value: 'Sibling' },
  { label: i18n.t('user:familyMemberTypes.grand_child'), value: 'Grandchild' },
  { label: i18n.t('user:familyMemberTypes.legal_dependant'), value: 'Legal Dependent' },
  { label: i18n.t('user:familyMemberTypes.other'), value: 'other' }
];

interface FamilyMemberFormProps {
  member?: FamilyMember | undefined | null;
  familyData?: FamilyMember[];
  updateFamilyMemberList: (newFamilyMember: FamilyMember) => void;
  closeFormFamilyWindow: (createdOrUpdated?: boolean) => void;
  submitButtonContent?: string;
  title?: string;
}

function FamilyMemberForm({
  updateFamilyMemberList,
  closeFormFamilyWindow,
  member,
  submitButtonContent,
  title
}: FamilyMemberFormProps) {
  const familyMemberRelation = relationshipData.find((relation) => relation.value === member?.Relationship);
  const { register, control, handleSubmit, formState, reset } = useForm<IFormFamilyMember>({
    mode: 'all',
    reValidateMode: 'onChange',
    defaultValues: {
      FirstName: member?.FirstName || '',
      LastName: member?.LastName || '',
      //  @ts-expect-error wrong type for DOB
      DOB: member?.DOB ? dayjs(member?.DOB) : null,
      Relationship: familyMemberRelation?.value || ''
    }
  });
  const { errors } = formState;

  const { createFamilyMember, setIsAddFamilyFormOpened } = useBoundStore();

  const { t } = useTranslation('user');

  const onSubmit: SubmitHandler<IFormFamilyMember> = (data, e) => {
    // your code
    e?.preventDefault();
    const newData = {
      id: member?.id ? member.id : uuidv4(),
      ...data,
      DOB: dayjs(data.DOB).toISOString()
      // Relationship: data.Relationship.value
    };

    if (member?.id) {
      updateFamilyMemberList(newData);
    } else {
      createFamilyMember(newData);
    }
    closeFormFamilyWindow(true);
    reset();
  };

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box className="sm:flex sm:justify-center w-[100%] ">
          <Box className="!px-[16px] w-full sm:w-[600px]">
            <Box className="!w-full flex justify-end my-[16px]">
              <Button
                className="!normal-case !text-secondary !m-text-btn-md md:!d-text-btn-md !flex !items-center"
                onClick={() => closeFormFamilyWindow()}
              >
                <Icon className="mr-2 ">close_icon</Icon> {t('close')}
              </Button>
            </Box>
            <Divider className="!mb-[24px]"></Divider>
            <Typography className="!mb-[24px] !m-text-h5 md:!d-text-h5">{title ? title : ''}</Typography>
            <form
              onSubmit={(e) => {
                e.stopPropagation();
                return handleSubmit(onSubmit)(e);
              }}
            >
              <p className="!m-text-body-md md:!d-text-body-md mb-[16px]">{t('firstName')}</p>

              <TextField
                {...register('FirstName', {
                  required: t('validations.firstNameRequired'),
                  maxLength: {
                    value: 25,
                    message: t('validations.charMax')
                  },
                  minLength: {
                    value: 2,
                    message: t('validations.charMin')
                  },
                  pattern: {
                    value:
                      /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð,. '-]+$/u,
                    message: t('validations.firstNameInvalid')
                  }
                })}
                className="w-full !pb-[24px]"
                placeholder={t('firstNamePlaceholder')}
                error={!!errors.FirstName}
                helperText={errors.FirstName?.message}
                label={t('firstNamePlaceholder')}
                InputLabelProps={{
                  shrink: true
                }}
              />

              <p className="!m-text-body-md md:!d-text-body-md mb-[16px]">{t('lastName')}</p>

              <TextField
                {...register('LastName', {
                  required: t('validations.lastNameRequired'),
                  maxLength: {
                    value: 25,
                    message: t('validations.charMax')
                  },
                  minLength: {
                    value: 2,
                    message: t('validations.charMin')
                  },
                  pattern: {
                    value:
                      /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð,. '-]+$/u,
                    message: t('validations.lastNameInvalid')
                  }
                })}
                className="w-full !mb-[24px]"
                placeholder={t('lastNamePlaceholder')}
                error={!!errors.LastName}
                helperText={errors.LastName?.message}
                label={t('lastNamePlaceholder')}
                InputLabelProps={{
                  shrink: true
                }}
              />

              <p className="!m-text-body-md md:!d-text-body-md  mb-[16px]">{t('familyMemberDOB')}</p>
              <Controller
                name="DOB"
                control={control}
                rules={{
                  required: t('validations.DOBRequired'),
                  validate: {
                    isValid: (v) => dayjs(v).isValid() || t('validations.DOBValid'),
                    yearGreaterThan: (v) => dayjs(v).get('year') >= 1920 || t('validations.DOBMax'),
                    monthNotHigherThan: (v) =>
                      !!dayjs(v).isBefore(dayjs()) || `${t('validations.DOBMin')} ${dayjs().format('MM/DD/YYYY')}. `
                  }
                }}
                render={({ field }) => (
                  <DateField
                    {...field}
                    sx={
                      errors.DOB?.message
                        ? {
                            '& .MuiOutlinedInput-root': {
                              // - The Input-root, inside the TextField-root
                              '& fieldset': {
                                // - The <fieldset> inside the Input-root
                                // borderColor: '#d32f2f',
                                border: '1px solid #d32f2f' // - Set the Input border
                              },
                              '&:hover fieldset': {
                                // - Set the Input border when parent is focused
                                borderColor: '#d32f2f'
                              }
                            },
                            '& .MuiFormLabel-root': {
                              color: '#d32f2f' // or black
                            },
                            '& .MuiFormHelperText-root': {
                              color: '#d32f2f'
                            }
                          }
                        : {}
                    }
                    slotProps={{
                      textField: {
                        helperText: errors.DOB?.message
                      }
                    }}
                    className="w-full !mb-[16px]"
                    label={t('dateFormate')}
                    disableFuture
                    InputLabelProps={{
                      shrink: true
                    }}
                  />
                )}
              />
              <p className="!m-text-body-md md:!d-text-body-md  mb-[16px]">{t('familyMemberRelationship')}</p>
              <Controller
                name="Relationship"
                control={control}
                rules={{
                  required: t('selectRelationship')
                }}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">{t('select')}</InputLabel>
                    <Select
                      {...field}
                      labelId="demo-simple-select-label"
                      className="!w-full"
                      defaultValue={field.value}
                      label={t('select')}
                    >
                      {relationshipData.map((status) => (
                        <MenuItem key={status.value} value={status.value}>
                          {status.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
              <Box
                // sx={{ boxShadow: '0px -4px 4px -4px black' }}
                className="!py-[36px] !h-min-[70px] !w-full !flex !flex-col !justify-center !bg-transparent !items-center"
              >
                <Button
                  className={`!w-full !h-12 !m-text-btn-md md:!d-text-btn-md !normal-case ${
                    !formState.isValid ? '' : '!text-secondary !border-secondary'
                  }`}
                  variant="outlined"
                  type="submit"
                  onClick={() => setIsAddFamilyFormOpened(false)}
                  disabled={!formState.isValid}
                >
                  {submitButtonContent ? submitButtonContent : t('save')}
                </Button>
              </Box>
            </form>
          </Box>
        </Box>
      </LocalizationProvider>
    </>
  );
}

export default FamilyMemberForm;
