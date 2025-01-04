import React, { useState, memo, useRef } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { useAsyncRetry } from 'react-use';
import { useApi } from '../../utils/use-api';
import HideImageOutlinedIcon from '@mui/icons-material/HideImageOutlined';

interface AsyncProps {
  generatedFileId?: string;
}

const AsyncImage = memo(function AsyncImage({ generatedFileId }: AsyncProps) {
  //   const [loadedSrc, setLoadedSrc] = React.useState<string | null>(null);
  const api = useApi();
  const [onErrorImg, setOnErrorImg] = useState(true);
  const [errorImgApiRefetch, setErrorImgApiRefetch] = useState(false);
  const TIMES_TO_REFETCH_IMG = 7;

  const {
    value: thumbnail,
    retry,
    error
  } = useAsyncRetry(() =>
    api.getGeneratedTfileThumbnailDownloadUrl({ generatedFileId: generatedFileId ? generatedFileId : '' })
  );

  const timeRef = useRef(TIMES_TO_REFETCH_IMG);
  const checkIfImageLoad = (url: string | any) => {
    return new Promise((resolve, reject) => {
      const loadImage = (times: number) => {
        const img = new Image();
        img.src = url;
        img.onload = () => {
          resolve('fullfilled');
        };

        img.onerror = () => {
          if (times > 0) {
            setOnErrorImg(true);
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

  React.useEffect(() => {
    if (thumbnail && thumbnail.downloadUrl && thumbnail.downloadUrl?.length > 0) {
      checkIfImageLoad(thumbnail.downloadUrl)
        .then(() => {
          setOnErrorImg(false);
        })
        .catch((e) => {
          setOnErrorImg(false);
          setErrorImgApiRefetch(true);
          console.log(e);
        });
    }
  }, [thumbnail]);

  //   if (error?.message) {
  //     return (
  //       <Box className="!h-[56px] !w-[56px] mr-4 flex justify-center items-center !bg-darkGreyBorder">
  //         <WarningAmberIcon className="!h-[30px] !w-[30px]" />
  //       </Box>
  //     );
  //   }

  if (error?.name) {
    return (
      <Box className="!h-[56px] !w-[56px] mr-4 flex justify-center items-center border-lightGreyBorder !bg-greyBox">
        <HideImageOutlinedIcon className="!h-[25px] !w-[25px] !text-darkGreyBorder" />
      </Box>
    );
  } else {
    if (!onErrorImg && !errorImgApiRefetch) {
      if (thumbnail?.downloadUrl) {
        return <img className="mr-4 !w-[56px] !h-[56px] rounded inline" src={thumbnail.downloadUrl} />;
      }
    } else if (onErrorImg && !errorImgApiRefetch) {
      return (
        <Box className="!h-[60px] !w-[60px] mr-4 flex justify-center items-center ">
          <CircularProgress className="!text-secondary !h-[30px] !w-[30px]"></CircularProgress>
        </Box>
      );
    } else {
      return (
        <Box className="!h-[56px] !w-[56px] mr-4 flex justify-center items-center border-[1px] border-lightGreyBorder !bg-greyBox">
          <HideImageOutlinedIcon className="!h-[25px] !w-[25px] !text-darkqqGreyBorder !text-darkGreyBorder" />
        </Box>
      );
    }
  }
});

export default AsyncImage;
