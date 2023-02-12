import { Checkbox } from "@mui/material";
import { ComponentProps, forwardRef } from "react";
import { Field } from "react-final-form";

export const FormCheckbox = forwardRef(
  (
    { name, ...props }: { name: string } & ComponentProps<typeof Checkbox>,
    ref
  ) => (
    <Field name={name} type="checkbox" ref={ref as any}>
      {({ input: { checked, onChange } }) => (
        <Checkbox checked={checked} onChange={onChange} {...props} />
      )}
    </Field>
  )
);
