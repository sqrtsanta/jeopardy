import { useEffect, useState, useRef } from "react";

export interface Query<T> {
  value: T;
  start: number;
  end: number;
}

export function buildContainerQuery<T>(
  value: T,
  start: number,
  end: number,
): Query<T> {
  return {
    value,
    start,
    end,
  };
}

function calculateQueryValue<T>(
  queries: Query<T>[],
  width: number,
  defaultValue: T,
) {
  let value: T = defaultValue;

  queries.forEach((item) => {
    if (width >= item.start && width < item.end) {
      value = item.value;
    }
  });

  return value;
}

export const useStaticContainerQuery = <T, E extends Element>(
  queries: Query<T>[],
  defaultValue: T,
) => {
  const [value, setValue] = useState<T>();
  const ref = useRef<E | null>(null);

  useEffect(() => {
    const width = ref.current?.getBoundingClientRect().width ?? 0;
    const calculatedValue = calculateQueryValue(queries, width, defaultValue);
    setValue(calculatedValue);
  }, []);

  return { ref, value };
};
