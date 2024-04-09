import { Box, Button, Icon, Select, MenuItem, TextField } from '@mui/material';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { v4 as uuidv4 } from 'uuid';
import { DateField } from '@mui/x-date-pickers/DateField';
import FamilyMember from '../../types/FamilyMember';
interface IFormFamilyMember {
  firstName: string;
  lastName: string;
  dateOfBirth: string | dayjs.Dayjs | null;
  relationship: string;
}

interface FamilyMemberFormProps {
  member?: FamilyMember | undefined | null;
  familyData?: FamilyMember[];
  updateFamilyMemberList: (newFamilyMember: FamilyMember) => void;
  closeFormFamilyWindow: () => void;
  submitButtonContent?: string;
}

const relationshipData = ['Parent', 'Child', 'Adult', 'Legal guardian'];

function FamilyMemberForm({
  updateFamilyMemberList,
  closeFormFamilyWindow,
  member,
  submitButtonContent
}: FamilyMemberFormProps) {
  const { register, control, handleSubmit, formState, reset } =
    useForm<IFormFamilyMember>({
      mode: 'all',
      reValidateMode: 'onChange',
      defaultValues: {
        firstName: member?.firstName ? member.firstName : '',
        lastName: member?.lastName ? member.lastName : '',
        dateOfBirth: member?.dateOfBirth ? dayjs(member.dateOfBirth) : null,
        relationship: member?.relationship
          ? member.relationship
          : relationshipData[0]
      }
    });
  const { errors } = formState;

  const onSubmit: SubmitHandler<IFormFamilyMember> = (data, e) => {
    // your code
    e?.preventDefault();
    const newData = {
      id: member?.id ? member.id : uuidv4(),
      ...data,
      dateOfBirth: dayjs(data.dateOfBirth).format('MM/DD/YYYY')
    };

    updateFamilyMemberList(newData);
    closeFormFamilyWindow();
    reset();
  };
  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box className="sm:flex sm:justify-center w-[100%] !pt-[24px]">
          <Box className="!px-[16px] w-full sm:w-[600px]">
            <Box className="!w-full flex justify-end mb-[24px]">
              <Button
                className="!normal-case !text-secondary !d-text-btn-md"
                onClick={() => closeFormFamilyWindow()}
              >
                <Icon fontSize="medium" className="mr-2">
                  close_icon
                </Icon>{' '}
                Close
              </Button>
            </Box>
            <form
              onSubmit={(e) => {
                e.stopPropagation();
                return handleSubmit(onSubmit)(e);
              }}
            >
              <p className="d-text-body-md mb-[16px]">
                What is their first name ?
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
              />

              <p className="d-text-body-md mb-[16px]">
                What is their last name ?
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
              />

              <p className="d-text-body-md mb-[16px]">
                What is their date of birth ?
              </p>
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
                      )}. `
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
                    className="w-full !mb-[16px]"
                    label="MM/DD/YYYY"
                    disableFuture
                    InputLabelProps={{
                      shrink: true
                    }}
                  />
                )}
              />
              <p className="d-text-body-md mb-[16px]">
                When is their relationship?
              </p>
              <Controller
                name="relationship"
                defaultValue={relationshipData[0]}
                control={control}
                render={({ field }) => (
                  <Select {...field} className="!w-full">
                    {relationshipData.map((status) => (
                      <MenuItem key={status} value={status}>
                        {status}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              <Box
                // sx={{ boxShadow: '0px -4px 4px -4px black' }}
                className="!py-[36px] !h-min-[70px] !w-full !flex !flex-col !justify-center !bg-transparent !items-center"
              >
                <Button
                  className={`!w-full !h-12 !m-text-btn-md !normal-case ${
                    !formState.isValid
                      ? ''
                      : '!text-secondary !border-secondary'
                  }`}
                  variant="outlined"
                  type="submit"
                  disabled={!formState.isValid}
                >
                  {submitButtonContent ? submitButtonContent : 'Submit member'}
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
