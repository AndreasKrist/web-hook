// Initialize the application when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Apply active class to current navigation item
    highlightCurrentNav();
    
    // Initialize hamburger menu for mobile
    initMobileNav();
    
    // Initialize content based on the current page
    const currentPage = getCurrentPage();
    
    if (currentPage === 'index') {
        // Load featured articles for the home page
        loadFeaturedArticles();
    } else if (currentPage === 'article') {
        // Load single article content
        const articleId = getParameterByName('id');
        if (articleId) {
            loadArticle(articleId);
        } else {
            window.location.href = './index.html';
        }
    } else if (['books', 'philosophy', 'story', 'science'].includes(currentPage)) {
        // Load category articles
        loadCategoryArticles(currentPage);
    }
});

// Initialize mobile navigation
function initMobileNav() {
    const hamburgerMenu = document.getElementById('hamburger-menu');
    
    if (hamburgerMenu) {
        hamburgerMenu.addEventListener('click', function() {
            console.log('Hamburger menu clicked');
            this.classList.toggle('menu-active');
            document.querySelector('nav').classList.toggle('menu-open');
        });
        
        // Close menu when clicking a link
        const navLinks = document.querySelectorAll('.desktop-nav a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                hamburgerMenu.classList.remove('menu-active');
                document.querySelector('nav').classList.remove('menu-open');
            });
        });
    } else {
        console.error('Hamburger menu element not found');
    }
}

// Get the current page name from the URL
function getCurrentPage() {
    const path = window.location.pathname;
    let page = path.split("/").pop().split(".")[0];
    
    if (page === '' || page === 'index') return 'index';
    
    return page;
}

// Highlight the current navigation item based on the current page
function highlightCurrentNav() {
    const currentPage = getCurrentPage();
    const navLinks = document.querySelectorAll('nav a');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        const linkPage = href.split('/').pop().split('.')[0];
        
        // Remove active class from all links
        link.classList.remove('active');
        
        // Add active class to current page link
        if (linkPage === currentPage) {
            link.classList.add('active');
        } else if (currentPage === 'article' && href.includes('index.html')) {
            // Do nothing for article pages
        } else if (currentPage === 'index' && href.includes('index.html')) {
            link.classList.add('active');
        }
    });
}

// Load articles for the home page
function loadFeaturedArticles() {
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
            
            // Filter articles by category and limit to 3 per category
            const booksArticles = data.articles.filter(article => article.category === 'books').slice(0, 3);
            const philosophyArticles = data.articles.filter(article => article.category === 'philosophy').slice(0, 3);
            const storyArticles = data.articles.filter(article => article.category === 'story').slice(0, 3);
            const scienceArticles = data.articles.filter(article => article.category === 'science').slice(0, 3);
            
            // Render articles to their respective containers
            renderArticleCards(booksArticles, booksContainer);
            renderArticleCards(philosophyArticles, philosophyContainer);
            renderArticleCards(storyArticles, storyContainer);
            renderArticleCards(scienceArticles, scienceContainer);
        })
        .catch(error => {
            console.error('Error loading articles:', error);
        });
}

// Load articles for a specific category
function loadCategoryArticles(category) {
    // Adjust path to JSON file based on current location
    const jsonPath = window.location.pathname.includes('/categories/') 
        ? '../data/articles.json' 
        : 'data/articles.json';
        
    fetch(jsonPath)
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById('category-articles');
            const categoryArticles = data.articles.filter(article => article.category === category);
            
            renderArticleCards(categoryArticles, container);
            
            // Update the category title
            const categoryTitle = document.getElementById('category-title');
            if (categoryTitle) {
                categoryTitle.textContent = category.charAt(0).toUpperCase() + category.slice(1);
            }
        })
        .catch(error => {
            console.error('Error loading category articles:', error);
        });
}

// Load a single article
function loadArticle(articleId) {
    // Adjust path to JSON file based on current location
    const jsonPath = window.location.pathname.includes('/categories/') 
        ? '../data/articles.json' 
        : './data/articles.json';
        
    fetch(jsonPath)
        .then(response => response.json())
        .then(data => {
            const article = data.articles.find(a => a.id === articleId);
            
            if (article) {
                renderArticle(article);
            } else {
                window.location.href = './index.html';
            }
        })
        .catch(error => {
            console.error('Error loading article:', error);
        });
}

// Render article cards for the grid layout
function renderArticleCards(articles, container) {
    if (!container) return;
    
    container.innerHTML = '';
    
    articles.forEach(article => {
        const card = document.createElement('div');
        card.className = 'article-card';
        
        // Determine the correct path for the article link based on current page
        let articlePath = 'article.html?id=' + article.id;
        if (window.location.pathname.includes('/categories/')) {
            articlePath = '../article.html?id=' + article.id;
        }
        
        card.innerHTML = `
            <a href="${articlePath}" class="card-link">
                <div class="card-image" style="background-image: url('${article.featured_image}');"></div>
                <div class="card-content">
                    <div class="card-category">${article.category}</div>
                    <h3 class="card-title">${article.title}</h3>
                    <div class="card-date">${article.date}</div>
                    <p class="card-excerpt">${article.excerpt}</p>
                    <div class="card-quote">${article.quote}</div>
                    <span class="read-more">Read More →</span>
                </div>
            </a>
        `;
        
        container.appendChild(card);
    });
}

// Render a single article
function renderArticle(article) {
    const titleElement = document.getElementById('article-title');
    const metaElement = document.getElementById('article-meta');
    const imageElement = document.getElementById('featured-image');
    const contentElement = document.getElementById('article-content');
    
    if (titleElement) titleElement.textContent = article.title;
    if (metaElement) metaElement.textContent = `${article.date} • ${article.category.charAt(0).toUpperCase() + article.category.slice(1)}`;
    if (imageElement) imageElement.style.backgroundImage = `url('${article.featured_image}')`;
    
    if (contentElement) {
        contentElement.innerHTML = '';
        
        article.content.forEach(paragraph => {
            const p = document.createElement('p');
            p.textContent = paragraph;
            contentElement.appendChild(p);
        });
    }
    
    // Update page title
    document.title = `${article.title} | Your Thoughtful Space`;
}

// Helper function to get URL parameters
function getParameterByName(name) {
    const url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
    const results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}