/**
 * Application Manager - Coordinates all modules and manages application lifecycle
 * Central hub for theme, navigation, search, and global functionality
 */

import { ThemeManager } from './theme-manager.js';
import { NavigationManager } from './navigation-manager.js';
import { SearchManager } from './search-manager.js';

export class ApplicationManager {
    constructor() {
        this.themeManager = null;
        this.navigationManager = null;
        this.searchManager = null;
        this.initialized = false;
        this.errorHandlers = [];
        this.init();
    }

    /**
     * Initialize application manager
     */
    async init() {
        try {
            // Initialize managers in order of dependency
            this.themeManager = new ThemeManager();
            this.navigationManager = new NavigationManager();
            this.searchManager = new SearchManager();

            // Wait for navigation manager to initialize pages
            await this.navigationManager.initializePages();

            // Set up global error handling
            this.setupErrorHandling();

            // Set up global event listeners
            this.setupGlobalListeners();

            // Set up keyboard shortcuts
            this.setupKeyboardShortcuts();

            // Mark as initialized
            this.initialized = true;

            console.log('Application Manager initialized successfully');
            
            // Show initialization notification
            this.showNotification('Website loaded successfully', 'success');
            
        } catch (error) {
            console.error('Failed to initialize Application Manager:', error);
            this.showNotification('Failed to initialize website', 'error');
            throw error;
        }
    }

    /**
     * Set up global error handling
     */
    setupErrorHandling() {
        // Handle JavaScript errors
        window.addEventListener('error', (event) => {
            console.error('Global error:', event.error);
            this.showNotification('An error occurred', 'error');
            this.handleError(event.error);
        });

        // Handle unhandled promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled promise rejection:', event.reason);
            this.showNotification('An error occurred', 'error');
            this.handleError(event.reason);
        });

        // Handle offline/online events
        window.addEventListener('offline', () => {
            this.showNotification('You are offline', 'warning');
        });

        window.addEventListener('online', () => {
            this.showNotification('You are back online', 'success');
        });
    }

    /**
     * Set up global event listeners
     */
    setupGlobalListeners() {
        // Handle page visibility changes
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.handlePageHide();
            } else {
                this.handlePageShow();
            }
        });

        // Handle before unload
        window.addEventListener('beforeunload', () => {
            this.handleBeforeUnload();
        });

        // Handle resize for responsive behavior (delay to ensure managers are initialized)
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                // Only call handleResize if managers are initialized
                if (this.initialized) {
                    this.handleResize();
                }
            }, 250);
        });
    }

    /**
     * Set up keyboard shortcuts
     */
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + K for search
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                if (this.searchManager) {
                    this.searchManager.focusSearchInput();
                }
            }

            // Ctrl/Cmd + T for theme toggle
            if ((e.ctrlKey || e.metaKey) && e.key === 't') {
                e.preventDefault();
                if (this.themeManager) {
                    this.themeManager.toggleTheme();
                }
            }

            // Escape to close search
            if (e.key === 'Escape') {
                if (this.searchManager) {
                    this.searchManager.clearSearch();
                }
            }

            // Arrow keys for navigation (when search is not focused)
            if (this.searchManager && !this.searchManager.isSearchFocused()) {
                if (e.key === 'ArrowLeft' && e.altKey) {
                    e.preventDefault();
                    this.navigateToPreviousPage();
                }
                if (e.key === 'ArrowRight' && e.altKey) {
                    e.preventDefault();
                    this.navigateToNextPage();
                }
            }
        });
    }

    /**
     * Handle page hide event
     */
    handlePageHide() {
        // Save application state
        this.saveApplicationState();
        
        // Notify managers
        if (this.navigationManager) {
            this.navigationManager.handlePageHide();
        }
    }

    /**
     * Handle page show event
     */
    handlePageShow() {
        // Restore application state
        this.restoreApplicationState();
        
        // Notify managers
        if (this.navigationManager) {
            this.navigationManager.handlePageShow();
        }
    }

    /**
     * Handle before unload event
     */
    handleBeforeUnload() {
        // Save final state
        this.saveApplicationState();
    }

    /**
     * Handle window resize
     */
    handleResize() {
        // Notify managers of resize
        try {
            if (this.searchManager && typeof this.searchManager.handleResize === 'function') {
                this.searchManager.handleResize();
            } else {
                console.warn('SearchManager not ready for resize:', {
                    hasSearchManager: !!this.searchManager,
                    hasHandleResize: this.searchManager && typeof this.searchManager.handleResize === 'function'
                });
            }
        } catch (error) {
            console.warn('Error in handleResize:', error);
        }
    }

    /**
     * Navigate to previous page
     */
    navigateToPreviousPage() {
        if (this.navigationManager) {
            // This would require implementing a page history stack
            // For now, we'll use browser back
            window.history.back();
        }
    }

    /**
     * Navigate to next page
     */
    navigateToNextPage() {
        if (this.navigationManager) {
            // This would require implementing a page history stack
            // For now, we'll use browser forward
            window.history.forward();
        }
    }

    /**
     * Save application state
     */
    saveApplicationState() {
        try {
            const state = {
                timestamp: Date.now(),
                currentPage: this.navigationManager ? this.navigationManager.getCurrentPage() : 'home',
                theme: this.themeManager ? this.themeManager.getCurrentTheme() : 'light',
                scrollPosition: window.pageYOffset
            };

            localStorage.setItem('appState', JSON.stringify(state));
        } catch (error) {
            console.warn('Failed to save application state:', error);
        }
    }

    /**
     * Restore application state
     */
    restoreApplicationState() {
        try {
            const savedState = localStorage.getItem('appState');
            if (!savedState) return;

            const state = JSON.parse(savedState);
            
            // Check if state is recent (within 1 hour)
            const maxAge = 60 * 60 * 1000; // 1 hour
            if (Date.now() - state.timestamp > maxAge) {
                localStorage.removeItem('appState');
                return;
            }

            // Restore scroll position
            if (state.scrollPosition) {
                setTimeout(() => {
                    window.scrollTo(0, state.scrollPosition);
                }, 100);
            }

        } catch (error) {
            console.warn('Failed to restore application state:', error);
            localStorage.removeItem('appState');
        }
    }

    /**
     * Show notification to user
     * @param {string} message - Notification message
     * @param {string} type - Notification type (success, error, warning, info)
     */
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;

        // Add to page
        document.body.appendChild(notification);

        // Add show class after a delay for animation
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);

        // Remove after delay
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    /**
     * Handle errors
     * @param {Error} error - Error object
     */
    handleError(error) {
        // Add error to handlers for debugging
        this.errorHandlers.push({
            error: error,
            timestamp: Date.now()
        });

        // Keep only recent errors (last 10)
        if (this.errorHandlers.length > 10) {
            this.errorHandlers = this.errorHandlers.slice(-10);
        }

        // Log to console for debugging
        console.error('Application error:', error);
    }

    /**
     * Get application statistics
     * @returns {Object} Application statistics
     */
    getStats() {
        return {
            initialized: this.initialized,
            managers: {
                theme: this.themeManager ? this.themeManager.getStats() : null,
                navigation: this.navigationManager ? this.navigationManager.getStats() : null,
                search: this.searchManager ? this.searchManager.getStats() : null
            },
            errorCount: this.errorHandlers.length,
            recentErrors: this.errorHandlers.slice(-3)
        };
    }

    /**
     * Clear all caches
     */
    clearAllCaches() {
        if (this.navigationManager) {
            this.navigationManager.clearCache();
        }
        if (this.searchManager) {
            this.searchManager.clearCache();
        }
        localStorage.removeItem('appState');
        
        this.showNotification('All caches cleared', 'success');
    }

    /**
     * Get manager instances
     * @returns {Object} Manager instances
     */
    getManagers() {
        return {
            theme: this.themeManager,
            navigation: this.navigationManager,
            search: this.searchManager
        };
    }
}