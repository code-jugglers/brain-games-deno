import { readJsonSync, writeJsonSync } from "./deps.ts";
import { Board, BoardSpace } from "./board.ts";

export class HistoricalMove {
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

  constructor(public savedFile: string = `bot_${Date.now()}.json`) {
    try {
      this.gameStates = readJsonSync(this.savedFile) as Record<string, Move[]>;
    } catch {
      this.gameStates = {};
    }
  }

  memorize(): void {
    writeJsonSync(this.savedFile, this.gameStates);
  }
}

export class Bot {
  public game_history: HistoricalMove[] = [];

  constructor(
    private board: Board,
    public team: BoardSpace.X | BoardSpace.O,
    public brain: BotBrain
  ) {}

  reset(board: Board) {
    this.board = board;

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
    this.game_history.push(
      new HistoricalMove(move, this.team, this.board.key())
    );

    this.board.setByIndex(move.index, this.team);
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

      current.count += didIWin ? 3 : -1;

      if (didIWin && i === this.game_history.length - 1) {
        current.count += 100;
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
