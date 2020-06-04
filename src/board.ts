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

  spaces: BoardSpace[] = new Array(this.cols * this.rows).fill(
    BoardSpace.Empty
  );

  set(row: number, col: number, team: BoardSpace) {
    const i = row * 3 + col;

    this.spaces[i] = team;
  }

  setByIndex(index: number, team: BoardSpace) {
    this.spaces[index] = team;
  }

  key() {
    return this.spaces.join("");
  }

  createVisual(): string {
    return this.spaces.reduce((b, team, i) => {
      if (!(i % 3)) {
        b += "\n";
      }

      b += team + " ";

      return b;
    }, "");
  }

  determineWinner(): GameResult {
    const squares = this.spaces;

    if (this.checkBoard(0, 1, 2)) {
      // row 1
      return this.boardSpaceToResult(squares[0]);
    } else if (this.checkBoard(3, 4, 5)) {
      // row 2
      return this.boardSpaceToResult(squares[3]);
    } else if (this.checkBoard(6, 7, 8)) {
      // row3
      return this.boardSpaceToResult(squares[6]);
    } else if (this.checkBoard(0, 3, 6)) {
      // col 1
      return this.boardSpaceToResult(squares[0]);
    } else if (this.checkBoard(1, 4, 7)) {
      // col 2
      return this.boardSpaceToResult(squares[1]);
    } else if (this.checkBoard(2, 5, 8)) {
      // col 3
      return this.boardSpaceToResult(squares[2]);
    } else if (this.checkBoard(0, 4, 8)) {
      // Diagonal top-left > bottom-right
      return this.boardSpaceToResult(squares[0]);
    } else if (this.checkBoard(2, 4, 6)) {
      // Diagonal top-right > bottom-left
      return this.boardSpaceToResult(squares[2]);
    } else if (squares.every((square) => square !== BoardSpace.Empty)) {
      // Every space is full and no winner was found above
      return GameResult.Tie;
    }

    return GameResult.Incomplete;
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
