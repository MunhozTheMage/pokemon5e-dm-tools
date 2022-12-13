import { toPairs } from "remeda";
import _typeAffinities from "../data/types.json";

type TypeMultipliers = { [k: string]: number };

const typeAffinities = _typeAffinities as {
  name: string;
  immune: string[];
  weak: string[];
  resistant: string[];
}[];

export const types = [
  "normal",
  "fighting",
  "flying",
  "poison",
  "ground",
  "rock",
  "bug",
  "ghost",
  "steel",
  "fire",
  "water",
  "grass",
  "electric",
  "psychic",
  "ice",
  "dragon",
  "dark",
  "fairy",
];

export const typeImageUrl = (type: string) =>
  `${process.env.PUBLIC_URL}/${type}.png`;

export const getTypeAffinityModifiers = (type: string) => {
  const typeAffinity = typeAffinities.find(
    (currTypeAffinity) =>
      currTypeAffinity.name.toLowerCase() === type.toLowerCase()
  );

  const findModifier = (targetType: string) => {
    const lowerCaseTargetType = targetType.toLowerCase();
    const makeLowerCase = (list: string[]) => list.map((i) => i.toLowerCase());

    if (!typeAffinity) return 1;

    if (makeLowerCase(typeAffinity.immune).includes(lowerCaseTargetType))
      return 0;

    if (makeLowerCase(typeAffinity.resistant).includes(lowerCaseTargetType))
      return 0.5;

    if (makeLowerCase(typeAffinity.weak).includes(lowerCaseTargetType))
      return 2;

    return 1;
  };

  return types.reduce((obj, currType) => {
    return {
      ...obj,
      [currType]: findModifier(currType),
    };
  }, {} as TypeMultipliers);
};

export const multiplyTypes = (type1: string, type2?: string) => {
  const type1Mods = getTypeAffinityModifiers(type1);
  const type2Mods = type2 ? getTypeAffinityModifiers(type2) : undefined;

  console.log(type1Mods, type2Mods);

  return toPairs(type1Mods).reduce(
    (obj, [currType, modifier]) => ({
      ...obj,
      [currType]: modifier * ((type2Mods || {})[currType] || 1),
    }),
    {} as TypeMultipliers
  );
};

export const typeImmuneAgainst = (multipliers: TypeMultipliers) =>
  types.filter((type) => (multipliers[type] || 1) === 0);

export const typeWeakAgainst = (multipliers: TypeMultipliers) =>
  types.filter(
    (type) => (multipliers[type] || 1) !== 0 && (multipliers[type] || 1) > 1
  );

export const typeResistantAgainst = (multipliers: TypeMultipliers) =>
  types.filter(
    (type) => (multipliers[type] || 1) !== 0 && (multipliers[type] || 1) < 1
  );
