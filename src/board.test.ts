import { assertEquals } from "https://deno.land/std@0.55.0/testing/asserts.ts";

import { Board, BoardSpace, GameResult } from "./board.ts";

const { test } = Deno;

test("should initialize with an empty board", () => {
  const board = new Board();

  assertEquals(board.spaces, [".", ".", ".", ".", ".", ".", ".", ".", "."]);
  assertEquals(board.key(), ".........");
});

test("should set a space on the board based on row and column", () => {
  const board = new Board();

  board.set(0, 0, BoardSpace.X);
  board.set(1, 1, BoardSpace.O);

  assertEquals(board.spaces, [
    BoardSpace.X,
    ".",
    ".",
    ".",
    BoardSpace.O,
    ".",
    ".",
    ".",
    ".",
  ]);

  assertEquals(board.key(), "X...O....");
});

test("should reset the board to empty", () => {
  const board = new Board();

  board.set_by_index(0, BoardSpace.X);
  board.set_by_index(1, BoardSpace.O);
  board.set_by_index(2, BoardSpace.X);

  board.reset();

  assertEquals(board.spaces, [".", ".", ".", ".", ".", ".", ".", ".", "."]);
  assertEquals(board.key(), ".........");
});

test("should set a space on the board based on an index", () => {
  const board = new Board();

  board.set_by_index(0, BoardSpace.X);
  board.set_by_index(1, BoardSpace.O);

  assertEquals(board.spaces, [
    BoardSpace.X,
    BoardSpace.O,
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
  ]);

  assertEquals(board.key(), "XO.......");
});

test("x should win on top row", () => {
  const board = new Board();

  board.set(0, 0, BoardSpace.X);
  board.set(0, 1, BoardSpace.X);
  board.set(0, 2, BoardSpace.X);

  assertEquals(board.determine_result(), GameResult.WinX);
});

test("x should win on the middle row", () => {
  const board = new Board();

  board.set(1, 0, BoardSpace.X);
  board.set(1, 1, BoardSpace.X);
  board.set(1, 2, BoardSpace.X);

  assertEquals(board.determine_result(), GameResult.WinX);
});

test("x should win on the bottom row", () => {
  const board = new Board();

  board.set(2, 0, BoardSpace.X);
  board.set(2, 1, BoardSpace.X);
  board.set(2, 2, BoardSpace.X);

  assertEquals(board.determine_result(), GameResult.WinX);
});

test("x should win diagonally R -> L", () => {
  const board = new Board();

  board.set(0, 0, BoardSpace.X);
  board.set(1, 1, BoardSpace.X);
  board.set(2, 2, BoardSpace.X);

  assertEquals(board.determine_result(), GameResult.WinX);
});

test("x should win diagonally L -> R", () => {
  const board = new Board();

  board.set(0, 2, BoardSpace.X);
  board.set(1, 1, BoardSpace.X);
  board.set(2, 0, BoardSpace.X);

  assertEquals(board.determine_result(), GameResult.WinX);
});
