/* ==========================================================================
   Automation Arcade: Cyber Chess Engine
   Interactive 8x8 Chess with Automation Bot AI, Move Validation & Sound FX
   ========================================================================== */

(function () {
  'use strict';

  const boardEl = document.getElementById('chessBoard');
  if (!boardEl) return;

  const statusEl = document.getElementById('chessStatus');
  const resetBtn = document.getElementById('chessResetBtn');
  const aiToggleBtn = document.getElementById('chessAiToggleBtn');
  const capturedWhiteEl = document.getElementById('chessCapturedWhite');
  const capturedBlackEl = document.getElementById('chessCapturedBlack');

  // Initial standard board setup (Lowercase = Black, Uppercase = White)
  const initialBoard = [
    ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
    ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
    ['.', '.', '.', '.', '.', '.', '.', '.'],
    ['.', '.', '.', '.', '.', '.', '.', '.'],
    ['.', '.', '.', '.', '.', '.', '.', '.'],
    ['.', '.', '.', '.', '.', '.', '.', '.'],
    ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
    ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
  ];

  let board = JSON.parse(JSON.stringify(initialBoard));
  let turn = 'W'; // 'W' or 'B'
  let selectedSquare = null;
  let validMoves = [];
  let vsAi = true;
  let capturedWhite = [];
  let capturedBlack = [];

  const pieceSymbols = {
    'K': '♔', 'Q': '♕', 'R': '♖', 'B': '♗', 'N': '♘', 'P': '♙',
    'k': '♚', 'q': '♛', 'r': '♜', 'b': '♝', 'n': '♞', 'p': '♟'
  };

  const pieceValues = {
    'p': 10, 'n': 30, 'b': 30, 'r': 50, 'q': 90, 'k': 900,
    'P': 10, 'N': 30, 'B': 30, 'R': 50, 'Q': 90, 'K': 900
  };

  function isWhite(piece) {
    return piece !== '.' && piece === piece.toUpperCase();
  }

  function isBlack(piece) {
    return piece !== '.' && piece === piece.toLowerCase();
  }

  function getRawMoves(r, c, currentBoard) {
    const p = currentBoard[r][c];
    if (p === '.') return [];
    const moves = [];
    const white = isWhite(p);
    const forward = white ? -1 : 1;

    // Pawns
    if (p.toUpperCase() === 'P') {
      const startRow = white ? 6 : 1;
      const nextR = r + forward;
      if (nextR >= 0 && nextR < 8 && currentBoard[nextR][c] === '.') {
        moves.push([nextR, c]);
        if (r === startRow && currentBoard[r + 2 * forward][c] === '.') {
          moves.push([r + 2 * forward, c]);
        }
      }
      // Captures
      [-1, 1].forEach(dc => {
        const nextC = c + dc;
        if (nextR >= 0 && nextR < 8 && nextC >= 0 && nextC < 8) {
          const target = currentBoard[nextR][nextC];
          if (target !== '.' && (white ? isBlack(target) : isWhite(target))) {
            moves.push([nextR, nextC]);
          }
        }
      });
    }

    // Knights
    if (p.toUpperCase() === 'N') {
      const knightOffsets = [
        [-2, -1], [-2, 1], [-1, -2], [-1, 2],
        [1, -2], [1, 2], [2, -1], [2, 1]
      ];
      knightOffsets.forEach(([dr, dc]) => {
        const nr = r + dr;
        const nc = c + dc;
        if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
          const target = currentBoard[nr][nc];
          if (target === '.' || (white ? isBlack(target) : isWhite(target))) {
            moves.push([nr, nc]);
          }
        }
      });
    }

    // Kings
    if (p.toUpperCase() === 'K') {
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          const nr = r + dr;
          const nc = c + dc;
          if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
            const target = currentBoard[nr][nc];
            if (target === '.' || (white ? isBlack(target) : isWhite(target))) {
              moves.push([nr, nc]);
            }
          }
        }
      }
    }

    // Sliding pieces (Rook, Bishop, Queen)
    const dirs = [];
    if (p.toUpperCase() === 'R' || p.toUpperCase() === 'Q') {
      dirs.push([-1, 0], [1, 0], [0, -1], [0, 1]);
    }
    if (p.toUpperCase() === 'B' || p.toUpperCase() === 'Q') {
      dirs.push([-1, -1], [-1, 1], [1, -1], [1, 1]);
    }

    dirs.forEach(([dr, dc]) => {
      let nr = r + dr;
      let nc = c + dc;
      while (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
        const target = currentBoard[nr][nc];
        if (target === '.') {
          moves.push([nr, nc]);
        } else {
          if (white ? isBlack(target) : isWhite(target)) {
            moves.push([nr, nc]);
          }
          break;
        }
        nr += dr;
        nc += dc;
      }
    });

    return moves;
  }

  function renderBoard() {
    boardEl.innerHTML = '';
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const sq = document.createElement('div');
        const isLight = (r + c) % 2 === 0;
        sq.className = `chess-sq ${isLight ? 'sq-light' : 'sq-dark'}`;
        sq.dataset.r = r;
        sq.dataset.c = c;

        const piece = board[r][c];
        if (piece !== '.') {
          const pieceEl = document.createElement('span');
          pieceEl.className = `chess-piece ${isWhite(piece) ? 'piece-white' : 'piece-black'}`;
          pieceEl.textContent = pieceSymbols[piece];
          sq.appendChild(pieceEl);
        }

        // Highlight selected square
        if (selectedSquare && selectedSquare[0] === r && selectedSquare[1] === c) {
          sq.classList.add('is-selected');
        }

        // Highlight valid moves
        if (validMoves.some(([vr, vc]) => vr === r && vc === c)) {
          sq.classList.add('is-valid-move');
        }

        sq.addEventListener('click', () => handleSquareClick(r, c));
        boardEl.appendChild(sq);
      }
    }

    // Update captured pieces display
    if (capturedWhiteEl) capturedWhiteEl.textContent = capturedWhite.map(p => pieceSymbols[p]).join(' ');
    if (capturedBlackEl) capturedBlackEl.textContent = capturedBlack.map(p => pieceSymbols[p]).join(' ');

    // Update status
    if (statusEl) {
      if (turn === 'W') {
        statusEl.textContent = 'YOUR TURN (WHITE)';
        statusEl.style.color = 'var(--color-cyan)';
      } else {
        statusEl.textContent = vsAi ? 'ROBOT AI THINKING... (BLACK)' : 'BLACK TURN';
        statusEl.style.color = 'var(--color-amber)';
      }
    }
  }

  function handleSquareClick(r, c) {
    if (vsAi && turn === 'B') return; // AI's turn

    const clickedPiece = board[r][c];

    // If already selected, check if clicked square is a valid destination
    if (selectedSquare) {
      const isMove = validMoves.some(([vr, vc]) => vr === r && vc === c);
      if (isMove) {
        makeMove(selectedSquare[0], selectedSquare[1], r, c);
        selectedSquare = null;
        validMoves = [];
        renderBoard();

        if (vsAi && turn === 'B') {
          setTimeout(makeAiMove, 450);
        }
        return;
      }
    }

    // Select piece
    if (clickedPiece !== '.' && ((turn === 'W' && isWhite(clickedPiece)) || (turn === 'B' && isBlack(clickedPiece)))) {
      selectedSquare = [r, c];
      validMoves = getRawMoves(r, c, board);
      if (window.playCyberSound) window.playCyberSound('click');
    } else {
      selectedSquare = null;
      validMoves = [];
    }

    renderBoard();
  }

  function makeMove(fr, fc, tr, tc) {
    const movingPiece = board[fr][fc];
    const targetPiece = board[tr][tc];

    if (targetPiece !== '.') {
      if (isWhite(targetPiece)) capturedWhite.push(targetPiece);
      else capturedBlack.push(targetPiece);
      if (window.playCyberSound) window.playCyberSound('chess-capture');
    } else {
      if (window.playCyberSound) window.playCyberSound('chess-move');
    }

    board[tr][tc] = movingPiece;
    board[fr][fc] = '.';

    // Pawn Promotion to Queen
    if (movingPiece === 'P' && tr === 0) board[tr][tc] = 'Q';
    if (movingPiece === 'p' && tr === 7) board[tr][tc] = 'q';

    turn = turn === 'W' ? 'B' : 'W';
  }

  // Simple heuristic Automation Bot AI
  function makeAiMove() {
    const allBlackMoves = [];
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        if (isBlack(board[r][c])) {
          const moves = getRawMoves(r, c, board);
          moves.forEach(([tr, tc]) => {
            allBlackMoves.push({ fr: r, fc: c, tr, tc, target: board[tr][tc] });
          });
        }
      }
    }

    if (allBlackMoves.length === 0) {
      if (statusEl) statusEl.textContent = 'CHECKMATE! YOU WIN! 🏆';
      if (window.playCyberSound) window.playCyberSound('win');
      return;
    }

    // Score moves: prioritize captures by value
    allBlackMoves.sort((a, b) => {
      const valA = a.target !== '.' ? (pieceValues[a.target] || 0) : 0;
      const valB = b.target !== '.' ? (pieceValues[b.target] || 0) : 0;
      return (valB + (Math.random() * 5)) - (valA + (Math.random() * 5));
    });

    const bestMove = allBlackMoves[0];
    makeMove(bestMove.fr, bestMove.fc, bestMove.tr, bestMove.tc);
    renderBoard();
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      board = JSON.parse(JSON.stringify(initialBoard));
      turn = 'W';
      selectedSquare = null;
      validMoves = [];
      capturedWhite = [];
      capturedBlack = [];
      renderBoard();
      if (window.playCyberSound) window.playCyberSound('click');
    });
  }

  if (aiToggleBtn) {
    aiToggleBtn.addEventListener('click', () => {
      vsAi = !vsAi;
      aiToggleBtn.textContent = vsAi ? 'Mode: Vs Bot 🤖' : 'Mode: 2 Player 👥';
      if (window.playCyberSound) window.playCyberSound('click');
    });
  }

  renderBoard();
})();
