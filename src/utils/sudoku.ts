export function generateSudoku(emptyCount: number) {
  // 9x9 array
  let board = Array.from({length: 9}, () => Array(9).fill(0));
  
  function isValid(board: number[][], row: number, col: number, num: number) {
    for (let i = 0; i < 9; i++) {
      if (board[row][i] === num) return false;
      if (board[i][col] === num) return false;
      let boxRow = 3 * Math.floor(row / 3) + Math.floor(i / 3);
      let boxCol = 3 * Math.floor(col / 3) + (i % 3);
      if (board[boxRow][boxCol] === num) return false;
    }
    return true;
  }
  
  function solve(board: number[][]) {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === 0) {
          // Shuffle numbers 1-9 to randomize generation
          const nums = [1,2,3,4,5,6,7,8,9].sort(() => Math.random() - 0.5);
          for (let n of nums) {
            if (isValid(board, row, col, n)) {
              board[row][col] = n;
              if (solve(board)) return true;
              board[row][col] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  }
  
  solve(board);
  
  // Make a copy of the solution
  const solution = board.map(r => [...r]);
  
  // Remove numbers randomly
  let removed = 0;
  while (removed < emptyCount) {
    let r = Math.floor(Math.random() * 9);
    let c = Math.floor(Math.random() * 9);
    if (board[r][c] !== 0) {
      board[r][c] = 0;
      removed++;
    }
  }
  
  return { puzzle: board, solution };
}
