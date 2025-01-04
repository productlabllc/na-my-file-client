import { useState, useEffect } from 'react';

import { Container, Box } from '@mui/material';

import BackButton from '../../components/BackButton/BackButton';
import MyFileLogo from '../../components/MyFileLogo/MyFileLogo';
import Footer from '../../layouts/Footer/Footer';
import MDContent from '../../components/MDContent/MDContent';
import GlobalNavigation from '../../layouts/GlobalNavigation/GlobalNavigation';
// import { useTranslation } from 'react-i18next';
import { getMarkDownFile } from '../../utils/importMarkdownFile';
import { useBoundStore } from '../../store/store';

function About() {
  // const { i18n } = useTranslation();
  const [mdText, setMdText] = useState('');
  const { getUserLang } = useBoundStore();
  const lang = getUserLang();

  useEffect(() => {
    if (lang) {
      const fetchData = async () => {
        try {
          const data = await getMarkDownFile('about', lang);

          setMdText(data);
        } catch (error) {
          // console.log(lang)
          console.error('Error fetching data:', error);
        }
      };

      fetchData();
    }
  }, [lang]);

  return (
    <div className="min-h-[100vh] relative">
      <Box className="fixed top-0 w-full !z-20">
        <GlobalNavigation />
      </Box>
      <div className="flex items-center flex-col !pt-[70px] !w-full px-[16px] sm:px-0 pb-[250px] !h-full">
        <div className="lg:w-[570px] sm:w-[546px]">
          <div className="mb-[24px]">
            <BackButton navigatePath="/" />
          </div>
          <Container className="!p-0">
            <div>
              <MyFileLogo variant="full" notClickable={true} />
            </div>
            <MDContent content={mdText} />
          </Container>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default About;
