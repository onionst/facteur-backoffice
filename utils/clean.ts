export function cleanObject(obj: any) {
  const cleanObj = {};

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];

      // Check for null, empty string, empty array, or empty object
      if (
        value !== null &&
        value !== '' &&
        !(Array.isArray(value) && value.length === 0) &&
        !(value.constructor === Object && Object.keys(value).length === 0)
      ) {
        cleanObj[key] = value;
      }
    }
  }

  return cleanObj;
}
