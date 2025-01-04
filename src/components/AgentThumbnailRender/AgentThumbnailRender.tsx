import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const RETRY_COUNT = 5;
const RETRY_DELAY = 1000;

interface ImagePreviewProps {
  s3Url: string;
  refetch: () => void;
  //   error: boolean;
}

function AgentThumbnailRender({ s3Url, refetch }: ImagePreviewProps) {
  const componentRef = useRef<number>();
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    componentRef.current = RETRY_COUNT;
  }, []);

  const handleError = useCallback((event: React.SyntheticEvent<HTMLImageElement>) => {
    const { currentTarget } = event;
    setError(true);
    if (componentRef && componentRef.current && componentRef.current > 0) {
      refetch();
      setTimeout(() => {
        currentTarget.onerror = null;
        currentTarget.src = s3Url;
        componentRef.current = componentRef && componentRef.current && componentRef.current - 1;
      }, RETRY_DELAY);
    }
  }, []);

  const handleLoad = useCallback(() => {
    setError(false);
  }, []);

  const showImage = useMemo(() => {
    return <img src={s3Url} onError={(e) => handleError(e)} onLoad={handleLoad} />;
  }, [s3Url]);

  if (error) {
    return 'loading';
  }

  return showImage;
}

export default AgentThumbnailRender;
