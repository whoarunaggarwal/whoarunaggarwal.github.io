/* ==========================================================================
   Automation Arcade: Robo Uno Battle
   Fast-Paced Uno vs 3 Robotic AI Opponents (Delta, Kuka, Fanuc)
   ========================================================================== */

(function () {
  'use strict';

  const unoContainer = document.getElementById('unoGameContainer');
  if (!unoContainer) return;

  const topCardEl = document.getElementById('unoTopCard');
  const currentColorEl = document.getElementById('unoCurrentColor');
  const playerHandEl = document.getElementById('unoPlayerHand');
  const drawDeckBtn = document.getElementById('unoDrawDeck');
  const callUnoBtn = document.getElementById('unoCallBtn');
  const statusEl = document.getElementById('unoStatus');
  const resetBtn = document.getElementById('unoResetBtn');

  // Opponent card count badges
  const botDeltaCardsEl = document.getElementById('botDeltaCards');
  const botKukaCardsEl = document.getElementById('botKukaCards');
  const botFanucCardsEl = document.getElementById('botFanucCards');

  const COLORS = ['red', 'blue', 'green', 'yellow'];
  const SPECIALS = ['Skip', 'Reverse', '+2'];
  const WILDS = ['Wild', 'Wild +4'];

  let deck = [];
  let discardPile = [];
  let currentColor = 'red';
  let activePlayerIndex = 0; // 0 = Human, 1 = Bot Delta, 2 = Bot Kuka, 3 = Bot Fanuc
  let turnDirection = 1; // 1 = Clockwise, -1 = Counter-clockwise
  let players = [
    { name: 'You (Arun)', hand: [], isBot: false },
    { name: 'Bot Delta', hand: [], isBot: true },
    { name: 'Bot Kuka', hand: [], isBot: true },
    { name: 'Bot Fanuc', hand: [], isBot: true }
  ];

  function createDeck() {
    deck = [];
    COLORS.forEach(color => {
      // 0 card
      deck.push({ color, value: '0' });
      // 1-9 (two of each)
      for (let n = 1; n <= 9; n++) {
        deck.push({ color, value: n.toString() });
        deck.push({ color, value: n.toString() });
      }
      // Specials
      SPECIALS.forEach(sp => {
        deck.push({ color, value: sp });
        deck.push({ color, value: sp });
      });
    });
    // Wilds
    for (let w = 0; w < 4; w++) {
      deck.push({ color: 'wild', value: 'Wild' });
      deck.push({ color: 'wild', value: 'Wild +4' });
    }
    // Shuffle
    deck.sort(() => Math.random() - 0.5);
  }

  function initGame() {
    createDeck();
    players.forEach(p => p.hand = []);
    // Deal 7 cards each
    for (let i = 0; i < 7; i++) {
      players.forEach(p => {
        if (deck.length > 0) p.hand.push(deck.pop());
      });
    }

    // First card on discard pile (non-wild)
    let firstCard = deck.pop();
    while (firstCard.color === 'wild') {
      deck.unshift(firstCard);
      firstCard = deck.pop();
    }
    discardPile = [firstCard];
    currentColor = firstCard.color;
    activePlayerIndex = 0;
    turnDirection = 1;

    renderGame();
    if (statusEl) {
      statusEl.textContent = 'GAME STARTED! YOUR TURN';
      statusEl.style.color = 'var(--color-cyan)';
    }
  }

  function getCardDisplay(card) {
    if (card.value === 'Skip') return '🚫';
    if (card.value === 'Reverse') return '🔄';
    if (card.value === '+2') return '+2';
    if (card.value === 'Wild') return '🌈';
    if (card.value === 'Wild +4') return '🌈+4';
    return card.value;
  }

  function renderGame() {
    // Render top discard card
    const topCard = discardPile[discardPile.length - 1];
    if (topCardEl && topCard) {
      topCardEl.className = `uno-card uno-card-large uno-card-${topCard.color}`;
      topCardEl.innerHTML = `
        <span class="uno-corner-val">${getCardDisplay(topCard)}</span>
        <span class="uno-center-val">${getCardDisplay(topCard)}</span>
        <span class="uno-corner-val val-bottom">${getCardDisplay(topCard)}</span>
      `;
    }

    // Current Color Indicator
    if (currentColorEl) {
      currentColorEl.textContent = `Active Color: ${currentColor.toUpperCase()}`;
      currentColorEl.style.color = `var(--color-${currentColor === 'yellow' ? 'amber' : currentColor})`;
    }

    // Opponent Card Counts
    if (botDeltaCardsEl) botDeltaCardsEl.textContent = `${players[1].hand.length} Cards`;
    if (botKukaCardsEl) botKukaCardsEl.textContent = `${players[2].hand.length} Cards`;
    if (botFanucCardsEl) botFanucCardsEl.textContent = `${players[3].hand.length} Cards`;

    // Render Human Player Hand
    if (playerHandEl) {
      playerHandEl.innerHTML = '';
      players[0].hand.forEach((card, idx) => {
        const cEl = document.createElement('div');
        cEl.className = `uno-card uno-card-${card.color}`;
        cEl.innerHTML = `
          <span class="uno-corner-val">${getCardDisplay(card)}</span>
          <span class="uno-center-val">${getCardDisplay(card)}</span>
          <span class="uno-corner-val val-bottom">${getCardDisplay(card)}</span>
        `;

        const canPlay = (activePlayerIndex === 0) && (
          card.color === 'wild' ||
          card.color === currentColor ||
          card.value === topCard.value
        );

        if (canPlay) {
          cEl.classList.add('is-playable');
          cEl.addEventListener('click', () => playCard(0, idx));
        }

        playerHandEl.appendChild(cEl);
      });
    }
  }

  function playCard(playerIdx, cardIdx) {
    const player = players[playerIdx];
    const card = player.hand.splice(cardIdx, 1)[0];
    discardPile.push(card);

    if (window.playCyberSound) window.playCyberSound('card-play');

    // Handle Wild color selection
    if (card.color === 'wild') {
      const colors = ['red', 'blue', 'green', 'yellow'];
      currentColor = colors[Math.floor(Math.random() * colors.length)];
    } else {
      currentColor = card.color;
    }

    // Check Win
    if (player.hand.length === 0) {
      renderGame();
      if (statusEl) {
        statusEl.textContent = `${player.name.toUpperCase()} WINS THE UNO BATTLE! 🏆`;
        statusEl.style.color = playerIdx === 0 ? 'var(--color-green)' : 'var(--color-red)';
      }
      if (window.playCyberSound) window.playCyberSound('win');
      return;
    }

    // Apply Card Effects
    let skipNext = false;

    if (card.value === 'Reverse') {
      turnDirection *= -1;
    } else if (card.value === 'Skip') {
      skipNext = true;
    } else if (card.value === '+2') {
      const nextIdx = getNextPlayerIndex(1);
      drawCards(nextIdx, 2);
      skipNext = true;
    } else if (card.value === 'Wild +4') {
      const nextIdx = getNextPlayerIndex(1);
      drawCards(nextIdx, 4);
      skipNext = true;
    }

    advanceTurn(skipNext ? 2 : 1);
  }

  function drawCards(playerIdx, count) {
    for (let c = 0; c < count; c++) {
      if (deck.length === 0) {
        // Recycle discard pile
        const top = discardPile.pop();
        deck = discardPile.sort(() => Math.random() - 0.5);
        discardPile = [top];
      }
      if (deck.length > 0) {
        players[playerIdx].hand.push(deck.pop());
      }
    }
  }

  function getNextPlayerIndex(steps) {
    let next = (activePlayerIndex + steps * turnDirection) % players.length;
    if (next < 0) next += players.length;
    return next;
  }

  function advanceTurn(steps = 1) {
    activePlayerIndex = getNextPlayerIndex(steps);
    renderGame();

    if (activePlayerIndex === 0) {
      if (statusEl) {
        statusEl.textContent = 'YOUR TURN!';
        statusEl.style.color = 'var(--color-cyan)';
      }
    } else {
      const bot = players[activePlayerIndex];
      if (statusEl) {
        statusEl.textContent = `${bot.name.toUpperCase()} IS PLAYING...`;
        statusEl.style.color = 'var(--color-amber)';
      }
      setTimeout(botPlay, 1000);
    }
  }

  function botPlay() {
    const bot = players[activePlayerIndex];
    const topCard = discardPile[discardPile.length - 1];

    // Find playable cards
    const playableIndices = [];
    bot.hand.forEach((card, idx) => {
      if (card.color === 'wild' || card.color === currentColor || card.value === topCard.value) {
        playableIndices.push(idx);
      }
    });

    if (playableIndices.length > 0) {
      // Prefer action cards or first playable
      const chosenIdx = playableIndices[0];
      playCard(activePlayerIndex, chosenIdx);
    } else {
      // Bot draws
      drawCards(activePlayerIndex, 1);
      advanceTurn(1);
    }
  }

  // Draw Deck Button for Human Player
  if (drawDeckBtn) {
    drawDeckBtn.addEventListener('click', () => {
      if (activePlayerIndex === 0) {
        drawCards(0, 1);
        if (window.playCyberSound) window.playCyberSound('click');
        advanceTurn(1);
      }
    });
  }

  // Call Uno Button
  if (callUnoBtn) {
    callUnoBtn.addEventListener('click', () => {
      if (players[0].hand.length === 1) {
        if (window.showToast) window.showToast('YOU CALLED UNO! 💥');
        if (window.playCyberSound) window.playCyberSound('laser');
      } else {
        if (window.showToast) window.showToast('You have more than 1 card!');
      }
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      initGame();
      if (window.playCyberSound) window.playCyberSound('click');
    });
  }

  initGame();
})();
