import { resolve } from "https://deno.land/std@0.51.0/path/mod.ts";

import { Board, BoardSpace } from "./board.ts";
import { Bot } from "./bot.ts";

export class PlayProgram {
  private bot: Bot = new Bot(this.board, BoardSpace.O, "team_o_brain.json");

  constructor(public board: Board) {
    this.play(BoardSpace.X);
  }

  async play(currentPlayer: BoardSpace) {
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
    }

    if (currentPlayer === BoardSpace.X) {
      const move = await this.getUserMove();

      this.board.set(move[1], move[0], BoardSpace.X);
    } else {
      const move = this.bot.determineMove();

      if (move) {
        this.board.setByIndex(move.index, BoardSpace.O);
      }
    }

    this.play(currentPlayer === BoardSpace.X ? BoardSpace.O : BoardSpace.X);
  }

  async getUserMove(): Promise<number[]> {
    await Deno.stdout.write(new TextEncoder().encode("Make your move: "));

    const buf = new Uint8Array(1024);
    const n = <number>await Deno.stdin.read(buf);
    const answer = new TextDecoder().decode(buf.subarray(0, n));

    return answer.split(",").map(Number);
  }
}

new PlayProgram(new Board());
