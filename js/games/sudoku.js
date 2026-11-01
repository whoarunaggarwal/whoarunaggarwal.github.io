/* ==========================================================================
   Automation Arcade: Quantum Sudoku
   Interactive 9x9 Sudoku Grid with Multi-Difficulty Puzzles & Auto-Checker
   ========================================================================== */

(function () {
  'use strict';

  const gridEl = document.getElementById('sudokuGrid');
  if (!gridEl) return;

  const numpadEl = document.getElementById('sudokuNumpad');
  const timerEl = document.getElementById('sudokuTimer');
  const difficultyBtns = document.querySelectorAll('.sudoku-diff-btn');
  const checkBtn = document.getElementById('sudokuCheckBtn');
  const hintBtn = document.getElementById('sudokuHintBtn');
  const resetBtn = document.getElementById('sudokuResetBtn');

  // Pre-generated valid puzzles and solutions
  const puzzles = {
    easy: {
      initial: [
        5, 3, 0, 0, 7, 0, 0, 0, 0,
        6, 0, 0, 1, 9, 5, 0, 0, 0,
        0, 9, 8, 0, 0, 0, 0, 6, 0,
        8, 0, 0, 0, 6, 0, 0, 0, 3,
        4, 0, 0, 8, 0, 3, 0, 0, 1,
        7, 0, 0, 0, 2, 0, 0, 0, 6,
        0, 6, 0, 0, 0, 0, 2, 8, 0,
        0, 0, 0, 4, 1, 9, 0, 0, 5,
        0, 0, 0, 0, 8, 0, 0, 7, 9
      ],
      solution: [
        5, 3, 4, 6, 7, 8, 9, 1, 2,
        6, 7, 2, 1, 9, 5, 3, 4, 8,
        1, 9, 8, 3, 4, 2, 5, 6, 7,
        8, 5, 9, 7, 6, 1, 4, 2, 3,
        4, 2, 6, 8, 5, 3, 7, 9, 1,
        7, 1, 3, 9, 2, 4, 8, 5, 6,
        9, 6, 1, 5, 3, 7, 2, 8, 4,
        2, 8, 7, 4, 1, 9, 6, 3, 5,
        3, 4, 5, 2, 8, 6, 1, 7, 9
      ]
    },
    medium: {
      initial: [
        0, 0, 0, 6, 0, 0, 4, 0, 0,
        7, 0, 0, 0, 0, 3, 6, 0, 0,
        0, 0, 0, 0, 9, 1, 0, 8, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 5, 0, 1, 8, 0, 0, 0, 3,
        0, 0, 0, 3, 0, 6, 0, 4, 5,
        0, 4, 0, 2, 0, 0, 0, 6, 0,
        9, 0, 3, 0, 0, 0, 0, 0, 0,
        0, 2, 0, 0, 0, 0, 1, 0, 0
      ],
      solution: [
        5, 8, 1, 6, 7, 2, 4, 3, 9,
        7, 9, 2, 8, 4, 3, 6, 5, 1,
        3, 6, 4, 5, 9, 1, 7, 8, 2,
        4, 3, 8, 9, 5, 7, 2, 1, 6,
        2, 5, 6, 1, 8, 4, 9, 7, 3,
        1, 7, 9, 3, 2, 6, 8, 4, 5,
        8, 4, 5, 2, 1, 9, 3, 6, 7,
        9, 1, 3, 7, 6, 8, 5, 2, 4,
        6, 2, 7, 4, 3, 5, 1, 9, 8
      ]
    }
  };

  let currentDiff = 'easy';
  let userGrid = [...puzzles.easy.initial];
  let selectedIndex = null;
  let timerSeconds = 0;
  let timerInterval = null;

  function startTimer() {
    clearInterval(timerInterval);
    timerSeconds = 0;
    timerInterval = setInterval(() => {
      timerSeconds++;
      const mins = Math.floor(timerSeconds / 60).toString().padStart(2, '0');
      const secs = (timerSeconds % 60).toString().padStart(2, '0');
      if (timerEl) timerEl.textContent = `${mins}:${secs}`;
    }, 1000);
  }

  function renderGrid() {
    gridEl.innerHTML = '';
    const puzzle = puzzles[currentDiff];

    for (let i = 0; i < 81; i++) {
      const cell = document.createElement('div');
      const row = Math.floor(i / 9);
      const col = i % 9;
      cell.className = 'sudoku-cell';
      cell.dataset.index = i;

      // Add subgrid border classes
      if (row % 3 === 2 && row !== 8) cell.classList.add('border-bottom-bold');
      if (col % 3 === 2 && col !== 8) cell.classList.add('border-right-bold');

      const isInitial = puzzle.initial[i] !== 0;
      if (isInitial) {
        cell.classList.add('is-given');
        cell.textContent = puzzle.initial[i];
      } else if (userGrid[i] !== 0) {
        cell.textContent = userGrid[i];
      }

      if (selectedIndex === i) {
        cell.classList.add('is-active-cell');
      }

      cell.addEventListener('click', () => {
        if (!isInitial) {
          selectedIndex = i;
          renderGrid();
          if (window.playCyberSound) window.playCyberSound('click');
        }
      });

      gridEl.appendChild(cell);
    }
  }

  function renderNumpad() {
    if (!numpadEl) return;
    numpadEl.innerHTML = '';

    for (let num = 1; num <= 9; num++) {
      const btn = document.createElement('button');
      btn.className = 'sudoku-num-btn';
      btn.textContent = num;
      btn.type = 'button';
      btn.addEventListener('click', () => {
        if (selectedIndex !== null && puzzles[currentDiff].initial[selectedIndex] === 0) {
          userGrid[selectedIndex] = num;
          if (window.playCyberSound) window.playCyberSound('sudoku-place');
          renderGrid();
          checkAutoWin();
        }
      });
      numpadEl.appendChild(btn);
    }

    // Clear Button
    const clearBtn = document.createElement('button');
    clearBtn.className = 'sudoku-num-btn btn-clear';
    clearBtn.textContent = '⌫';
    clearBtn.type = 'button';
    clearBtn.addEventListener('click', () => {
      if (selectedIndex !== null && puzzles[currentDiff].initial[selectedIndex] === 0) {
        userGrid[selectedIndex] = 0;
        renderGrid();
      }
    });
    numpadEl.appendChild(clearBtn);
  }

  function checkAutoWin() {
    const sol = puzzles[currentDiff].solution;
    const isFull = userGrid.every(v => v !== 0);
    if (isFull) {
      const isCorrect = userGrid.every((v, idx) => v === sol[idx]);
      if (isCorrect) {
        clearInterval(timerInterval);
        if (window.playCyberSound) window.playCyberSound('win');
        if (window.showToast) window.showToast('CONGRATULATIONS! SUDOKU SOLVED! 🏆');
      } else {
        if (window.showToast) window.showToast('Some numbers are incorrect. Check highlighted cells.');
      }
    }
  }

  // Difficulty Selector
  difficultyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      difficultyBtns.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      currentDiff = btn.dataset.diff;
      userGrid = [...puzzles[currentDiff].initial];
      selectedIndex = null;
      startTimer();
      renderGrid();
      if (window.playCyberSound) window.playCyberSound('click');
    });
  });

  // Hint Button
  if (hintBtn) {
    hintBtn.addEventListener('click', () => {
      const sol = puzzles[currentDiff].solution;
      const emptyIndices = [];
      userGrid.forEach((v, idx) => {
        if (v === 0) emptyIndices.push(idx);
      });

      if (emptyIndices.length > 0) {
        const randomIdx = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
        userGrid[randomIdx] = sol[randomIdx];
        selectedIndex = randomIdx;
        renderGrid();
        if (window.playCyberSound) window.playCyberSound('laser');
        checkAutoWin();
      }
    });
  }

  // Reset Button
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      userGrid = [...puzzles[currentDiff].initial];
      selectedIndex = null;
      startTimer();
      renderGrid();
      if (window.playCyberSound) window.playCyberSound('click');
    });
  }

  startTimer();
  renderGrid();
  renderNumpad();
})();
