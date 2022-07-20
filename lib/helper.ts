import { useState, useEffect } from "react";
import type { Models } from "appwrite";

export function useAsyncResult<T>(
  effect: AsyncEffectCallback<T>
): AsyncEffectResult<T> {
  const [data, setData] = useState<Loading<T>>(undefined);
  const [error, setError] = useState<any | undefined>(undefined);

  useEffect(() => effect(setData, setError), []);

  return [data, data === undefined && error !== undefined, error];
}

export type Loading<T> = T | undefined;
export type AsyncEffectResult<T> = [Loading<T>, boolean, unknown];

export type AsyncEffectCallback<T> = (
  set: (data: T) => void,
  error: (error: unknown) => void
) => void | (() => void);

export type CloudFunctionExecution<Data> = Models.Execution & {
  data: Data;
};

export type CloudFunction<Data, ReturnData> = {
  execute: (data?: Data) => void;
  execution?: CloudFunctionExecution<ReturnData>;
};
