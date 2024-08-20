export function getDataWithIndex(dataWithoutIndex: any) {
  return dataWithoutIndex.map((item: any, index: number) => ({
    ...item,
    key: index + 1,
  }));
}
