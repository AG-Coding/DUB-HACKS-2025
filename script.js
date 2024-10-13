let currentGame = {};
let gamesPlayed = 0;
let hintIndex = 0;

// Sample data for hints and images
const locations = [
    {
        country: "Italy",
        image: "https://www.google.com/search?sca_esv=f97c68fb7d313c40&rlz=1C5CHFA_en___US1086&sxsrf=ADLYWILVBOcwkAWzepJXS7t062vyCeHh8A:1728790439047&q=Italy+image&udm=2&fbs=AEQNm0Aa4sjWe7Rqy32pFwRj0UkWd8nbOJfsBGGB5IQQO6L3JxdWbs3CkcdlHyEbrNaWhotMJs9T6Ysmviw_2YPsUINQur8LDCM8ha9ZIfjN1uSvMcUe7DoBIMDnXWOL8G0Ix0OeOetFdeFTsaoMV3mOjipNZ6jaTA5z5nYBUH65_NUAENnG6PR3yS-XoCbd6JxAW1y_hzDk81eU-YCV8hiIt5r_Owrt2A&sa=X&ved=2ahUKEwjwuIqgtoqJAxWyDDQIHadYCMcQtKgLegQIFRAB&biw=1336&bih=756&dpr=2.2#vhid=ddc75cfRWrXSVM&vssid=mosaic",  // Replace with a real image link
        hints: ["Famous for pizza and pasta", "Home to the Colosseum", "Capital is Rome"]
    },
    {
        country: "Japan",
        image: "https://www.google.com/search?q=japan+image&sca_esv=f97c68fb7d313c40&rlz=1C5CHFA_en___US1086&udm=2&biw=1336&bih=756&sxsrf=ADLYWIIUjkW_fLiTcYtlAK_AYFOiXzAyNA%3A1728790440394&ei=qD8LZ9LeF9uU0PEPqYuA0A0&ved=0ahUKEwjS0tygtoqJAxVbCjQIHakFANoQ4dUDCBA&uact=5&oq=japan+image&gs_lp=Egxnd3Mtd2l6LXNlcnAiC2phcGFuIGltYWdlMgYQABgHGB4yBRAAGIAEMgYQABgHGB4yBhAAGAcYHjIGEAAYBxgeMggQABgHGAoYHjIGEAAYBxgeMgYQABgHGB4yBhAAGAcYHjIGEAAYBxgeSNQMUIYDWMELcAJ4AJABAJgBZqABnwSqAQM1LjK4AQPIAQD4AQGYAgmgAsMEwgIMEAAYgAQYQxiKBRgKwgIKEAAYgAQYQxiKBcICDRAAGIAEGLEDGEMYigXCAggQABiABBixA5gDAIgGAZIHAzcuMqAHqSU&sclient=gws-wiz-serp#vhid=qiBg_asNKVBJgM&vssid=mosaic",  // Replace with a real image link
        hints: ["Known for sushi", "Mount Fuji is here", "Capital is Tokyo"]
    }
    // Add more locations as needed
];

// Display random location
function startNewGame() {
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
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

// Handle user input
document.getElementById('send-btn').addEventListener('click', () => {
    const userInput = document.getElementById('user-input').value;
    if (userInput.trim()) {
        addMessage('user', userInput);
        checkAnswer(userInput.trim());
    }
    document.getElementById('user-input').value = '';
});

function checkAnswer(guess) {
    if (guess.toLowerCase() === currentGame.country.toLowerCase()) {
        addMessage('bot', `Correct! The country is ${currentGame.country}.`);
        gamesPlayed++;
        document.getElementById('gamesPlayed').innerText = gamesPlayed;
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
    document.getElementById('send-btn').addEventListener('click', () => {
        const userInput = document.getElementById('user-input').value.toLowerCase();
        if (userInput === 'yes') {
            hintIndex = 0;
            startNewGame();
        } else if (userInput === 'no') {
            addMessage('bot', "Thanks for playing! See you next time.");
        }
    });
}

// Start the first game
startNewGame();
