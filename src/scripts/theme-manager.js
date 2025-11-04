/**
 * Theme Manager - Handles dark/light theme switching
 * Provides persistent theme management with system preference detection
 */

export class ThemeManager {
    constructor() {
        this.theme = this.getInitialTheme();
        this.init();
    }

    /**
     * Initialize theme manager and set up event listeners
     */
    init() {
        this.applyTheme(this.theme);
        this.setupToggleButton();
        this.setupSystemThemeListener();
    }

    /**
     * Get initial theme from localStorage or system preference
     * @returns {string} 'light' or 'dark'
     */
    getInitialTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            return savedTheme;
        }
        
        // Check system preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        
        return 'light';
    }

    /**
     * Apply theme to document
     * @param {string} theme - 'light' or 'dark'
     */
    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        this.theme = theme;
        localStorage.setItem('theme', theme);
        this.updateToggleButton(theme);
    }

    /**
     * Toggle between light and dark themes
     */
    toggleTheme() {
        const newTheme = this.theme === 'light' ? 'dark' : 'light';
        this.applyTheme(newTheme);
    }

    /**
     * Set up theme toggle button event listener
     */
    setupToggleButton() {
        const toggleButton = document.querySelector('.theme-toggle');
        if (toggleButton) {
            toggleButton.addEventListener('click', () => this.toggleTheme());
        }
    }

    /**
     * Update toggle button appearance based on current theme
     * @param {string} theme - Current theme
     */
    updateToggleButton(theme) {
        const themeIcon = document.querySelector('.theme-icon');
        if (themeIcon) {
            themeIcon.textContent = theme === 'light' ? '🌙' : '☀️';
        }
    }

    /**
     * Listen for system theme changes
     */
    setupSystemThemeListener() {
        if (window.matchMedia) {
            const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
            darkModeQuery.addEventListener('change', (e) => {
                // Only apply system theme if user hasn't manually set a preference
                if (!localStorage.getItem('theme')) {
                    this.applyTheme(e.matches ? 'dark' : 'light');
                }
            });
        }
    }

    /**
     * Get current theme
     * @returns {string} Current theme
     */
    getCurrentTheme() {
        return this.theme;
    }
}