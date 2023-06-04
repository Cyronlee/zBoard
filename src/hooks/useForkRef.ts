import { useMemo } from "react";

function setRef<T>(ref: React.RefObject<T> | ((instance: T | null) => void) | null | undefined, value: T | null): void {
  if (typeof ref === 'function') {
    ref(value);
  } else if (ref) {
    // @ts-ignore
    ref.current = value;
  }
}


export function useForkRef<T>(refA: React.Ref<T>, refB: React.Ref<T>): React.Ref<T>  {
  return useMemo(function () {
    if (refA == null && refB == null) {
      return null;
    }

    return function (refValue) {
      debugger
      setRef(refA, refValue);
      setRef(refB, refValue);
    };
  }, [refA, refB]);
}