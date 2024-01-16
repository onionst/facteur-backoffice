export function cleanObject(obj: any) {
  const cleanObj = {};

  for (const key in obj) {
    // eslint-disable-next-line no-prototype-builtins
    if (obj?.hasOwnProperty(key)) {
      const value = obj[key];

      if (
        value !== null &&
        value !== '' &&
        !(Array.isArray(value) && value.length === 0) &&
        !(value.constructor === Object && Object.keys(value).length === 0)
      ) {
        // @ts-ignore
        cleanObj[key] = value;
      }
    }
  }

  return cleanObj;
}
