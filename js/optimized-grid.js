// Function to optimize the number of articles displayed based on screen size
function loadOptimizedArticles() {
    // Adjust path to JSON file based on current location
    const jsonPath = window.location.pathname.includes('/categories/') 
        ? '../data/articles.json' 
        : 'data/articles.json';
        
    fetch(jsonPath)
        .then(response => response.json())
        .then(data => {
            // Get container for each category section
            const booksContainer = document.getElementById('books-articles');
            const philosophyContainer = document.getElementById('philosophy-articles');
            const storyContainer = document.getElementById('story-articles');
            const scienceContainer = document.getElementById('science-articles');
            
            // Determine optimal number of articles to display based on screen width
            let articlesPerCategory = getOptimalArticleCount();
            
            // Filter articles by category and limit to optimal number per category
            const booksArticles = data.articles.filter(article => article.category === 'books').slice(0, articlesPerCategory);
            const philosophyArticles = data.articles.filter(article => article.category === 'philosophy').slice(0, articlesPerCategory);
            const storyArticles = data.articles.filter(article => article.category === 'story').slice(0, articlesPerCategory);
            const scienceArticles = data.articles.filter(article => article.category === 'science').slice(0, articlesPerCategory);
            
            // Render articles to their respective containers
            if (booksContainer) renderArticleCards(booksArticles, booksContainer);
            if (philosophyContainer) renderArticleCards(philosophyArticles, philosophyContainer);
            if (storyContainer) renderArticleCards(storyArticles, storyContainer);
            if (scienceContainer) renderArticleCards(scienceArticles, scienceContainer);
        })
        .catch(error => {
            console.error('Error loading articles:', error);
        });
}

// Determine optimal number of articles based on screen width
function getOptimalArticleCount() {
    const width = window.innerWidth;
    
    // iPad-specific adjustments
    const isIPad = /iPad|Macintosh/.test(navigator.userAgent) && 'ontouchend' in document;
    
    if (width < 768) {
        return 2; // Mobile: 2 articles per category
    } else if (width < 992 || isIPad) {
        return 2; // Tablets & iPad: 2 articles per category
    } else {
        return 3; // Desktops/Large screens: max 3 articles per category
    }
}

// Replace the original loadFeaturedArticles function with this optimized version
function loadFeaturedArticles() {
    loadOptimizedArticles();
}

// Add resize listener to adjust article count when window size changes
window.addEventListener('resize', function() {
    // Only reload articles on the home page
    if (getCurrentPage() === 'index') {
        loadOptimizedArticles();
    }
});