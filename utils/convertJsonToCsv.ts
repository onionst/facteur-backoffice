export const convertJsonToCsv = (jsonData: any[]) => {
  const csvRows = [];
  let max = 0;
  let indexMax = 0;
  jsonData.forEach((data, index) => {
    const lengthKeys = Object.keys(data).length;
    if (lengthKeys > max) {
      max = lengthKeys;
      indexMax = index;
    }
  });
  const headers = Object.keys(jsonData[indexMax]);
  csvRows.push(headers.join(';'));

  for (const row of jsonData) {
    const values = headers.map(header => {
      const valueRow = row[header] ?? '';
      const escaped = ('' + valueRow).replace(/"/g, '\\"');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(';'));
  }

  return new Blob([csvRows.join('\n')], { type: 'text/csv' });
};
