import { FormHelperText, Stack } from "@mui/material";
import { ComponentProps } from "react";
import { Field } from "react-final-form";
import { SelectField as BaseSelectField } from "../SelectField";

import ErrorIcon from "@mui/icons-material/Error";

export const FormSelectField = ({
  name,
  ...props
}: { name: string } & ComponentProps<typeof BaseSelectField>) => (
  <Field name={name}>
    {({ input: { value, onChange }, meta: { error, modified } }) => (
      <BaseSelectField
        value={value}
        onChange={onChange}
        renderOnFormControl={
          error && modified
            ? () => (
                <Stack direction="row">
                  <ErrorIcon
                    fontSize="small"
                    sx={{ color: "error.main", alignSelf: "center" }}
                  />
                  <FormHelperText sx={{ color: "error.main" }}>
                    {error}
                  </FormHelperText>
                </Stack>
              )
            : undefined
        }
        {...props}
      />
    )}
  </Field>
);
