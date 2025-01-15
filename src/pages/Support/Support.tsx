import { useRef, useEffect } from 'react';
import { Box, Typography, Divider } from '@mui/material';
import { useTranslation, Trans } from 'react-i18next';
import BackButton from '../../components/BackButton/BackButton';
import FAQAccordion from '../../components/FAQAccordion/FAQAccordion';

function Support() {
  const { t } = useTranslation('support');

  const topRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (topRef.current) {
      topRef.current.focus();
      window.scrollTo(0, 0);
    }
  }, []);

  return (
    <Box className="min-h-[100vh] relative block lg:flex lg:justify-center">
      <Box
        ref={topRef}
        tabIndex={0}
        className="w-full mt-[48px] lg:w-[805px] lg:mt-[116px] px-[16px] focus:outline-none"
      >
        <Box className="mb-[46px] lg:mb-[56px]">
          <BackButton navigatePath="/" text="Back" />
        </Box>

        <Box className="mb-[40px] lg:!mb-[56px] ">
          <Typography className="!m-text-h1 lg:!d-text-h1 !text-secondary !mb-[24px] lg:!mb-[32px]">
            {t('supportPageTitle')}
          </Typography>
          <Divider className="!border-[1px] !border-[#999CA4] !border-opacity-30"></Divider>
        </Box>

        <Box className="mb-[40px] lg:mb-[56px]">
          <Box className="!mb-[24px]">
            <Typography className="!text-secondary !m-text-h3 lg:!d-text-h3">{t('aboutMyFileTitle')}</Typography>
          </Box>

          <Box className="!mb-[24px]">
            <Typography className="!m-text-body-lg lg:!d-text-body-lg">{t('aboutMyFileParagraphOne')}</Typography>
          </Box>

          <Box className="!mb-[24px]">
            <Typography className="!m-text-body-lg lg:!d-text-body-lg">
              {
                <Trans
                  ns="support"
                  i18nKey={'aboutMyFileParagraphTwo'}
                  components={{
                    hrefMayorOffice: (
                      <a
                        className="text-primary !underline !underline-offset-4"
                        href="https://www1.nyc.gov/site/opportunity/index.page"
                        target="_blank"
                        rel="noreferrer"
                      ></a>
                    ),
                    hrefDepartmentHomeless: (
                      <a
                        className="text-primary !underline !underline-offset-4"
                        href="https://www1.nyc.gov/site/dhs/index.page"
                        target="_blank"
                        rel="noreferrer"
                      ></a>
                    ),
                    hrefNewAmerica: (
                      <a
                        className="text-primary !underline !underline-offset-4"
                        href="https://www.newamerica.org/"
                        target="_blank"
                        rel="noreferrer"
                      ></a>
                    ),
                    hrefTwoBulls: (
                      <a
                        className="text-primary !underline !underline-offset-4"
                        href="https://www.twobulls.com/"
                        target="_blank"
                        rel="noreferrer"
                      ></a>
                    ),
                    hrefRockfeller: (
                      <a
                        className="text-primary !underline !underline-offset-4"
                        href="https://www.rockefellerfoundation.org/"
                        target="_blank"
                        rel="noreferrer"
                      ></a>
                    )
                  }}
                />
              }
            </Typography>
          </Box>

          <Box className="!mb-[24px]">
            <Typography className="!m-text-body-lg lg:!d-text-body-lg">{t('aboutMyFileParagraphThree')}</Typography>
          </Box>

          <Box className="!mb-[24px]">
            <Typography className="!m-text-body-lg lg:!d-text-body-lg">{t('aboutMyFileParagraphFour')}</Typography>
          </Box>
        </Box>

        <Box className="mb-[56px]">
          <Box className="!mb-[36px]">
            <Typography className="!text-secondary !m-text-h3 lg:!d-text-h3">
              {t('frequentlyAskedQuestions')}
            </Typography>
          </Box>

          <Box>
            <Box className="mb-[24px]">
              <FAQAccordion title={t('FAQQuestionOne')} details={t('FAQAnswerOne')} />
            </Box>
            <Box className="mb-[24px]">
              <FAQAccordion title={t('FAQQuestionTwo')} details={t('FAQAnswerTwo')} />
            </Box>
            <Box className="mb-[24px]">
              <FAQAccordion title={t('FAQQuestionThree')} details={t('FAQAnswerThree')} />
            </Box>
            <Box className="mb-[24px]">
              <FAQAccordion title={t('FAQQuestionFour')} details={t('FAQAnswerFour')} />
            </Box>
            <Box className="mb-[24px]">
              <FAQAccordion title={t('FAQQuestionFive')} details={t('FAQAnswerFive')} />
            </Box>
            <Box className="mb-[24px]">
              <FAQAccordion title={t('FAQQuestionSix')} details={t('FAQAnswerSix')} />
            </Box>
            <Box className="mb-[24px]">
              <FAQAccordion title={t('FAQQuestionSeven')} details={t('FAQAnswerSeven')} />
            </Box>
            <Box className="mb-[24px]">
              <FAQAccordion title={t('FAQQuestionEight')} details={t('FAQAnswerEight')} />
            </Box>
            <Box className="mb-[24px]">
              <FAQAccordion title={t('FAQQuestionNine')} details={t('FAQAnswerNine')} />
            </Box>
            <Box className="mb-[24px]">
              <FAQAccordion title={t('FAQQuestionTen')} details={t('FAQAnswerTen')} />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default Support;
