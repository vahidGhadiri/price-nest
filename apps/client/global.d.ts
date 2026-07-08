declare global {
  type QueryValueType =
    | (boolean | string | number)[]
    | undefined
    | boolean
    | string
    | number
    | null;

  type QueryParams = Record<string, QueryValueType> | string;
  type PathParams = Record<string, string | number>;
}

export {};
