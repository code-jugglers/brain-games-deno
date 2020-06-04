import { Board, BoardSpace, GameResult } from "./board.ts";
import { Bot, BotBrain } from "./bot.ts";

export class PlayProgram {
  private bot: Bot = new Bot(
    this.board,
    this.bot_team,
    new BotBrain("bot_a_brain.json")
  );

  constructor(
    public board: Board,
    public player_team: BoardSpace.X | BoardSpace.O,
    public bot_team: BoardSpace.X | BoardSpace.O
  ) {}

  async play(current_player: BoardSpace) {
    console.log(this.board.create_visual());
    console.log(" ");

    const result = this.board.determine_result();

    if (result !== GameResult.Incomplete) {
      if (result === GameResult.Tie) {
        console.log("It is a TIE!");
      } else {
        console.log(`${result === GameResult.WinX ? "X" : "O"} Wins!`);
      }

      return;
    }

    if (current_player === this.player_team) {
      const move = await this.getUserMove();

      this.board.set(move[1], move[0], this.player_team);
    } else {
      const move = this.bot.determine_move();

      if (move) {
        this.board.setByIndex(move.index, this.bot_team);
      }
    }

    this.play(current_player === BoardSpace.X ? BoardSpace.O : BoardSpace.X);
  }

  async getUserMove(): Promise<number[]> {
    await Deno.stdout.write(
      new TextEncoder().encode("Make your move (col,row): ")
    );

    const buf = new Uint8Array(1024);
    const n = <number>await Deno.stdin.read(buf);
    const answer = new TextDecoder().decode(buf.subarray(0, n));

    return answer.split(",").map(Number);
  }
}

await Deno.stdout.write(
  new TextEncoder().encode("Would you like to be X or O? (X): ")
);

const buf = new Uint8Array(1024);
const n = <number>await Deno.stdin.read(buf);
const answer = new TextDecoder()
  .decode(buf.subarray(0, n))
  .toUpperCase()
  .trim();

let program = new PlayProgram(new Board(), BoardSpace.X, BoardSpace.O);

if (answer === "O") {
  console.log(`You will be O. Good Luck.`);

  program.player_team = BoardSpace.O;
  program.bot_team = BoardSpace.X;
} else {
  console.log(`You will be X. Good Luck.`);
}

program.play(BoardSpace.X);
