export const convertJsonToBlob = (jsonData: any) => {
  const jsonString = JSON.stringify(jsonData);
  return new Blob([jsonString], { type: 'application/json' });
};
