document.addEventListener('DOMContentLoaded', () => {
    const contentSection = document.getElementById('content');
    const prevButton = document.getElementById('prev');
    const nextButton = document.getElementById('next');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('nav ul');

    let currentCategory = '';
    let currentPageUrl = '';

    const categories = ['people', 'planets', 'films', 'species', 'vehicles', 'starships'];
    let currentCategoryIndex = 0;

    // Function to fetch data from the API
    async function fetchData(pageUrl) {
        try {
            const response = await fetch(pageUrl);
            const data = await response.json();
            displayData(data.results);
            updateNavigationButtons();
        } catch (error) {
            contentSection.innerHTML = `<p>Close, but no cigar!</p>`;
        }
    }

    // Function to display data in the content section
    function displayData(items) {
        contentSection.innerHTML = `<h3>${currentCategory.charAt(0).toUpperCase() + currentCategory.slice(1)}</h3>`;
        const list = document.createElement('ul');
        items.forEach(item => {
            const listItem = document.createElement('li');
            listItem.textContent = item.name || item.title;
            list.appendChild(listItem);
        });
        contentSection.appendChild(list);
    }

    // Function to update the navigation buttons
    function updateNavigationButtons() {
        prevButton.disabled = currentCategoryIndex === 0;
        nextButton.disabled = currentCategoryIndex === categories.length - 1;
    }

    // Function to navigate between categories
    function navigateCategory(direction) {
        currentCategoryIndex = (currentCategoryIndex + direction + categories.length) % categories.length;
        currentCategory = categories[currentCategoryIndex];
        currentPageUrl = `https://swapi.dev/api/${currentCategory}/`;
        fetchData(currentPageUrl);
    }

    // Event listeners for menu links
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', event => {
            event.preventDefault();
            currentCategory = event.target.getAttribute('data-category');
            currentCategoryIndex = categories.indexOf(currentCategory);
            currentPageUrl = `https://swapi.dev/api/${currentCategory}/`;
            fetchData(currentPageUrl);
        });
    });

    // Event listeners for next/previous buttons
    prevButton.addEventListener('click', () => {
        navigateCategory(-1);
    });

    nextButton.addEventListener('click', () => {
        navigateCategory(1);
    });

    // Event listener for hamburger menu toggle
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('show');
    });
});
