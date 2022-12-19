import { IconButton, InputAdornment, TextField } from "@mui/material";
import { ComponentProps, useState } from "react";

import SearchIcon from "@mui/icons-material/Search";

import { ComponentType } from "../types/ComponentType";

export const SearchBar: ComponentType<
  Omit<ComponentProps<typeof TextField>, "value" | "onChange"> & {
    onSearch: (value: string) => void;
    initialValue?: string;
  }
> = ({ onSearch, initialValue = "", sx, ...props }) => {
  const [text, setText] = useState(initialValue);

  return (
    <TextField
      size="small"
      value={text}
      onChange={(e) => setText(e.target.value)}
      onKeyDown={(e) => e.key === "Enter" && onSearch(text)}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton size="small" onClick={() => onSearch(text)}>
              <SearchIcon />
            </IconButton>
          </InputAdornment>
        ),
      }}
      sx={{
        width: "100%",
        marginBottom: "20px",
        ...sx,
      }}
      {...props}
    />
  );
};
