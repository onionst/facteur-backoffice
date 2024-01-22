export const convertJsonToCsv = (jsonData: any[]) => {
  const csvRows = [];
  const headers = Object.keys(jsonData[0]);
  csvRows.push(headers.join(';'));

  for (const row of jsonData) {
    const values = headers.map(header => {
      const escaped = ('' + row[header]).replace(/"/g, '\\"');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(';'));
  }

  return new Blob([csvRows.join('\n')], { type: 'text/csv' });
};
