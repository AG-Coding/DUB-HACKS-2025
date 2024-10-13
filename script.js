let currentGame = {};
let gamesPlayed = 0;
let hintIndex = 0;
let waitingForNewGame = false;

// Sample data for hints and images
const locations = [
    {
        country: "Italy",
        image: "https://example.com/italy.jpg", // Replace with a real image link
        hints: ["Famous for pizza and pasta", "Home to the Colosseum", "Capital is Rome"]
    },
    {
        country: "Japan",
        image: "https://example.com/japan.jpg", // Replace with a real image link
        hints: ["Known for sushi", "Mount Fuji is here", "Capital is Tokyo"]
    }
    // Add more locations as needed
];

// Display random location
function startNewGame() {
    hintIndex = 0; // Reset hint index
    waitingForNewGame = false; // Indicate that we're now in game mode
    let randomIndex = Math.floor(Math.random() * locations.length);
    currentGame = locations[randomIndex];
    document.getElementById('image-display').innerHTML = `<img src="${currentGame.image}" alt="location image">`;
    addMessage("bot", "Can you guess the country?");
}

function addMessage(sender, message) {
    const chatWindow = document.getElementById('chat-window');
    const messageDiv = document.createElement('div');
    messageDiv.classList.add(sender === 'bot' ? 'bot-message' : 'user-message');
    messageDiv.innerText = message;
    chatWindow.appendChild(messageDiv);

    // Smoothly scroll to the bottom of the chat window
    chatWindow.scrollTo({
        top: chatWindow.scrollHeight,
        behavior: 'smooth'
    });
}

// Handle user input
document.getElementById('send-btn').addEventListener('click', () => {
    const userInput = document.getElementById('user-input').value.trim();
    if (userInput) {
        addMessage('user', userInput);
        handleUserInput(userInput);
    }
    document.getElementById('user-input').value = '';
});

function handleUserInput(input) {
    if (waitingForNewGame) {
        handleNewGameDecision(input);
    } else {
        checkAnswer(input);
    }
}

function checkAnswer(guess) {
    if (guess.toLowerCase() === currentGame.country.toLowerCase()) {
        addMessage('bot', `Correct! The country is ${currentGame.country}.`);
        gamesPlayed++;
        setTimeout(() => {
            askForAnotherGame();
        }, 1000);
    } else {
        if (hintIndex < currentGame.hints.length) {
            addMessage('bot', `Hint: ${currentGame.hints[hintIndex]}`);
            hintIndex++;
        } else {
            addMessage('bot', "Sorry, no more hints! Try guessing again.");
        }
    }
}

function askForAnotherGame() {
    addMessage('bot', "Do you want to play another game? (yes/no)");
    waitingForNewGame = true; // Set the flag to true to indicate we're waiting for a response.
}

function handleNewGameDecision(response) {
    const lowerResponse = response.toLowerCase();
    if (lowerResponse === 'yes') {
        startNewGame();
    } else if (lowerResponse === 'no') {
        addMessage('bot', "Thanks for playing! See you next time.");
        waitingForNewGame = false; // Set the flag back to false.
    } else {
        addMessage('bot', "Please answer with 'yes' or 'no'.");
    }
}

// Start the first game
startNewGame();
