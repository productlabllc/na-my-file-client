import { useMemo, useState, useCallback } from 'react';
// import { useBoundStore } from '../../store/store';
import Header from '../../layouts/Header/Header';
import { Box, SelectChangeEvent } from '@mui/material';
import dayjs from 'dayjs';
// import { v4 as uuidv4 } from 'uuid';
import StepOneApplication from '../../components/StepOneApplication/StepOneApplication';
import StepTwoPATHApplication from '../../components/StepTwoPATHApplication/StepTwoPATHApplication';
import StepTwoHPDApplication from '../../components/StepTwoHPDApplication/StepTwoHPDApplication';
import StepThreeApplication from '../../components/StepThreeApplication/StepThreeApplication';
import StepFourApplication from '../../components/StepFourApplication/StepFourApplication';
// import ConfirmDelete from '../../components/ConfirmDelete/ConfirmDelete';

import { useNavigate } from 'react-router-dom';
import { useForm, SubmitHandler, FormProvider } from 'react-hook-form';
import { useApi } from '../../utils/use-api';
import { useAsync } from 'react-use';
import { FamilyMember } from '@namyfile/api-client';

interface FormInput {
  organization: string;
  caseNumber: string;
  ssn: string;
  familyMembers: FamilyMember[];
  shelterName: string;
  buildingUnit: string;
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

function CreateApplication() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [organization, setOrganization] = useState('');
  const [caseNumber, setCaseNumber] = useState<string>('');
  const [shelterData, setShelterData] = useState(shelters[0]);
  const [buildingUnitData, setBuildingUnitData] = useState(buildingUnits[0]);
  const [ssn, setSnn] = useState('');
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);

  const methods = useForm<FormInput>({
    defaultValues: {
      organization: 'PATH'
    },
    mode: 'all',
    reValidateMode: 'onChange',
    shouldFocusError: true
  });

  const api = useApi();
  const { value: workflows } = useAsync(() => api.getWorkflows());

  const workflowTypeToId = useMemo(
    () =>
      workflows?.reduce(
        (acc, workflow) => {
          acc[workflow?.id] = workflow.Type ?? '';
          return acc;
        },
        {} as Record<string, string>
      ) ?? {},
    [workflows]
  );

  const getFamilyMembersData = useCallback(async () => {
    try {
      const value: FamilyMember[] = await api.getFamilyMembers();
      setFamilyMembers(value);
    } catch (error) {
      console.error('Failed to fetch family members:', error);
    }
  }, [api]);

  const onSubmitApplication: SubmitHandler<FormInput> = async (data) => {
    const workflow = workflows!.find((ele) => ele.id === data.organization);
    try {
      const caseData = await api.createCase({
        requestBody: {
          WorkflowId: workflow!.id,
          FamilyMemberIds: familyMembers.map((ele) => ele.id),
          /**
           * After some debug data.family member is always empty
           * and the Logic in FamilyMemberBlock is localize only to that component
           * Feel free to undo this any time.
           */
          // data.familyMembers?.map((ele) => ele.id),
          CaseIdentifier: data.caseNumber,
          CaseTitle: `${workflow!.Type}-${dayjs().format('MM/DD/YYYY')}`,
          CaseType: workflow!.Type!,
          SSN: ssn,
          CaseAttributes: [
            { name: 'ssn', value: ssn },
            { name: 'shelterName', value: shelterData },
            { name: 'buildingUnit', value: buildingUnitData },
            { name: 'status', value: 'Active' }
          ].filter((ele) => ele.value)
        }
      });
      navigate(`/application/${caseData.CaseType}/${caseData.id}`);
    } catch (error) {
      console.warn('error while creating case: ', error);
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

    if (step == 2) {
      getFamilyMembersData();
    }
  };

  const prevStep = () => {
    setStep((prevStep) => {
      if (prevStep > 0) {
        if (prevStep === 1) {
          setCaseNumber('');
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
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

  // function formatSSN(value: string) {
  //   if (!value) return value;
  //   const ssn = value.replace(/[^\d]/g, '');
  //   const ssnLength = ssn.length;

  //   if (ssnLength < 4) return ssn;

  //   if (ssnLength < 6) {
  //     return `${ssn.slice(0, 3)}-${ssn.slice(3)}`;
  //   }

  //   // finally, if the ssnLength is greater then 6, we add the last
  //   // bit of formatting and return it.
  //   return `${ssn.slice(0, 3)}-${ssn.slice(3, 5)}-${ssn.slice(5, 9)}`;
  // }

  const handleSSN = (e: React.ChangeEvent<HTMLInputElement>) => {
    // setSnn(e.target.value);
    // setValue('ssn', e.target.value);
    // const formattedSSN = formatSSN();
    if (e.target.value.length < 12) {
      methods.setValue('ssn', e.target.value.toString());
      setSnn(e.target.value.toString());
    }
  };

  const handleChangeOrganization = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOrganization(e.target.value);
    methods.setValue('organization', e.target.value);
  };

  const handleChangeCasenumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    // if (e.target.value.length === 0) {
    //   // methods.trigger('caseNumber');
    // }
    if (e.target.value.length < 10) {
      setCaseNumber(e.target.value);

      methods.setValue('caseNumber', e.target.value);
    }
  };

  const handleChangeShelter = (e: SelectChangeEvent) => {
    setShelterData(e.target.value);
    methods.setValue('shelterName', e.target.value);
  };

  const handleChangeBuildingUnit = (e: SelectChangeEvent) => {
    setBuildingUnitData(e.target.value);
    methods.setValue('buildingUnit', e.target.value);
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
                  workflows={workflows}
                />
              )}
              {(step === 1 && workflowTypeToId[organization] === 'PATH' && (
                <StepTwoPATHApplication
                  organization={organization}
                  handleChangeCasenumber={handleChangeCasenumber}
                  nextStep={nextStep}
                  prevStep={prevStep}
                  caseNumber={caseNumber}
                />
              )) ||
                (step === 1 && workflowTypeToId[organization] === 'HPD' && (
                  <StepTwoHPDApplication
                    shelterData={shelterData}
                    handleChangeShelter={handleChangeShelter}
                    handleChangeBuildingUnit={handleChangeBuildingUnit}
                    buildingUnits={buildingUnits}
                    buildingUnitData={buildingUnitData}
                    shelters={shelters}
                    handleSSN={handleSSN}
                    organization={organization}
                    ssn={ssn}
                    prevStep={prevStep}
                    nextStep={nextStep}
                  />
                ))}
              {step === 2 && <StepThreeApplication prevStep={prevStep} nextStep={nextStep} />}
              {step === 3 && (
                <StepFourApplication
                  organization={organization}
                  shelterData={shelterData}
                  organizationType={workflowTypeToId[organization]!}
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
