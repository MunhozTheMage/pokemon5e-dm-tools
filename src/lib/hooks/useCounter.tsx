import { useCallback, useState } from "react";
import { clamp } from "remeda";

export const useCounter = (init: number, min: number, max: number) => {
  const [value, setValue] = useState(clamp(init, { min, max }));

  const increment = useCallback(
    (n = 1) => setValue((prevValue) => clamp(prevValue + n, { max, min })),
    [setValue, max, min]
  );

  const decrement = useCallback(
    (n = 1) => setValue((prevValue) => clamp(prevValue - n, { max, min })),
    [setValue, max, min]
  );

  const set = useCallback(
    (n: number) => setValue(clamp(n, { max, min })),
    [setValue, max, min]
  );

  return { value, increment, decrement, set };
};
