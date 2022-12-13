import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  Pagination,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import {
  ComponentProps,
  ReactNode,
  useCallback,
  useMemo,
  useState,
} from "react";

import DescriptionIcon from "@mui/icons-material/Description";
// import PokeballIcon from "@mui/icons-material/CatchingPokemon";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";

import { PageView } from "../components/PageView";
import { useArrayPagination } from "../lib/hooks/useArrayPagination";
import { useCounter } from "../lib/hooks/useCounter";
import {
  BasicPokemon,
  imageUrlForPokemon,
  proficientSavingThrows,
  proficientSkill,
  useBasicPokemons,
  usePokemonQuery,
} from "../models/pokemon";
import { useEvent } from "react-use";
import { ComponentType } from "../types/ComponentType";
import {
  multiplyTypes,
  typeImageUrl,
  typeImmuneAgainst,
  typeResistantAgainst,
  typeWeakAgainst,
} from "../models/pokemonTypes";
import { groupBy, toPairs } from "remeda";

const Info: ComponentType<{ label: string; content: ReactNode }> = ({
  label,
  content,
}) => (
  <Box display="flex" flexDirection="column">
    <Typography variant="overline">{label}</Typography>
    <Box>{content}</Box>
  </Box>
);

const TypeImg: ComponentType<{ type: string }> = ({ type }) => (
  <img
    src={typeImageUrl(type.toLowerCase())}
    alt={type}
    style={{ width: "90px", marginRight: "5px" }}
  />
);

const PokemonStatblockDialog: ComponentType<
  Omit<ComponentProps<typeof Dialog>, "children"> & {
    onClose?: () => void;
    pokemon: BasicPokemon;
  }
> = ({ onClose, pokemon: basicPokemon, ...props }) => {
  const isMdBreakpoint = useMediaQuery((theme) =>
    (theme as any).breakpoints.down("md")
  );

  const { data: pokemon } = usePokemonQuery(basicPokemon);

  const skills = useMemo(
    () => pokemon && proficientSkill(pokemon.skills),
    [pokemon]
  );
  const savingThrows = useMemo(
    () => pokemon && proficientSavingThrows(pokemon.savingThrows),
    [pokemon]
  );

  const typeMultipliers = useMemo(
    () =>
      pokemon?.types[0]
        ? multiplyTypes(pokemon.types[0], pokemon.types[1])
        : undefined,
    [pokemon?.types]
  );

  const weakAgainst = useMemo(
    () => (typeMultipliers ? typeWeakAgainst(typeMultipliers) : []),
    [typeMultipliers]
  );

  const resistantAgainst = useMemo(
    () => (typeMultipliers ? typeResistantAgainst(typeMultipliers) : []),
    [typeMultipliers]
  );

  const immuneAgainst = useMemo(
    () => (typeMultipliers ? typeImmuneAgainst(typeMultipliers) : []),
    [typeMultipliers]
  );

  if (!pokemon) return <></>;

  return (
    <Dialog {...props}>
      <DialogTitle>
        <Box display="flex">
          <img
            src={imageUrlForPokemon(pokemon.id)}
            alt={pokemon.name}
            style={{ height: "50px", marginRight: "10px" }}
          />

          <Box display="flex" flexDirection="column">
            <Typography variant="overline" sx={{ lineHeight: "1.8" }}>
              {"#" + pokemon.id}
            </Typography>

            <Typography variant="h5" gutterBottom sx={{ lineHeight: "1" }}>
              {pokemon.name}
            </Typography>
          </Box>
        </Box>

        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent
        sx={{
          "&::-webkit-scrollbar": {
            width: "0.6em",
          },
          "&::-webkit-scrollbar-track": {
            boxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
            webkitBoxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "rgba(0,0,0,.3)",
            borderRadius: "3px",
          },
        }}
      >
        <Box display="flex" flexDirection={isMdBreakpoint ? "column" : "row"}>
          <Box flex="1 1 0">
            <Info
              label="Type"
              content={pokemon.types.map((type, i) => (
                <TypeImg key={i} type={type} />
              ))}
            />

            <Stack direction="row" spacing={4}>
              <Info
                label="SR"
                content={<Chip label={pokemon.sr} size="small" />}
              />

              <Info
                label="Size"
                content={<Chip label={pokemon.size} size="small" />}
              />

              <Info
                label="AC"
                content={<Chip label={pokemon.stats.ac} size="small" />}
              />

              <Info
                label="HP"
                content={
                  <Chip
                    label={`${pokemon.stats.hp} (d${pokemon.hitDie})`}
                    size="small"
                  />
                }
              />
            </Stack>

            <Divider sx={{ marginBlock: "20px" }} />

            <Typography variant="h6" gutterBottom>
              Speed
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Info
                  label="Walk"
                  content={
                    <Chip label={`${pokemon.movement.walk}ft.`} size="small" />
                  }
                />
              </Grid>

              <Grid item xs={4}>
                <Info
                  label="Swim"
                  content={
                    <Chip label={`${pokemon.movement.swim}ft.`} size="small" />
                  }
                />
              </Grid>

              <Grid item xs={4}>
                <Info
                  label="Fly"
                  content={
                    <Chip label={`${pokemon.movement.fly}ft.`} size="small" />
                  }
                />
              </Grid>

              <Grid item xs={4}>
                <Info
                  label="Burrow"
                  content={
                    <Chip
                      label={`${pokemon.movement.burrow}ft.`}
                      size="small"
                    />
                  }
                />
              </Grid>

              <Grid item xs={4}>
                <Info
                  label="Climb"
                  content={
                    <Chip label={`${pokemon.movement.climb}ft.`} size="small" />
                  }
                />
              </Grid>
            </Grid>

            <Divider sx={{ marginBlock: "20px" }} />

            <Typography variant="h6" gutterBottom>
              Stats
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={2}>
                <Info
                  label="STR"
                  content={<Chip label={pokemon.stats.str} size="small" />}
                />
              </Grid>

              <Grid item xs={2}>
                <Info
                  label="DEX"
                  content={<Chip label={pokemon.stats.dex} size="small" />}
                />
              </Grid>

              <Grid item xs={2}>
                <Info
                  label="CON"
                  content={<Chip label={pokemon.stats.con} size="small" />}
                />
              </Grid>

              <Grid item xs={2}>
                <Info
                  label="INT"
                  content={<Chip label={pokemon.stats.int} size="small" />}
                />
              </Grid>

              <Grid item xs={2}>
                <Info
                  label="WIS"
                  content={<Chip label={pokemon.stats.wis} size="small" />}
                />
              </Grid>

              <Grid item xs={2}>
                <Info
                  label="CHA"
                  content={<Chip label={pokemon.stats.cha} size="small" />}
                />
              </Grid>
            </Grid>

            {((skills?.length || 0) > 0 || (savingThrows?.length || 0) > 0) && (
              <>
                <Divider sx={{ marginBlock: "20px" }} />

                <Typography variant="h6" gutterBottom>
                  Proficiencies
                </Typography>

                <Grid container spacing={2}>
                  {skills && skills.length > 0 && (
                    <Grid item xs={6}>
                      <Info
                        label="Skills"
                        content={
                          <>
                            {skills.map((skill) => (
                              <Chip
                                key={skill}
                                label={skill}
                                size="small"
                                sx={{ marginRight: "5px", marginBottom: "5px" }}
                              />
                            ))}
                          </>
                        }
                      />
                    </Grid>
                  )}

                  {savingThrows && savingThrows.length > 0 && (
                    <Grid item xs={6}>
                      <Info
                        label="Saving Throws"
                        content={
                          <>
                            {savingThrows.map((attr) => (
                              <Chip
                                key={attr}
                                label={attr}
                                size="small"
                                sx={{ marginRight: "5px", marginBottom: "5px" }}
                              />
                            ))}
                          </>
                        }
                      />
                    </Grid>
                  )}
                </Grid>
              </>
            )}
          </Box>

          <Divider
            orientation={isMdBreakpoint ? "horizontal" : "vertical"}
            flexItem
            sx={{ [isMdBreakpoint ? "marginBlock" : "marginInline"]: "20px" }}
          />

          <Box flex="1 1 0">
            <Typography variant="h6" gutterBottom>
              Damage Affinity
            </Typography>

            {weakAgainst.length > 0 && (
              <Info
                label="Weakness"
                content={weakAgainst.map((type, i) => (
                  <TypeImg key={i} type={type} />
                ))}
              />
            )}

            {resistantAgainst.length > 0 && (
              <Info
                label="Resistance"
                content={resistantAgainst.map((type, i) => (
                  <TypeImg key={i} type={type} />
                ))}
              />
            )}

            {immuneAgainst.length > 0 && (
              <Info
                label="Immunity"
                content={immuneAgainst.map((type, i) => (
                  <TypeImg key={i} type={type} />
                ))}
              />
            )}

            <Divider sx={{ marginBlock: "20px" }} />

            <Typography variant="h6" gutterBottom>
              Combat
            </Typography>

            <Info
              label="Abilities"
              content={pokemon.abilities.map((ability, i) => (
                <Chip
                  key={i}
                  label={
                    !ability.isHidden
                      ? ability.ability
                      : `${ability.ability} (Hidden)`
                  }
                  size="small"
                  sx={{ marginRight: "5px", marginBottom: "5px" }}
                />
              ))}
            />

            {toPairs(
              groupBy(
                pokemon.moves.filter(
                  (move) => move.learning.method === "level"
                ),
                (move) =>
                  String("level" in move.learning ? move.learning.level : 0)
              )
            )
              .sort(([levelA], [levelB]) => Number(levelA) - Number(levelB))
              .map(([level, moves]) => (
                <Info
                  label={
                    level === "0" ? "Starting Moves" : `Level ${level} Moves`
                  }
                  content={moves.map((move, i) => (
                    <Chip
                      key={i}
                      label={move.move}
                      size="small"
                      sx={{ marginRight: "5px", marginBottom: "5px" }}
                    />
                  ))}
                />
              ))}
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export const Landing = () => {
  const [openPokemon, setOpenPokemon] = useState<string | undefined>(undefined);

  const [searchInputValue, setSearchInputValue] = useState("");
  const [searchValue, setSearchValue] = useState("");

  const isLgBreakpoint = useMediaQuery((theme) =>
    (theme as any).breakpoints.down("lg")
  );

  const isMdBreakpoint = useMediaQuery((theme) =>
    (theme as any).breakpoints.down("md")
  );

  // const isSmBreakpoint = useMediaQuery((theme) =>
  //   (theme as any).breakpoints.down("sm")
  // );

  const cardsPerLine = useMemo(() => {
    if (isMdBreakpoint) return 2;
    if (isLgBreakpoint) return 3;
    return 4;
  }, [isLgBreakpoint, isMdBreakpoint]);

  const allPokemons = useBasicPokemons();

  const filteredPokemons = useMemo(() => {
    return allPokemons.filter((p) =>
      p.name.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [allPokemons, searchValue]);

  const pages = useMemo(
    () => Math.ceil(filteredPokemons.length / 12),
    [filteredPokemons.length]
  );
  const {
    value: page,
    set: setPage,
    increment: nextPage,
    decrement: prevPage,
  } = useCounter(0, 0, pages - 1);

  const currentPokemons = useArrayPagination(filteredPokemons, {
    perPage: 12,
    currentPage: page,
  });

  const currentOpenPokemon = useMemo(
    () => allPokemons.find((pokemon) => pokemon.id === openPokemon),
    [allPokemons, openPokemon]
  );

  const handleSearch = useCallback(() => {
    setSearchValue(searchInputValue);
    setPage(0);
  }, [setSearchValue, setPage, searchInputValue]);

  const handleKeyPageNavigation = useCallback(
    (e: any) => {
      if (e.key === "ArrowLeft") return prevPage();
      if (e.key === "ArrowRight") return nextPage();
    },
    [prevPage, nextPage]
  );

  const handleClosePokemonStats = useCallback(
    () => setOpenPokemon(undefined),
    [setOpenPokemon]
  );

  const makeOpenPokemonHandler = useCallback(
    (pokemonId: string) => () => setOpenPokemon(pokemonId),
    [setOpenPokemon]
  );

  useEvent("keydown", handleKeyPageNavigation);

  return (
    <>
      <PageView
        sx={{
          marginBlock: "20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <TextField
          label="Search by Name"
          size="small"
          value={searchInputValue}
          onChange={(e) => setSearchInputValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton size="small" onClick={handleSearch}>
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            width: "100%",
            marginBottom: "20px",
          }}
        />

        <Grid container spacing={2} sx={{ marginBottom: "20px" }}>
          {currentPokemons.map((pokemon) => (
            <Grid item xs={12 / cardsPerLine} key={pokemon.id}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="overline" sx={{ lineHeight: "0.8" }}>
                    {"#" + pokemon.id}
                  </Typography>
                  <Typography
                    variant="h5"
                    gutterBottom
                    sx={{ lineHeight: "1" }}
                  >
                    {pokemon.name}
                  </Typography>
                </CardContent>

                <CardMedia
                  component="img"
                  image={imageUrlForPokemon(pokemon.id)}
                  alt={pokemon.name}
                />

                <CardActions sx={{ justifyContent: "center" }}>
                  <Button
                    // startIcon={!isMdBreakpoint ? <DescriptionIcon /> : null}
                    startIcon={<DescriptionIcon />}
                    sx={{ width: "100%" }}
                    onClick={makeOpenPokemonHandler(pokemon.id)}
                  >
                    {/* {!isSmBreakpoint ? "Statblock" : "Stat."} */}
                    Statblock
                  </Button>

                  {/* <Button startIcon={!isMdBreakpoint ? <PokeballIcon /> : null}>
                    {!isSmBreakpoint ? "Generate" : "Gen."}
                  </Button> */}
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Pagination
          count={pages}
          page={page + 1}
          onChange={(_e, pageNumber) => setPage(pageNumber - 1)}
        />
      </PageView>

      {currentOpenPokemon ? (
        <PokemonStatblockDialog
          pokemon={currentOpenPokemon}
          onClose={handleClosePokemonStats}
          maxWidth="md"
          open
          fullWidth
        />
      ) : null}
    </>
  );
};
