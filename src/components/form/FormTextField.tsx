import {
  FormControl,
  FormHelperText,
  Stack,
  TextField as MuiTextField,
} from "@mui/material";
import { ComponentProps } from "react";
import { Field } from "react-final-form";

import ErrorIcon from "@mui/icons-material/Error";

export const FormTextField = ({
  name,
  onlyShowErrorSymbol = false,
  fullWidth,
  ...props
}: { name: string; onlyShowErrorSymbol?: boolean } & ComponentProps<
  typeof MuiTextField
>) => (
  <Field name={name}>
    {({ input: { value, onChange }, meta: { error, modified } }) => (
      <FormControl fullWidth={fullWidth}>
        <MuiTextField value={value} onChange={onChange} {...props} />
        {error && modified ? (
          <Stack direction="row">
            <ErrorIcon
              fontSize="small"
              sx={{ color: "error.main", alignSelf: "center" }}
            />
            {!onlyShowErrorSymbol && (
              <FormHelperText sx={{ color: "error.main" }}>
                {error}
              </FormHelperText>
            )}
          </Stack>
        ) : undefined}
      </FormControl>
    )}
  </Field>
);
