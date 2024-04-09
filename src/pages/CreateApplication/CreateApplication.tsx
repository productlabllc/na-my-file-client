import { useEffect, useState } from 'react';
import { useBoundStore } from '../../store/store';
import Header from '../../layouts/Header/Header';
import { Box, SelectChangeEvent } from '@mui/material';
import dayjs from 'dayjs';
import { v4 as uuidv4 } from 'uuid';
import StepOneApplication from '../../components/StepOneApplication/StepOneApplication';
import StepTwoPATHApplication from '../../components/StepTwoPATHApplication/StepTwoPATHApplication';
import StepTwoHPDApplication from '../../components/StepTwoHPDApplication/StepTwoHPDApplication';
import StepThreeApplication from '../../components/StepThreeApplication/StepThreeApplication';
import StepFourApplication from '../../components/StepFourApplication/StepFourApplication';
// import ConfirmDelete from '../../components/ConfirmDelete/ConfirmDelete';

import { useNavigate } from 'react-router-dom';
import { useForm, SubmitHandler, FormProvider } from 'react-hook-form';
import FamilyMember from '../../types/FamilyMember';
interface FormInput {
  organization: string;
  caseNumber: string | undefined;
  ssn: string | undefined;
  familyMembers: FamilyMember[];
  shelterName: string | undefined;
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

function CreateApplication() {
  const navigate = useNavigate();
  const { getFamilyMembers, addAppicationHPD, addAppicationPATH } =
    useBoundStore();
  const [step, setStep] = useState(0);
  const [organization, setOrganization] = useState('PATH');
  const [caseNumber, setCaseNumber] = useState<string>('');
  const [shelterData, setShelterData] = useState(shelters[0]);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [ssn, setSnn] = useState('');

  const methods = useForm<FormInput>({
    defaultValues: {
      organization: 'PATH'
    },
    mode: 'all',
    reValidateMode: 'onChange',
    shouldFocusError: true
  });

  useEffect(() => {
    setFamilyMembers([...getFamilyMembers()]);
  }, [getFamilyMembers()]);

  const onSubmitApplication: SubmitHandler<FormInput> = (data) => {
    if (data.organization === 'HPD') {
      const newData = {
        id: uuidv4(),
        organization: data.organization,
        createdAt: dayjs().format('MM/DD/YYYY'),
        status: 'Active',
        ssn: ssn,
        shelterName: shelterData,
        familyMembers: [...familyMembers]
      };
      addAppicationHPD(newData);
      navigate(`/application/${data.organization}/${newData.id}`);
    } else {
      const newData = {
        id: uuidv4(),
        createdAt: dayjs().format('MM/DD/YYYY'),
        status: 'Active',
        organization: data.organization,
        caseNumber: data.caseNumber,
        familyMembers: [...familyMembers]
      };
      addAppicationPATH(newData);
      navigate(`/application/${data.organization}/${newData.id}`);
    }
  };

  const nextStep = () => {
    setStep((prevStep) => {
      if (prevStep < 4) {
        return prevStep + 1;
      } else {
        return prevStep;
      }
    });
  };

  const prevStep = () => {
    setStep((prevStep) => {
      if (prevStep > 0) {
        if (prevStep === 1) {
          setCaseNumber('');
          methods.setValue('caseNumber', '');
          setSnn('');
          methods.setValue('ssn', '');
          methods.reset();
        }
        return prevStep - 1;
      } else {
        return prevStep;
      }
    });
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
    methods.setValue('ssn', formattedSSN);
    setSnn(formattedSSN);
  };

  const handleChangeOrganization = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
    setOrganization(e.target.value);
    methods.setValue('organization', e.target.value);
  };

  const handleChangeCasenumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
    // if (e.target.value.length === 0) {
    //   // methods.trigger('caseNumber');
    // }
    if (e.target.value.length < 10) {
      setCaseNumber(e.target.value);

      methods.setValue('caseNumber', e.target.value);
    }
  };

  const handleChangeShelter = (e: SelectChangeEvent) => {
    console.log(e.target.value);
    setShelterData(e.target.value);
    methods.setValue('shelterName', e.target.value);
  };

  return (
    <>
      <Header />
      <Box className="!w-full !flex !justify-center">
        <Box className="!w-full sm:!w-[546px] lg:!w-[570px] mt-[70px] px-[16px] md:px-0 pb-[52px]">
          <FormProvider {...methods}>
            <form
              onSubmit={(e) => {
                e.stopPropagation();
                return methods.handleSubmit(onSubmitApplication)(e);
              }}
            >
              {step === 0 && (
                <StepOneApplication
                  nextStep={nextStep}
                  handleChangeOrganization={handleChangeOrganization}
                  organization={organization}
                />
              )}
              {(step === 1 && organization === 'PATH' && (
                <StepTwoPATHApplication
                  organization={organization}
                  handleChangeCasenumber={handleChangeCasenumber}
                  nextStep={nextStep}
                  prevStep={prevStep}
                  caseNumber={caseNumber}
                />
              )) ||
                (step === 1 && organization === 'HPD' && (
                  <StepTwoHPDApplication
                    shelterData={shelterData}
                    handleChangeShelter={handleChangeShelter}
                    shelters={shelters}
                    handleSSN={handleSSN}
                    organization={organization}
                    ssn={ssn}
                    prevStep={prevStep}
                    nextStep={nextStep}
                  />
                ))}
              {step === 2 && (
                <StepThreeApplication prevStep={prevStep} nextStep={nextStep} />
              )}
              {step === 3 && (
                <StepFourApplication
                  organization={organization}
                  shelterData={shelterData}
                  caseNumber={caseNumber}
                  ssn={ssn}
                  familyMembers={familyMembers}
                  prevStep={prevStep}
                />
              )}
            </form>
          </FormProvider>
        </Box>
      </Box>
    </>
  );
}

export default CreateApplication;
