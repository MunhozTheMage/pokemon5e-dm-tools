import {
  AppBar,
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";

import PokeballIcon from "@mui/icons-material/CatchingPokemon";
import MenuIcon from "@mui/icons-material/Menu";

import { PageView } from "./PageView";
import { LinkButton } from "./LinkButton";
import { useBoolean } from "react-use";
import { ListItemLink } from "./ListItemLink";

const pages: {
  label: string;
  path: string;
  icon: JSX.Element;
}[] = [];

export const AppHeader = () => {
  const [isPagesDrawerOpen, setIsPagesDrawerOpen] = useBoolean(false);

  const isMobileLayout = useMediaQuery((theme) =>
    (theme as any).breakpoints.down("md")
  );

  return (
    <>
      <AppBar position="static" sx={{ paddingBlock: "10px" }}>
        <PageView>
          <Stack direction="row" justifyContent="space-between">
            <Stack direction="row" alignItems="center">
              <PokeballIcon sx={{ marginRight: "5px" }} />
              <Typography variant="h5">Pokémon 5e DM Tools</Typography>
            </Stack>

            {pages.length > 0 ? (
              isMobileLayout ? (
                <IconButton onClick={() => setIsPagesDrawerOpen(true)}>
                  <MenuIcon />
                </IconButton>
              ) : (
                <Stack direction="row" spacing={2} sx={{ color: "white" }}>
                  {pages.map(({ label, path }, i) => (
                    <LinkButton key={i} href={path}>
                      {label}
                    </LinkButton>
                  ))}
                </Stack>
              )
            ) : null}
          </Stack>
        </PageView>
      </AppBar>

      <Drawer
        anchor="right"
        open={isMobileLayout && isPagesDrawerOpen}
        onClose={() => setIsPagesDrawerOpen(false)}
      >
        <Box sx={{ width: 250 }}>
          <Typography
            variant="h6"
            sx={{ paddingTop: "10px", paddingInline: "20px" }}
          >
            Pages
          </Typography>

          <Divider sx={{ paddingBottom: "10px", minWidth: "150px" }} />

          <List>
            {pages.map(({ label, path, icon }, i) => (
              <ListItemLink key={i} to={path} icon={icon}>
                {label}
              </ListItemLink>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
};
