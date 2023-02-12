import { FormControl, InputLabel, Select } from "@mui/material";
import { ComponentProps, useId } from "react";

export const SelectField = ({
  label,
  fullWidth,
  renderOnFormControl,
  children,
  ...props
}: { label: string; renderOnFormControl?: () => JSX.Element } & Omit<
  ComponentProps<typeof Select>,
  "label"
>) => {
  const uniqueId = useId();

  return (
    <FormControl fullWidth={fullWidth}>
      <InputLabel id={uniqueId}>{label}</InputLabel>
      <Select labelId={uniqueId} label={label} {...props}>
        {children}
      </Select>
      {renderOnFormControl?.()}
    </FormControl>
  );
};
