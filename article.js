document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const imageName = urlParams.get('image');

    if (imageName) {
        const imgElement = document.querySelector('main img');
        imgElement.src = `Imagenes/${imageName}`;

        const fileExtension = imageName.split('.').pop().toLowerCase();
        if (fileExtension === 'jpg' || fileExtension === 'jpeg') {
            imgElement.type = 'image/jpeg';
        } else if (fileExtension === 'png') {
            imgElement.type = 'image/png';
        }
    }

    const result = imageName.replace(/\.[^/.]+$/, "");

    const titleElement = document.querySelector('h1');
    const subtitleElement = document.querySelector('h2');
    const contentElement = document.querySelector('p');
    const metaElement = document.querySelector('h6');

    fetch(`Texto/${result}.txt`)
        .then(response => response.text())
        .then(data => {
            const lines = data.split('\n');
            metaElement.textContent = `${lines[2]} | ${lines[3]}`;
            titleElement.textContent = lines[0] || '';
            subtitleElement.textContent = lines[1] || '';
            contentElement.innerHTML = lines.slice(4).join('<br>'); // Use innerHTML to preserve line breaks
        })
        .catch(error => console.error('Error fetching article content:', error));

    const homeButton = document.getElementById('homeButton');
    homeButton.addEventListener('click', () => {
        window.location.href = 'index.html';
    });
});



