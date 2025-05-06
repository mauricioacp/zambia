export function tryCatch<T, E = Error>(
  fn: () => T,
  finallyFn?: () => void
): T extends Promise<infer PVal>
  ? Promise<{ data: PVal; error: null } | { data: null; error: E }>
  : { data: T; error: null } | { data: null; error: E } {
  type Result<TData, TError> = { data: TData; error: null } | { data: null; error: TError };

  type IntendedReturnType = T extends Promise<infer PVal> ? Promise<Result<PVal, E>> : Result<T, E>;

  try {
    const resultOrPromise = fn();

    if (resultOrPromise instanceof Promise) {
      return resultOrPromise
        .then((value) => {
          return { data: value, error: null };
        })
        .catch((error) => {
          return { data: null, error: error as E };
        }) as IntendedReturnType;
    } else {
      return { data: resultOrPromise, error: null } as IntendedReturnType;
    }
  } catch (error: unknown) {
    return { data: null, error: error as E } as IntendedReturnType;
  } finally {
    if (finallyFn) {
      finallyFn();
    }
  }
}
