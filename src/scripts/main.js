/**
 * Main Application Entry Point
 * Initializes and coordinates all modules for the personal website
 */

import { ApplicationManager } from './app-manager.js';

/**
 * Application configuration
 */
const APP_CONFIG = {
    name: "Karl's Digital Space",
    version: '2.0.0',
    debug: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1',
    features: {
        theme: true,
        navigation: true,
        search: true,
        notifications: true
    },
    cache: {
        enabled: true,
        maxAge: 3600000, // 1 hour
        maxSize: 50 // max cached items
    }
};

/**
 * Global application instance
 */
let appManager = null;

/**
 * Initialize application when DOM is ready
 */
function initializeApplication() {
    // Check if already initialized
    if (appManager) {
        console.warn('Application already initialized');
        return;
    }

    try {
        // Create application manager instance
        appManager = new ApplicationManager();
        
        // Make app manager globally accessible for debugging
        window.appManager = appManager;
        window.APP_CONFIG = APP_CONFIG;
        
        // Set up development helpers
        if (APP_CONFIG.debug) {
            setupDevelopmentHelpers();
        }
        
        // Set up performance monitoring
        setupPerformanceMonitoring();
        
        console.log('Application initialized successfully');
        console.log('Version:', APP_CONFIG.version);
        console.log('Debug mode:', APP_CONFIG.debug);
        
    } catch (error) {
        console.error('Failed to initialize application:', error);
        showInitializationError(error);
    }
}

/**
 * Set up development helpers
 */
function setupDevelopmentHelpers() {
    // Add debug console commands
    window.debug = {
        app: () => appManager,
        stats: () => appManager?.getStats(),
        clearCache: () => appManager?.clearAllCaches(),
        managers: () => appManager?.getManagers(),
        config: () => APP_CONFIG,
        help: () => {
            console.log('Available debug commands:');
            console.log('  debug.app() - Get application manager');
            console.log('  debug.stats() - Get application statistics');
            console.log('  debug.clearCache() - Clear all caches');
            console.log('  debug.managers() - Get manager instances');
            console.log('  debug.config() - Get application configuration');
        }
    };
    
    // Add keyboard shortcut for debug info
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.shiftKey && e.key === 'D') {
            e.preventDefault();
            console.log('Application Debug Info:', debug.stats());
        }
    });
    
    console.log('Development helpers enabled. Type debug.help() for available commands.');
}

/**
 * Set up performance monitoring
 */
function setupPerformanceMonitoring() {
    // Monitor Core Web Vitals
    if ('web-vitals' in window) {
        import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
            getCLS(console.log);
            getFID(console.log);
            getFCP(console.log);
            getLCP(console.log);
            getTTFB(console.log);
        });
    }
    
    // Monitor resource loading
    const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
            if (entry.duration > 1000) {
                console.warn(`Slow resource: ${entry.name} (${entry.duration}ms)`);
            }
        }
    });
    
    try {
        observer.observe({ entryTypes: ['resource'] });
    } catch (error) {
        console.warn('PerformanceObserver not supported');
    }
    
    // Monitor long tasks
    if ('PerformanceObserver' in window && 'PerformanceLongTaskTiming' in window) {
        const longTaskObserver = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                console.warn(`Long task detected: ${entry.duration}ms`);
            }
        });
        
        try {
            longTaskObserver.observe({ entryTypes: ['longtask'] });
        } catch (error) {
            console.warn('Long task monitoring not supported');
        }
    }
}

/**
 * Show initialization error
 * @param {Error} error - Initialization error
 */
function showInitializationError(error) {
    const errorHtml = `
        <div style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: var(--bg-primary, #ffffff);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        ">
            <div style="
                text-align: center;
                padding: 2rem;
                max-width: 500px;
            ">
                <h1 style="
                    font-size: 1.5rem;
                    margin-bottom: 1rem;
                    color: var(--text-primary, #000000);
                ">Website Error</h1>
                <p style="
                    margin-bottom: 1.5rem;
                    color: var(--text-secondary, #666666);
                ">Sorry, we couldn't load the website properly.</p>
                <div style="
                    background: var(--bg-secondary, #f5f5f5);
                    padding: 1rem;
                    border-radius: 0.5rem;
                    margin-bottom: 1.5rem;
                    font-family: monospace;
                    font-size: 0.875rem;
                    color: var(--text-secondary, #666666);
                ">
                    ${error.message || 'Unknown error occurred'}
                </div>
                <button onclick="location.reload()" style="
                    background: var(--color-primary, #007bff);
                    color: white;
                    border: none;
                    padding: 0.75rem 1.5rem;
                    border-radius: 0.375rem;
                    font-size: 1rem;
                    cursor: pointer;
                    transition: background-color 0.2s;
                " onmouseover="this.style.backgroundColor='var(--color-primary-hover, #0056b3)'" 
                   onmouseout="this.style.backgroundColor='var(--color-primary, #007bff)'">
                    Reload Page
                </button>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', errorHtml);
}

/**
 * Handle DOM ready state
 */
function handleDOMReady() {
    // Check if DOM is already ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeApplication);
    } else {
        // DOM is already ready
        initializeApplication();
    }
}

/**
 * Global error handler
 */
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    
    // Show user-friendly error in production
    if (!APP_CONFIG.debug && event.error && event.error.message) {
        // Prevent infinite error loops
        if (window.__errorShown) return;
        window.__errorShown = true;
        
        // Show error notification
        if (appManager && appManager.showNotification) {
            appManager.showNotification('An error occurred. Please refresh the page.', 'error');
        }
    }
});

/**
 * Handle unhandled promise rejections
 */
window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    
    // Show user-friendly error in production
    if (!APP_CONFIG.debug) {
        if (appManager && appManager.showNotification) {
            appManager.showNotification('A network error occurred. Please check your connection.', 'error');
        }
    }
});

/**
 * Handle page visibility changes for performance
 */
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Page is hidden, pause non-critical operations
        console.log('Page hidden - pausing non-critical operations');
    } else {
        // Page is visible, resume operations
        console.log('Page visible - resuming operations');
    }
});

/**
 * Initialize application
 */
handleDOMReady();