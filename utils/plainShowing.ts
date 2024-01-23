export function plainShowing(page: number, records: number, total: number, collection: string) {
  const from = (page >= 1 ? 20 : 0) * page;
  const to = (page >= 1 ? 20 : records) * page + records;

  return `Showing ${from}-${to} of ${total} ${collection}`;
}
