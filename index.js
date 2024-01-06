
/*

document.addEventListener('DOMContentLoaded', function () {
    const imageContainer = document.getElementById('image-container');

    // Directory path (modify this to the path of your "Imagenes" folder)
    const directoryPath = '/Imagenes/';
    
    // Fetch the list of images from the server
    fetchImageList(directoryPath)
        .then(images => {
            // Calculate the number of rows needed
            const numRows = Math.ceil(images.length / 3);

            // Create rows and append images
            for (let i = 0; i < numRows; i++) {
                const row = document.createElement('div');
                row.className = 'image-button-row';

                // Add 3 images or fewer if there are fewer than 3 left
                for (let j = i * 3; j < (i + 1) * 3 && j < images.length; j++) {
                    const imageButton = createImageButton(images[j]);
                    row.appendChild(imageButton);
                }

                imageContainer.appendChild(row);
            }
        })
        .catch(error => {
            console.error('Error fetching images:', error);
        });
});

// Function to fetch the list of images from the server
async function fetchImageList(directoryPath) {
    const response = await fetch(`/list-images?directory=${directoryPath}`);
    if (!response.ok) {
        throw new Error(`Failed to fetch image list: ${response.status} ${response.statusText}`);
    }

    return await response.json();
}

// Function to create an image button
function createImageButton(image) {
    const imageButton = document.createElement('div');
    imageButton.className = 'image-button';

    const imgElement = document.createElement('img');
    imgElement.src = image.path;
    imgElement.alt = image.name;

    const pElement = document.createElement('p');
    pElement.textContent = image.name;

    imageButton.appendChild(imgElement);
    imageButton.appendChild(pElement);

    return imageButton;
}

*/


document.addEventListener('DOMContentLoaded', function () {
    const imageContainer = document.getElementById('imageContainer');

    fetch('noticias.json') // Fetch the list of image filenames from noticias.json
        .then(response => response.json())
        .then(data => {
            if (data && data.images && data.images.length > 0) {
                displayImages(data.images);
            } else {
                console.error('No images found in noticias.json.');
            }
        })
        .catch(error => {
            console.error('Error fetching noticias.json:', error);
        });

        function displayImages(imageFiles) {
            imageFiles.forEach((filename, index) => {
                const block = document.createElement('div');
                block.classList.add('block');
        
                const imgElement = document.createElement('img');
                imgElement.src = `Imagenes/${filename}`;
                imgElement.alt = `Image ${index + 1}`;
        
                const textLink = document.createElement('a');
                textLink.classList.add('text-link');
                textLink.href = `article.html?image=${filename}`; // Include file extension
                textLink.textContent = `Link ${index + 1}`;
        
                block.appendChild(imgElement);
                block.appendChild(textLink);
        
                imageContainer.appendChild(block);
            });
        }
});