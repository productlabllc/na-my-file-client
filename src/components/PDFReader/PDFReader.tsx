import { useEffect, useMemo } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Box, Button, Icon, Typography } from '@mui/material';
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';

import { useState } from 'react';
import { Skeleton } from '@mui/material';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url
).toString();

function PDFReader({ file }: { file: string | undefined }) {
  const [scale, setScale] = useState(1);
  const [numPages, setNumPages] = useState<number>(1);
  const [queryWidth, setQueryWidth] = useState(window.innerWidth / 2);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  // const screnWitdh = useMemo(() => {
  //   return window.innerWidth / 2;
  // }, [window.innerWidth]);

  useEffect(() => {
    const windowSizeHandler = () => {
      setQueryWidth(window.innerWidth / 2);
    };
    window.addEventListener('resize', windowSizeHandler);
    console.log(window.innerWidth);
    return () => {
      window.removeEventListener('resize', windowSizeHandler);
    };
  }, []);

  const pdfRender = useMemo(() => file, [file]);
  console.log(window.innerWidth);
  const renderDocumentSkeleton = () => {
    return (
      <Skeleton
        variant="rectangular"
        height="400px"
        width="400px"
        className="mx-auto"
      />
    );
  };

  useEffect(() => {
    return setNumPages(0);
  }, [file]);

  const increaseScale = () => {
    setScale((prev) => prev + 0.2);
  };

  const decreaseScale = () => {
    if (scale > 0.4) {
      setScale((prev) => prev - 0.2);
    }
  };

  return (
    <>
      {/* {pdfRender} */}
      <Box className="!sticky !top-[48px] !h-[54px] !z-20 !w-full bg-white flex justify-between !items-center px-[8px]">
        <Box>
          <Typography className="!text-body-md !ml-[8px]">
            {Math.round(scale * 100)}%
          </Typography>
        </Box>
        <Box>
          <Button
            onClick={decreaseScale}
            className="!text-secondary !normal-case !mr-1"
          >
            <Icon className="mr-2">zoom_out</Icon>
            <Typography className="!underline underline-offset-4 !text-body-md">
              Zoom out
            </Typography>
          </Button>
          <Button
            onClick={increaseScale}
            className="!text-secondary !normal-case "
          >
            <Icon className="mr-2">zoom_in</Icon>
            <Typography className="!underline underline-offset-4 !text-body-md">
              Zoom in
            </Typography>
          </Button>
        </Box>
      </Box>
      <div className="!overflow-y-auto">
        <Document
          file={{
            url: pdfRender ? pdfRender : ''
          }}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={renderDocumentSkeleton()}
          className=" bg-white "
          renderMode="canvas"
        >
          {Array.from(Array(numPages).keys()).map((pageNumber) => (
            <Page
              key={pageNumber}
              className="!p-0 !m-0"
              pageNumber={pageNumber + 1}
              loading={renderDocumentSkeleton()}
              scale={scale}
              width={queryWidth}
            ></Page>
          ))}
        </Document>
        {/* <iframe src={file} className="min-h-[80vh] w-full"></iframe> */}
      </div>
    </>
  );
}

export default PDFReader;
