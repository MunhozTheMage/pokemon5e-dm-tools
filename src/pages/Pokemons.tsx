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
  Link,
  Pagination,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { ComponentProps, useCallback, useMemo, useState } from "react";

import DescriptionIcon from "@mui/icons-material/Description";
// import PokeballIcon from "@mui/icons-material/CatchingPokemon";
import CloseIcon from "@mui/icons-material/Close";

import { PageView } from "../components/PageView";
import { useArrayPagination } from "../lib/hooks/useArrayPagination";
import { useCounter } from "../lib/hooks/useCounter";
import {
  BasicPokemon,
  imageUrlForPokemon,
  proficientSavingThrows,
  proficientSkill,
  useBasicPokemon,
  useBasicPokemons,
  usePokemonQuery,
} from "../models/pokemon";
import { useEvent } from "react-use";
import { ComponentType } from "../types/ComponentType";
import {
  multiplyTypes,
  TypeImg,
  typeImmuneAgainst,
  typeResistantAgainst,
  typeWeakAgainst,
} from "../models/pokemonTypes";
import { groupBy, toPairs } from "remeda";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { SearchBar } from "../components/SearchBar";
import { InfoBlock } from "../components/InfoBlock";

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
            <InfoBlock
              label="Type"
              content={pokemon.types.map((type, i) => (
                <TypeImg key={i} type={type} />
              ))}
            />

            <Stack direction="row" spacing={4}>
              <InfoBlock
                label="SR"
                content={<Chip label={pokemon.sr} size="small" />}
              />

              <InfoBlock
                label="Size"
                content={<Chip label={pokemon.size} size="small" />}
              />

              <InfoBlock
                label="AC"
                content={<Chip label={pokemon.stats.ac} size="small" />}
              />

              <InfoBlock
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
                <InfoBlock
                  label="Walk"
                  content={
                    <Chip label={`${pokemon.movement.walk}ft.`} size="small" />
                  }
                />
              </Grid>

              <Grid item xs={4}>
                <InfoBlock
                  label="Swim"
                  content={
                    <Chip label={`${pokemon.movement.swim}ft.`} size="small" />
                  }
                />
              </Grid>

              <Grid item xs={4}>
                <InfoBlock
                  label="Fly"
                  content={
                    <Chip label={`${pokemon.movement.fly}ft.`} size="small" />
                  }
                />
              </Grid>

              <Grid item xs={4}>
                <InfoBlock
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
                <InfoBlock
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
              <Grid item xs={isMdBreakpoint ? 4 : 2}>
                <InfoBlock
                  label="STR"
                  content={<Chip label={pokemon.stats.str} size="small" />}
                />
              </Grid>

              <Grid item xs={isMdBreakpoint ? 4 : 2}>
                <InfoBlock
                  label="DEX"
                  content={<Chip label={pokemon.stats.dex} size="small" />}
                />
              </Grid>

              <Grid item xs={isMdBreakpoint ? 4 : 2}>
                <InfoBlock
                  label="CON"
                  content={<Chip label={pokemon.stats.con} size="small" />}
                />
              </Grid>

              <Grid item xs={isMdBreakpoint ? 4 : 2}>
                <InfoBlock
                  label="INT"
                  content={<Chip label={pokemon.stats.int} size="small" />}
                />
              </Grid>

              <Grid item xs={isMdBreakpoint ? 4 : 2}>
                <InfoBlock
                  label="WIS"
                  content={<Chip label={pokemon.stats.wis} size="small" />}
                />
              </Grid>

              <Grid item xs={isMdBreakpoint ? 4 : 2}>
                <InfoBlock
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
                      <InfoBlock
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
                      <InfoBlock
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
              <InfoBlock
                label="Weakness"
                content={weakAgainst.map((type, i) => (
                  <TypeImg key={i} type={type} />
                ))}
              />
            )}

            {resistantAgainst.length > 0 && (
              <InfoBlock
                label="Resistance"
                content={resistantAgainst.map((type, i) => (
                  <TypeImg key={i} type={type} />
                ))}
              />
            )}

            {immuneAgainst.length > 0 && (
              <InfoBlock
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

            <InfoBlock
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
              .map(([level, moves], i) => (
                <InfoBlock
                  key={i}
                  label={
                    level === "0" ? "Starting Moves" : `Level ${level} Moves`
                  }
                  content={moves.map((move, i) => (
                    <Link
                      key={i}
                      href={`/moves/${encodeURI(move.move)}`}
                      sx={{ textDecoration: "none" }}
                    >
                      <Chip
                        label={move.move}
                        size="small"
                        sx={{
                          marginRight: "5px",
                          marginBottom: "5px",
                          cursor: "pointer",
                          "&:hover": {
                            backgroundColor: "rgb(255, 255, 255, 0.05)",
                          },
                        }}
                      />
                    </Link>
                  ))}
                />
              ))}
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

const PokemonsContent = () => {
  const navigate = useNavigate();
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

  const handleSearch = useCallback(
    (searchValue: string) => {
      setSearchValue(searchValue);
      setPage(0);
    },
    [setSearchValue, setPage]
  );

  const handleKeyPageNavigation = useCallback(
    (e: any) => {
      if (e.key === "ArrowLeft") return prevPage();
      if (e.key === "ArrowRight") return nextPage();
    },
    [prevPage, nextPage]
  );

  const makeOpenPokemonHandler = useCallback(
    (pokemonId: string) => () => navigate(`${pokemonId}`),
    [navigate]
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
        <SearchBar label="Search by Name" onSearch={handleSearch} />

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
    </>
  );
};

export const PokemonDetailsPage = () => {
  const { pokemonId } = useParams();
  const navigate = useNavigate();

  const pokemon = useBasicPokemon(pokemonId || "000");

  return pokemon ? (
    <PokemonStatblockDialog
      pokemon={pokemon}
      onClose={() => navigate("/pokemons")}
      maxWidth="md"
      open
      fullWidth
    />
  ) : (
    <></>
  );
};

export const PokemonsPage = () => (
  <>
    <PokemonsContent />
    <Outlet />
  </>
);
