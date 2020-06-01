export enum BoardSpace {
  X = "X",
  O = "O",
  Empty = ".",
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

  determineWinner() {
    const squares = this.spaces;

    if (this.checkBoard(0, 1, 2)) {
      // row 1
      return squares[0];
    } else if (this.checkBoard(3, 4, 5)) {
      // row 2
      return squares[3];
    } else if (this.checkBoard(6, 7, 8)) {
      // row3
      return squares[6];
    } else if (this.checkBoard(0, 3, 6)) {
      // col 1
      return squares[0];
    } else if (this.checkBoard(1, 4, 7)) {
      // col 2
      return squares[1];
    } else if (this.checkBoard(2, 5, 8)) {
      // col 3
      return squares[2];
    } else if (this.checkBoard(0, 4, 8)) {
      // Diagonal top-left > bottom-right
      return squares[0];
    } else if (this.checkBoard(2, 4, 6)) {
      // Diagonal top-right > bottom-left
      return squares[2];
    } else if (squares.every((square) => square !== BoardSpace.Empty)) {
      return BoardSpace.Empty;
    }

    return BoardSpace.Empty;
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
