let currentGame = {};
let gamesPlayed = 0;
let hintIndex = 0;
let waitingForNewGame = false;
let userAttempts = 0; // Track the number of user attempts
let locations = [];

async function callAPI(prompt) {
  try {
    const response = await fetch("http://127.0.0.1/api/generate-content", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: "the country is" + prompt,
    });
    const data = await response.json();
    console.log(data.content[0].text);
    return data.content[0].text;
  } catch (error) {
    console.error("Error:", error);
  }
}

// Fetch countries and set up hints and images
function fetchCountries() {
  return fetch("https://restcountries.com/v3.1/all")
    .then((response) => response.json())
    .then((data) => {
      // Map country data to the format you need
      locations = data.map((country) => ({
        country: country.name.common,
        hints: callAPI(country),
        // hints: [
        //   `Located in ${country.region}`,
        //   `Capital is ${country.capital ? country.capital[0] : "unknown"}`,
        // ],
      }));
    })
    .catch((error) => {
      console.error("Error fetching countries:", error);
    });
}

// This function will search Wikipedia for a notable place in the given country and fetch its image
function fetchLocationImage(countryName) {
  const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&origin=*&format=json&list=search&srsearch=${encodeURIComponent(
    countryName
  )}%20landmark&utf8=1`;

  return fetch(searchUrl)
    .then((response) => response.json())
    .then((data) => {
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
  const apiUrl = `https://en.wikipedia.org/w/api.php?action=query&origin=*&format=json&prop=pageimages&piprop=original&titles=${encodeURIComponent(
    pageTitle
  )}`;

  return fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      const pages = data.query.pages;
      const page = Object.values(pages)[0]; // Get the first page object
      if (page && page.original && page.original.source) {
        return page.original.source; // Return the image URL
      } else {
        throw new Error("No image found for the landmark");
      }
    });
}

// Start a new game
function startNewGame() {
  hintIndex = 0; // Reset hint index
  userAttempts = 0; // Reset user attempts
  waitingForNewGame = false; // Indicate that we're now in game mode
  let randomIndex = Math.floor(Math.random() * locations.length);
  currentGame = locations[randomIndex];

  // Fetch location image for the country
  fetchLocationImage(currentGame.country)
    .then((imageUrl) => {
      document.getElementById("image-display").innerHTML = `
                <img src="${imageUrl}" alt="${currentGame.country}" style="width:200px; height:auto;">
            `;
    })
    .catch((error) => {
      // console.error("Error fetching location image:", error);
      // document.getElementById('image-display').innerHTML = `<p>Image not available</p>`;
      fetchLocationImage(currentGame.country).then((imageUrl) => {
        document.getElementById("image-display").innerHTML = `
                    <img src="${imageUrl}" alt="${currentGame.country}" style="width:200px; height:auto;">
                `;
      });
    });

  addMessage("bot", "Can you guess the country?");
}

// Function to add messages to the chat
function addMessage(sender, message) {
  const chatWindow = document.getElementById("chat-window");
  const messageDiv = document.createElement("div");
  messageDiv.classList.add(sender === "bot" ? "bot-message" : "user-message");
  messageDiv.innerText = message;
  chatWindow.appendChild(messageDiv);

  // Smoothly scroll to the bottom of the chat window
  chatWindow.scrollTo({
    top: chatWindow.scrollHeight,
    behavior: "smooth",
  });
}

// Handle user input
document.getElementById("send-btn").addEventListener("click", () => {
  const userInput = document.getElementById("user-input").value.trim();
  if (userInput) {
    addMessage("user", userInput);
    handleUserInput(userInput);
  }
  document.getElementById("user-input").value = "";
});

function handleUserInput(input) {
  if (waitingForNewGame) {
    handleNewGameDecision(input);
  } else {
    checkAnswer(input);
  }
}

function checkAnswer(guess) {
  userAttempts++; // Increment user attempts

  if (guess.toLowerCase() === currentGame.country.toLowerCase()) {
    addMessage("bot", `Correct! The country is ${currentGame.country}.`);
    gamesPlayed++;
    setTimeout(() => {
      askForAnotherGame();
    }, 1000);
  } else {
    if (hintIndex < currentGame.hints.length) {
      addMessage("bot", `Hint: ${currentGame.hints[hintIndex]}`);
      hintIndex++;
    } else {
      addMessage("bot", "Sorry, no more hints! Try guessing again.");
    }
  }

  // After every 5 attempts, ask if they want to give up
  if (userAttempts % 5 === 0) {
    addMessage("bot", "Do you want to give up? (yes/no)");
    waitingForNewGame = true; // Set the flag to true to indicate we're waiting for a response.
  }
}

function askForAnotherGame() {
  addMessage("bot", "Do you want to play another game? (yes/no)");
  waitingForNewGame = true; // Set the flag to true to indicate we're waiting for a response.
  startNewGame();
}

function handleNewGameDecision(response) {
  const lowerResponse = response.toLowerCase();
  if (lowerResponse === "yes") {
    addMessage("bot", `The correct country was: ${currentGame.country}.`);
    startNewGame();
  } else if (lowerResponse === "no") {
    addMessage("bot", "Thanks for playing! See you next time.");
    waitingForNewGame = false; // End the game
  } else {
    addMessage("bot", "Please answer with 'yes' or 'no'.");
  }
}

// Start the game by fetching the countries first
fetchCountries().then(() => {
  startNewGame();
});
