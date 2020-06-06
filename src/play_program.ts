import { Board, BoardSpace, GameResult } from "./board.ts";
import { Bot, BotBrain } from "./bot.ts";
import { Io } from "./io.ts";

export class PlayProgram {
  private board = new Board();
  private player_team: BoardSpace.X | BoardSpace.O = BoardSpace.X;
  private bot: Bot = new Bot(
    this.board,
    BoardSpace.O,
    new BotBrain("bot_a_brain.json", this.io)
  );

  constructor(private io: Io) {}

  async run(): Promise<void> {
    const answer = await this.io.prompt("Would you like to be X or O? (X): ");

    if (answer === "O") {
      this.io.log(`You will be O. Good Luck.`);

      this.player_team = BoardSpace.O;
      this.bot.team = BoardSpace.X;
    } else {
      this.io.log(`You will be X. Good Luck.`);
    }

    return this.play(BoardSpace.X);
  }

  async play(current_player: BoardSpace) {
    this.io.log(this.board.create_visual());
    this.io.log(" ");

    const result = this.board.determine_result();

    if (result !== GameResult.Incomplete) {
      if (result === GameResult.Tie) {
        this.io.log("It is a TIE!");
      } else {
        this.io.log(`${result === GameResult.WinX ? "X" : "O"} Wins!`);
      }

      return;
    }

    if (current_player === this.player_team) {
      const move = await this.getUserMove();

      this.board.set(move[1], move[0], this.player_team);
    } else {
      const move = this.bot.determine_move();

      if (move) {
        this.board.set_by_index(move.index, this.bot.team);
      }
    }

    this.play(current_player === BoardSpace.X ? BoardSpace.O : BoardSpace.X);
  }

  async getUserMove(): Promise<number[]> {
    const answer = await this.io.prompt("Make your move (col,row): ");

    return answer.split(",").map(Number);
  }
}
