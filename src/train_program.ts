import { Board, BoardSpace, GameResult } from "./board.ts";
import { BotBrain, Bot } from "./bot.ts";
import { Io } from "./io.ts";

export class TrainProgram {
  private board = new Board();
  private brain_a = new BotBrain("bot_a_brain.json", this.io);
  private brain_b = new BotBrain("bot_b_brain.json", this.io);
  private bot_x = new Bot(this.board, BoardSpace.X, this.brain_a);
  private bot_o = new Bot(this.board, BoardSpace.O, this.brain_b);
  private xWins = 0;
  private oWins = 0;
  private catWins = 0;
  private iterations = 5000000;

  constructor(private io: Io) {}

  run() {
    for (let i = 0; i < this.iterations; i++) {
      // have bots play one game
      let result = this.play(this.bot_x);

      // check result, tally and reinforce bot behavior
      switch (result) {
        case GameResult.WinX:
          this.xWins += 1;

          this.bot_x.learn(true);
          this.bot_o.learn(false);

          break;

        case GameResult.WinO:
          this.oWins += 1;

          this.bot_x.learn(false);
          this.bot_o.learn(true);

          break;

        case GameResult.Tie:
          this.catWins += 1;

          break;
      }

      if (i % 100000 === 0) {
        this.create_visual(`Game ${i + 1} `);
      } else if (i === this.iterations - 1) {
        this.create_visual("FINAL");
      }

      this.board.reset();
      this.bot_x.reset();
      this.bot_o.reset();

      // switch brains around every million games
      if ((i + 1) % 1000000 === 0 && i !== this.iterations - 1) {
        this.io.log("=========== SWITCHING BRAINS ============== \n");

        this.bot_x.brain =
          this.bot_x.brain === this.brain_a ? this.brain_b : this.brain_a;

        this.bot_o.brain =
          this.bot_o.brain === this.brain_a ? this.brain_b : this.brain_a;

        console.log(
          `Brain A is ${this.bot_x.brain === this.brain_a ? "X" : "O"}`
        );

        console.log(
          `Brain B is ${this.bot_o.brain === this.brain_a ? "X" : "O"}`
        );
      }
    }

    this.bot_x.memorize();
    this.bot_o.memorize();
  }

  private play(bot: Bot): GameResult {
    const winner = this.board.determine_result();

    if (winner !== GameResult.Incomplete) {
      return winner;
    }

    const move = bot.determine_move();

    if (!move) {
      throw new Error(
        `Bot ${
          bot.team
        } was unable to find a move in: \n ${this.board.create_visual()}`
      );
    }

    bot.make_move(move);

    return this.play(bot.team === BoardSpace.X ? this.bot_o : this.bot_x);
  }

  private create_visual(value: string): void {
    this.io.log(" ");
    this.io.log(`=========== ${value} ==============`);

    this.io.log(this.board.create_visual() + "\n");

    this.io.log("X:    ", this.xWins);
    this.io.log("O:    ", this.oWins);
    this.io.log("DRAW: ", this.catWins);
  }
}
