import React, { memo, useRef, useEffect } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useAsyncRetry } from 'react-use';
import { useApi } from '../../utils/use-api';
import { useBoundStore } from '../../store/store';
import HideImageOutlinedIcon from '@mui/icons-material/HideImageOutlined';

interface AsyncProps {
  generatedFileId?: string;
}

const AsyncPreviewImage = memo(function AsyncPreviewImage({ generatedFileId }: AsyncProps) {
  const api = useApi();

  // Using isAsyncImageLoaded in DocumentId and ApplicationDocumentId components
  const {
    isAsyncImageLoaded,
    setIsAsyncImageLoaded,
    setisAsyncImageFinishedRefetching,
    isAsyncImageFinishedRefetching,
    setisAsyncImageApiCaughtError
  } = useBoundStore();
  const TIMES_TO_REFETCH_IMG = 7;

  const {
    value: thumbnail,
    retry,
    error
  } = useAsyncRetry(
    () =>
      api.getGeneratedTfileThumbnailDownloadUrl({
        generatedFileId: generatedFileId ? generatedFileId : '',
        isPreview: true
      }),
    [generatedFileId]
  );

  const timeRef = useRef(TIMES_TO_REFETCH_IMG);
  const checkIfImageLoad = (url: string | any) => {
    return new Promise((resolve, reject) => {
      const loadImage = (times: number) => {
        setisAsyncImageFinishedRefetching(false);
        const img = new Image();
        img.src = url;
        img.onload = () => {
          resolve('fullfilled');
        };

        img.onerror = () => {
          if (times > 0) {
            setIsAsyncImageLoaded(true);
            setTimeout(() => {
              retry();
              timeRef.current = timeRef.current - 1;
            }, 1000);
          } else {
            reject();
          }
        };
      };
      loadImage(timeRef.current);
    });
  };

  useEffect(() => {
    setisAsyncImageFinishedRefetching(false);
  }, []);

  useEffect(() => {
    if (error) {
      setisAsyncImageApiCaughtError(true);
    } else {
      setisAsyncImageApiCaughtError(false);
    }
  }, [error]);

  React.useEffect(() => {
    if (thumbnail && thumbnail.downloadUrl && thumbnail.downloadUrl?.length > 0) {
      checkIfImageLoad(thumbnail.downloadUrl)
        .then(() => {
          // setTimeout(() => {
          setIsAsyncImageLoaded(false);
          // }, 2000);
        })
        .catch((e) => {
          setIsAsyncImageLoaded(false);
          setisAsyncImageFinishedRefetching(true);
          console.log(e);
        });
    }
  }, [thumbnail]);

  if (error?.name) {
    return (
      <Box className="!h-full !w-full mr-4 flex flex-col justify-center items-center border-lightGreyBorder !bg-greyBox">
        <HideImageOutlinedIcon className="!h-[30px] !w-[30px] !text-darkGreyBorder mb-[24px] " />
        <Typography className="!text-darkGreyBorder !d-text-body-sm">Image failed to load</Typography>
      </Box>
    );
  } else {
    if (!isAsyncImageLoaded && !isAsyncImageFinishedRefetching) {
      if (thumbnail?.downloadUrl) {
        return (
          <img
            loading="lazy"
            className="!h-[280px] md:!h-[350px] !w-full !object-cover !object-top opacity-0 transition-opacity duration-100 ease-out"
            src={thumbnail.downloadUrl}
            onLoad={(e) => {
              e.currentTarget.style.opacity = '1';
            }}
          />
        );
      }
    } else if (isAsyncImageLoaded && !isAsyncImageFinishedRefetching) {
      return (
        <Box className="!h-full !w-full mr-4 flex flex-col justify-center items-center ">
          <CircularProgress className="!text-secondary !h-[30px] !w-[30px] md:!h-[40px] md:!w-[40px]"></CircularProgress>
          <Typography className="!m-text-body-sm md:!d-text-body-sm !text-secondary">Loading Image</Typography>
        </Box>
      );
    } else {
      return (
        <Box className="!h-full !w-full mr-4 flex justify-center flex-col items-center border-lightGreyBorder !bg-greyBox">
          <HideImageOutlinedIcon className="!h-[30px] !w-[30px] !text-darkGreyBorder mb-[24px]" />
          <Typography className="!text-darkGreyBorder !d-text-body-sm">Image failed to load</Typography>
        </Box>
      );
    }
  }
});

export default AsyncPreviewImage;
