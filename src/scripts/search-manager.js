/**
 * Search Manager - Handles content search functionality
 * Provides real-time search across page content
 */

export class SearchManager {
    constructor() {
        this.searchInput = null;
        this.searchButton = null;
        this.searchResults = [];
        this.contentIndex = new Map();
        this.init();
    }

    /**
     * Initialize search manager
     */
    init() {
        this.setupSearchElements();
        this.buildContentIndex();
        this.setupEventListeners();
    }

    /**
     * Set up search input and button elements
     */
    setupSearchElements() {
        this.searchInput = document.querySelector('.search-input');
        this.searchButton = document.querySelector('.search-button');
        
        if (!this.searchInput) {
            console.warn('Search input not found - search functionality disabled');
            return;
        }
    }

    /**
     * Build searchable content index
     */
    buildContentIndex() {
        // Index main navigation items
        const navItems = document.querySelectorAll('.nav-link');
        navItems.forEach(item => {
            const text = item.textContent.trim();
            const href = item.getAttribute('href');
            const page = item.getAttribute('data-page');
            
            if (text && page) {
                this.contentIndex.set(text.toLowerCase(), {
                    type: 'navigation',
                    text: text,
                    page: page,
                    element: item
                });
            }
        });

        // Index current page content
        this.indexCurrentPageContent();
    }

    /**
     * Index content from current page
     */
    indexCurrentPageContent() {
        const contentContainer = document.querySelector('.content-container');
        if (!contentContainer) return;

        // Index headings
        const headings = contentContainer.querySelectorAll('h1, h2, h3, h4, h5, h6');
        headings.forEach(heading => {
            const text = heading.textContent.trim();
            if (text) {
                this.contentIndex.set(text.toLowerCase(), {
                    type: 'heading',
                    text: text,
                    element: heading,
                    tagName: heading.tagName.toLowerCase()
                });
            }
        });

        // Index paragraphs
        const paragraphs = contentContainer.querySelectorAll('p');
        paragraphs.forEach(paragraph => {
            const text = paragraph.textContent.trim();
            if (text && text.length > 20) { // Only index substantial content
                const keywords = this.extractKeywords(text);
                keywords.forEach(keyword => {
                    if (!this.contentIndex.has(keyword)) {
                        this.contentIndex.set(keyword, {
                            type: 'content',
                            text: text.substring(0, 100) + '...',
                            element: paragraph,
                            keywords: keywords
                        });
                    }
                });
            }
        });
    }

    /**
     * Extract keywords from text
     * @param {string} text - Text to extract keywords from
     * @returns {string[]} Array of keywords
     */
    extractKeywords(text) {
        // Simple keyword extraction - can be enhanced with more sophisticated NLP
        const words = text.toLowerCase()
            .replace(/[^\w\s]/g, ' ')
            .split(/\s+/)
            .filter(word => word.length > 3); // Only words longer than 3 characters
        
        return [...new Set(words)]; // Remove duplicates
    }

    /**
     * Set up search event listeners
     */
    setupEventListeners() {
        if (!this.searchInput) return;

        // Input event for real-time search
        this.searchInput.addEventListener('input', (e) => {
            this.performSearch(e.target.value);
        });

        // Search button click
        if (this.searchButton) {
            this.searchButton.addEventListener('click', () => {
                this.performSearch(this.searchInput.value);
            });
        }

        // Enter key on search input
        this.searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.performSearch(e.target.value);
            }
        });

        // Clear search on escape
        this.searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.clearSearch();
            }
        });
    }

    /**
     * Perform search with given query
     * @param {string} query - Search query
     */
    performSearch(query) {
        if (!query || query.trim().length < 2) {
            this.clearSearch();
            return;
        }

        const searchTerm = query.toLowerCase().trim();
        const results = this.searchContent(searchTerm);
        this.displaySearchResults(results, searchTerm);
    }

    /**
     * Search content index for matching items
     * @param {string} searchTerm - Term to search for
     * @returns {Array} Search results
     */
    searchContent(searchTerm) {
        const results = [];
        
        this.contentIndex.forEach((item, key) => {
            if (key.includes(searchTerm) || item.text.toLowerCase().includes(searchTerm)) {
                const relevance = this.calculateRelevance(item, searchTerm);
                results.push({
                    ...item,
                    relevance: relevance
                });
            }
        });

        // Sort by relevance
        return results.sort((a, b) => b.relevance - a.relevance);
    }

    /**
     * Calculate search relevance score
     * @param {Object} item - Search item
     * @param {string} searchTerm - Search term
     * @returns {number} Relevance score
     */
    calculateRelevance(item, searchTerm) {
        let score = 0;
        const text = item.text.toLowerCase();
        
        // Exact match gets highest score
        if (text === searchTerm) score += 10;
        
        // Starts with search term
        if (text.startsWith(searchTerm)) score += 5;
        
        // Contains search term
        if (text.includes(searchTerm)) score += 3;
        
        // Navigation items get bonus
        if (item.type === 'navigation') score += 2;
        
        // Headings get bonus
        if (item.type === 'heading') score += 1;
        
        return score;
    }

    /**
     * Display search results
     * @param {Array} results - Search results
     * @param {string} searchTerm - Original search term
     */
    displaySearchResults(results, searchTerm) {
        // Remove existing results
        this.clearSearchResults();
        
        if (results.length === 0) {
            this.showNoResults(searchTerm);
            return;
        }

        // Create results container
        const resultsContainer = document.createElement('div');
        resultsContainer.className = 'search-results';
        
        // Add results header
        const header = document.createElement('div');
        header.className = 'search-results-header';
        header.innerHTML = `<span>Found ${results.length} result${results.length !== 1 ? 's' : ''}</span>`;
        resultsContainer.appendChild(header);

        // Add result items
        results.forEach(result => {
            const resultItem = this.createResultItem(result, searchTerm);
            resultsContainer.appendChild(resultItem);
        });

        // Insert after search input
        this.searchInput.parentNode.appendChild(resultsContainer);
        
        // Highlight search term in content
        this.highlightSearchTerm(searchTerm);
    }

    /**
     * Create individual result item
     * @param {Object} result - Search result
     * @param {string} searchTerm - Search term
     * @returns {HTMLElement} Result item element
     */
    createResultItem(result, searchTerm) {
        const item = document.createElement('div');
        item.className = 'search-result-item';
        
        let icon = '';
        let action = '';
        
        switch (result.type) {
            case 'navigation':
                icon = '📄';
                action = `Navigate to ${result.text}`;
                break;
            case 'heading':
                icon = '📝';
                action = `Go to ${result.text}`;
                break;
            case 'content':
                icon = '🔍';
                action = `View content about ${searchTerm}`;
                break;
        }
        
        item.innerHTML = `
            <div class="search-result-icon">${icon}</div>
            <div class="search-result-content">
                <div class="search-result-title">${this.highlightText(result.text, searchTerm)}</div>
                <div class="search-result-action">${action}</div>
            </div>
        `;
        
        // Add click handler
        item.addEventListener('click', () => {
            this.handleResultClick(result);
        });
        
        return item;
    }

    /**
     * Handle result item click
     * @param {Object} result - Search result
     */
    handleResultClick(result) {
        if (result.type === 'navigation' && result.page) {
            // Navigate to page
            if (window.navigationManager) {
                window.navigationManager.navigateToPage(result.page);
            }
        } else if (result.element) {
            // Scroll to element
            result.element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // Highlight element temporarily
            result.element.style.backgroundColor = 'var(--color-highlight)';
            setTimeout(() => {
                result.element.style.backgroundColor = '';
            }, 2000);
        }
        
        // Clear search
        this.clearSearch();
    }

    /**
     * Highlight text with search term
     * @param {string} text - Original text
     * @param {string} searchTerm - Term to highlight
     * @returns {string} HTML with highlighted text
     */
    highlightText(text, searchTerm) {
        if (!searchTerm) return text;
        
        const regex = new RegExp(`(${searchTerm})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }

    /**
     * Highlight search term in page content
     * @param {string} searchTerm - Term to highlight
     */
    highlightSearchTerm(searchTerm) {
        if (!searchTerm) return;
        
        const contentContainer = document.querySelector('.content-container');
        if (!contentContainer) return;
        
        // Remove existing highlights
        this.clearHighlights();
        
        // Find and highlight text
        const walker = document.createTreeWalker(
            contentContainer,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );
        
        const textNodes = [];
        let node;
        while (node = walker.nextNode()) {
            if (node.textContent.toLowerCase().includes(searchTerm.toLowerCase())) {
                textNodes.push(node);
            }
        }
        
        // Highlight text nodes
        textNodes.forEach(textNode => {
            const text = textNode.textContent;
            const regex = new RegExp(`(${searchTerm})`, 'gi');
            const highlightedText = text.replace(regex, '<mark class="search-highlight">$1</mark>');
            
            if (highlightedText !== text) {
                const span = document.createElement('span');
                span.innerHTML = highlightedText;
                textNode.parentNode.replaceChild(span, textNode);
            }
        });
    }

    /**
     * Show no results message
     * @param {string} searchTerm - Search term that yielded no results
     */
    showNoResults(searchTerm) {
        this.clearSearchResults();
        
        const noResults = document.createElement('div');
        noResults.className = 'search-no-results';
        noResults.innerHTML = `
            <div class="search-no-results-icon">🔍</div>
            <div class="search-no-results-text">
                <p>No results found for "${searchTerm}"</p>
                <p>Try different keywords or check your spelling</p>
            </div>
        `;
        
        this.searchInput.parentNode.appendChild(noResults);
    }

    /**
     * Clear search results
     */
    clearSearchResults() {
        const existingResults = document.querySelector('.search-results');
        if (existingResults) {
            existingResults.remove();
        }
        
        const noResults = document.querySelector('.search-no-results');
        if (noResults) {
            noResults.remove();
        }
    }

    /**
     * Clear search highlights
     */
    clearHighlights() {
        const highlights = document.querySelectorAll('.search-highlight');
        highlights.forEach(highlight => {
            const parent = highlight.parentNode;
            if (parent) {
                parent.replaceChild(document.createTextNode(highlight.textContent), highlight);
                parent.normalize();
            }
        });
    }

    /**
     * Clear search
     */
    clearSearch() {
        if (this.searchInput) {
            this.searchInput.value = '';
        }
        this.clearSearchResults();
        this.clearHighlights();
    }

    /**
     * Focus search input
     */
    focusSearchInput() {
        if (this.searchInput) {
            this.searchInput.focus();
            this.searchInput.select();
        }
    }

    /**
     * Check if search input is focused
     * @returns {boolean} True if search input is focused
     */
    isSearchFocused() {
        return document.activeElement === this.searchInput;
    }

    /**
     * Rebuild content index (call when content changes)
     */
    rebuildIndex() {
        this.contentIndex.clear();
        this.buildContentIndex();
    }

    /**
     * Handle resize events
     */
    handleResize() {
        // Close search results on mobile when resizing to smaller screens
        if (window.innerWidth < 768) {
            this.clearSearchResults();
        }
    }

    /**
     * Clear search cache
     */
    clearCache() {
        this.contentIndex.clear();
        this.searchResults = [];
        this.clearSearch();
    }

    /**
     * Get search statistics
     * @returns {Object} Search statistics
     */
    getStats() {
        return {
            indexSize: this.contentIndex.size,
            hasSearchInput: !!this.searchInput,
            hasSearchButton: !!this.searchButton,
            searchResultsCount: this.searchResults.length
        };
    }
}