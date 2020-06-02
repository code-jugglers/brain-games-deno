import { Board, BoardSpace } from "./board.ts";
import { Bot, BotBrain } from "./bot.ts";

export class PlayProgram {
  private bot: Bot = new Bot(
    this.board,
    BoardSpace.O,
    new BotBrain(`team_a_brain.json`.toLowerCase())
  );

  constructor(
    public board: Board,
    public player_team: BoardSpace,
    public bot_team: BoardSpace
  ) {}

  async play(current_player: BoardSpace) {
    console.log(this.board.createVisual());
    console.log(" ");

    const winner = this.board.determineWinner();

    if (winner !== BoardSpace.Empty) {
      await Deno.stdout.write(
        new TextEncoder().encode(`Team ${winner} Wins! \n`)
      );

      this.bot.learn(winner);

      this.bot.memorize();

      return;
    } else if (this.board.spaces.every((space) => space !== BoardSpace.Empty)) {
      await Deno.stdout.write(new TextEncoder().encode(`It is a TIE! \n`));

      return;
    }

    if (current_player === this.player_team) {
      const move = await this.getUserMove();

      this.board.set(move[1], move[0], this.player_team);
    } else {
      const move = this.bot.determineMove();

      if (move) {
        this.board.setByIndex(move.index, this.bot_team);
      }
    }

    this.play(
      current_player === this.player_team ? this.bot_team : this.player_team
    );
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

let program: PlayProgram;

if (answer === "O") {
  console.log(`You will be O. Good Luck.`);

  program = new PlayProgram(new Board(), BoardSpace.O, BoardSpace.X);
} else {
  console.log(`You will be X. Good Luck.`);

  program = new PlayProgram(new Board(), BoardSpace.X, BoardSpace.O);
}

program.play(BoardSpace.X);
