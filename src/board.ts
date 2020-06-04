export enum BoardSpace {
  X = "X",
  O = "O",
  Empty = ".",
}

export enum GameResult {
  WinX,
  WinO,
  Tie,
  Incomplete,
}

export class Board {
  private readonly cols = 3;
  private readonly rows = 3;
  private readonly visual_cache = new Map<string, string>();
  private readonly result_cache = new Map<string, GameResult>();

  spaces: BoardSpace[] = this.createSpaces();

  set(row: number, col: number, team: BoardSpace) {
    const i = row * 3 + col;

    this.spaces[i] = team;
  }

  setByIndex(index: number, team: BoardSpace) {
    this.spaces[index] = team;
  }

  reset() {
    this.spaces = this.createSpaces();
  }

  key() {
    return this.spaces.join("");
  }

  create_visual(): string {
    const key = this.key();

    if (this.visual_cache.has(key)) {
      return this.visual_cache.get(key) as string;
    }

    const visual = this.spaces.reduce((b, team, i) => {
      if (!(i % 3)) {
        b += "\n";
      }

      b += team + " ";

      return b;
    }, "");

    this.visual_cache.set(key, visual);

    return visual;
  }

  determine_result(): GameResult {
    const squares = this.spaces;
    const key = this.key();

    if (this.result_cache.has(key)) {
      return this.result_cache.get(key) as GameResult;
    }

    let result: GameResult = GameResult.Incomplete;

    if (this.checkBoard(0, 1, 2)) {
      // row 1
      result = this.boardSpaceToResult(squares[0]);
    } else if (this.checkBoard(3, 4, 5)) {
      // row 2
      result = this.boardSpaceToResult(squares[3]);
    } else if (this.checkBoard(6, 7, 8)) {
      // row3
      result = this.boardSpaceToResult(squares[6]);
    } else if (this.checkBoard(0, 3, 6)) {
      // col 1
      result = this.boardSpaceToResult(squares[0]);
    } else if (this.checkBoard(1, 4, 7)) {
      // col 2
      result = this.boardSpaceToResult(squares[1]);
    } else if (this.checkBoard(2, 5, 8)) {
      // col 3
      result = this.boardSpaceToResult(squares[2]);
    } else if (this.checkBoard(0, 4, 8)) {
      // Diagonal top-left > bottom-right
      result = this.boardSpaceToResult(squares[0]);
    } else if (this.checkBoard(2, 4, 6)) {
      // Diagonal top-right > bottom-left
      result = this.boardSpaceToResult(squares[2]);
    } else if (squares.every((square) => square !== BoardSpace.Empty)) {
      // Every space is full and no winner was found above
      result = GameResult.Tie;
    }

    this.result_cache.set(key, result);

    return result;
  }

  private boardSpaceToResult(space: BoardSpace): GameResult {
    switch (space) {
      case BoardSpace.X:
        return GameResult.WinX;

      case BoardSpace.O:
        return GameResult.WinO;

      case BoardSpace.Empty:
        return GameResult.Incomplete;
    }
  }

  private createSpaces() {
    return new Array(this.cols * this.rows).fill(BoardSpace.Empty);
  }

  private checkBoard(first: number, second: number, third: number): boolean {
    const squares = this.spaces;

    return (
      squares[first] !== BoardSpace.Empty &&
      squares[second] !== BoardSpace.Empty &&
      squares[third] !== BoardSpace.Empty &&
      squares[first] === squares[second] &&
      squares[second] === squares[third]
    );
  }
}
