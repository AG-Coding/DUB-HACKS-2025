document.getElementById('chat-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const message = document.getElementById('message').value;
    const imageFile = document.getElementById('image-upload').files[0];
    const chatBox = document.getElementById('chat-box');
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('chat-message');

    const promptDiv = document.createElement('div');
    promptDiv.innerText = message;
    messageDiv.appendChild(promptDiv);

    const loadingDiv = document.createElement('div');
    loadingDiv.classList.add('loading');
    loadingDiv.innerHTML = `<div class="loading-dot"></div><div class="loading-dot"></div><div class="loading-dot"></div>`;
    chatBox.appendChild(loadingDiv);
    chatBox.scrollTop = chatBox.scrollHeight;

    setTimeout(() => {
        chatBox.removeChild(loadingDiv);

        if (imageFile) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const imageElement = document.createElement('img');
                imageElement.src = e.target.result;
                messageDiv.appendChild(imageElement);
            };
            reader.readAsDataURL(imageFile);
        }

        chatBox.appendChild(messageDiv);
        chatBox.scrollTop = chatBox.scrollHeight;

        document.getElementById('message').value = '';
        document.getElementById('image-upload').value = '';
    }, 1000);
});

document.getElementById('toggle-sidebar').addEventListener('click', function() {
    document.querySelector('.sidebar').classList.toggle('open');
});
