document.addEventListener('DOMContentLoaded', function () {
    const reloadButton = document.querySelector('.reload-button');
    reloadButton.addEventListener('click', () => location.reload());

    const imageContainer = document.getElementById('imageContainer');
    let startRow = 0;
    const rowsPerLoad = 2;
    const maxArticles = 100;
    let loading = false;
    let displayedArticles = {};

    const loadMoreArticles = () => {
        loading = true;
        const articlesRemaining = maxArticles - Object.keys(displayedArticles).length;
        const articlesToLoad = Math.min(rowsPerLoad * 3, articlesRemaining);

        fetch(`noticias.json?start=${startRow * 3}&limit=${articlesToLoad}`)
            .then(response => response.json())
            .then(data => {
                if (data && data.images && data.images.length > 0) {
                    displayImages(data.images.reverse());
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
    };

    const displayImages = (imageFiles) => {
        imageFiles.forEach((filename, index) => {
            if (!displayedArticles[filename] && Object.keys(displayedArticles).length < maxArticles) {
                const block = document.createElement('div');
                block.classList.add('block');

                const imgLink = document.createElement('a');
                imgLink.href = `article.html?image=${filename}`;

                const imgElement = new Image();
                imgElement.src = `Imagenes/${filename}`;
                imgElement.alt = `Image ${startRow * 3 + index + 1}`;
                imgElement.classList.add('resizable-image');

                const title = document.createElement('a');
                title.classList.add('image-title');
                title.style.fontFamily = 'sans-serif';
                title.style.fontSize = '20px';
                title.style.fontWeight = 'bold';
                title.style.color = '#000000';
                title.style.textDecoration = 'none';
                title.style.marginTop = '20px';
                title.style.marginBottom = '30px';
                title.style.display = 'block';
                title.style.textAlign = 'center';

                fetch(`Texto/${filename.replace(/\.[^/.]+$/, "")}.txt`)
                    .then(response => response.text())
                    .then(text => {
                        title.textContent = text.split('\n')[0];
                        title.href = `article.html?image=${filename}`;
                    })
                    .catch(error => console.error('Error fetching text file:', error));

                imgLink.appendChild(imgElement);
                block.appendChild(imgLink);
                block.appendChild(title);
                imageContainer.appendChild(block);

                displayedArticles[filename] = true;
            }
        });

        adjustImageSizes();
    };

    const adjustImageSizes = () => {
        const images = document.querySelectorAll('.resizable-image');
        const containerWidth = imageContainer.offsetWidth;
        const margin = 20;
        const numImagesPerRow = 3;
        const totalMarginWidth = (numImagesPerRow - 1) * margin;
        const imageWidth = (containerWidth - totalMarginWidth) / numImagesPerRow;
        const imageHeight = imageWidth * 9 / 16;

        images.forEach(img => {
            if (window.innerWidth <= 600) {
                img.style.width = 'calc(100% - 10px)';
                img.style.height = 'auto';
                img.style.margin = '0 5px';
            } else {
                img.style.width = imageWidth + 'px';
                img.style.height = imageHeight + 'px';
            }
        });
    };

    const changeBannerImage = () => {
        const banner = document.querySelector('.banner');
        const bannerImages = ['Banner/1.png', 'Banner/2.png', 'Banner/3.png', 'Banner/4.png', 'Banner/5.png'];
        let currentImageIndex = 0;

        banner.style.backgroundSize = 'cover';
        banner.style.backgroundRepeat = 'no-repeat';
        banner.style.backgroundImage = `url(${bannerImages[currentImageIndex]})`;

        setInterval(() => {
            const nextImage = new Image();
            nextImage.src = bannerImages[(currentImageIndex + 1) % bannerImages.length];
            banner.style.transition = 'background-image 1s ease-in-out';
            banner.style.backgroundImage = `url(${nextImage.src})`;
            currentImageIndex = (currentImageIndex + 1) % bannerImages.length;
        }, 5000);
    };

    loadMoreArticles();

    window.addEventListener('scroll', () => {
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight && !loading) {
            loadMoreArticles();
        }
    });

    changeBannerImage();
    window.addEventListener('resize', adjustImageSizes);
});