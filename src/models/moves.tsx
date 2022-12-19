import { useCallback } from "react";
import { useQuery } from "react-query";
import _moves from "../data/moves.json";
import { MOVE_DATA_PATH } from "../vars";

type MoveData = {
  name: string;
  power: string[];
  time: string;
  duration: string;
  range: string;
  pp: number;
  type: string;
  description: string;
  scalingDescription?: string;
};

export const moves = _moves as string[];

const moveUrl = (move: string) => MOVE_DATA_PATH.replace("{{name}}", move);

const moveFromDataJson = (move: string, moveData: any): MoveData => ({
  name: move,
  power: (moveData["Move Power"] || []) as string[],
  time: moveData["Move Time"] as string,
  duration: moveData["Duration"] as string,
  range: moveData["Range"] as string,
  pp: moveData["PP"] as number,
  type: moveData["Type"] as string,
  description: (moveData["Description"] || "") as string,
  scalingDescription: moveData["Scaling"] as string | undefined,
});

const fetchMoveData = async (move: string) => {
  const res = await fetch(moveUrl(move));
  const content = await res.json();

  return moveFromDataJson(move, content);
};

export const useMoveQuery = (move: string) => {
  const fetchMove = useCallback(() => fetchMoveData(move), [move]);
  return useQuery(`move-${move}`, fetchMove, {
    cacheTime: 30 * 60 * 1000,
  });
};
