/**
 * Navigation Manager - Handles single-page application navigation
 * Manages page routing, content loading, and browser history
 */

import { ContentLoader } from './content-loader.js';

export class NavigationManager {
    constructor() {
        this.currentPage = 'home';
        this.contentLoader = new ContentLoader();
        this.pageCache = new Map();
        this.isLoading = false;
        this.init();
    }

    /**
     * Initialize navigation manager
     */
    init() {
        this.setupEventListeners();
        this.handleInitialPageLoad();
    }

    /**
     * Set up navigation event listeners
     */
    setupEventListeners() {
        // Handle navigation link clicks
        document.addEventListener('click', (e) => {
            const navLink = e.target.closest('.nav-link');
            if (navLink) {
                e.preventDefault();
                const page = navLink.getAttribute('data-page');
                if (page) {
                    this.navigateToPage(page);
                }
            }
        });

        // Handle browser back/forward buttons
        window.addEventListener('popstate', (e) => {
            const page = e.state?.page || 'home';
            this.loadPageContent(page, false);
        });

        // Handle hash changes (fallback)
        window.addEventListener('hashchange', () => {
            const hash = window.location.hash.slice(1);
            if (hash && hash !== this.currentPage) {
                this.navigateToPage(hash);
            }
        });
    }

    /**
     * Handle initial page load
     */
    handleInitialPageLoad() {
        const hash = window.location.hash.slice(1);
        const initialPage = hash || 'home';
        this.loadPageContent(initialPage, false);
    }

    /**
     * Navigate to specific page
     * @param {string} page - Target page name
     */
    async navigateToPage(page) {
        if (page === this.currentPage || this.isLoading) {
            return;
        }

        this.isLoading = true;
        this.showLoadingState();

        try {
            await this.loadPageContent(page, true);
        } catch (error) {
            console.error(`Failed to navigate to page: ${page}`, error);
            this.showErrorState(error);
        } finally {
            this.isLoading = false;
        }
    }

    /**
     * Load page content
     * @param {string} page - Page name
     * @param {boolean} updateHistory - Whether to update browser history
     */
    async loadPageContent(page, updateHistory = true) {
        if (!this.validatePage(page)) {
            throw new Error(`Invalid page: ${page}`);
        }

        // Update URL and history
        if (updateHistory) {
            const url = `#${page}`;
            window.history.pushState({ page }, '', url);
        }

        // Update navigation state
        this.updateNavigationState(page);

        // Load content using ContentLoader
        try {
            const content = await this.contentLoader.loadContentComponent(page);
            this.renderContent(content);
            this.currentPage = page;
            
            // Update page title
            this.updatePageTitle(page);
            
            // Rebuild search index for new content
            if (window.searchManager) {
                window.searchManager.rebuildIndex();
            }
            
            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
        } catch (error) {
            console.error(`Failed to load content for page: ${page}`, error);
            this.renderErrorContent(error);
        }
    }

    /**
     * Validate page name
     * @param {string} page - Page name
     * @returns {boolean} Validation result
     */
    validatePage(page) {
        const validPages = ['home', 'blogs', 'projects', 'misc'];
        return validPages.includes(page);
    }

    /**
     * Update navigation state
     * @param {string} page - Current page
     */
    updateNavigationState(page) {
        // Update active navigation item
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            const linkPage = link.getAttribute('data-page');
            if (linkPage === page) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    /**
     * Render content in main container
     * @param {string} content - HTML content
     */
    renderContent(content) {
        const contentContainer = document.querySelector('.content-container');
        if (!contentContainer) {
            console.error('Content container not found');
            return;
        }

        contentContainer.innerHTML = content;
        
        // Add fade-in animation
        contentContainer.style.opacity = '0';
        contentContainer.style.transform = 'translateY(20px)';
        contentContainer.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        
        requestAnimationFrame(() => {
            contentContainer.style.opacity = '1';
            contentContainer.style.transform = 'translateY(0)';
        });
    }

    /**
     * Render error content
     * @param {Error} error - Error object
     */
    renderErrorContent(error) {
        const errorContent = `
            <div class="page-content">
                <div class="error-state">
                    <div class="error-icon">⚠️</div>
                    <h2>Content Not Available</h2>
                    <p>${error.message || 'Sorry, we couldn\'t load the requested content.'}</p>
                    <button onclick="location.reload()" class="error-retry-btn">Refresh Page</button>
                </div>
            </div>
        `;
        
        this.renderContent(errorContent);
    }

    /**
     * Show loading state
     */
    showLoadingState() {
        const loadingContent = `
            <div class="page-content">
                <div class="loading-state">
                    <div class="loading-spinner"></div>
                    <p>Loading content...</p>
                </div>
            </div>
        `;
        
        this.renderContent(loadingContent);
    }

    /**
     * Show error state
     * @param {Error} error - Error object
     */
    showErrorState(error) {
        this.renderErrorContent(error);
    }

    /**
     * Update page title based on current page
     * @param {string} page - Page name
     */
    updatePageTitle(page) {
        const pageTitles = {
            home: "Karl's Digital Space - Home",
            blogs: "Karl's Digital Space - Blogs",
            projects: "Karl's Digital Space - Projects",
            misc: "Karl's Digital Space - Miscellaneous"
        };
        
        document.title = pageTitles[page] || "Karl's Digital Space";
    }

    /**
     * Get current page
     * @returns {string} Current page name
     */
    getCurrentPage() {
        return this.currentPage;
    }

    /**
     * Initialize pages (called by ApplicationManager)
     * @returns {Promise<void>}
     */
    async initializePages() {
        // Preload critical pages
        try {
            await this.contentLoader.loadContentComponent('home');
            console.log('Home page preloaded successfully');
        } catch (error) {
            console.warn('Failed to preload home page:', error);
        }
    }

    /**
     * Handle page hide event
     */
    handlePageHide() {
        // Save current page state
        this.pageCache.set(this.currentPage, {
            scrollPosition: window.pageYOffset,
            timestamp: Date.now()
        });
    }

    /**
     * Handle page show event
     */
    handlePageShow() {
        // Restore page state if available
        const pageState = this.pageCache.get(this.currentPage);
        if (pageState && pageState.scrollPosition) {
            // Restore scroll position after a short delay
            setTimeout(() => {
                window.scrollTo(0, pageState.scrollPosition);
            }, 100);
        }
    }

    /**
     * Clear navigation cache
     */
    clearCache() {
        this.pageCache.clear();
        if (this.contentLoader) {
            this.contentLoader.clearCache();
        }
    }

    /**
     * Get navigation statistics
     * @returns {Object} Navigation statistics
     */
    getStats() {
        return {
            currentPage: this.currentPage,
            pageCacheSize: this.pageCache.size,
            contentCache: this.contentLoader ? this.contentLoader.getCacheStats() : null,
            isLoading: this.isLoading
        };
    }
}