import { Board, BoardSpace } from "./board.ts";
import { Io } from "./io.ts";

export class HistoryEntry {
  constructor(
    public move: Move,
    public team: BoardSpace,
    public boardKey: string
  ) {}
}

export class Move {
  constructor(public index: number, public count: number) {}
}

export class BotBrain {
  gameStates: Record<string, Move[]>;

  constructor(
    public savedFile: string = `bot_${Date.now()}.json`,
    private io: Io
  ) {
    try {
      this.gameStates = this.io.readJsonSync<Record<string, Move[]>>(
        this.savedFile
      );
    } catch {
      this.gameStates = {};
    }
  }

  memorize(): void {
    this.io.writeJsonSync(this.savedFile, this.gameStates);
  }
}

export class Bot {
  public game_history: HistoryEntry[] = [];

  constructor(
    private board: Board,
    public team: BoardSpace.X | BoardSpace.O,
    public brain: BotBrain
  ) {}

  reset() {
    this.game_history = [];
  }

  determine_move(): Move | null {
    // based on probability, select the best available move for the given team
    const memory = this.brain.gameStates[this.board.key()];
    const availMoves = memory ? memory : this.get_available_moves();

    // If the brain hasn't seen this board state before, save it
    if (!memory) {
      this.brain.gameStates[this.board.key()] = availMoves;
    }

    return this.pick_random_percentage(availMoves);
  }

  pick_random_percentage(counts: Move[]): Move | null {
    const total = counts.reduce((s, m) => s + m.count, 0);

    let random = Math.floor(Math.random() * total) + 1; // Random inclusive between 1 and total
    let move: Move;

    for (let i = 0; i < counts.length; i++) {
      move = counts[i];

      if (move.count == 0) {
        continue;
      }

      if (random <= move.count) {
        return move;
      }

      random = random - move.count;
    }

    return null;
  }

  make_move(move: Move): void {
    this.game_history.push(new HistoryEntry(move, this.team, this.board.key()));

    this.board.set_by_index(move.index, this.team);
  }

  learn(didIWin: boolean) {
    for (let i = 0; i < this.game_history.length; i++) {
      let move = this.game_history[i];
      let moves = this.brain.gameStates[move.boardKey];

      const current = moves.find(
        (brainMove) => brainMove.index === move.move.index
      );

      if (!current) {
        throw new Error(
          "There was a problem learning. It looks like the bot is trying to remember a move that does not exist"
        );
      }

      if (didIWin) {
        const isLastMove = i === this.game_history.length - 1;

        // If the bot won that means the last move it made was the winning move
        current.count += isLastMove ? 100 : 3;
      } else {
        current.count -= 1;
      }

      // Don't let the bot die
      if (moves.every((move) => move.count === 0)) {
        moves.forEach((move: Move) => {
          move.count = 3;
        });
      }
    }
  }

  memorize() {
    this.brain.memorize();
  }

  get_available_moves(): Move[] {
    const length = this.board.spaces.length;
    const moves: Move[] = [];

    for (let i = 0; i < length; i++) {
      if (this.board.spaces[i] === BoardSpace.Empty) {
        moves.push(new Move(i, 3));
      }
    }

    return moves;
  }
}
