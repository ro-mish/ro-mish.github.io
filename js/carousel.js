document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger-menu');
    const navLinks = document.querySelector('.nav-links');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // Close menu when a link is clicked
    document.querySelectorAll('.nav-links li').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });


    const carousel = document.querySelector('.carousel');
    const cards = document.querySelectorAll('.skill-card');
    const prevButton = document.querySelector('.carousel-button.prev');
    const nextButton = document.querySelector('.carousel-button.next');
    let currentIndex = 0;

    function updateCarousel() {
        carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
    }

    prevButton.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateCarousel();
        }
    });

    nextButton.addEventListener('click', () => {
        if (currentIndex < cards.length - 1) {
            currentIndex++;
            updateCarousel();
        }
    });

    function createCarousel(containerClass, prevButtonClass, nextButtonClass) {
        const carousel = document.querySelector(`.${containerClass} .carousel`);
        const cards = carousel.querySelectorAll('.skill-card, .project-card');
        const prevButton = document.querySelector(`.${prevButtonClass}`);
        const nextButton = document.querySelector(`.${nextButtonClass}`);
        let currentIndex = 0;

        function updateCarousel() {
            carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
        }

        prevButton.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
                updateCarousel();
            }
        });

        nextButton.addEventListener('click', () => {
            if (currentIndex < cards.length - 1) {
                currentIndex++;
                updateCarousel();
            }
        });
    }

    // Initialize skills carousel
    createCarousel('carousel-container', 'prev', 'next');

    // Initialize projects carousel
    createCarousel('projects-carousel', 'projects-prev', 'projects-next');

    function fetchGitHubData() {
        const projectCards = document.querySelectorAll('.project-card');
        projectCards.forEach(card => {
            const link = card.querySelector('.github-link');
            const repoUrl = link.href;
            const repoName = repoUrl.split('/').slice(-2).join('/');
            
            fetch(`https://api.github.com/repos/${repoName}`)
                .then(response => response.json())
                .then(data => {
                    card.querySelector('h3').textContent = data.name;
                    card.querySelector('.project-description').textContent = data.description;
                    card.querySelector('.language').textContent = data.language;
                    card.querySelector('.stars').textContent = `★ ${data.stargazers_count}`;
                    card.querySelector('.forks').textContent = `🍴 ${data.forks_count}`;
                })
                .catch(error => console.error('Error:', error));
        });
    }

    fetchGitHubData();
});