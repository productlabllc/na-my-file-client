// Can be used e.g. as .filter(truthy) to only keep truthy values,
// because .filter(Boolean) doesn't pass TypeScript check

// https://stackoverflow.com/questions/47632622/typescript-and-filter-boolean

export type Truthy<T> = T extends false | '' | 0 | null | undefined ? never : T; // from lodash

export const truthy = <T>(value: T): value is Truthy<T> => !!value;
