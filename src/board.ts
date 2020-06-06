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

  spaces: BoardSpace[] = this.create_spaces();

  set(row: number, col: number, team: BoardSpace) {
    const i = row * 3 + col;

    this.spaces[i] = team;
  }

  set_by_index(index: number, team: BoardSpace) {
    this.spaces[index] = team;
  }

  reset() {
    this.spaces = this.create_spaces();
  }

  key() {
    return this.spaces.join("");
  }

  create_visual(): string {
    const key = this.key();

    if (this.visual_cache.has(key)) {
      return this.visual_cache.get(key) as string;
    }

    const visual = this.generate_visual();

    this.visual_cache.set(key, visual);

    return visual;
  }

  determine_result(): GameResult {
    const key = this.key();

    if (this.result_cache.has(key)) {
      return this.result_cache.get(key) as GameResult;
    }

    let result: GameResult = this.find_result();

    this.result_cache.set(key, result);

    return result;
  }

  private generate_visual(): string {
    return this.spaces.reduce((b, team, i) => {
      if (!(i % 3)) {
        b += "\n";
      }

      b += team + " ";

      return b;
    }, "");
  }

  private find_result(): GameResult {
    let result: GameResult = GameResult.Incomplete;

    if (this.check_board(0, 1, 2)) {
      // row 1
      result = this.board_space_to_result(this.spaces[0]);
    } else if (this.check_board(3, 4, 5)) {
      // row 2
      result = this.board_space_to_result(this.spaces[3]);
    } else if (this.check_board(6, 7, 8)) {
      // row3
      result = this.board_space_to_result(this.spaces[6]);
    } else if (this.check_board(0, 3, 6)) {
      // col 1
      result = this.board_space_to_result(this.spaces[0]);
    } else if (this.check_board(1, 4, 7)) {
      // col 2
      result = this.board_space_to_result(this.spaces[1]);
    } else if (this.check_board(2, 5, 8)) {
      // col 3
      result = this.board_space_to_result(this.spaces[2]);
    } else if (this.check_board(0, 4, 8)) {
      // Diagonal top-left > bottom-right
      result = this.board_space_to_result(this.spaces[0]);
    } else if (this.check_board(2, 4, 6)) {
      // Diagonal top-right > bottom-left
      result = this.board_space_to_result(this.spaces[2]);
    } else if (this.spaces.every((space) => space !== BoardSpace.Empty)) {
      // Every space is full and no winner was found above
      result = GameResult.Tie;
    }

    return result;
  }

  private board_space_to_result(space: BoardSpace): GameResult {
    switch (space) {
      case BoardSpace.X:
        return GameResult.WinX;

      case BoardSpace.O:
        return GameResult.WinO;

      case BoardSpace.Empty:
        return GameResult.Incomplete;
    }
  }

  private create_spaces() {
    return new Array(this.cols * this.rows).fill(BoardSpace.Empty);
  }

  private check_board(first: number, second: number, third: number): boolean {
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
