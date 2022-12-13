import { Box } from "@mui/material";
import { ComponentProps } from "react";
import { ComponentType } from "../types/ComponentType";

export const PageView: ComponentType<ComponentProps<typeof Box>> = (props) => (
  <Box display="flex" justifyContent="center">
    <Box width="min(1100px, 90vw)" {...props} />
  </Box>
);
