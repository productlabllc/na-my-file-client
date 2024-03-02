import { useState, useEffect } from 'react';

import { Container } from '@mui/material';
import BackButton from '../../components/BackButton/BackButton';
import GlobalNavigation from '../../layouts/GlobalNavigation/GlobalNavigation';
// import Header from '../../layouts/Header/Header'
// import TopLinksContainer from '../../layouts/TopLinksContainer/TopLinksContainer';
import MyFileLogo from '../../components/MyFileLogo/MyFileLogo';
import Footer from '../../layouts/Footer/Footer';
import MDContent from '../../components/MDContent/MDContent';
//import AboutMD from '../../../src/assets/md-translations/about/en.md'
import { useTranslation } from 'react-i18next';
import { getMarkDownFile } from '../../utils/importMarkdownFile';

function NycAuth() {
  // TODO fetch from CMS based on locale
  // const content = `\nAn h1 header\n============\n\nParagraphs are separated by a blank line.\n\n2nd paragraph. *Italic*, **bold**, and \`monospace\`. Itemized lists\nlook like:\n\n  * this one\n  * that one\n  * the other one\n\nAn h2 header\n------------\n\nHere's a numbered list:\n\n 1. first item\n 2. second item\n 3. third item\n`
  const { i18n } = useTranslation();

  const [mdText, setMdText] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getMarkDownFile('nycid', i18n.language);
        setMdText(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-[100vh] relative">
      <GlobalNavigation />
      <div className="flex items-center flex-col !pt-[70px] !w-full px-[16px] sm:px-0 pb-[250px] !h-full">
        <div className="lg:w-[570px] sm:w-[546px]">
          <div className="mb-[24px]">
            <BackButton />
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

export default NycAuth;
