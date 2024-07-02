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
        if (loading) return;
        loading = true;
        const articlesRemaining = maxArticles - Object.keys(displayedArticles).length;
        const articlesToLoad = Math.min(rowsPerLoad * 3, articlesRemaining);

        fetch(`noticias.json?start=${startRow * 3}&limit=${articlesToLoad}`)
            .then(response => response.json())
            .then(data => {
                if (data && data.images && data.images.length > 0) {
                    displayImages(data.images.reverse());
                    startRow += rowsPerLoad;
                } else {
                    console.error('No more images found.');
                }
            })
            .catch(error => console.error('Error fetching articles:', error))
            .finally(() => loading = false);
    };

    const displayImages = (imageFiles) => {
        imageFiles.forEach((filename) => {
            if (!displayedArticles[filename] && Object.keys(displayedArticles).length < maxArticles) {
                const block = document.createElement('div');
                block.classList.add('block');

                const imgLink = document.createElement('a');
                imgLink.href = `article.html?image=${filename}`;

                const imgElement = new Image();
                imgElement.src = `Imagenes/${filename}`;
                imgElement.alt = `Image`;
                imgElement.classList.add('resizable-image');

                const title = document.createElement('a');
                title.classList.add('image-title');
                title.style.cssText = `
                    font-family: sans-serif;
                    font-size: 20px;
                    font-weight: bold;
                    color: #000;
                    text-decoration: none;
                    margin: 20px 0 30px;
                    display: block;
                    text-align: center;
                `;

                const meta = document.createElement('h6');
                meta.classList.add('image-meta');

                fetch(`Texto/${filename.replace(/\.[^/.]+$/, "")}.txt`)
                    .then(response => response.text())
                    .then(text => {
                        const lines = text.split('\n');
                        title.textContent = lines[0];
                        meta.textContent = `${lines[2]} | ${lines[3]}`;
                        title.href = `article.html?image=${filename}`;
                    })
                    .catch(error => console.error('Error fetching text file:', error));

                imgLink.appendChild(imgElement);
                block.appendChild(imgLink);
                block.appendChild(meta);
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

        // Pre-cargar la primera imagen
        const firstImage = new Image();
        firstImage.src = bannerImages[0];

        banner.style.backgroundSize = 'cover';
        banner.style.backgroundRepeat = 'no-repeat';
        banner.style.backgroundImage = `url(${firstImage.src})`;

        setInterval(() => {
            const nextImage = new Image();
            nextImage.src = bannerImages[(currentImageIndex + 1) % bannerImages.length];
            nextImage.onload = () => {
                banner.style.transition = 'background-image 1s ease-in-out';
                banner.style.backgroundImage = `url(${nextImage.src})`;
            };
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