let currentGame = {};
let gamesPlayed = 0;
let hintIndex = 0;
let waitingForNewGame = false;
let waitingForGiveUpResponse = false; // Flag for waiting on 'give up' response
let userAttempts = 0;
let locations = [];

// Fetch countries and set up hints and images
function fetchCountries() {
    return fetch('https://restcountries.com/v3.1/all')
        .then(response => response.json())
        .then(data => {
            // Map places data to the format you need
            locations = data.map(country => ({
                country: country.name.common,
                hints: [
                    `Located in ${country.region}`,
                    `Capital is ${country.capital ? country.capital[0] : "unknown"}`
                ]
            }));
        })
        .catch(error => {
            console.error("Error fetching places:", error);
        });
}

function fetchLocationImage(countryName) {
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&origin=*&format=json&list=search&srsearch=${encodeURIComponent(countryName)}%20landmark&utf8=1`;

    return fetch(searchUrl)
        .then(response => response.json())
        .then(data => {
            if (data.query.search && data.query.search.length > 0) {
                const firstResultTitle = data.query.search[1].title;
                return fetchImageFromPage(firstResultTitle);
            } else {
                throw new Error("No landmark found");
            }
        });
}

function fetchImageFromPage(pageTitle) {
    const apiUrl = `https://en.wikipedia.org/w/api.php?action=query&origin=*&format=json&prop=pageimages&piprop=original&titles=${encodeURIComponent(pageTitle)}`;

    return fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const pages = data.query.pages;
            const page = Object.values(pages)[0];
            if (page && page.original && page.original.source) {
                return page.original.source;
            } else {
                throw new Error("No image found for the landmark");
            }
        });
}

function startNewGame() {
    hintIndex = 0;
    userAttempts = 0;
    waitingForNewGame = false;
    waitingForGiveUpResponse = false; // Reset give up flag
    let randomIndex = Math.floor(Math.random() * locations.length);
    currentGame = locations[randomIndex];

    fetchLocationImage(currentGame.country)
        .then(imageUrl => {
            document.getElementById('image-display').innerHTML = `
                <img src="${imageUrl}" alt="${currentGame.country}" style="width:200px; height:auto;">
            `;
        })
        .catch(() => {
            fetchLocationImage(currentGame.country)
        .then(imageUrl => {
            document.getElementById('image-display').innerHTML = `
                <img src="${imageUrl}" alt="${currentGame.country}" style="width:200px; height:auto;">
            `;
        })
        });

    addMessage("bot", "Can you guess the place?");
}

function addMessage(sender, message) {
    const chatWindow = document.getElementById('chat-window');
    const messageDiv = document.createElement('div');
    messageDiv.classList.add(sender === 'bot' ? 'bot-message' : 'user-message');
    messageDiv.innerText = message;
    chatWindow.appendChild(messageDiv);

    chatWindow.scrollTo({
        top: chatWindow.scrollHeight,
        behavior: 'smooth'
    });
}

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
    } else if (waitingForGiveUpResponse) {
        handleGiveUpDecision(input);
    } else {
        checkAnswer(input);
    }
}

function checkAnswer(guess) {
    userAttempts++;

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

    if (userAttempts % 5 === 0) {
        addMessage('bot', "Do you want to give up? (yes/no)");
        waitingForGiveUpResponse = true; // Waiting for give up response
    }
}

function askForAnotherGame() {
    addMessage('bot', "Do you want to play another game? (yes/no)");
    waitingForNewGame = true;
}

function handleNewGameDecision(response) {
    const lowerResponse = response.toLowerCase();
    if (lowerResponse === 'yes') {
        startNewGame(); // Start new game only after user confirms
    } else if (lowerResponse === 'no') {
        addMessage('bot', "Thanks for playing! See you next time.");
        waitingForNewGame = false;
    } else {
        addMessage('bot', "Please answer with 'yes' or 'no'.");
    }
}

function handleGiveUpDecision(response) {
    const lowerResponse = response.toLowerCase();
    if (lowerResponse === 'yes') {
        addMessage('bot', `You gave up! The correct place was: ${currentGame.country}.`);
        setTimeout(() => {
            askForAnotherGame();
        }, 1000); // Ask for another game after revealing the country
    } else if (lowerResponse === 'no') {
        addMessage('bot', "Keep guessing! You can do it!");
        waitingForGiveUpResponse = false; // Allow user to keep guessing
    } else {
        addMessage('bot', "Please answer with 'yes' or 'no'.");
    }
}

fetchCountries().then(() => {
    startNewGame();
});
