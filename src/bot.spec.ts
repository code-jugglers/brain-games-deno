import { assertEquals } from "./deps_testing.ts";
import { Bot, BotBrain, Move } from "./bot.ts";
import { Board, BoardSpace } from "./board.ts";

const { test } = Deno;

test("should remember the moves it makes in a game", () => {
  const bot = new Bot(new Board(), BoardSpace.X, new BotBrain());

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
  class MockBotBrain implements BotBrain {
    savedFile = "hello-world.json";
    gameStates: Record<string, Move[]> = {};
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
