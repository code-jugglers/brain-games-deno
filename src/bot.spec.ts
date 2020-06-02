import { assertEquals } from "./deps.ts";
import { Bot, BotBrain, RememberedMove } from "./bot.ts";
import { Board, BoardSpace } from "./board.ts";

Deno.test("should remember the moves it makes in a game", () => {
  class MockBotBrain implements BotBrain {
    savedFile = "hello-world.json";
    gameStates: Record<string, RememberedMove[]> = {};
    memorize() {}
  }
  const bot = new Bot(new Board(), BoardSpace.X, new MockBotBrain());

  bot.makeMove(bot.determineMove() as RememberedMove);
  bot.makeMove(bot.determineMove() as RememberedMove);
  bot.makeMove(bot.determineMove() as RememberedMove);

  assertEquals(bot.game_history.length, 3);

  bot.game_history.forEach((m) => {
    assertEquals(m.boardKey.length, 9);
    assertEquals(m.team, BoardSpace.X);
  });
});

Deno.test("should remember the initial moves it makes", () => {
  class MockBotBrain implements BotBrain {
    savedFile = "hello-world.json";
    gameStates: Record<string, RememberedMove[]> = {};
    memorize() {
      assertEquals(this.gameStates["........."].length, 9);

      this.gameStates["........."].forEach((m) => {
        assertEquals(m.count, 3);
      });
    }
  }

  const bot = new Bot(new Board(), BoardSpace.X, new MockBotBrain());

  bot.makeMove(bot.determineMove() as RememberedMove);
  bot.memorize();
});
