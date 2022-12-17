import { LinkProps as MuiLinkProps } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { ComponentProps, forwardRef } from "react";
import { Link } from "react-router-dom";

const LinkBehavior = forwardRef<
  HTMLAnchorElement,
  Omit<ComponentProps<typeof Link>, "to"> & {
    href: ComponentProps<typeof Link>["to"];
  }
>(({ href, ...other }, ref) => <Link ref={ref} to={href} {...other} />);

export const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#ff3c2e",
    },
  },
  components: {
    MuiLink: {
      defaultProps: {
        component: LinkBehavior,
      } as MuiLinkProps,
    },
    MuiButtonBase: {
      defaultProps: {
        LinkComponent: LinkBehavior,
      },
    },
    MuiButton: {
      defaultProps: {
        variant: "contained",
        size: "small",
      },
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 400,
      md: 800,
      lg: 1100,
      xl: 1536,
    },
  },
});
