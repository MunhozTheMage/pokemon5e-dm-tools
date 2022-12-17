import { Button } from "@mui/material";
import { ComponentProps } from "react";
import { ComponentType } from "../types/ComponentType";

export const LinkButton: ComponentType<ComponentProps<typeof Button>> = ({
  sx,
  ...props
}) => (
  <Button
    variant="text"
    size="small"
    {...props}
    sx={{
      color: (theme) => theme.palette.text.primary,
      "&:hover": {
        color: (theme) => theme.palette.primary.main,
        backgroundColor: "transparent",
      },
      ...sx,
    }}
  />
);
