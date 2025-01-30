export const validateUrl = (url: string): boolean => {
  const regex =
    /[Hh][Tt][Tt][Pp][Ss]?:\/\/(?:(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)(?:\.(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)*(?:\.(?:[a-zA-Z\u00a1-\uffff]{2,}))(?::\d{2,5})?(?:\/[^\s]*)?/;
  return regex.test(url);
};

export const removeFalsyValues = (obj: any) => {
  for (const key in obj) {
    const value = obj[key];
    if (typeof value === 'object' && value !== null) {
      obj[key] = removeFalsyValues(value);
    }
    if ((value === null || value === undefined) && typeof value !== 'object') {
      delete obj[key];
    }
  }

  return obj;
};
