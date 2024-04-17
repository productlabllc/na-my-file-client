import MyFileLogo from '../../components/MyFileLogo/MyFileLogo';
import GlobalNavigation from '../../layouts/GlobalNavigation/GlobalNavigation';
// import { languages, languagesInEnglish } from '../../assets/languages/languages'
import { Box, Button, TextField } from '@mui/material';
import { DateField } from '@mui/x-date-pickers/DateField';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { useBoundStore } from '../../store/store';
import { useAuth } from 'react-oidc-context';
import { CreateUserRequest } from '@myfile/api-client';
import { useEffect, useState } from 'react';
import User from '../../types/UserType';

interface IFormInput {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  language: string;
  Email: string;
}

function CreateProfile() {
  const auth = useAuth();
  const navigate = useNavigate();
  const { updateUser, getUserData } = useBoundStore();
  const [user, setUser] = useState<User>();

  useEffect(() => {
    const fetchUserData = async () => {
      const userData = await getUserData();
      setUser(userData);
    };
    fetchUserData();
  });

  const { register, control, handleSubmit, formState, reset } =
    useForm<IFormInput>({
      defaultValues: {
        language: localStorage.getItem('language') || 'en'
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
    // const newData = {
    //   ...data,
    //   language: localStorage.getItem('language'),
    //   dateOfBirth: dayjs(data.dateOfBirth).format('MM/DD/YYYY')
    // };
    // console.log(newData);

    const language = localStorage.getItem('language');

    const newProfile: CreateUserRequest = {
      FirstName: data.firstName,
      LastName: data.lastName,
      Email: auth.user?.profile.email ? data.Email : '',
      DOB: data.dateOfBirth,
      LanguageIsoCode: language ? language : 'en'
    };

    // console.log(newProfile);

    updateUser(newProfile, auth.user?.id_token).then((user) => {
      console.log(user);
      navigate('/family-members');
      reset();
    });
  };

  // useEffect(() => {
  //   document.body.style.overflow = 'hidden';
  // });

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div>
        <Box className="fixed top-0 w-full !z-20">
          <GlobalNavigation />
        </Box>
        <div className="w-full flex justify-center">
          <div className="w-full md:w-[546px] lg:w-[570px] mt-[70px] px-[16px] md:px-0 pb-[52px]">
            <Box className="pb-[24px]">
              <MyFileLogo variant="full" notClickable={true} />
            </Box>
            <Box className="mb-[24px]">
              <p className="d-text-h5 text-secondary">Profile creation</p>
            </Box>
            <form onSubmit={handleSubmit(onSubmit)}>
              <p className="d-text-body-md mb-[16px]">
                What is your first name?
              </p>

              <TextField
                {...register('firstName', {
                  required: 'First name is required',
                  maxLength: {
                    value: 25,
                    message: 'Maximum length is 10 characters'
                  },
                  minLength: {
                    value: 2,
                    message: 'Minimum length is 2 character'
                  },
                  pattern: {
                    value:
                      /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð,. '-]+$/u,
                    message: 'Invalid first name'
                  }
                })}
                className="w-full !pb-[24px]"
                placeholder="First name"
                error={!!errors.firstName}
                helperText={errors.firstName?.message}
                label="First Name"
                InputLabelProps={{
                  shrink: true
                }}
                value={user?.FirstName}
              />

              <p className="d-text-body-md mb-[16px]">
                What is your last name?
              </p>

              <TextField
                {...register('lastName', {
                  required: 'Last name is required',
                  maxLength: {
                    value: 25,
                    message: 'Maximum length is 10 characters'
                  },
                  minLength: {
                    value: 2,
                    message: 'Minimum length is 2 character'
                  },
                  pattern: {
                    value:
                      /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð,. '-]+$/u,
                    message: 'Invalid last name'
                  }
                })}
                className="w-full !mb-[24px]"
                placeholder="Last name"
                error={!!errors.lastName}
                helperText={errors.lastName?.message}
                label="Last name"
                InputLabelProps={{
                  shrink: true
                }}
                value={user?.LastName}
              />

              <p className="d-text-body-md mb-[16px]">When were you born?</p>
              <Controller
                name="dateOfBirth"
                control={control}
                rules={{
                  required: 'Provide your date of birth',
                  validate: {
                    isValid: (v) =>
                      dayjs(v).isValid() || 'Provide valid date of birth',
                    yearGreaterThan: (v) =>
                      dayjs(v).get('year') >= 1920 ||
                      'Provide higher year than 1919',
                    monthNotHigherThan: (v) =>
                      !!dayjs(v).isBefore(dayjs()) ||
                      `Provide date of birth before todays date ${dayjs().format(
                        'MM/DD/YYYY'
                      )}. `,
                    olderThan18: (v) => {
                      const today = dayjs();
                      const eighteenYearsAgo = today.subtract(18, 'years');
                      return (
                        dayjs(v).isBefore(eighteenYearsAgo) ||
                        'You must be 18 or older'
                      );
                    }
                  }
                }}
                render={({ field }) => (
                  <DateField
                    {...field}
                    sx={
                      errors.dateOfBirth?.message
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
                        helperText: errors.dateOfBirth?.message
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
                  Save
                </Button>
              </Box>
            </form>
          </div>
        </div>
      </div>
    </LocalizationProvider>
  );
}

export default CreateProfile;
