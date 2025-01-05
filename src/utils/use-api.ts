import { useMemo } from 'react';
import * as Api from '@namyfile/api-client';

export const useApi = () => {
  const api = useMemo(() => {
    return Api;
  }, []);

  return api;
};
