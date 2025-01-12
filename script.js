const cardsArray = [
    '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼',
    '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'
];

let moves = 0;
let timer = 0;
let timerInterval;
let firstCard, secondCard;
let isFlipping = false;
let gameStarted = false;

const grid = document.querySelector('.grid');
const movesCounter = document.getElementById('moves');
const timerDisplay = document.getElementById('timer');
const newGameButton = document.getElementById('new-game');
const stopGameButton = document.getElementById('stop-game');
const congrats = document.getElementById('congrats');
const finalMoves = document.getElementById('final-moves');
const finalTime = document.getElementById('final-time');

function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

function createCard(symbol) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `
        <div class="card-inner">
            <div class="card-front"></div>
            <div class="card-back">${symbol}</div>
        </div>`;
    card.addEventListener('click', () => flipCard(card));
    return card;
}

function flipCard(card) {
    if (isFlipping || card === firstCard || card.classList.contains('flipped')) return;

    if (!gameStarted) {
        startTimer();
        gameStarted = true;
    }

    card.classList.add('flipped');

    if (!firstCard) {
        firstCard = card;
    } else {
        secondCard = card;
        checkMatch();
    }
}

function checkMatch() {
    moves++;
    movesCounter.textContent = moves;
    isFlipping = true;

    const firstSymbol = firstCard.querySelector('.card-back').textContent;
    const secondSymbol = secondCard.querySelector('.card-back').textContent;

    if (firstSymbol === secondSymbol) {
        resetCards(true);
    } else {
        setTimeout(() => {
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            resetCards(false);
        }, 1000);
    }
}

function resetCards(match) {
    if (match && document.querySelectorAll('.card.flipped').length === cardsArray.length) {
        stopTimer();
        // Show the congratulatory message in a pop-up
        alert(
            `🎉 Congratulations! You completed the game! 🎉\n\n` +
            `Moves: ${moves}\n` +
            `Time: ${timerDisplay.textContent}`
        );
    }

    [firstCard, secondCard, isFlipping] = [null, null, false];
}


function startTimer() {
    timer = 0;
    timerDisplay.textContent = '0:00';
    timerInterval = setInterval(() => {
        timer++;
        const minutes = Math.floor(timer / 60);
        const seconds = timer % 60;
        timerDisplay.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
    gameStarted = false;
}

function startGame() {
    grid.innerHTML = '';
    shuffle(cardsArray).forEach(symbol => grid.appendChild(createCard(symbol)));
    moves = 0;
    movesCounter.textContent = moves;
    congrats.classList.add('hidden');
    stopTimer(); // Reset timer when starting a new game
}

function stopGame() {
    stopTimer();
    grid.innerHTML = '';
    congrats.classList.add('hidden');
    movesCounter.textContent = '0';
    timerDisplay.textContent = '0:00';
    alert('Game stopped. Start a new game when you’re ready!');
}

newGameButton.addEventListener('click', startGame);
stopGameButton.addEventListener('click', stopGame);

// Ensure the game starts when the page loads
startGame();
