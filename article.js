document.getElementById('homeButton').addEventListener('click', function() {
    window.location.href = 'home.html';
});

document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const imageName = urlParams.get('image');

    if (imageName) {
        const imgElement = document.querySelector('main img');
        imgElement.src = `Imagenes/${imageName}`;

        // Check the file extension and set the type attribute accordingly
        const fileExtension = imageName.split('.').pop().toLowerCase();
        if (fileExtension === 'jpg' || fileExtension === 'jpeg') {
            imgElement.type = 'image/jpeg';
        } else if (fileExtension === 'png') {
            imgElement.type = 'image/png';
        }
    }

    const lastIndex = imageName.lastIndexOf(".");
    const result = imageName.substring(0, lastIndex);

    // Get references to the HTML elements where you want to display the content
    const titleElement = document.querySelector('h1');
    const subtitleElement = document.querySelector('h2');
    const contentElement = document.querySelector('p');

    // Dynamically construct the text file name based on the image name
    const textFileName = `Texto/${result}.txt`;

    // Fetch the text file content using the Fetch API
    fetch(textFileName)
    .then(response => response.text())
    .then(data => {
        // Split the text into lines
        const lines = data.split('\n');

        // Create HTML elements dynamically
        const titleHTML = document.createElement('div');
        titleHTML.innerHTML = lines.length >= 1 ? lines[0] : '';

        const subtitleHTML = document.createElement('div');
        subtitleHTML.innerHTML = lines.length >= 2 ? lines[1] : '';

        const contentHTML = document.createElement('div');
        contentHTML.textContent = lines.length > 2 ? lines.slice(2).join('\n') : ''; // Use textContent instead of innerHTML

        // Append the HTML elements to the respective containers
        titleElement.appendChild(titleHTML);
        subtitleElement.appendChild(subtitleHTML);
        contentElement.appendChild(contentHTML);
    })
    .catch(error => {
        console.error('Error fetching article content:', error);
    });

});



