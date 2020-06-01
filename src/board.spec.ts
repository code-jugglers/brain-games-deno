import { assertEquals } from "https://deno.land/std/testing/asserts.ts";

import { Board, BoardSpace } from "./board.ts";

Deno.test("should initialize with an empty board", () => {
  const board = new Board();

  assertEquals(board.spaces, [".", ".", ".", ".", ".", ".", ".", ".", "."]);
  assertEquals(board.key(), ".........");
});

Deno.test("should set a space on the board based on row and column", () => {
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

Deno.test("should set a space on the board based on an index", () => {
  const board = new Board();

  board.setByIndex(0, BoardSpace.X);
  board.setByIndex(1, BoardSpace.O);

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

Deno.test("x should win on top row", () => {
  const board = new Board();

  board.set(0, 0, BoardSpace.X);
  board.set(0, 1, BoardSpace.X);
  board.set(0, 2, BoardSpace.X);

  assertEquals(board.determineWinner(), BoardSpace.X);
});

Deno.test("x should win on the middle row", () => {
  const board = new Board();

  board.set(1, 0, BoardSpace.X);
  board.set(1, 1, BoardSpace.X);
  board.set(1, 2, BoardSpace.X);

  assertEquals(board.determineWinner(), BoardSpace.X);
});

Deno.test("x should win on the bottom row", () => {
  const board = new Board();

  board.set(2, 0, BoardSpace.X);
  board.set(2, 1, BoardSpace.X);
  board.set(2, 2, BoardSpace.X);

  assertEquals(board.determineWinner(), BoardSpace.X);
});

Deno.test("x should win diagonally R -> L", () => {
  const board = new Board();

  board.set(0, 0, BoardSpace.X);
  board.set(1, 1, BoardSpace.X);
  board.set(2, 2, BoardSpace.X);

  assertEquals(board.determineWinner(), BoardSpace.X);
});

Deno.test("x should win diagonally L -> R", () => {
  const board = new Board();

  board.set(0, 2, BoardSpace.X);
  board.set(1, 1, BoardSpace.X);
  board.set(2, 0, BoardSpace.X);

  assertEquals(board.determineWinner(), BoardSpace.X);
});
