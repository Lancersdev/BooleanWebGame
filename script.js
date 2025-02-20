const questions = [
    { question: '!(1 AND 0) == 1', answer: true },
    { question: '1 OR 0 AND 0 == 1', answer: true },
    { question: '!(1 OR 1) == 1', answer: false },
    { question: '1 AND !(0 OR 1) == 1', answer: false },
    { question: '0 OR 1 AND 1 == 0', answer: false },
    { question: '!(0 AND 1) == 1', answer: true },
    { question: '1 OR !(1 AND 0) == 1', answer: true },
    { question: '!(1 AND 1) == 0', answer: true }
];

let currentQuestion = 0, score = 0, timer, timeLeft = 10;
let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || {};

function clearUsername() { document.getElementById('username').value = ''; }

function startGame() {
    const username = document.getElementById('username').value.trim();
    if (!username) {
        showModal('Invalid username. Please enter your name.');
        return;
    }
    toggleDisplay('header', 'game', 'timer');
    shuffleQuestions();
    loadQuestion();
}

function shuffleQuestions() {
    for (let i = questions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [questions[i], questions[j]] = [questions[j], questions[i]];
    }
}

function loadQuestion() {
    if (currentQuestion < questions.length) {
        document.getElementById('question').innerText = questions[currentQuestion].question;
        startTimer();
    } else {
        endGame();
    }
}

function startTimer() {
    resetTimer();
    timer = setInterval(updateTimer, 1000);
}

function updateTimer() {
    timeLeft--;
    updateTimerBar();
    if (timeLeft <= 0) endGame();
}

function updateTimerBar() {
    const timerBar = document.getElementById('timerBar');
    timerBar.style.width = `${(timeLeft / 10) * 100}%`;
    timerBar.style.backgroundColor = timeLeft <= 3 ? 'red' : timeLeft <= 6 ? 'yellow' : 'green';
}

function resetTimer() {
    clearInterval(timer);
    timeLeft = 10;
    const timerBar = document.getElementById('timerBar');
    timerBar.style.width = '100%';
    timerBar.style.backgroundColor = 'green';
}

function submitAnswer(answer) {
    clearInterval(timer);
    if (answer === questions[currentQuestion].answer) score++;
    document.getElementById('score').innerText = `Score: ${score}`;
    currentQuestion++;
    loadQuestion();
}

function endGame() {
    clearInterval(timer);
    const username = document.getElementById('username').value.trim();
    if (!leaderboard[username] || leaderboard[username] < score) leaderboard[username] = score;
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
    updateLeaderboard();
    showEndOptions();
}

function updateLeaderboard() {
    const leaderboardElement = document.getElementById('leaderboard');
    leaderboardElement.innerHTML = '';
    Object.entries(leaderboard).sort((a, b) => b[1] - a[1])
        .forEach(([user, score]) => {
            const li = document.createElement('li');
            li.innerText = `${user}: ${score}`;
            leaderboardElement.appendChild(li);
        });
}

function showEndOptions() {
    const gameContainer = document.querySelector('.game-container');
    if (!document.querySelector('.end-options')) {
        const endOptions = document.createElement('div');
        endOptions.className = 'end-options';
        endOptions.innerHTML = `<button class="button button-end" onclick="tryAgain()">Try Again</button>
                                <button class="button button-end" onclick="exitGame()">Exit</button>`;
        gameContainer.appendChild(endOptions);
    }
}

function tryAgain() {
    currentQuestion = 0;
    score = 0;
    document.getElementById('score').innerText = 'Score: 0';
    document.querySelector('.end-options').remove();
    shuffleQuestions();
    loadQuestion();
    resetTimer();
}

function exitGame() {
    clearInterval(timer); // Ensure the timer stops
    currentQuestion = 0;
    score = 0;
    toggleDisplay('game', 'header', 'timer', false);
    document.querySelector('.header').style.display = 'block'; // Show the header for username input
    document.getElementById('username').value = ''; // Clear the username input
    if (document.querySelector('.end-options')) document.querySelector('.end-options').remove();
}

function resetGame() {
    currentQuestion = 0;
    score = 0;
    toggleDisplay('game', 'header', 'timer', false);
    resetTimer();
    if (document.querySelector('.end-options')) document.querySelector('.end-options').remove();
}

function goHome() {
    resetGame();
    clearUsername();
    toggleDisplay('game', 'header', 'timer', false);
    clearInterval(timer); // Ensure the timer stops
}

function showModal(message) {
    document.getElementById('alertMessage').innerText = message;
    document.getElementById('alertModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('alertModal').style.display = 'none';
}

function toggleDisplay(hide, show, timer, showTimer = true) {
    document.querySelector(`.${hide}`).style.display = 'none';
    document.getElementById(show).style.display = 'block';
    document.getElementById(timer).style.display = showTimer ? 'block' : 'none';
}

updateLeaderboard();
