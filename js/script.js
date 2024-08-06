// Wait for the DOM to fully load before running the script
document.addEventListener('DOMContentLoaded', () => {
    // Get references to the content section and navigation buttons by their IDs
    const contentSection = document.getElementById('content');
    const prevButton = document.getElementById('prev');
    const nextButton = document.getElementById('next');

    // Initialize variables to keep track of the current category and page URL
    let currentCategory = '';
    let currentPageUrl = '';

    // Define an array of categories to navigate through
    const categories = ['people', 'planets', 'films', 'species', 'vehicles', 'starships'];
    // Keep track of the current category index
    let currentCategoryIndex = 0;

    // Function to fetch data from the given URL
    async function fetchData(pageUrl) {
        try {
            // Fetch data from the API
            const response = await fetch(pageUrl);
            const data = await response.json();
            
            // Display the fetched data
            displayData(data.results);
            
            // Update the state of the navigation buttons
            updateNavigationButtons();
        } catch (error) {
            // Display an error message if the fetch fails
            contentSection.innerHTML = `<p>Close, but no cigar.</p>`;
        }
    }

    // Function to display the fetched data
    function displayData(items) {
        // Set the heading for the content section
        contentSection.innerHTML = `<h2>${currentCategory.charAt(0).toUpperCase() + currentCategory.slice(1)}</h2>`;
        
        // Create a list to display the items
        const list = document.createElement('ul');
        
        // Add each item to the list
        items.forEach(item => {
            const listItem = document.createElement('li');
            listItem.textContent = item.name || item.title; // Use name or title based on the item type
            list.appendChild(listItem);
        });
        
        // Append the list to the content section
        contentSection.appendChild(list);
    }

    // Function to update the state of the navigation buttons
    function updateNavigationButtons() {
        // Disable the previous button if at the start of the categories array
        prevButton.disabled = currentCategoryIndex === 0;
        
        // Disable the next button if at the end of the categories array
        nextButton.disabled = currentCategoryIndex === categories.length - 1;
    }

    // Function to navigate to a different category
    function navigateCategory(direction) {
        // Update the current category index based on the navigation direction
        currentCategoryIndex = (currentCategoryIndex + direction + categories.length) % categories.length;
        
        // Update the current category and page URL
        currentCategory = categories[currentCategoryIndex];
        currentPageUrl = `https://swapi.dev/api/${currentCategory}/`;
        
        // Fetch data for the new category
        fetchData(currentPageUrl);
    }
    
    // Add click event listeners to each navigation link
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', event => {
            // Prevent the default link behavior
            event.preventDefault();
            
            // Update the current category based on the link clicked
            currentCategory = event.target.getAttribute('data-category');
            currentCategoryIndex = categories.indexOf(currentCategory);
            
            // Update the current page URL and fetch data for the new category
            currentPageUrl = `https://swapi.dev/api/${currentCategory}/`;
            fetchData(currentPageUrl);
        });
    });

    // Add click event listener to the previous button to navigate to the previous category
    prevButton.addEventListener('click', () => {
        navigateCategory(-1);
    });

    // Add click event listener to the next button to navigate to the next category
    nextButton.addEventListener('click', () => {
        navigateCategory(1);
    });
});
