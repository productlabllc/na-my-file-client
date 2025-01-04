import { useState, useEffect } from 'react';
import { Box, Button, Typography } from '@mui/material';
import FamilyMembersBlock from '../FamilyMembersBlock/FamilyMembersBlock';
import { useBoundStore } from '../../store/store';
import { useTranslation } from 'react-i18next';
import { FamilyMember } from '@myfile/api-client';
import BackButton from '../BackButton/BackButton';

interface StepThreeApplicationProps {
  prevStep: () => void;
  nextStep: () => void;
}

function StepThreeApplication({ prevStep, nextStep }: StepThreeApplicationProps) {
  // const { setIsAddFamilyFormOpened } = useBoundStore();

  const {
    fetchFamilyMembers,
    isUpdateFamilyFormOpened,
    setIsAddFamilyFormOpened,
    isAddFamilyFormOpened,
    isDeleteDialogOpen
  } = useBoundStore();

  const [familyData, setFamilyData] = useState<FamilyMember[]>([]);

  useEffect(() => {
    if (!isAddFamilyFormOpened) {
      setTimeout(() => {
        fetchFamilyMembers().then((members) => {
          setFamilyData([...members]);
        });
      }, 300);
    }
  }, [isAddFamilyFormOpened, fetchFamilyMembers, isUpdateFamilyFormOpened, isDeleteDialogOpen]);

  const { t } = useTranslation('applications');

  return (
    <>
      <Box className="mb-[24px]">
        <BackButton text={t('return')} step={prevStep} />
      </Box>
      <Typography className="!mb-[8px] !m-text-italic md:!d-text-italic">{t('stepThree')}</Typography>
      <FamilyMembersBlock skipNavigation={nextStep} />
      <Box
        sx={{ boxShadow: '0px -4px 4px -4px black' }}
        className="!fixed !py-[16px] !h-min-[70px] !z-20 bottom-0 w-full inset-x-0 !flex !flex-col !justify-center !bg-white !items-center"
      >
        <Button
          className="!mb-[16px] !w-[94%] md:!w-[660px] !h-[48px] !m-text-btn-md md:!d-text-btn-md  !normal-case !text-secondary !border-secondary"
          variant="outlined"
          onClick={() => setIsAddFamilyFormOpened(true)}
        >
          {t('addFamilyMember')}
        </Button>

        {/* <Button
            variant="text"
            className="!m-text-btn-md !flex-1 !border-secondary !mr-2 !text-secondary !min-w-[170px] !h-[48px] !normal-case"
            onClick={prevStep}
          >
            {t('back')}
          </Button> */}
        <Button
          variant="contained"
          className={
            familyData && familyData.length < 1
              ? '!py-[16px] !w-[94%] md:!w-[660px] !h-[48px] !m-text-btn-md md:!d-text-btn-md !normal-case'
              : `!py-[16px] !w-[94%] md:!w-[660px] !h-[48px] !bg-secondary
             !m-text-btn-md  md:!d-text-btn-md !normal-case`
          }
          onClick={nextStep}
          disabled={familyData && familyData.length < 1}
        >
          {t('continue')}
        </Button>
      </Box>
    </>
  );
}

export default StepThreeApplication;
