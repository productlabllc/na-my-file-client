// batch promise.all;
export const batchPromises = async <T>(promises: (() => Promise<T>)[], batchSize: number) => {
  const results = [];
  for (let i = 0; i < promises.length; i += batchSize) {
    results.push(...(await Promise.all(promises.slice(i, i + batchSize).map((p) => p()))));
  }
  return results;
};
