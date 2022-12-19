import {
  Box,
  Collapse,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Pagination,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { ComponentProps, useCallback, useMemo, useState } from "react";
import { useBoolean, useEvent } from "react-use";

import { PageView } from "../components/PageView";
import { SearchBar } from "../components/SearchBar";
import { useArrayPagination } from "../lib/hooks/useArrayPagination";
import { useCounter } from "../lib/hooks/useCounter";
import { moves, useMoveQuery } from "../models/moves";
import { TypeImg } from "../models/pokemonTypes";
import { ComponentType } from "../types/ComponentType";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import CloseIcon from "@mui/icons-material/Close";

import { Outlet, useNavigate, useParams } from "react-router-dom";

const MoveRow: ComponentType<{
  move: string;
  dialogMode?: boolean;
}> = ({ move, dialogMode = false }) => {
  const [open, toggleOpen] = useBoolean(false);
  const { data: moveData } = useMoveQuery(move);

  const isMdBreakpoint = useMediaQuery((theme) =>
    (theme as any).breakpoints.down("md")
  );

  const showContent = open || dialogMode;

  if (!moveData) return <></>;

  return !isMdBreakpoint ? (
    <>
      <TableRow sx={{ "& td": { borderBottom: "unset" } }}>
        {!dialogMode && (
          <TableCell>
            <IconButton onClick={() => toggleOpen()}>
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
        )}
        {!dialogMode && <TableCell>{moveData.name}</TableCell>}
        <TableCell>
          {moveData.power.length > 0 ? moveData.power.join(" / ") : "N/A"}
        </TableCell>
        <TableCell>{moveData.time}</TableCell>
        <TableCell>{moveData.duration}</TableCell>
        <TableCell>{moveData.range}</TableCell>
        <TableCell>{moveData.pp}</TableCell>
        <TableCell>
          <TypeImg type={moveData.type.toLowerCase()} />
        </TableCell>
      </TableRow>

      <TableRow sx={{ margin: "0" }}>
        {!dialogMode && <TableCell sx={{ padding: "0" }} />}
        <TableCell
          colSpan={7}
          sx={{ transition: "200ms", ...(showContent ? {} : { padding: "0" }) }}
        >
          <Collapse in={showContent}>
            <Typography
              sx={
                Boolean(moveData.scalingDescription)
                  ? { marginBottom: "15px" }
                  : {}
              }
            >
              {moveData.description}
            </Typography>
            {moveData.scalingDescription ? (
              <Typography>{moveData.scalingDescription}</Typography>
            ) : null}
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  ) : (
    <>
      {!dialogMode && (
        <TableRow
          sx={{ "& td": { borderBottom: "unset" } }}
          onClick={() => toggleOpen()}
        >
          <TableCell>{moveData.name}</TableCell>
          <TableCell align="right">
            <TypeImg type={moveData.type.toLowerCase()} />
          </TableCell>
        </TableRow>
      )}

      <TableRow sx={{ margin: "0" }}>
        <TableCell
          colSpan={2}
          sx={{ transition: "200ms", ...(showContent ? {} : { padding: "0" }) }}
        >
          <Collapse in={showContent}>
            <TableContainer component={Paper} sx={{ marginBottom: "20px" }}>
              <Table>
                <TableBody>
                  {dialogMode && (
                    <TableRow>
                      <TableCell>Type</TableCell>
                      <TableCell align="right">
                        <TypeImg type={moveData.type.toLowerCase()} />
                      </TableCell>
                    </TableRow>
                  )}

                  <TableRow>
                    <TableCell>PP</TableCell>
                    <TableCell align="right">{moveData.pp}</TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell>Power</TableCell>
                    <TableCell align="right">
                      {moveData.power.length > 0
                        ? moveData.power.join(" / ")
                        : "N/A"}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell>Time</TableCell>
                    <TableCell align="right">{moveData.time}</TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell>Range</TableCell>
                    <TableCell align="right">{moveData.range}</TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell>Duration</TableCell>
                    <TableCell align="right">{moveData.duration}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>

            <Typography
              sx={
                Boolean(moveData.scalingDescription)
                  ? { marginBottom: "15px" }
                  : {}
              }
            >
              {moveData.description}
            </Typography>

            {moveData.scalingDescription ? (
              <Typography>{moveData.scalingDescription}</Typography>
            ) : null}
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

const MoveDialog: ComponentType<
  ComponentProps<typeof Dialog> & {
    onClose: () => void;
    move?: string;
    compact?: boolean;
  }
> = ({ onClose, open, move, compact, ...props }) => (
  <Dialog open={open && !!move} {...props}>
    <DialogTitle>
      <Typography>{move}</Typography>
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

    {!!move && (
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
        <Table>
          <TableHead>
            <TableRow>
              {!compact && (
                <>
                  <TableCell>Power</TableCell>
                  <TableCell>Time</TableCell>
                  <TableCell>Duration</TableCell>
                  <TableCell>Range</TableCell>
                  <TableCell>PP</TableCell>
                  <TableCell>Type</TableCell>
                </>
              )}
            </TableRow>
          </TableHead>

          <TableBody>
            <MoveRow move={move} dialogMode />
          </TableBody>
        </Table>
      </DialogContent>
    )}
  </Dialog>
);

export const MovesContent = () => {
  const ITEMS_PER_PAGE = 25;

  const [searchValue, setSearchValue] = useState("");

  const isMdBreakpoint = useMediaQuery((theme) =>
    (theme as any).breakpoints.down("md")
  );

  const searchMoves = useMemo(
    () =>
      moves.filter((move) =>
        move.toLowerCase().includes(searchValue.toLowerCase())
      ),
    [searchValue]
  );

  const pages = useMemo(
    () => Math.ceil(searchMoves.length / ITEMS_PER_PAGE),
    [searchMoves]
  );

  const {
    value: page,
    set: setPage,
    increment: nextPage,
    decrement: prevPage,
  } = useCounter(0, 0, pages - 1);

  const currentMoves = useArrayPagination(searchMoves, {
    perPage: ITEMS_PER_PAGE,
    currentPage: page,
  });

  const handleSearch = useCallback(
    (value: string) => {
      setSearchValue(value);
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

  useEvent("keydown", handleKeyPageNavigation);

  return (
    <PageView sx={{ paddingBlock: "20px" }}>
      <SearchBar label="Search by Name" onSearch={handleSearch} />

      <Table>
        <TableHead>
          <TableRow>
            {!isMdBreakpoint ? (
              <>
                <TableCell />
                <TableCell>Move</TableCell>
                <TableCell>Power</TableCell>
                <TableCell>Time</TableCell>
                <TableCell>Duration</TableCell>
                <TableCell>Range</TableCell>
                <TableCell>PP</TableCell>
                <TableCell>Type</TableCell>
              </>
            ) : (
              <>
                <TableCell>Move</TableCell>
                <TableCell align="right">Type</TableCell>
              </>
            )}
          </TableRow>
        </TableHead>

        <TableBody>
          {currentMoves.map((move) => (
            <MoveRow key={move} move={move} />
          ))}
        </TableBody>

        <TableFooter>
          <TableRow>
            <TableCell align="center" colSpan={8}>
              <Box display="flex" justifyContent="center">
                <Pagination
                  count={pages}
                  page={page + 1}
                  onChange={(_e, pageNumber) => setPage(pageNumber - 1)}
                />
              </Box>
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </PageView>
  );
};

export const MoveDetailsPage = () => {
  const navigate = useNavigate();
  const { move: uriMove } = useParams();

  const isMdBreakpoint = useMediaQuery((theme) =>
    (theme as any).breakpoints.down("md")
  );

  const move = useMemo(() => uriMove && decodeURI(uriMove), [uriMove]);

  return (
    <MoveDialog
      maxWidth="md"
      fullWidth
      move={move}
      onClose={() => navigate("/moves")}
      compact={isMdBreakpoint}
      open
    />
  );
};

export const MovesPage = () => (
  <>
    <MovesContent />
    <Outlet />
  </>
);
