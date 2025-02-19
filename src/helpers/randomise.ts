import { getRndInteger } from './randomNumber';

// randomises the order of items in an array
export function randomiseArray<T>(arr: T[]): T[] {
  // cloning the array so we don't mutate the original array
  const orgArray = structuredClone(arr);
  const newArray: T[] = [];
  do {
    const randomIndex = getRndInteger(0, orgArray.length);
    const randomElement = orgArray.splice(randomIndex, 1);
    newArray.push(...randomElement);
  } while (orgArray.length);

  return newArray;
}
