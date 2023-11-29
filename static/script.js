// static/script.js
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const homeContainer = document.getElementById('homeContainer');
    
    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();
        login();
    });
    
    const imageForm = document.getElementById('imageForm');
    imageForm.addEventListener('submit', function(event) {
        event.preventDefault();
        uploadImage();
    });

    const encryptButton = document.getElementById('encryptButton');
    encryptButton.addEventListener('click', function() {
        encryptImage();
    });

    const decryptButton = document.getElementById('decryptButton');
    decryptButton.addEventListener('click', function() {
        decryptImage();
    });
    
});

const emailForm = document.getElementById('emailForm');

emailForm.addEventListener('submit', function(event) {

  event.preventDefault();
  
  const formData = new FormData(emailForm);

  fetch('/send_email', {
    method: 'POST',
    body: formData    
  })
  .then(response => response.text()) 
  .then(message => {
    alert(message);  
  })
  .catch(error => {
    console.error('Error sending email:', error);
  });

});

function login() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('homeContainer').style.display = 'block';
    document.getElementById('encryptButton').style.display = 'inline-block'; // Show the encrypt button
    document.getElementById('decryptButton').style.display = 'inline-block'; // Show the decrypt button
}

function uploadImage() {
    const imageForm = document.getElementById('imageForm');
    const formData = new FormData(imageForm);

    fetch('/', {  // Use the same URL as the server
        method: 'POST',
        body: formData
    })
    .then(response => response.text())
    .then(message => {
        alert(message);
    })
    .catch(error => {
        console.error('Error during image upload:', error);
    });
}

function encryptImage() {

    // Get encryption key 
    const encryptionKey = document.getElementById('encryptionKey').value;
    
    // Get the uploaded image filename
    const imageInput = document.getElementById('imageInput');
    const imageFilename = imageInput.files.length > 0 ? imageInput.files[0].name : null;

    // Check if an image is selected
    if (!imageFilename) {
        alert('Please upload an image before encrypting.');
        return;
    }

    // Make a request to the /encrypt route with the image filename
    fetch('/encrypt', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `imageFilename=${imageFilename}&key_en=${encryptionKey}`,
    })
    .then(response => response.text())
    .then(message => {
        alert(message);
    })
    .catch(error => {
        console.error('Error during image encryption:', error);
    });
}
function decryptImage() {

    // Get decryption key
    const decryptionKey = document.getElementById('decryptionKey').value;  

    // Get the uploaded image filename
    const imageInput = document.getElementById('imageInput');
    const imageFilename = imageInput.files.length > 0 ? imageInput.files[0].name : null;

    // Check if an image is selected
    if (!imageFilename) {
        alert('Please upload an image before decrypting.');
        return;
    }

    // Make a request to the /decrypt route with the image filename
    fetch('/decrypt', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `imageFilename=${imageFilename}&key_de=${decryptionKey}`,
    })
    .then(response => response.text())
    .then(message => {
        alert(message);
    })
    .catch(error => {
        console.error('Error during image decryption:', error);
    });
}

