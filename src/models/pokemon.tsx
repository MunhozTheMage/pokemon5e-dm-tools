import { ComponentProps, useCallback, useMemo } from "react";
import { useQuery } from "react-query";
import { pipe, toPairs, map, flatten, fromPairs, filter } from "remeda";

import _pokemonData from "../data/pokemons.json";
import { ComponentType } from "../types/ComponentType";
import { POKEMON_DATA_PATH, POKEMON_IMAGE_PATH } from "../vars";
import { camelize } from "./string";

export type BasicPokemon = {
  id: string;
  name: string;
};

type PokemonStatBlock = BasicPokemon & {
  sr: number;
  types: string[];
  abilities: { ability: string; isHidden: boolean }[];
  evolutions: { pokemon: string }[];
  movement: {
    walk: number;
    burrow: number;
    climb: number;
    fly: number;
    swim: number;
  };
  stats: {
    hp: number;
    ac: number;
    cha: number;
    con: number;
    dex: number;
    int: number;
    str: number;
    wis: number;
  };
  hitDie: number;
  moves: {
    move: string;
    learning: { method: "level"; level: number } | { method: "egg" | string };
  }[];
  skills: {
    acrobatics: boolean;
    animalHandling: boolean;
    arcana: boolean;
    athletics: boolean;
    deception: boolean;
    history: boolean;
    insight: boolean;
    intimidation: boolean;
    investigation: boolean;
    medicine: boolean;
    nature: boolean;
    perception: boolean;
    performance: boolean;
    persuasion: boolean;
    religion: boolean;
    sleightOfHand: boolean;
    stealth: boolean;
    survival: boolean;
  };
  savingThrows: {
    cha: boolean;
    con: boolean;
    dex: boolean;
    int: boolean;
    str: boolean;
    wis: boolean;
  };
  senses: string[];
  size: string;
};

const pokemonData = _pokemonData as { [k: string]: string };

const pokemonFromDataJson = (
  pokemon: BasicPokemon,
  data: any
): PokemonStatBlock => {
  const savingThrows = (data["saving_throws"] || []) as string[];

  return {
    ...pokemon,
    sr: data["SR"],
    types: data["Type"],
    abilities: [
      ...data["Abilities"].map((ability: string) => ({
        ability,
        isHidden: false,
      })),
      ...(data["Hidden Ability"]
        ? [{ ability: data["Hidden Ability"], isHidden: true }]
        : []),
    ],
    evolutions: data["Evolve"] ? [{ pokemon: data["Evolve"] }] : [],
    movement: {
      walk: data["WSp"] || 0,
      burrow: data["Burrowing Speed"] || 0,
      climb: data["Climbing Speed"] || 0,
      fly: data["Fsp"] || 0,
      swim: data["Ssp"] || 0,
    },
    stats: {
      hp: data["HP"],
      ac: data["AC"],
      cha: data["attributes"]["CHA"],
      con: data["attributes"]["CON"],
      dex: data["attributes"]["DEX"],
      int: data["attributes"]["INT"],
      str: data["attributes"]["STR"],
      wis: data["attributes"]["WIS"],
    },
    hitDie: data["Hit Dice"],
    moves: [
      ...pipe(
        (data["Moves"]["Level"] || []) as { [k: string]: string[] },
        (movesByLevel) => toPairs(movesByLevel),
        (movesByLevel) =>
          map(movesByLevel, ([level, moves]) =>
            map(moves, (move) => ({
              move,
              learning: { method: "level", level: Number(level) },
            }))
          ),
        (moves) => flatten(moves)
      ),

      ...pipe((data["Moves"]["Starting Moves"] || []) as string[], (moves) =>
        map(moves, (move) => ({
          move,
          learning: { method: "level", level: 0 },
        }))
      ),

      ...pipe((data["Moves"]["egg"] || []) as string[], (moves) =>
        map(moves, (move) => ({ move, learning: { method: "egg" } }))
      ),
    ],
    skills: pipe(
      [
        "Acrobatics",
        "Animal Handling",
        "Arcana",
        "Athletics",
        "Deception",
        "History",
        "Insight",
        "Intimidation",
        "Investigation",
        "Medicine",
        "Nature",
        "Perception",
        "Performance",
        "Persuasion",
        "Religion",
        "Sleight Of Hand",
        "Stealth",
        "Survival",
      ],
      (skills) =>
        map(
          skills,
          (skill) =>
            [
              camelize(skill),
              ((data["Skill"] || []) as string[]).find(
                (proficientSkill) =>
                  proficientSkill.toLowerCase() === skill.toLowerCase()
              ) !== undefined,
            ] as [string, boolean]
        ),
      (skillPairs) => fromPairs(skillPairs)
    ) as PokemonStatBlock["skills"],
    savingThrows: {
      cha: savingThrows.includes("Charisma"),
      con: savingThrows.includes("Constitution"),
      dex: savingThrows.includes("Dexterity"),
      int: savingThrows.includes("Intelligence"),
      str: savingThrows.includes("Strength"),
      wis: savingThrows.includes("Wisdom"),
    },
    senses: data["Senses"] || [],
    size: data["size"],
  };
};

export const proficientSkill = (skills: PokemonStatBlock["skills"]) => {
  const skillIfProficient = (skill: string, proficient: boolean) =>
    proficient ? skill : null;

  return filter(
    [
      skillIfProficient("Acrobatics", skills.acrobatics),
      skillIfProficient("Animal Handling", skills.animalHandling),
      skillIfProficient("Arcana", skills.arcana),
      skillIfProficient("Athletics", skills.athletics),
      skillIfProficient("Deception", skills.deception),
      skillIfProficient("History", skills.history),
      skillIfProficient("Insight", skills.insight),
      skillIfProficient("Intimidation", skills.intimidation),
      skillIfProficient("Investigation", skills.investigation),
      skillIfProficient("Medicine", skills.medicine),
      skillIfProficient("Nature", skills.nature),
      skillIfProficient("Perception", skills.perception),
      skillIfProficient("Performance", skills.performance),
      skillIfProficient("Persuasion", skills.persuasion),
      skillIfProficient("Religion", skills.religion),
      skillIfProficient("Sleight of Hand", skills.sleightOfHand),
      skillIfProficient("Stealth", skills.stealth),
      skillIfProficient("Survival", skills.survival),
    ],
    Boolean
  );
};

export const proficientSavingThrows = (
  attrs: PokemonStatBlock["savingThrows"]
) => {
  const attrIfProficient = (attr: string, proficient: boolean) =>
    proficient ? attr : null;

  return filter(
    [
      attrIfProficient("Strength", attrs.str),
      attrIfProficient("Dexterity", attrs.dex),
      attrIfProficient("Constitution", attrs.con),
      attrIfProficient("Inteligence", attrs.int),
      attrIfProficient("Wisdom", attrs.wis),
      attrIfProficient("Charisma", attrs.cha),
    ],
    Boolean
  );
};

const getFetchableName = (name: string) =>
  pipe(
    name,

    // For names with speciifed special characters, like Type: Null
    (n) => n.replace(/:/g, ""),

    // For cases like Nidorans
    (n) => n.replace(/♀/g, "-f"),
    (n) => n.replace(/♂/g, "-m"),

    // For names with accents like Flabébé
    (n) => n.normalize("NFD").replace(/\p{Diacritic}/gu, ""),

    // If mewostic, assume female gender
    (n) => (n === "Meowstic" ? "Meowstic-f" : n)
  );

export const dataUrlForPokemon = (name: string) =>
  POKEMON_DATA_PATH.replace("{{name}}", getFetchableName(name));

export const imageUrlForPokemon = (id: string) =>
  POKEMON_IMAGE_PATH.replace("{{number}}", id);

const allPokemon = (): BasicPokemon[] =>
  Object.entries(pokemonData)
    .map(([id, name]) => ({ id, name }))
    .sort(({ id: idA }, { id: idB }) => (Number(idA) > Number(idB) ? 1 : -1));

const fetchPokemonData = async (pokemon: BasicPokemon) => {
  const res = await fetch(dataUrlForPokemon(pokemon.name));
  const content = await res.json();

  return pokemonFromDataJson(pokemon, content);
};

export const useBasicPokemons = () => useMemo(() => allPokemon(), []);

export const useBasicPokemon = (id: string) =>
  useMemo(() => allPokemon().find((pokemon) => pokemon.id === id), [id]);

export const usePokemonQuery = (pokemon: BasicPokemon) => {
  const fetchPokemon = useCallback(() => fetchPokemonData(pokemon), [pokemon]);
  return useQuery(`pokemon-${pokemon.id}`, fetchPokemon);
};

export const PokemonImage: ComponentType<
  {
    pokemon: BasicPokemon;
  } & Omit<ComponentProps<"img">, "alt" | "src">
> = ({ pokemon, ...props }) => {
  const link = useMemo(() => imageUrlForPokemon(pokemon.id), [pokemon]);
  return <img alt={pokemon.name} src={link} {...props} />;
};
