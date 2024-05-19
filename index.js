document.addEventListener('DOMContentLoaded', function () {
    // Reload button functionality
    const reloadButton = document.querySelector('.reload-button');
    reloadButton.addEventListener('click', function () {
        location.reload();
    });

    const imageContainer = document.getElementById('imageContainer');
    let startRow = 0;
    const rowsPerLoad = 2; 
    const maxArticles = 100; // Maximum number of articles to display
    let loading = false;
    let displayedArticles = {}; 

    function loadMoreArticles() {
        loading = true;
        const articlesRemaining = maxArticles - Object.keys(displayedArticles).length;
        const articlesToLoad = Math.min(rowsPerLoad * 3, articlesRemaining);
        fetch(`noticias.json?start=${startRow * 3}&limit=${articlesToLoad}`)
            .then(response => response.json())
            .then(data => {
                if (data && data.images && data.images.length > 0) {
                    displayImages(data.images.reverse()); // Reverse the array
                    startRow += rowsPerLoad;
                    loading = false;
                } else {
                    console.error('No more images found.');
                }
            })
            .catch(error => {
                console.error('Error fetching articles:', error);
                loading = false;
            });
    }

    function displayImages(imageFiles) {
        imageFiles.forEach((filename, index) => {
            // Check if article has been displayed before and limit the number of articles
            if (!displayedArticles[filename] && Object.keys(displayedArticles).length < maxArticles) {
                const block = document.createElement('div');
                block.classList.add('block');

                const imgLink = document.createElement('a'); // Create anchor element for the image
                imgLink.href = `article.html?image=${filename}`; // Link to article page

                const imgElement = new Image();
                imgElement.src = `Imagenes/${filename}`;
                imgElement.alt = `Image ${startRow * 3 + index + 1}`;
                imgElement.classList.add('resizable-image');

                const title = document.createElement('a'); // Create title element
                title.classList.add('image-title');
                title.style.fontFamily = 'sans-serif';
                title.style.fontSize = '20px'; // Increased font size
                title.style.fontWeight = 'bold'; // Bold text
                title.style.color = '#000000'; // Completely black color
                title.style.textDecoration = 'none'; // No underline
                title.style.marginTop = '20px'; // Reduced vertical margin between text and image
                title.style.marginBottom = '30px'; // Increased vertical margin between rows
                title.style.display = 'block'; // Centered text
                title.style.textAlign = 'center';

                // Fetch the content of the corresponding .txt file
                fetch(`Texto/${filename.replace(/\.[^/.]+$/, "")}.txt`)
                    .then(response => response.text())
                    .then(text => {
                        title.textContent = text.split('\n')[0]; // Use the first line of the text file as the title
                        title.href = `article.html?image=${filename}`; // Link to article page
                    })
                    .catch(error => {
                        console.error('Error fetching text file:', error);
                    });

                imgLink.appendChild(imgElement); // Append image to anchor element
                block.appendChild(imgLink); // Append anchor element to block
                block.appendChild(title); // Append title below image

                imageContainer.appendChild(block);

                // Mark article as displayed
                displayedArticles[filename] = true;
            }
        });

        // After all images are added, adjust their sizes
        adjustImageSizes();
    }

    function adjustImageSizes() {
        const images = document.querySelectorAll('.resizable-image');
        const containerWidth = imageContainer.offsetWidth;
        const margin = 20; // Margin between images
        const numImagesPerRow = 3;
        const totalMarginWidth = (numImagesPerRow - 1) * margin;
        const imageWidth = (containerWidth - totalMarginWidth) / numImagesPerRow;
        const imageHeight = imageWidth * 9 / 16; // Assuming images have a 16:9 aspect ratio

        // Set fixed width and height for all images
        images.forEach(img => {
            img.style.width = imageWidth + 'px';
            img.style.height = imageHeight + 'px';
        });
    }

    function changeBannerImage() {
        const banner = document.querySelector('.banner'); // Select the banner element
        const bannerImages = ['Banner/1.png', 'Banner/2.png', 'Banner/3.png', 'Banner/4.png', 'Banner/5.png']; // Array of banner images
        let currentImageIndex = 0; // Variable to keep track of current banner image index
        
        // Set the first image immediately
        banner.style.backgroundSize = 'cover'; // Stretch image to fit fixed width and height
        banner.style.backgroundRepeat = 'no-repeat';
        banner.style.backgroundImage = `url(${bannerImages[currentImageIndex]})`;
    
        setInterval(() => {
            // Preload the next image for smooth transition
            const nextImage = new Image();
            nextImage.src = bannerImages[(currentImageIndex + 1) % bannerImages.length];
            
            // Smooth transition between images
            banner.style.transition = 'background-image 1s ease-in-out';
            
            // Set the background image of the banner
            banner.style.backgroundImage = `url(${nextImage.src})`;
            
            // Increment index and loop back to 0 if it exceeds the array length
            currentImageIndex = (currentImageIndex + 1) % bannerImages.length;
        }, 5000); // Change image every 5 seconds
    }

    // Load the first rowsPerLoad initially
    loadMoreArticles();


    // Load additional rows as the user scrolls down
    window.addEventListener('scroll', function () {
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight && !loading) {
            loadMoreArticles();
        }
    });

    changeBannerImage();

});