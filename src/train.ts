import { Board, BoardSpace, GameResult } from "./board.ts";
import { Bot, BotBrain } from "./bot.ts";

const board = new Board();
const brain_a = new BotBrain("bot_a_brain.json");
const brain_b = new BotBrain("bot_b_brain.json");
const bot_x = new Bot(board, BoardSpace.X, brain_a);
const bot_o = new Bot(board, BoardSpace.O, brain_b);

let xWins = 0;
let oWins = 0;
let catWins = 0;

const iterations = 5000000;

for (let i = 0; i < iterations; i++) {
  let winner = train(bot_x);

  switch (winner) {
    case GameResult.WinX:
      xWins += 1;

      bot_x.learn(true);
      bot_o.learn(false);

      break;

    case GameResult.WinO:
      oWins += 1;

      bot_x.learn(false);
      bot_o.learn(true);

      break;

    case GameResult.Tie:
      catWins += 1;

      break;
  }

  if (i % 10000 === 0) {
    console.log(" ");
    console.log(`=========== Game ${i + 1} ==============`);

    console.log(board.createVisual());

    console.log("X:    ", xWins);
    console.log("O:    ", oWins);
    console.log("DRAW: ", catWins);
  } else if (i === iterations - 1) {
    console.log(" ");
    console.log("=========== FINAL ==============");

    console.log(board.createVisual());

    console.log("X:    ", xWins);
    console.log("O:    ", oWins);
    console.log("DRAW: ", catWins);
  }

  board.reset();
  bot_x.reset(board);
  bot_o.reset(board);

  // switch brains half way through. This makes sure brains play both X and O
  if (i === iterations / 2) {
    console.log("=========== SWITCHING BRAINS ==============");

    bot_x.brain = brain_b;
    bot_o.brain = brain_a;
  }
}

bot_x.memorize();
bot_o.memorize();

function train(bot: Bot): GameResult {
  const winner = board.determineResult();

  if (winner !== GameResult.Incomplete) {
    return winner;
  }

  const move = bot.determineMove();

  if (move) {
    bot.makeMove(move);
  } else {
    return winner;
  }

  return train(bot.team === BoardSpace.X ? bot_o : bot_x);
}
