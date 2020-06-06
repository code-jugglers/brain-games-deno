import { assertEquals } from "https://deno.land/std@0.55.0/testing/asserts.ts";

import { Bot, BotBrain, Move } from "./bot.ts";
import { Board, BoardSpace } from "./board.ts";
import { Io } from "./io.ts";

const { test } = Deno;

test("should remember the moves it makes in a game", () => {
  const bot = new Bot(new Board(), BoardSpace.X, new BotBrain("", {} as Io));

  bot.make_move(bot.determine_move() as Move);
  bot.make_move(bot.determine_move() as Move);
  bot.make_move(bot.determine_move() as Move);

  assertEquals(bot.game_history.length, 3);

  bot.game_history.forEach((m) => {
    assertEquals(m.boardKey.length, 9);
    assertEquals(m.team, BoardSpace.X);
  });
});

test("should remember the initial moves it makes", () => {
  class MockBotBrain extends BotBrain {
    savedFile = "hello-world.json";
    gameStates: Record<string, Move[]> = {};

    constructor() {
      super("", {} as Io);
    }

    memorize() {
      assertEquals(this.gameStates["........."].length, 9);

      this.gameStates["........."].forEach((m) => {
        assertEquals(m.count, 3);
      });
    }
  }

  const bot = new Bot(new Board(), BoardSpace.X, new MockBotBrain());

  bot.make_move(bot.determine_move() as Move);
  bot.memorize();
});
