document.getElementById('chat-form').addEventListener('submit', function(event) {
    event.preventDefault();

    // Get the message prompt
    const message = document.getElementById('message').value;

    // Get the image file
    const imageFile = document.getElementById('image-upload').files[0];

    // Add the prompt to the chat
    const chatBox = document.getElementById('chat-box');
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('chat-message');

    // Create the prompt display
    const promptDiv = document.createElement('div');
    promptDiv.classList.add('prompt');
    promptDiv.innerText = "User prompt: " + message;

    messageDiv.appendChild(promptDiv);

    // If an image is uploaded, display it
    if (imageFile) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const imageElement = document.createElement('img');
            imageElement.src = e.target.result;
            messageDiv.appendChild(imageElement);
        }
        reader.readAsDataURL(imageFile);
    }

    // Append the message to the chat box
    chatBox.appendChild(messageDiv);

    // Clear the input fields
    document.getElementById('message').value = '';
    document.getElementById('image-upload').value = '';
    
    // Scroll chat to the bottom
    chatBox.scrollTop = chatBox.scrollHeight;
});
