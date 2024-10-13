document.getElementById('chatForm').addEventListener('submit', function (e) {
    e.preventDefault();
    
    const textInput = document.getElementById('textInput').value;
    const imageInput = document.getElementById('imageInput').files[0];
    
    // Create message container for user input
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('user-message', 'result-item');
    messageDiv.style.animationDelay = '0.1s';
    
    if (textInput) {
        // Display the user's text
        const userText = document.createElement('p');
        userText.textContent = textInput;
        messageDiv.appendChild(userText);
    }

    if (imageInput) {
        // Display the user's uploaded image
        const imgElement = document.createElement('img');
        imgElement.src = URL.createObjectURL(imageInput);
        imgElement.style.maxWidth = '100%';
        imgElement.style.marginTop = '10px';
        messageDiv.appendChild(imgElement);
    }

    document.getElementById('messages').appendChild(messageDiv);
    
    // Clear the input fields
    document.getElementById('textInput').value = '';
    document.getElementById('imageInput').value = '';

    // Simulate a chatbot response after 1 second
    setTimeout(() => {
        const botMessageDiv = document.createElement('div');
        botMessageDiv.classList.add('bot-message', 'result-item');
        botMessageDiv.style.animationDelay = '0.3s';
        
        const botText = document.createElement('p');
        botText.textContent = "Bot response will appear here!";
        botMessageDiv.appendChild(botText);
        
        document.getElementById('messages').appendChild(botMessageDiv);
    }, 1000);
});
