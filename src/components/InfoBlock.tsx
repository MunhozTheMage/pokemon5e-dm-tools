import { Box, Typography } from "@mui/material";
import { ReactNode } from "react";
import { ComponentType } from "../types/ComponentType";

export const InfoBlock: ComponentType<{
  label: string;
  content: ReactNode;
}> = ({ label, content }) => (
  <Box display="flex" flexDirection="column">
    <Typography variant="overline">{label}</Typography>
    <Box>{content}</Box>
  </Box>
);
