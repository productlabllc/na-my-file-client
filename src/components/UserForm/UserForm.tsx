import GlobalNavigation from '../../layouts/GlobalNavigation/GlobalNavigation';
// import { languages, languagesInEnglish } from '../../assets/languages/languages'
import { Box, Button, TextField, Icon } from '@mui/material';
import { DateField } from '@mui/x-date-pickers/DateField';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
// import User from '../../types/UserType';
import { UpdateUserRequest } from '@namyfile/api-client';
import { useBoundStore } from '../../store/store';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface IFormInput {
  FirstName: string;
  LastName: string;
  DOB: string | dayjs.Dayjs;
  LanguageIsoCode: string;
}

interface UserFormProps {
  user?: UpdateUserRequest;
  updateUser?: (userData: UpdateUserRequest) => void;
}

function UserForm({ user }: UserFormProps) {
  const navigate = useNavigate();
  const { updateUser, getUserData, loading } = useBoundStore();

  const { t } = useTranslation('user');

  const { register, control, handleSubmit, formState, reset } = useForm<IFormInput>({
    defaultValues: {
      FirstName: user?.FirstName || '',
      LastName: user?.LastName || '',
      DOB: dayjs(user?.DOB).add(1, 'day') || '',
      LanguageIsoCode: user?.LanguageIsoCode || 'en-us'
    },
    mode: 'all',
    reValidateMode: 'onChange',
    shouldFocusError: true
  });

  const { errors } = formState;
  //   const updatedLanguage = (event) => {
  //     localStorage.removeItem('language')
  //     localStorage.setItem('language', event.target.value)
  //     location.reload()
  //   }

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    const newData: UpdateUserRequest = {
      ...data,
      LanguageIsoCode: localStorage.getItem('language') || 'en-us',
      DOB: dayjs(data.DOB).format('MM/DD/YYYY'),
      FirstName: data.FirstName,
      LastName: data.LastName
    };
    updateUser(newData);
    navigate(-1);
    reset();
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const userData = await getUserData();
      reset({
        FirstName: userData.FirstName || '',
        LastName: userData.LastName || '',
        DOB: dayjs(userData.DOB).add(1, 'day') || '',
        LanguageIsoCode: userData.LanguageIsoCode || localStorage.getItem('language') || 'en-us'
      });
    };
    fetchUserData();
  }, [getUserData, user, reset, loading]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div>
        <Box className="fixed top-0 w-full !z-20">
          <GlobalNavigation />
        </Box>
        <div className="w-full flex justify-center">
          <div className="w-full md:w-[546px] lg:w-[570px] mt-[70px] px-[16px] md:px-0 pb-[52px]">
            {/* <Box className="pb-[24px]">
              <MyFileLogo variant="full" notClickable={true} />
            </Box>
            <Box className="mb-[24px]">
              <p className="d-text-h5 text-secondary">Profile creation</p>
            </Box> */}
            <Box className="!w-full flex justify-end">
              <Button className="!normal-case !text-secondary !d-text-btn-md" onClick={() => navigate(-1)}>
                <Icon fontSize="medium" className="mr-2">
                  close_icon
                </Icon>{' '}
                {t('close')}
              </Button>
            </Box>
            <form onSubmit={handleSubmit(onSubmit)}>
              <p className="d-text-body-md mb-[16px]">{t('firstName')}</p>

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
                placeholder="First name"
                error={!!errors.FirstName}
                helperText={errors.FirstName?.message}
                label="First Name"
                InputLabelProps={{
                  shrink: true
                }}
              />

              <p className="d-text-body-md mb-[16px]">{t('lastName')}</p>

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
                placeholder="Last name"
                error={!!errors.LastName}
                helperText={errors.LastName?.message}
                label="Last name"
                InputLabelProps={{
                  shrink: true
                }}
              />

              <p className="d-text-body-md mb-[16px]">{t('DOB')}</p>
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
                    label="MM/DD/YYYY"
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
          </div>
        </div>
      </div>
    </LocalizationProvider>
  );
}

export default UserForm;
