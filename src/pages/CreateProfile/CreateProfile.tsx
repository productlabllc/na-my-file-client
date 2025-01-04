import MyFileLogo from '../../components/MyFileLogo/MyFileLogo';
import GlobalNavigation from '../../layouts/GlobalNavigation/GlobalNavigation';
// import { languages, languagesInEnglish } from '../../assets/languages/languages'
import { Box, Button, TextField, CircularProgress, Typography } from '@mui/material';
import { DateField } from '@mui/x-date-pickers/DateField';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { useBoundStore } from '../../store/store';
// import { useAuth } from 'react-oidc-context';
import { UpdateUserRequest } from '@myfile/api-client';
import { useEffect } from 'react';
import { useAsync } from 'react-use';
import { useApi } from '../../utils/use-api';
import { useTranslation } from 'react-i18next';
import { useAuth } from 'react-oidc-context';

interface IFormInput {
  FirstName: string;
  LastName: string;
  DOB: null | dayjs.Dayjs;
  language: string;
}

function CreateProfile() {
  // const auth = useAuth();
  const navigate = useNavigate();
  const { updateUser, getUserLang } = useBoundStore();
  const lang = getUserLang();
  const auth = useAuth();

  const api = useApi();
  const { value } = useAsync(() => api.getUser());

  const { register, control, handleSubmit, formState, reset } = useForm<IFormInput>({
    defaultValues: {
      FirstName: auth.user?.profile.given_name || value?.FirstName || '',
      LastName: auth.user?.profile.family_name || value?.LastName || '',
      DOB: dayjs(value?.DOB) || null,
      language: value?.LanguageIsoCode || 'en-us'
    },
    mode: 'all',
    reValidateMode: 'onChange',
    shouldFocusError: true
  });
  const { errors } = formState;

  const { t } = useTranslation('user');

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    const language = lang;

    const newProfile: UpdateUserRequest = {
      FirstName: data.FirstName,
      LastName: data.LastName,
      DOB: dayjs(data.DOB).format('MM/DD/YYYY'),
      LanguageIsoCode: language ? language : 'en-us'
    };

    updateUser(newProfile).then(() => {
      if (
        //@ts-expect-error StakeholderGroupRoles not exist on User type
        value.StakeholderGroupRoles[0].StakeholderGroupRole.Name == 'Client' ||
        //@ts-expect-error StakeholderGroupRoles not exist on User type
        value.StakeholderGroupRoles[0].StakeholderGroupRole.Name == 'Client Trusted User'
      ) {
        navigate('/family-members');
      } else {
        navigate('/agent-dashboard');
      }
      reset();
    });
  };

  useEffect(() => {
    if (value) {
      reset({
        FirstName: value.FirstName ? value?.FirstName : '',
        LastName: value.LastName ? value.LastName : '',
        DOB: value.DOB ? dayjs(value?.DOB) : null,
        language: value?.LanguageIsoCode || 'en-us'
      });
    }
  }, [reset, value]);

  if (!value) {
    return <CircularProgress />;
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box>
        <Box className="fixed top-0 w-full !z-20">
          <GlobalNavigation />
        </Box>
        <Box className="w-full flex justify-center">
          <Box className="w-full md:w-[546px] lg:w-[570px] mt-[70px] px-[16px] md:px-0 pb-[52px]">
            <Box className="mb-[24px]">
              <Box className="mb-[24px]">
                <MyFileLogo variant="full" notClickable={true} />
              </Box>
              <Box className="mb-[8px] md:mb-[16px]">
                <Typography className="!m-text-h5 md:!d-text-h5 !text-black">{t('createProfile')}</Typography>
              </Box>
              <Box>
                <Typography className="!m-text-body-md md:!d-text-body-md">{t('createProfileBodyText')}</Typography>
              </Box>
            </Box>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Typography className="!m-text-body-md sm:!d-text-body-md !mb-[16px]">{t('firstName')}</Typography>

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
                className="w-full !pb-[24px] !m-text-body-md  sm:!d-text-body-md "
                placeholder={t('firstNamePlaceholder')}
                error={!!errors.FirstName}
                helperText={errors.FirstName?.message}
                label={t('firstNamePlaceholder')}
                InputLabelProps={{
                  shrink: true
                }}
                // value={user?.FirstName}
              />

              <Typography className="!m-text-body-md  sm:!d-text-body-md  !mb-[16px]">{t('lastName')}</Typography>

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
                    message: 'Invalid last name'
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
                // value={user?.LastName}
              />

              <Typography className="!m-text-body-md  sm:!d-text-body-md !mb-[16px]">{t('DOB')}</Typography>
              <Controller
                name="DOB"
                control={control}
                rules={{
                  required: t('validations.DOBRequired'),
                  validate: {
                    isValid: (v) => dayjs(v).isValid() || t('validations.DOBValid'),
                    yearGreaterThan: (v) => dayjs(v).get('year') >= 1920 || t('validations.DOBMax'),
                    monthNotHigherThan: (v) =>
                      !!dayjs(v).isBefore(dayjs()) || `${t('validations.DOBMin')} ${dayjs().format('MM/DD/YYYY')}. `,
                    olderThan18: (v) => {
                      const today = dayjs();
                      const eighteenYearsAgo = today.subtract(18, 'years');
                      return dayjs(v).isBefore(eighteenYearsAgo) || t('validations.DOBAdult');
                    }
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
                    className="w-full !mb-[50px]"
                    label={t('dateFormate')}
                    // value={''}
                    disableFuture
                    InputLabelProps={{
                      shrink: true
                    }}
                  />
                )}
              />

              <Box
                sx={{ boxShadow: '0px -4px 4px -4px black' }}
                className="!fixed !py-[16px] !h-min-[70px] !z-20 bottom-0 w-full inset-x-0 !flex !flex-col !justify-center !bg-white !items-center"
              >
                <Button
                  className={`!w-[94%] md:!w-[660px] !h-10 !m-text-btn-md !normal-case ${
                    !formState.isValid ? '' : '!text-white !bg-secondary'
                  }`}
                  variant="contained"
                  type="submit"
                  disabled={!formState.isValid}
                >
                  {t('save')}
                </Button>
              </Box>
            </form>
          </Box>
        </Box>
      </Box>
    </LocalizationProvider>
  );
}

export default CreateProfile;
