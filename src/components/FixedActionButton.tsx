import { Box, IconButton, useMediaQuery } from "@mui/material";
import { ComponentProps } from "react";

export const FixedActionButtonMobileSpacing = () => {
  const isMdBreakpoint = useMediaQuery((theme) =>
    (theme as any).breakpoints.down("md")
  );
  return <>{isMdBreakpoint && <Box marginBottom="55px" />}</>;
};

export const FixedActionButton = ({
  withoutMobileSpacing = false,
  children,
  ...props
}: ComponentProps<typeof IconButton> & {
  withoutMobileSpacing?: boolean;
}) => {
  return (
    <>
      <IconButton
        {...props}
        size="large"
        sx={{
          // color
          backgroundColor: "primary.main",
          boxShadow: "rgb(0 0 0 / 50%) 0px 4px 20px",

          // position
          position: "fixed",
          bottom: 20,
          right: 20,

          // misc
          transition: "200ms",

          "&:hover": {
            backgroundColor: "primary.main",
            opacity: "80%",
          },
        }}
      >
        {children}
      </IconButton>

      {!withoutMobileSpacing && <FixedActionButtonMobileSpacing />}
    </>
  );
};
