export function plainShowing(page: number, records: number, total: number, collection: string) {
  const from = (page >= 1 ? 20 : 0) * page;
  const to = (page >= 1 ? 20 : records) * page + records;

  return `Showing ${records > 0 ? (records > 1 ? `${from + 1}-${to}` : 1) : 0} of ${total} ${collection}`;
}
