import { readJsonSync, writeJsonSync } from "./deps.ts";
import { Board, BoardSpace } from "./board.ts";

export class GameHistoryMove {
  constructor(
    public move: RememberedMove,
    public team: BoardSpace,
    public boardKey: string
  ) {}
}

export class RememberedMove {
  constructor(public index: number, public count: number) {}
}

export class BotBrain {
  gameStates: Record<string, RememberedMove[]>;

  constructor(public savedFile: string = `bot_${Date.now()}.json`) {
    try {
      this.gameStates = readJsonSync(this.savedFile) as Record<
        string,
        RememberedMove[]
      >;
    } catch {
      this.gameStates = {};
    }
  }

  memorize(): void {
    writeJsonSync(this.savedFile, this.gameStates);
  }
}

export class Bot {
  public game_history: GameHistoryMove[] = [];

  constructor(
    private board: Board,
    public team: BoardSpace.X | BoardSpace.O,
    public brain: BotBrain
  ) {}

  reset(board: Board) {
    this.board = board;

    this.game_history = [];
  }

  determineMove(): RememberedMove | null {
    // based on probability, select the best available move for the given team
    const memory = this.brain.gameStates[this.board.key()];
    const availMoves = memory ? memory : this.getAvailableMoves();

    // If the brain hasn't seen this board state before, save it
    if (!memory) {
      this.brain.gameStates[this.board.key()] = availMoves;
    }

    return this.pickRandomPercentage(availMoves);
  }

  pickRandomPercentage(counts: Array<RememberedMove>): RememberedMove | null {
    const total = counts.reduce((s, m) => s + m.count, 0);

    let random = Math.floor(Math.random() * total) + 1; // Random inclusive between 1 and total
    let move: RememberedMove;

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

  makeMove(move: RememberedMove): void {
    this.game_history.push(
      new GameHistoryMove(move, this.team, this.board.key())
    );

    this.board.setByIndex(move.index, this.team);
  }

  learn(didIWin: boolean) {
    for (let move of this.game_history) {
      let moves = this.brain.gameStates[move.boardKey];

      const current = moves.find((brainMove) => {
        return brainMove.index === move.move.index;
      });

      if (!current) {
        throw new Error(
          "There was a problem learning. It looks like the bot is trying to remember a move that does not exist"
        );
      }

      current.count += didIWin ? 3 : -1;

      if (moves.every((move) => move.count === 0)) {
        moves.forEach((move: RememberedMove) => {
          move.count = 3;
        });
      }
    }
  }

  memorize() {
    this.brain.memorize();
  }

  getAvailableMoves(): RememberedMove[] {
    const length = this.board.spaces.length;
    const moves: RememberedMove[] = [];

    for (let i = 0; i < length; i++) {
      if (this.board.spaces[i] === BoardSpace.Empty) {
        moves.push(new RememberedMove(i, 3));
      }
    }

    return moves;
  }
}
