import { toCamelKeys } from "keys-transform";

export function convertCamelCase(data: object[]) {
  const allData: object[] = [];
  for (let i = 0; i < data.length; i++) {
    const d: object = toCamelKeys(data[i]);
    allData.push(d);
  }
  return allData;
}
