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
    },
    {
        country: "United States of America",
        image: "https://example.com/USA.jpg", // Replace with a real image link
        hints: ["Known for sushi", "Mount Fuji is here", "Capital is Tokyo"]
    }
];

// This function will search Wikipedia for a notable place in the given country and fetch its image
function fetchLocationImage(countryName) {
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&origin=*&format=json&list=search&srsearch=${encodeURIComponent(countryName)}%20landmark&utf8=1`;

    return fetch(searchUrl)
        .then(response => response.json())
        .then(data => {
            if (data.query.search && data.query.search.length > 0) {
                // Get the first search result, assumed to be a landmark or important location
                const firstResultTitle = data.query.search[1].title;

                // Fetch the image from the page of the first result
                return fetchImageFromPage(firstResultTitle);
            } else {
                throw new Error("No landmark found");
            }
        });
}

// This function fetches the image from the Wikipedia page given a title
function fetchImageFromPage(pageTitle) {
    const apiUrl = `https://en.wikipedia.org/w/api.php?action=query&origin=*&format=json&prop=pageimages&piprop=original&titles=${encodeURIComponent(pageTitle)}`;

    return fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const pages = data.query.pages;
            const page = Object.values(pages)[0]; // Get the first page object
            if (page && page.original && page.original.source) {
                return page.original.source; // Return the image URL
            } else {
                throw new Error("No image found for the landmark");
            }
        });
}

// Example of startNewGame function, using the fetchLocationImage function
function startNewGame() {
    hintIndex = 0; // Reset hint index
    waitingForNewGame = false; // Indicate that we're now in game mode
    let randomIndex = Math.floor(Math.random() * locations.length);
    currentGame = locations[randomIndex];

    // Fetch location image for the country
    fetchLocationImage(currentGame.country)
        .then(imageUrl => {
            document.getElementById('image-display').innerHTML = `
                <img src="${imageUrl}" alt="${currentGame.country}" style="width:200px; height:auto;">
            `;
        })
        .catch(error => {
            console.error("Error fetching location image:", error);
            document.getElementById('image-display').innerHTML = `<p>Image not available</p>`;
        });

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
