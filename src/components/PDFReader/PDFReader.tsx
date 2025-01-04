import { useCallback, useEffect, useMemo, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Box, Button, CircularProgress, Icon, Typography } from '@mui/material';
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import * as pdfjsLib from 'pdfjs-dist';
import HideImageOutlinedIcon from '@mui/icons-material/HideImageOutlined';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAsyncRetry } from 'react-use';
import { useApi } from '../../utils/use-api';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

function PDFReader({
  id,
  userId
}: {
  file?: string | undefined;
  id?: string | undefined;
  userId?: string | undefined;
}) {
  const [scale, setScale] = useState(1);
  const [numPages, setNumPages] = useState<number>(1);
  const [queryWidth, setQueryWidth] = useState(window.innerWidth / 2);
  const [isPDFDocumentIsReady, setPDFDocumentIsReady] = useState(false);
  const [errorImgApiRefetch, setErrorImgApiRefetch] = useState(false);
  const api = useApi();
  const TIMES_TO_REFETCH_IMG = 7;

  const { t } = useTranslation('docs');

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const { value, retry, error } = useAsyncRetry(async () => {
    if (userId) {
      return await api.getGeneratedFileDownloadUrl({
        generatedFileId: id!,
        userId: userId,
        caseFileId: id
      });
    } else {
      return await api.getGeneratedFileDownloadUrl({
        generatedFileId: id!
      });
    }
  }, [id, userId]);

  useEffect(() => {
    checkIfPdfWasLoaded()
      .then((res) => {
        setPDFDocumentIsReady(true);
        console.log(res);
      })
      .catch((e) => {
        setPDFDocumentIsReady(true);
        setErrorImgApiRefetch(true);
        console.log(e);
      });
  }, [value?.downloadUrl]);

  const timeRef = useRef(TIMES_TO_REFETCH_IMG);
  const checkIfPdfWasLoaded = () => {
    return new Promise((res) => {
      const check = async (times: number) => {
        const pdf = await pdfjsLib.getDocument(value?.downloadUrl).promise;
        console.log(pdf);
        if (pdf && pdf.numPages) {
          setNumPages(pdf.numPages);
          res('Resolved document');
        } else {
          // rej('Rejected');
          if (times > 0) setPDFDocumentIsReady(false);
          setTimeout(() => {
            retry();
            timeRef.current = timeRef.current - 1;
          }, 1000);
        }
      };
      check(timeRef.current);
    });
  };

  useEffect(() => {
    const windowSizeHandler = () => {
      setQueryWidth(window.innerWidth / 2);
    };
    window.addEventListener('resize', windowSizeHandler);
    return () => {
      window.removeEventListener('resize', windowSizeHandler);
    };
  }, []);

  const pdfRender = useMemo(() => {
    if (isPDFDocumentIsReady) {
      return value?.downloadUrl;
    }
  }, [isPDFDocumentIsReady]);

  const pdfFile = useMemo(() => {
    return { url: pdfRender ? pdfRender : '' };
  }, [pdfRender]);

  // useEffect(() => {
  //   return setNumPages(0);
  // }, [file]);

  const increaseScale = () => {
    setScale((prev) => prev + 0.2);
  };

  const decreaseScale = () => {
    if (scale > 0.4) {
      setScale((prev) => prev - 0.2);
    }
  };

  const renderDocumentSkeleton = () => {
    return <Box></Box>;
  };

  const PdfDocument = useCallback(
    () => (
      <Document
        file={pdfFile}
        onLoadSuccess={() => onDocumentLoadSuccess({ numPages })}
        // onError={() => console.log('EEEERRRORRRR')}
        loading={renderDocumentSkeleton}
        className="!bg-[#EEEEEE] !m-0 !p-0"
        renderMode="canvas"
        onError={() => (
          <Box className="!h-[70dvh] !w-full flex flex-col justify-center items-center border-lightGreyBorder !bg-greyBox">
            <HideImageOutlinedIcon className="!h-[40px] !w-[40px] !text-darkqqGreyBorder !text-darkGreyBorder mb-[24px]" />
            <Typography className="!text-darkGreyBorder">PDF file was failed to load</Typography>
          </Box>
        )}
      >
        {Array.from(Array(numPages).keys()).map((pageNumber) => (
          <Box key={pageNumber + 1}>
            <Box className="flex justify-center py-[24px]">
              <Box className="px-[24px] py-[4px] rounded !bg-white text-secondary m-text-body-md sm:!d-text-body-md !w-fit flex justify-center items-center">{`Page ${
                pageNumber + 1
              } of ${numPages}`}</Box>
            </Box>
            <Page
              key={pageNumber}
              className="!p-0 !m-0  !bg-[#EEEEEE]"
              pageNumber={pageNumber + 1}
              loading={renderDocumentSkeleton}
              scale={scale}
              width={queryWidth}
            ></Page>
          </Box>
        ))}
      </Document>
    ),
    [numPages, scale, pdfFile, renderDocumentSkeleton, queryWidth]
  );

  return (
    <>
      {/* {pdfRender} */}
      <Box className="!sticky !top-[48px] !h-[54px] !z-20 !w-full bg-white flex justify-between !items-center px-[8px] sm:px-[24px]">
        <Box>
          <Typography className="!text-body-md !ml-[8px]">{Math.round(scale * 100)}%</Typography>
        </Box>
        <Box>
          <Button onClick={decreaseScale} className="!text-secondary !normal-case !mr-1">
            <Icon className="mr-2">zoom_out</Icon>
            <Typography className="!underline underline-offset-4 !text-body-md">{t('zoomOut')}</Typography>
          </Button>
          <Button onClick={increaseScale} className="!text-secondary !normal-case ">
            <Icon className="mr-2">zoom_in</Icon>
            <Typography className="!underline underline-offset-4 !text-body-md">{t('zoonIn')}</Typography>
          </Button>
        </Box>
      </Box>
      <div className="!overflow-y-auto ">
        {error?.name ? (
          <Box className="!h-[70dvh] !w-full flex flex-col justify-center items-center border-lightGreyBorder !bg-greyBox">
            <HideImageOutlinedIcon className="!h-[40px] !w-[40px] !text-darkqqGreyBorder !text-darkGreyBorder mb-[24px]" />
            <Typography className="!text-darkGreyBorder">PDF file was failed to load</Typography>
          </Box>
        ) : (
          <Box>
            {isPDFDocumentIsReady && numPages ? (
              PdfDocument()
            ) : (
              <Box>
                {errorImgApiRefetch ? (
                  <Box className="!h-[70dvh] !w-full flex flex-col justify-center items-center border-lightGreyBorder !bg-greyBox">
                    <HideImageOutlinedIcon className="!h-[40px] !w-[40px] !text-darkqqGreyBorder !text-darkGreyBorder mb-[24px]" />
                    <Typography className="!text-darkGreyBorder">PDF file was failed to load</Typography>
                  </Box>
                ) : (
                  <Box className="flex !h-[600px] flex-col !justify-center !items-center">
                    <CircularProgress className="!text-secondary mb-[16px]"></CircularProgress>
                    <Typography className="!m-text-body-md md:!d-text-body-md !text-secondary">
                      Loading PDF document
                    </Typography>
                  </Box>
                )}
              </Box>
            )}
          </Box>
        )}
      </div>
    </>
  );
}

export default PDFReader;
