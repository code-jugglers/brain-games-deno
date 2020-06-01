import { Board, BoardSpace } from "./board.ts";
import { Bot, BotBrain } from "./bot.ts";

let board = new Board();
let engineX = new Bot(board, BoardSpace.X, new BotBrain("team_x_brain.json"));
let engineO = new Bot(board, BoardSpace.O, new BotBrain("team_o_brain.json"));

let xWins = 0;
let oWins = 0;
let catWins = 0;

const iterations = 3000000;

for (let i = 0; i < iterations; i++) {
  let winner = train(engineX);

  switch (winner) {
    case BoardSpace.X:
      xWins += 1;
      break;

    case BoardSpace.O:
      oWins += 1;
      break;

    case BoardSpace.Empty:
      catWins += 1;
      break;
  }

  engineX.learn(winner);
  engineO.learn(winner);

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

  board = new Board();
  engineX.reset(board);
  engineO.reset(board);
}

engineX.memorize();
engineO.memorize();

function train(bot: Bot): BoardSpace {
  const winner = board.determineWinner();

  if (winner !== BoardSpace.Empty) {
    return winner;
  }

  const move = bot.determineMove();

  if (move) {
    bot.makeMove(move);
  } else {
    return winner;
  }

  return train(bot.team === BoardSpace.X ? engineO : engineX);
}
